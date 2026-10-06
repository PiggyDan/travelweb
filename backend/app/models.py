import enum
from datetime import UTC, date, datetime

from sqlalchemy import JSON, Boolean, Date, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


def utcnow() -> datetime:
    return datetime.now(UTC)


class TripPlanStatus(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    quoted = "quoted"
    booked = "booked"
    closed = "closed"


class Sender(str, enum.Enum):
    customer = "customer"
    admin = "admin"
    # The AI assistant (app/assistant.py), answering for the company.
    assistant = "assistant"
    # Automatic notes, e.g. "Trip plan ESK-7KQ2PD submitted".
    system = "system"


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(254), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class TripPlan(Base):
    __tablename__ = "trip_plans"

    id: Mapped[int] = mapped_column(primary_key=True)
    reference: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    status: Mapped[TripPlanStatus] = mapped_column(
        Enum(TripPlanStatus, native_enum=False, length=16), default=TripPlanStatus.new, index=True
    )

    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(254), index=True)
    phone: Mapped[str | None] = mapped_column(String(40))
    country: Mapped[str | None] = mapped_column(String(80))
    message: Mapped[str | None] = mapped_column(Text)

    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    days: Mapped[int] = mapped_column(Integer)
    adults: Mapped[int] = mapped_column(Integer)
    children: Mapped[int] = mapped_column(Integer, default=0)
    interests: Mapped[list[str]] = mapped_column(JSON, default=list)
    destinations: Mapped[list[str]] = mapped_column(JSON, default=list)
    activity_level: Mapped[str] = mapped_column(String(32))
    accommodation_style: Mapped[str] = mapped_column(String(32))
    budget: Mapped[str] = mapped_column(String(32))
    tour_type: Mapped[str | None] = mapped_column(String(32))

    admin_notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    conversation: Mapped["Conversation | None"] = relationship(back_populates="trip_plan")


class Conversation(Base):
    """One visitor's chat thread. The visitor is recognised by a secret token kept in a cookie."""

    __tablename__ = "conversations"

    id: Mapped[int] = mapped_column(primary_key=True)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    trip_plan_id: Mapped[int | None] = mapped_column(ForeignKey("trip_plans.id", ondelete="SET NULL"))

    customer_name: Mapped[str] = mapped_column(String(120))
    customer_email: Mapped[str] = mapped_column(String(254), index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    last_message_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    # Read markers: messages from the other side with a higher id count as unread.
    admin_last_read_id: Mapped[int] = mapped_column(Integer, default=0)
    customer_last_read_id: Mapped[int] = mapped_column(Integer, default=0)
    # The AI answers while this is on; it switches off when staff reply or the AI hands over.
    ai_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    # True while the AI is writing a reply (shown to the traveller as "typing…").
    ai_pending: Mapped[bool] = mapped_column(Boolean, default=False)

    trip_plan: Mapped[TripPlan | None] = relationship(back_populates="conversation")
    messages: Mapped[list["Message"]] = relationship(
        back_populates="conversation", order_by="Message.id", cascade="all, delete-orphan"
    )


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversations.id", ondelete="CASCADE"), index=True)
    sender: Mapped[Sender] = mapped_column(Enum(Sender, native_enum=False, length=16))
    # Set on admin replies so the customer sees who answered.
    author_name: Mapped[str | None] = mapped_column(String(120))
    body: Mapped[str] = mapped_column(Text)
    # A tour card the assistant attached: a snapshot of {slug, title, ...} from the catalog.
    attachment: Mapped[dict | None] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    conversation: Mapped[Conversation] = relationship(back_populates="messages")
