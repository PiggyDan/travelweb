"""Chat helpers shared by the public and admin routers."""

from collections.abc import Iterable

from fastapi import Response
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import Conversation, Message, Sender, utcnow
from app.security import CHAT_COOKIE, hash_chat_token, new_chat_token

_settings = get_settings()


def find_conversation(db: Session, token: str | None) -> Conversation | None:
    if not token:
        return None
    return db.scalar(select(Conversation).where(Conversation.token_hash == hash_chat_token(token)))


def open_conversation(db: Session, response: Response, *, name: str, email: str) -> Conversation:
    """Creates a conversation and hands the visitor its secret token as an httpOnly cookie."""
    token, token_hash = new_chat_token()
    conversation = Conversation(token_hash=token_hash, customer_name=name, customer_email=email)
    db.add(conversation)
    db.flush()
    response.set_cookie(
        CHAT_COOKIE,
        token,
        max_age=_settings.chat_cookie_days * 86400,
        httponly=True,
        secure=_settings.cookie_secure,
        samesite="lax",
        path="/",
    )
    return conversation


def add_message(
    db: Session,
    conversation: Conversation,
    sender: Sender,
    body: str,
    author_name: str | None = None,
    attachment: dict | None = None,
) -> Message:
    message = Message(
        conversation=conversation, sender=sender, body=body, author_name=author_name, attachment=attachment
    )
    db.add(message)
    conversation.last_message_at = utcnow()
    db.flush()
    # Your own message means you've seen everything before it.
    if sender is Sender.customer:
        conversation.customer_last_read_id = message.id
    elif sender is Sender.admin:
        conversation.admin_last_read_id = message.id
    return message


def messages_after(db: Session, conversation_id: int, after: int) -> list[Message]:
    return list(
        db.scalars(
            select(Message)
            .where(Message.conversation_id == conversation_id, Message.id > after)
            .order_by(Message.id)
        )
    )


def latest_message_id(db: Session, conversation_id: int) -> int:
    return db.scalar(select(func.max(Message.id)).where(Message.conversation_id == conversation_id)) or 0


def unread_counts(db: Session, conversations: Iterable[Conversation], *, for_admin: bool) -> dict[int, int]:
    """Messages from the other side newer than the reader's marker, per conversation id."""
    conversations = list(conversations)
    if not conversations:
        return {}
    # Staff care about customer messages; customers about replies from staff or the assistant.
    other = [Sender.customer] if for_admin else [Sender.admin, Sender.assistant]
    marker = Conversation.admin_last_read_id if for_admin else Conversation.customer_last_read_id
    rows = db.execute(
        select(Message.conversation_id, func.count())
        .join(Conversation, Conversation.id == Message.conversation_id)
        .where(
            Message.conversation_id.in_([c.id for c in conversations]),
            Message.sender.in_(other),
            Message.id > marker,
        )
        .group_by(Message.conversation_id)
    )
    return dict(rows.tuples().all())


def last_messages(db: Session, conversation_ids: list[int]) -> dict[int, Message]:
    if not conversation_ids:
        return {}
    latest = (
        select(func.max(Message.id))
        .where(Message.conversation_id.in_(conversation_ids))
        .group_by(Message.conversation_id)
    )
    return {m.conversation_id: m for m in db.scalars(select(Message).where(Message.id.in_(latest)))}
