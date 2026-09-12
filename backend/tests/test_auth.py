"""Tests for authentication endpoints."""

from app.core.config import settings


def test_login_success(client):
    response = client.post(
        "/api/auth/login",
        json={
            "email": settings.demo_user_email,
            "password": settings.demo_user_password,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] > 0


def test_login_invalid_password(client):
    response = client.post(
        "/api/auth/login",
        json={
            "email": settings.demo_user_email,
            "password": "WrongPassword123!",
        },
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_unknown_user(client):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@trial.dev",
            "password": "AnyPassword123!",
        },
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_validation_error(client):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "not-an-email",
            "password": "",
        },
    )
    assert response.status_code == 422


def test_get_me_authenticated(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == settings.demo_user_email.lower()
    assert data["full_name"] == "Test Researcher"


def test_get_me_unauthenticated(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_get_me_invalid_token(client):
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid.token.payload"})
    assert response.status_code == 401
