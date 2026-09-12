from fastapi import APIRouter

from app.core.deps import CurrentUser, DbSession
from app.schemas import MetricsResponse
from app.services.metrics import calculate_metrics

router = APIRouter(prefix="/api/metrics", tags=["metrics"])


@router.get("", response_model=MetricsResponse)
def read_metrics(db: DbSession, current_user: CurrentUser) -> MetricsResponse:
    return calculate_metrics(db)
