import hashlib
import secrets
from datetime import UTC, datetime, timedelta

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError
from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import get_db
from app.models import AdminUser

ADMIN_COOKIE = "esk_admin"
CHAT_COOKIE = "esk_chat"

_hasher = PasswordHasher()
_settings = get_settings()


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password_hash: str, password: str) -> bool:
    try:
        return _hasher.verify(password_hash, password)
    except (VerifyMismatchError, InvalidHashError):
        return False


def create_admin_token(admin_id: int) -> str:
    expires = datetime.now(UTC) + timedelta(hours=_settings.admin_session_hours)
    return jwt.encode({"sub": str(admin_id), "exp": expires}, _settings.secret_key, algorithm="HS256")


def get_current_admin(
    esk_admin: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> AdminUser:
    unauthorized = HTTPException(status.HTTP_401_UNAUTHORIZED, "Not signed in")
    if not esk_admin:
        raise unauthorized
    try:
        payload = jwt.decode(esk_admin, _settings.secret_key, algorithms=["HS256"])
        admin = db.get(AdminUser, int(payload["sub"]))
    except (jwt.PyJWTError, KeyError, ValueError):
        raise unauthorized from None
    if admin is None:
        raise unauthorized
    return admin


def new_chat_token() -> tuple[str, str]:
    """Returns (token for the visitor's cookie, hash to store). Only the hash is kept server-side."""
    token = secrets.token_urlsafe(32)
    return token, hash_chat_token(token)


def hash_chat_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


# Unambiguous characters only (no 0/O, 1/I/L), so references are easy to read out over the phone.
_REFERENCE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"


def new_reference() -> str:
    return "ESK-" + "".join(secrets.choice(_REFERENCE_ALPHABET) for _ in range(6))
