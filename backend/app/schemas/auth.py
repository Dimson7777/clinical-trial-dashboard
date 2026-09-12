from pydantic import BaseModel, EmailStr, Field

from app.core.security import MAX_PASSWORD_BYTES


class LoginRequest(BaseModel):
    email: EmailStr
    # Capped because bcrypt ignores bytes past its 72-byte limit.
    password: str = Field(min_length=1, max_length=MAX_PASSWORD_BYTES)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserRead(BaseModel):
    email: str
    full_name: str
