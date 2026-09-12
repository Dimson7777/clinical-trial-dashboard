"""Participant persistence logic, kept out of the routers."""

import logging

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Participant
from app.schemas import ParticipantCreate

logger = logging.getLogger(__name__)


class DuplicateSubjectIdError(Exception):
    """Raised when a subject_id is already used by another participant."""

    def __init__(self, subject_id: str) -> None:
        super().__init__(f"subject_id '{subject_id}' already exists")
        self.subject_id = subject_id


def list_participants(
    db: Session,
    *,
    status: str | None = None,
    study_group: str | None = None,
) -> list[Participant]:
    query = select(Participant)
    if status:
        query = query.where(Participant.status == status)
    if study_group:
        query = query.where(Participant.study_group == study_group)
    query = query.order_by(Participant.subject_id)
    return list(db.scalars(query))


def get_participant(db: Session, participant_id: str) -> Participant | None:
    return db.get(Participant, participant_id)


def get_by_subject_id(db: Session, subject_id: str) -> Participant | None:
    return db.scalar(select(Participant).where(Participant.subject_id == subject_id))


def create_participant(db: Session, payload: ParticipantCreate) -> Participant:
    if get_by_subject_id(db, payload.subject_id) is not None:
        raise DuplicateSubjectIdError(payload.subject_id)

    participant = Participant(
        subject_id=payload.subject_id,
        study_group=payload.study_group.value,
        enrollment_date=payload.enrollment_date,
        status=payload.status.value,
        age=payload.age,
        gender=payload.gender.value,
    )
    db.add(participant)
    db.commit()
    db.refresh(participant)
    logger.info(
        "Participant created: participant_id=%s subject_id=%s",
        participant.participant_id,
        participant.subject_id,
    )
    return participant
