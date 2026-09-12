"""Application settings, loaded from environment variables (or a local .env file)."""

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Used when no SECRET_KEY is provided. Safe for local development only; the
# application logs a warning at startup when this value is still in use.
DEV_SECRET_KEY = "dev-secret-key-change-me"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Clinical Trial Dashboard API"
    log_level: str = "INFO"

    database_url: str = "sqlite:///./clinical_trial.db"

    # Auth
    secret_key: str = DEV_SECRET_KEY
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # Comma-separated list of browser origins allowed to call the API.
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Demo account created by the seeder on first startup.
    demo_user_email: str = "researcher@trial.dev"
    demo_user_password: str = "Demo1234!"

    @field_validator("cors_origins")
    @classmethod
    def _strip_origins(cls, value: str) -> str:
        return value.strip()

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def uses_dev_secret(self) -> bool:
        return self.secret_key == DEV_SECRET_KEY


@lru_cache
def get_settings() -> Settings:
    """Cached so the environment is read once per process."""
    return Settings()


settings = get_settings()
