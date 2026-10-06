from fastapi.testclient import TestClient

PLAN = {
    "fullName": "Anna Schmidt",
    "email": "anna@example.com",
    "country": "Germany",
    "message": "We would love to see the eagle festival.",
    "startDate": "2027-06-10",
    "endDate": "2027-06-24",
    "days": 14,
    "adults": 2,
    "children": 1,
    "interests": ["horse-riding"],
    "destinations": ["gobi-desert"],
    "activityLevel": "balanced",
    "accommodationStyle": "mixed",
    "budget": "2000-3500",
}


def test_trip_plan_opens_a_linked_chat(customer: TestClient, admin: TestClient) -> None:
    response = customer.post("/api/trip-plans", json=PLAN)
    assert response.status_code == 201, response.text
    reference = response.json()["reference"]
    assert reference.startswith("ESK-")
    assert "esk_chat" in customer.cookies

    chat = customer.get("/api/chat/conversation").json()
    assert chat["tripReference"] == reference
    assert [m["sender"] for m in chat["messages"]] == ["system", "customer", "system"]

    plans = admin.get("/api/admin/trip-plans").json()
    assert len(plans) == 1
    assert plans[0]["reference"] == reference
    assert plans[0]["status"] == "new"
    assert plans[0]["unreadCount"] == 1
    assert admin.get("/api/admin/summary").json() == {"newTripPlans": 1, "unreadConversations": 1}


def test_chat_round_trip_and_unread_markers(customer: TestClient, admin: TestClient) -> None:
    started = customer.post(
        "/api/chat/conversations",
        json={"name": "Tom", "email": "tom@example.com", "message": "Hi! Is July a good month?"},
    )
    assert started.status_code == 201, started.text
    conversation_id = started.json()["id"]

    inbox = admin.get("/api/admin/conversations").json()
    assert inbox[0]["unreadCount"] == 1
    assert inbox[0]["lastMessage"]["body"] == "Hi! Is July a good month?"

    reply = admin.post(f"/api/admin/conversations/{conversation_id}/messages", json={"body": "Yes — Naadam!"})
    assert reply.status_code == 201
    assert reply.json()["authorName"] == "Saraa"
    # Replying marks the thread as read for staff.
    assert admin.get("/api/admin/conversations").json()[0]["unreadCount"] == 0

    last_seen = started.json()["messages"][-1]["id"]
    update = customer.get(f"/api/chat/conversation?after={last_seen}").json()
    assert [m["body"] for m in update["messages"]] == ["Yes — Naadam!"]
    assert update["unreadCount"] == 1
    customer.post("/api/chat/read")
    assert customer.get("/api/chat/conversation").json()["unreadCount"] == 0


def test_reply_moves_new_plan_to_contacted(customer: TestClient, admin: TestClient) -> None:
    customer.post("/api/trip-plans", json=PLAN)
    plan = admin.get("/api/admin/trip-plans").json()[0]
    admin.post(f"/api/admin/conversations/{plan['conversationId']}/messages", json={"body": "Hello Anna"})
    assert admin.get(f"/api/admin/trip-plans/{plan['id']}").json()["status"] == "contacted"

    updated = admin.patch(f"/api/admin/trip-plans/{plan['id']}", json={"status": "quoted", "adminNotes": "Sent v1"})
    assert updated.json()["status"] == "quoted"
    assert updated.json()["adminNotes"] == "Sent v1"


def test_visitor_without_chat_gets_null(customer: TestClient) -> None:
    response = customer.get("/api/chat/conversation")
    assert response.status_code == 200
    assert response.json() is None
    assert customer.post("/api/chat/messages", json={"body": "hello"}).status_code == 404


def test_admin_endpoints_require_sign_in(customer: TestClient) -> None:
    assert customer.get("/api/admin/trip-plans").status_code == 401
    assert customer.get("/api/admin/conversations").status_code == 401
    bad = customer.post("/api/admin/login", json={"email": "planner@eternalskytour.com", "password": "nope"})
    assert bad.status_code == 401


def test_customers_cannot_read_each_others_chats(customer: TestClient) -> None:
    customer.post("/api/chat/conversations", json={"name": "A", "email": "a@example.com", "message": "secret"})
    from app.main import app

    with TestClient(app) as stranger:
        assert stranger.get("/api/chat/conversation").json() is None
        stranger.cookies.set("esk_chat", "guessed-token")
        assert stranger.get("/api/chat/conversation").json() is None


def test_validation(customer: TestClient) -> None:
    assert customer.post("/api/trip-plans", json={**PLAN, "email": "not-an-email"}).status_code == 422
    assert customer.post("/api/trip-plans", json={**PLAN, "endDate": "2027-06-01"}).status_code == 422
    assert customer.post("/api/chat/conversations", json={"name": "A", "email": "a@x.io", "message": "  "}).status_code == 422
