"""Shared FastAPI dependencies."""

import logging
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database import get_db
from app.models import User
from app.services.auth import get_user_by_email

logger = logging.getLogger(__name__)

# auto_error=False so a missing header returns our own 401 with a WWW-Authenticate
# header instead of FastAPI's default 403.
bearer_scheme = HTTPBearer(auto_error=False)

CREDENTIALS_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Not authenticated",
    headers={"WWW-Authenticate": "Bearer"},
)

DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    db: DbSession,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> User:
    """Resolve the bearer token to a user, or raise 401."""
    if credentials is None:
        raise CREDENTIALS_ERROR

    email = decode_access_token(credentials.credentials)
    if email is None:
        logger.warning("Rejected request with an invalid or expired token")
        raise CREDENTIALS_ERROR

    user = get_user_by_email(db, email)
    if user is None:
        # Token was signed by us but the account no longer exists.
        logger.warning("Token referenced a missing user: email=%s", email)
        raise CREDENTIALS_ERROR
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
