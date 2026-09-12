from pydantic import BaseModel


class MetricsResponse(BaseModel):
    """Trial-level KPIs aggregated from the participants table."""

    total_participants: int
    active: int
    completed: int
    withdrawn: int
    treatment: int
    control: int
    average_age: float | None
