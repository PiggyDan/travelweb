"""Endpoints used by website visitors: submitting a trip plan and chatting with the team."""

from fastapi import APIRouter, BackgroundTasks, Cookie, Depends, HTTPException, Query, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.assistant import queue_reply
from app.chat import (
    add_message,
    find_conversation,
    latest_message_id,
    messages_after,
    open_conversation,
    unread_counts,
)
from app.db import get_db
from app.models import Conversation, Sender, TripPlan
from app.schemas import (
    ConversationStart,
    CustomerConversation,
    MessageCreate,
    MessageOut,
    Ok,
    TripPlanAccepted,
    TripPlanCreate,
)
from app.security import new_reference

router = APIRouter(prefix="/api", tags=["public"])


def _customer_view(db: Session, conversation: Conversation, after: int = 0) -> CustomerConversation:
    return CustomerConversation(
        id=conversation.id,
        customer_name=conversation.customer_name,
        trip_reference=conversation.trip_plan.reference if conversation.trip_plan else None,
        unread_count=unread_counts(db, [conversation], for_admin=False).get(conversation.id, 0),
        assistant_typing=conversation.ai_pending,
        messages=[MessageOut.model_validate(m) for m in messages_after(db, conversation.id, after)],
    )


def _plan_summary(plan: TripPlan) -> str:
    travellers = f"{plan.adults} adult{'s' if plan.adults != 1 else ''}"
    if plan.children:
        travellers += f", {plan.children} child{'ren' if plan.children != 1 else ''}"
    when = f" from {plan.start_date:%d %b %Y}" if plan.start_date else ""
    return f"Trip plan {plan.reference} submitted: {plan.days} days{when}, {travellers}."


@router.post("/trip-plans", response_model=TripPlanAccepted, status_code=status.HTTP_201_CREATED)
def create_trip_plan(
    payload: TripPlanCreate,
    response: Response,
    background_tasks: BackgroundTasks,
    esk_chat: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> TripPlanAccepted:
    for _ in range(5):
        plan = TripPlan(reference=new_reference(), **payload.model_dump())
        db.add(plan)
        try:
            db.flush()
            break
        except IntegrityError:  # reference collision; vanishingly rare, so just retry
            db.rollback()
    else:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Please try again")

    # Reuse the visitor's chat if it isn't already tied to another plan; otherwise start a new one.
    conversation = find_conversation(db, esk_chat)
    if conversation is None or conversation.trip_plan_id is not None:
        conversation = open_conversation(db, response, name=plan.full_name, email=plan.email)
    conversation.trip_plan = plan

    add_message(db, conversation, Sender.system, _plan_summary(plan))
    if plan.message:
        add_message(db, conversation, Sender.customer, plan.message)
    add_message(
        db,
        conversation,
        Sender.system,
        f"Thank you, {plan.full_name.split()[0]}! A trip planner will review your plan and reply here. "
        "You can keep chatting from any page of the website.",
    )
    # The assistant follows up right away with tours that fit the plan.
    queue_reply(db, conversation, background_tasks)
    db.commit()
    return TripPlanAccepted(reference=plan.reference, conversation_id=conversation.id)


@router.get("/chat/conversation", response_model=CustomerConversation | None)
def get_conversation(
    after: int = Query(default=0, ge=0),
    esk_chat: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> CustomerConversation | None:
    """The visitor's chat (only messages newer than `after`), or null if they haven't started one."""
    conversation = find_conversation(db, esk_chat)
    return _customer_view(db, conversation, after) if conversation else None


@router.post("/chat/conversations", response_model=CustomerConversation, status_code=status.HTTP_201_CREATED)
def start_conversation(
    payload: ConversationStart,
    response: Response,
    background_tasks: BackgroundTasks,
    esk_chat: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> CustomerConversation:
    conversation = find_conversation(db, esk_chat) or open_conversation(
        db, response, name=payload.name, email=str(payload.email)
    )
    add_message(db, conversation, Sender.customer, payload.message)
    queue_reply(db, conversation, background_tasks)
    db.commit()
    return _customer_view(db, conversation)


@router.post("/chat/messages", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(
    payload: MessageCreate,
    background_tasks: BackgroundTasks,
    esk_chat: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> MessageOut:
    conversation = find_conversation(db, esk_chat)
    if conversation is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No conversation yet")
    message = add_message(db, conversation, Sender.customer, payload.body)
    queue_reply(db, conversation, background_tasks)
    db.commit()
    return MessageOut.model_validate(message)


@router.post("/chat/read", response_model=Ok)
def mark_read(esk_chat: str | None = Cookie(default=None), db: Session = Depends(get_db)) -> Ok:
    conversation = find_conversation(db, esk_chat)
    if conversation is not None:
        conversation.customer_last_read_id = latest_message_id(db, conversation.id)
        db.commit()
    return Ok()
