"""Idempotent seed data so the dashboard is useful on first run."""

import logging
from datetime import date

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models import Participant, User

logger = logging.getLogger(__name__)

# subject_id, study_group, enrollment_date, status, age, gender
PARTICIPANT_SEED: list[tuple[str, str, date, str, int, str]] = [
    ("P001", "treatment", date(2024, 1, 15), "active", 45, "F"),
    ("P002", "control", date(2024, 1, 16), "active", 52, "M"),
    ("P003", "treatment", date(2024, 1, 22), "completed", 38, "F"),
    ("P004", "control", date(2024, 1, 29), "active", 61, "M"),
    ("P005", "treatment", date(2024, 2, 5), "withdrawn", 29, "Other"),
    ("P006", "control", date(2024, 2, 7), "active", 47, "F"),
    ("P007", "treatment", date(2024, 2, 12), "active", 55, "M"),
    ("P008", "control", date(2024, 2, 19), "completed", 43, "F"),
    ("P009", "treatment", date(2024, 2, 26), "active", 34, "M"),
    ("P010", "control", date(2024, 3, 4), "active", 67, "F"),
    ("P011", "treatment", date(2024, 3, 11), "withdrawn", 41, "M"),
    ("P012", "control", date(2024, 3, 18), "active", 50, "Other"),
    ("P013", "treatment", date(2024, 3, 25), "completed", 58, "F"),
    ("P014", "control", date(2024, 4, 1), "active", 36, "M"),
    ("P015", "treatment", date(2024, 4, 8), "active", 62, "F"),
    ("P016", "control", date(2024, 4, 15), "withdrawn", 44, "M"),
    ("P017", "treatment", date(2024, 4, 22), "completed", 31, "F"),
    ("P018", "control", date(2024, 4, 29), "active", 49, "M"),
    ("P019", "treatment", date(2024, 5, 6), "active", 57, "F"),
    ("P020", "control", date(2024, 5, 13), "completed", 65, "M"),
    ("P021", "treatment", date(2024, 5, 20), "active", 39, "Other"),
    ("P022", "control", date(2024, 5, 27), "active", 53, "F"),
    ("P023", "treatment", date(2024, 6, 3), "withdrawn", 46, "M"),
    ("P024", "control", date(2024, 6, 10), "completed", 42, "F"),
]


def seed_demo_user(db: Session) -> None:
    email = settings.demo_user_email.lower()
    if db.scalar(select(User).where(User.email == email)) is not None:
        return

    db.add(
        User(
            email=email,
            full_name="Demo Researcher",
            password_hash=hash_password(settings.demo_user_password),
        )
    )
    db.commit()
    logger.info("Seeded demo user: email=%s", email)


def seed_participants(db: Session) -> None:
    if (db.scalar(select(func.count()).select_from(Participant)) or 0) > 0:
        return

    db.add_all(
        Participant(
            subject_id=subject_id,
            study_group=study_group,
            enrollment_date=enrollment_date,
            status=status,
            age=age,
            gender=gender,
        )
        for subject_id, study_group, enrollment_date, status, age, gender in PARTICIPANT_SEED
    )
    db.commit()
    logger.info("Seeded %d participants", len(PARTICIPANT_SEED))


def seed_database(db: Session) -> None:
    seed_demo_user(db)
    seed_participants(db)
