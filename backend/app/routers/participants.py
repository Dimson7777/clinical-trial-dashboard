import logging

from fastapi import APIRouter, HTTPException, Query, status

from app.core.deps import CurrentUser, DbSession
from app.schemas import ParticipantCreate, ParticipantRead, ParticipantStatus, StudyGroup
from app.services import participants as participants_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/participants", tags=["participants"])


@router.get("", response_model=list[ParticipantRead])
def list_participants(
    db: DbSession,
    current_user: CurrentUser,
    status_filter: ParticipantStatus | None = Query(default=None, alias="status"),
    study_group: StudyGroup | None = Query(default=None),
) -> list[ParticipantRead]:
    records = participants_service.list_participants(
        db,
        status=status_filter.value if status_filter else None,
        study_group=study_group.value if study_group else None,
    )
    return [ParticipantRead.model_validate(record) for record in records]


@router.get("/{participant_id}", response_model=ParticipantRead)
def get_participant(participant_id: str, db: DbSession, current_user: CurrentUser) -> ParticipantRead:
    participant = participants_service.get_participant(db, participant_id)
    if participant is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participant not found")
    return ParticipantRead.model_validate(participant)


@router.post("", response_model=ParticipantRead, status_code=status.HTTP_201_CREATED)
def create_participant(
    payload: ParticipantCreate, db: DbSession, current_user: CurrentUser
) -> ParticipantRead:
    try:
        participant = participants_service.create_participant(db, payload)
    except participants_service.DuplicateSubjectIdError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Subject ID '{exc.subject_id}' is already registered",
        ) from exc
    return ParticipantRead.model_validate(participant)
