"""Single place where Python logging is configured for the API."""

import logging
import sys

from app.core.config import settings

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"


def configure_logging() -> None:
    logging.basicConfig(
        level=settings.log_level.upper(),
        format=LOG_FORMAT,
        stream=sys.stdout,
        force=True,
    )
    # Access logs are already emitted by uvicorn; keep SQLAlchemy quiet.
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
