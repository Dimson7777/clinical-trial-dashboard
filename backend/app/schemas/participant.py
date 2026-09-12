from datetime import date
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator


class StudyGroup(str, Enum):
    treatment = "treatment"
    control = "control"


class ParticipantStatus(str, Enum):
    active = "active"
    completed = "completed"
    withdrawn = "withdrawn"


class Gender(str, Enum):
    F = "F"
    M = "M"
    Other = "Other"


class ParticipantCreate(BaseModel):
    subject_id: str = Field(min_length=1, max_length=50)
    study_group: StudyGroup
    enrollment_date: date
    status: ParticipantStatus = ParticipantStatus.active
    age: int = Field(ge=0, le=120)
    gender: Gender

    @field_validator("subject_id")
    @classmethod
    def _normalise_subject_id(cls, value: str) -> str:
        return value.strip()

    @field_validator("enrollment_date")
    @classmethod
    def _reject_future_dates(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("enrollment_date cannot be in the future")
        return value


class ParticipantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    participant_id: str
    subject_id: str
    study_group: StudyGroup
    enrollment_date: date
    status: ParticipantStatus
    age: int
    gender: Gender
