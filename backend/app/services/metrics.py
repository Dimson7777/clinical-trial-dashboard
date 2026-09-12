"""Trial metrics, aggregated in the database rather than in Python."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Participant
from app.schemas import MetricsResponse


def _count_where(db: Session, column, value: str) -> int:
    return db.scalar(select(func.count()).select_from(Participant).where(column == value)) or 0


def calculate_metrics(db: Session) -> MetricsResponse:
    total = db.scalar(select(func.count()).select_from(Participant)) or 0
    average_age = db.scalar(select(func.avg(Participant.age)))

    return MetricsResponse(
        total_participants=total,
        active=_count_where(db, Participant.status, "active"),
        completed=_count_where(db, Participant.status, "completed"),
        withdrawn=_count_where(db, Participant.status, "withdrawn"),
        treatment=_count_where(db, Participant.study_group, "treatment"),
        control=_count_where(db, Participant.study_group, "control"),
        average_age=round(float(average_age), 1) if average_age is not None else None,
    )
