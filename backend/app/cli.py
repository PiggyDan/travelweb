"""Staff account management.

    python -m app.cli create-admin --email you@example.com --name "Your Name"

The password is prompted for (never passed on the command line). Running it
again for an existing email resets that account's password.
"""

import argparse
import getpass
import sys

from sqlalchemy import func, select

from app.db import Base, SessionLocal, engine
from app.models import AdminUser
from app.security import hash_password


def create_admin(email: str, name: str) -> None:
    password = getpass.getpass("Password (min. 10 characters): ")
    if len(password) < 10:
        sys.exit("Password must be at least 10 characters.")
    if getpass.getpass("Repeat password: ") != password:
        sys.exit("Passwords do not match.")

    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        admin = db.scalar(select(AdminUser).where(func.lower(AdminUser.email) == email.lower()))
        if admin:
            admin.password_hash = hash_password(password)
            admin.name = name
            action = "Updated"
        else:
            db.add(AdminUser(email=email.lower(), name=name, password_hash=hash_password(password)))
            action = "Created"
        db.commit()
    print(f"{action} admin {email}.")


def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m app.cli")
    commands = parser.add_subparsers(dest="command", required=True)
    create = commands.add_parser("create-admin", help="Create an admin, or reset an existing admin's password")
    create.add_argument("--email", required=True)
    create.add_argument("--name", required=True)
    args = parser.parse_args()
    if args.command == "create-admin":
        create_admin(args.email, args.name)


if __name__ == "__main__":
    main()
