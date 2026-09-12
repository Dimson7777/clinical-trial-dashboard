"""Authentication logic: credential checks and user lookup."""

import logging

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.models import User

logger = logging.getLogger(__name__)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Return the user when the credentials match, otherwise ``None``.

    The same result is returned for an unknown email and a wrong password so the
    API never reveals which accounts exist.
    """
    user = get_user_by_email(db, email.lower())
    if user is None or not verify_password(password, user.password_hash):
        logger.warning("Failed login attempt for email=%s", email)
        return None
    return user
