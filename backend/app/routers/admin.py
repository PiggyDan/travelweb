"""Staff endpoints: sign-in, trip plan management and the chat inbox. All except login require a session."""

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.chat import add_message, last_messages, latest_message_id, messages_after, unread_counts
from app.config import get_settings
from app.db import get_db
from app.models import AdminUser, Conversation, Message, Sender, TripPlan, TripPlanStatus
from app.schemas import (
    AdminConversation,
    AdminConversationSummary,
    AdminOut,
    AdminSummary,
    ConversationUpdate,
    LoginRequest,
    MessageCreate,
    MessageOut,
    Ok,
    TripPlanDetail,
    TripPlanSummary,
    TripPlanUpdate,
)
from app.security import ADMIN_COOKIE, create_admin_token, get_current_admin, hash_password, verify_password

_settings = get_settings()

auth_router = APIRouter(prefix="/api/admin", tags=["admin auth"])
router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])

# Verifying against a real hash even for unknown emails keeps response times uniform.
_DUMMY_HASH = hash_password("not-a-real-password")


# --- Auth ---------------------------------------------------------------------------------------


@auth_router.post("/login", response_model=AdminOut)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)) -> AdminUser:
    admin = db.scalar(select(AdminUser).where(func.lower(AdminUser.email) == str(payload.email).lower()))
    if not verify_password(admin.password_hash if admin else _DUMMY_HASH, payload.password) or admin is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong email or password")
    response.set_cookie(
        ADMIN_COOKIE,
        create_admin_token(admin.id),
        max_age=_settings.admin_session_hours * 3600,
        httponly=True,
        secure=_settings.cookie_secure,
        samesite="lax",
        path="/",
    )
    return admin


@auth_router.post("/logout", response_model=Ok)
def logout(response: Response) -> Ok:
    response.delete_cookie(ADMIN_COOKIE, path="/")
    return Ok()


@router.get("/me", response_model=AdminOut)
def me(admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
    return admin


@router.get("/summary", response_model=AdminSummary)
def summary(db: Session = Depends(get_db)) -> AdminSummary:
    new_plans = db.scalar(select(func.count()).where(TripPlan.status == TripPlanStatus.new)) or 0
    unread = db.scalar(
        select(func.count(func.distinct(Message.conversation_id)))
        .join(Conversation, Conversation.id == Message.conversation_id)
        .where(Message.sender == Sender.customer, Message.id > Conversation.admin_last_read_id)
    )
    return AdminSummary(new_trip_plans=new_plans, unread_conversations=unread or 0)


# --- Trip plans ---------------------------------------------------------------------------------


def _with_chat(db: Session, plans: list[TripPlan], model: type[TripPlanSummary]) -> list[TripPlanSummary]:
    conversations = [p.conversation for p in plans if p.conversation]
    unread = unread_counts(db, conversations, for_admin=True)
    out = []
    for plan in plans:
        item = model.model_validate(plan)
        if plan.conversation:
            item.conversation_id = plan.conversation.id
            item.unread_count = unread.get(plan.conversation.id, 0)
        out.append(item)
    return out


@router.get("/trip-plans", response_model=list[TripPlanSummary])
def list_trip_plans(
    status_filter: TripPlanStatus | None = Query(default=None, alias="status"),
    q: str | None = Query(default=None, max_length=120),
    db: Session = Depends(get_db),
) -> list[TripPlanSummary]:
    query = select(TripPlan).order_by(TripPlan.created_at.desc()).limit(500)
    if status_filter:
        query = query.where(TripPlan.status == status_filter)
    if q:
        like = f"%{q.strip()}%"
        query = query.where(
            TripPlan.reference.ilike(like) | TripPlan.full_name.ilike(like) | TripPlan.email.ilike(like)
        )
    return _with_chat(db, list(db.scalars(query)), TripPlanSummary)


def _get_plan(db: Session, plan_id: int) -> TripPlan:
    plan = db.get(TripPlan, plan_id)
    if plan is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Trip plan not found")
    return plan


@router.get("/trip-plans/{plan_id}", response_model=TripPlanDetail)
def get_trip_plan(plan_id: int, db: Session = Depends(get_db)) -> TripPlanSummary:
    return _with_chat(db, [_get_plan(db, plan_id)], TripPlanDetail)[0]


@router.patch("/trip-plans/{plan_id}", response_model=TripPlanDetail)
def update_trip_plan(plan_id: int, payload: TripPlanUpdate, db: Session = Depends(get_db)) -> TripPlanSummary:
    plan = _get_plan(db, plan_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "status" and value is None:
            continue
        setattr(plan, field, value)
    db.commit()
    return _with_chat(db, [plan], TripPlanDetail)[0]


# --- Inbox --------------------------------------------------------------------------------------


def _summaries(db: Session, conversations: list[Conversation]) -> list[AdminConversationSummary]:
    unread = unread_counts(db, conversations, for_admin=True)
    latest = last_messages(db, [c.id for c in conversations])
    return [
        AdminConversationSummary(
            id=c.id,
            customer_name=c.customer_name,
            customer_email=c.customer_email,
            trip_plan_id=c.trip_plan_id,
            trip_reference=c.trip_plan.reference if c.trip_plan else None,
            last_message_at=c.last_message_at,
            last_message=MessageOut.model_validate(latest[c.id]) if c.id in latest else None,
            unread_count=unread.get(c.id, 0),
            ai_enabled=c.ai_enabled,
            ai_pending=c.ai_pending,
        )
        for c in conversations
    ]


@router.get("/conversations", response_model=list[AdminConversationSummary])
def list_conversations(db: Session = Depends(get_db)) -> list[AdminConversationSummary]:
    conversations = list(db.scalars(select(Conversation).order_by(Conversation.last_message_at.desc()).limit(300)))
    return _summaries(db, conversations)


def _get_conversation(db: Session, conversation_id: int) -> Conversation:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found")
    return conversation


@router.get("/conversations/{conversation_id}", response_model=AdminConversation)
def get_conversation(
    conversation_id: int, after: int = Query(default=0, ge=0), db: Session = Depends(get_db)
) -> AdminConversation:
    """The thread (only messages newer than `after`, for polling)."""
    conversation = _get_conversation(db, conversation_id)
    summary = _summaries(db, [conversation])[0]
    messages = [MessageOut.model_validate(m) for m in messages_after(db, conversation.id, after)]
    return AdminConversation(**summary.model_dump(), messages=messages)


@router.post(
    "/conversations/{conversation_id}/messages", response_model=MessageOut, status_code=status.HTTP_201_CREATED
)
def reply(
    conversation_id: int,
    payload: MessageCreate,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> MessageOut:
    conversation = _get_conversation(db, conversation_id)
    message = add_message(db, conversation, Sender.admin, payload.body, author_name=admin.name)
    # A person has taken over; staff can switch the assistant back on from the chat header.
    conversation.ai_enabled = False
    # Replying to a new plan means the customer has been contacted.
    if conversation.trip_plan and conversation.trip_plan.status is TripPlanStatus.new:
        conversation.trip_plan.status = TripPlanStatus.contacted
    db.commit()
    return MessageOut.model_validate(message)


@router.patch("/conversations/{conversation_id}", response_model=AdminConversationSummary)
def update_conversation(
    conversation_id: int, payload: ConversationUpdate, db: Session = Depends(get_db)
) -> AdminConversationSummary:
    """Switch the AI assistant on or off for this conversation."""
    conversation = _get_conversation(db, conversation_id)
    conversation.ai_enabled = payload.ai_enabled
    db.commit()
    return _summaries(db, [conversation])[0]


@router.post("/conversations/{conversation_id}/read", response_model=Ok)
def mark_read(conversation_id: int, db: Session = Depends(get_db)) -> Ok:
    conversation = _get_conversation(db, conversation_id)
    conversation.admin_last_read_id = latest_message_id(db, conversation.id)
    db.commit()
    return Ok()
