from datetime import UTC, date, datetime
from typing import Annotated, Literal

from pydantic import AfterValidator, BaseModel, ConfigDict, EmailStr, Field, StringConstraints, model_validator

from app.models import Sender, TripPlanStatus


def _as_utc(value: datetime) -> datetime:
    # SQLite hands back naive datetimes; everything is stored in UTC.
    return value if value.tzinfo else value.replace(tzinfo=UTC)


UtcDatetime = Annotated[datetime, AfterValidator(_as_utc)]
Name = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
MessageBody = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=4000)]
OptionalShort = Annotated[str, StringConstraints(strip_whitespace=True, max_length=80)] | None


class ApiModel(BaseModel):
    """camelCase on the wire to match the TypeScript frontend."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True, alias_generator=lambda s: _camel(s))


def _camel(name: str) -> str:
    first, *rest = name.split("_")
    return first + "".join(part.title() for part in rest)


# --- Trip plans ---------------------------------------------------------------------------------


class TripPlanCreate(ApiModel):
    full_name: Name
    email: EmailStr
    phone: Annotated[str, StringConstraints(strip_whitespace=True, max_length=40)] | None = None
    country: OptionalShort = None
    message: Annotated[str, StringConstraints(strip_whitespace=True, max_length=4000)] | None = None

    start_date: date | None = None
    end_date: date | None = None
    days: int = Field(ge=1, le=60)
    adults: int = Field(ge=1, le=50)
    children: int = Field(default=0, ge=0, le=30)
    interests: list[Annotated[str, StringConstraints(max_length=64)]] = Field(default_factory=list, max_length=30)
    destinations: list[Annotated[str, StringConstraints(max_length=64)]] = Field(default_factory=list, max_length=30)
    activity_level: Annotated[str, StringConstraints(max_length=32)]
    accommodation_style: Annotated[str, StringConstraints(max_length=32)]
    budget: Annotated[str, StringConstraints(max_length=32)]
    tour_type: Annotated[str, StringConstraints(max_length=32)] | None = None

    @model_validator(mode="after")
    def _dates_in_order(self) -> "TripPlanCreate":
        if self.start_date and self.end_date and self.end_date < self.start_date:
            raise ValueError("Departure date must be after arrival date")
        return self


class TripPlanAccepted(ApiModel):
    reference: str
    conversation_id: int


class TripPlanSummary(ApiModel):
    id: int
    reference: str
    status: TripPlanStatus
    full_name: str
    email: str
    country: str | None
    start_date: date | None
    days: int
    adults: int
    children: int
    budget: str
    created_at: UtcDatetime
    conversation_id: int | None = None
    unread_count: int = 0


class TripPlanDetail(TripPlanSummary):
    phone: str | None
    message: str | None
    end_date: date | None
    interests: list[str]
    destinations: list[str]
    activity_level: str
    accommodation_style: str
    tour_type: str | None
    admin_notes: str | None
    updated_at: UtcDatetime


class TripPlanUpdate(ApiModel):
    status: TripPlanStatus | None = None
    admin_notes: Annotated[str, StringConstraints(max_length=8000)] | None = None


# --- Chat ---------------------------------------------------------------------------------------


class TourAttachment(ApiModel):
    """A tour card the assistant attached to its reply."""

    slug: str
    title: str
    region: str
    duration_days: int
    price_from: str
    url: str
    image: str


class MessageOut(ApiModel):
    id: int
    sender: Sender
    author_name: str | None
    body: str
    attachment: TourAttachment | None = None
    created_at: UtcDatetime


class MessageCreate(ApiModel):
    body: MessageBody


class ConversationStart(ApiModel):
    name: Name
    email: EmailStr
    message: MessageBody


class CustomerConversation(ApiModel):
    id: int
    customer_name: str
    trip_reference: str | None
    unread_count: int
    assistant_typing: bool = False
    messages: list[MessageOut]


class AdminConversationSummary(ApiModel):
    id: int
    customer_name: str
    customer_email: str
    trip_plan_id: int | None
    trip_reference: str | None
    last_message_at: UtcDatetime
    last_message: MessageOut | None
    unread_count: int
    ai_enabled: bool
    ai_pending: bool = False


class AdminConversation(AdminConversationSummary):
    messages: list[MessageOut]


class ConversationUpdate(ApiModel):
    ai_enabled: bool


# --- Admin auth ---------------------------------------------------------------------------------


class LoginRequest(ApiModel):
    # Not EmailStr: sign-in only needs to match a stored address, and strict
    # validation would reject e.g. internal domains.
    email: Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=254)]
    password: Annotated[str, StringConstraints(min_length=1, max_length=200)]


class AdminOut(ApiModel):
    id: int
    email: str
    name: str


class AdminSummary(ApiModel):
    new_trip_plans: int
    unread_conversations: int


class Ok(ApiModel):
    ok: Literal[True] = True
