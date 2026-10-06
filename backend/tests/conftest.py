import os
import tempfile
from collections.abc import Iterator

import pytest

# Point the app at a throwaway database before anything imports it.
_db_dir = tempfile.mkdtemp()
os.environ["DATABASE_URL"] = f"sqlite:///{_db_dir}/test.db"
os.environ["SECRET_KEY"] = "test-secret-key-that-is-long-enough-for-hs256"
# Tests never call Claude; assistant tests switch it on with a fake client.
os.environ["ASSISTANT_ENABLED"] = "false"

from fastapi.testclient import TestClient  # noqa: E402

from app.db import Base, SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models import AdminUser  # noqa: E402
from app.security import hash_password  # noqa: E402

ADMIN_EMAIL = "planner@eternalskytour.com"
ADMIN_PASSWORD = "correct-horse-battery"


@pytest.fixture(autouse=True)
def fresh_db() -> Iterator[None]:
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        db.add(AdminUser(email=ADMIN_EMAIL, name="Saraa", password_hash=hash_password(ADMIN_PASSWORD)))
        db.commit()
    yield


@pytest.fixture
def customer() -> Iterator[TestClient]:
    with TestClient(app) as client:
        yield client


@pytest.fixture
def admin() -> Iterator[TestClient]:
    with TestClient(app) as client:
        response = client.post("/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert response.status_code == 200, response.text
        yield client
