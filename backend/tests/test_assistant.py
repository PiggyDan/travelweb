from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

from app import assistant
from app.assistant import AssistantReply

from .test_api import PLAN

CATALOG = [
    {
        "slug": "gobi-desert-expedition",
        "title": "Gobi Desert Expedition",
        "region": "Gobi Desert",
        "durationDays": 8,
        "priceFrom": "$1,890",
        "url": "/en/tours/gobi-desert-expedition",
        "image": "/images/gobi/camels-at-dunes.jpg",
    },
    {
        "slug": "altai-eagle-hunters-journey",
        "title": "Altai Eagle Hunters Journey",
        "region": "Altai",
        "durationDays": 12,
        "priceFrom": "$3,200",
        "url": "/en/tours/altai-eagle-hunters-journey",
        "image": "/images/altai/eagle-hunter.jpg",
    },
]


class FakeClaude:
    """Stands in for anthropic.Anthropic: records each request and returns a queued reply."""

    def __init__(self) -> None:
        self.requests: list[dict] = []
        self.replies: list[object] = []
        self.beta = SimpleNamespace(messages=SimpleNamespace(parse=self._parse))

    def _parse(self, **kwargs):
        self.requests.append(kwargs)
        reply = self.replies.pop(0)
        if isinstance(reply, Exception):
            raise reply
        if reply == "refusal":
            return SimpleNamespace(stop_reason="refusal", parsed_output=None)
        return SimpleNamespace(stop_reason="end_turn", parsed_output=reply)


@pytest.fixture
def claude(monkeypatch: pytest.MonkeyPatch) -> FakeClaude:
    fake = FakeClaude()
    monkeypatch.setattr(assistant._settings, "assistant_enabled", True)
    monkeypatch.setattr(assistant, "load_catalog", lambda: CATALOG)
    monkeypatch.setattr(assistant, "get_client", lambda: fake)
    return fake


def start_chat(client: TestClient, message: str) -> dict:
    response = client.post("/api/chat/conversations", json={"name": "Tom Lee", "email": "tom@example.com", "message": message})
    assert response.status_code == 201, response.text
    return client.get("/api/chat/conversation").json()


def test_assistant_answers_with_only_the_asked_tour(customer: TestClient, claude: FakeClaude) -> None:
    claude.replies.append(
        AssistantReply(reply="The Gobi Desert Expedition is 8 days from $1,890.", tour_slug="gobi-desert-expedition", handoff=False)
    )
    chat = start_chat(customer, "Tell me about your Gobi trip")

    reply = chat["messages"][-1]
    assert reply["sender"] == "assistant"
    assert reply["body"].startswith("The Gobi Desert Expedition")
    assert reply["attachment"] == {
        "slug": "gobi-desert-expedition",
        "title": "Gobi Desert Expedition",
        "region": "Gobi Desert",
        "durationDays": 8,
        "priceFrom": "$1,890",
        "url": "/en/tours/gobi-desert-expedition",
        "image": "/images/gobi/camels-at-dunes.jpg",
    }
    assert chat["assistantTyping"] is False
    assert chat["unreadCount"] == 1  # the assistant's reply counts as new for the traveller

    request = claude.requests[0]
    assert request["model"] == "claude-opus-5-5"
    assert request["output_format"] is AssistantReply
    assert request["fallbacks"] == "default"
    assert "gobi-desert-expedition" in request["system"][0]["text"]
    assert request["system"][0]["cache_control"] == {"type": "ephemeral"}
    assert request["messages"][-1] == {"role": "user", "content": "Tell me about your Gobi trip"}


def test_unknown_tour_slug_is_not_attached(customer: TestClient, claude: FakeClaude) -> None:
    claude.replies.append(AssistantReply(reply="We have a few desert trips.", tour_slug="made-up-tour", handoff=False))
    chat = start_chat(customer, "Any desert trips?")
    assert chat["messages"][-1]["attachment"] is None


def test_handoff_stops_the_assistant(customer: TestClient, admin: TestClient, claude: FakeClaude) -> None:
    claude.replies.append(AssistantReply(reply="A trip planner will reply here shortly.", tour_slug=None, handoff=True))
    chat = start_chat(customer, "I want to book for 4 people in July")
    assert [m["sender"] for m in chat["messages"]][-2:] == ["assistant", "system"]

    conversation = admin.get(f"/api/admin/conversations/{chat['id']}").json()
    assert conversation["aiEnabled"] is False
    customer.post("/api/chat/messages", json={"body": "Hello?"})
    assert len(claude.requests) == 1  # no further AI replies


def test_staff_reply_takes_over_and_can_hand_back(customer: TestClient, admin: TestClient, claude: FakeClaude) -> None:
    claude.replies.append(AssistantReply(reply="Hi Tom!", tour_slug=None, handoff=False))
    chat = start_chat(customer, "Hi")
    admin.post(f"/api/admin/conversations/{chat['id']}/messages", json={"body": "Saraa here, happy to help."})

    customer.post("/api/chat/messages", json={"body": "Thanks Saraa"})
    assert len(claude.requests) == 1

    switched = admin.patch(f"/api/admin/conversations/{chat['id']}", json={"aiEnabled": True})
    assert switched.json()["aiEnabled"] is True
    claude.replies.append(AssistantReply(reply="Happy to help with anything else.", tour_slug=None, handoff=False))
    customer.post("/api/chat/messages", json={"body": "One more question"})
    assert len(claude.requests) == 2
    # Staff messages reach Claude as the company's side of the conversation.
    assert {"role": "assistant", "content": "[Trip planner Saraa] Saraa here, happy to help."} in claude.requests[1]["messages"]


def test_trip_plan_gets_a_tailored_first_reply(customer: TestClient, claude: FakeClaude) -> None:
    claude.replies.append(
        AssistantReply(reply="Hi Anna! The Altai Eagle Hunters Journey fits.", tour_slug="altai-eagle-hunters-journey", handoff=False)
    )
    customer.post("/api/trip-plans", json=PLAN)
    chat = customer.get("/api/chat/conversation").json()
    assert chat["messages"][-1]["attachment"]["slug"] == "altai-eagle-hunters-journey"
    context = claude.requests[0]["messages"][0]["content"]
    assert "Anna Schmidt" in context and "14 days" in context and "2000-3500" in context


def test_refusal_hands_over_to_staff(customer: TestClient, claude: FakeClaude) -> None:
    claude.replies.append("refusal")
    chat = start_chat(customer, "Something the model declines")
    assert chat["messages"][-1]["sender"] == "system"
    assert chat["messages"][-2]["sender"] == "assistant"


def test_missing_credentials_leave_the_chat_to_staff(customer: TestClient, claude: FakeClaude) -> None:
    claude.replies.append(TypeError("Could not resolve authentication method."))
    chat = start_chat(customer, "Hello")
    assert [m["sender"] for m in chat["messages"]] == ["customer"]
    assert chat["assistantTyping"] is False


def test_assistant_disabled_globally(customer: TestClient, claude: FakeClaude, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(assistant._settings, "assistant_enabled", False)
    start_chat(customer, "Hello")
    assert claude.requests == []
