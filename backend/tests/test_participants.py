"""Tests for participants management endpoints."""

from datetime import date, timedelta
from app.models import Participant


def test_list_participants_unauthenticated(client):
    response = client.get("/api/participants")
    assert response.status_code == 401


def test_list_participants_empty(client, auth_headers):
    response = client.get("/api/participants", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_create_and_list_participants(client, auth_headers, db_session):
    payload = {
        "subject_id": "P101",
        "study_group": "treatment",
        "enrollment_date": "2024-01-15",
        "status": "active",
        "age": 45,
        "gender": "F",
    }
    response = client.post("/api/participants", json=payload, headers=auth_headers)
    assert response.status_code == 201
    created = response.json()
    assert created["subject_id"] == "P101"
    assert created["study_group"] == "treatment"
    assert created["enrollment_date"] == "2024-01-15"
    assert created["status"] == "active"
    assert created["age"] == 45
    assert created["gender"] == "F"
    assert "participant_id" in created

    # List participants
    list_response = client.get("/api/participants", headers=auth_headers)
    assert list_response.status_code == 200
    participants = list_response.json()
    assert len(participants) == 1
    assert participants[0]["subject_id"] == "P101"


def test_get_single_participant(client, auth_headers, db_session):
    payload = {
        "subject_id": "P102",
        "study_group": "control",
        "enrollment_date": "2024-02-10",
        "status": "completed",
        "age": 52,
        "gender": "M",
    }
    created = client.post("/api/participants", json=payload, headers=auth_headers).json()
    p_id = created["participant_id"]

    response = client.get(f"/api/participants/{p_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["participant_id"] == p_id
    assert response.json()["subject_id"] == "P102"


def test_get_nonexistent_participant(client, auth_headers):
    response = client.get("/api/participants/00000000-0000-0000-0000-000000000000", headers=auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Participant not found"


def test_create_duplicate_subject_id(client, auth_headers):
    payload = {
        "subject_id": "P103",
        "study_group": "treatment",
        "enrollment_date": "2024-03-01",
        "status": "active",
        "age": 30,
        "gender": "Other",
    }
    res1 = client.post("/api/participants", json=payload, headers=auth_headers)
    assert res1.status_code == 201

    res2 = client.post("/api/participants", json=payload, headers=auth_headers)
    assert res2.status_code == 409
    assert "already registered" in res2.json()["detail"]


def test_create_participant_future_date(client, auth_headers):
    future_date = (date.today() + timedelta(days=5)).isoformat()
    payload = {
        "subject_id": "P104",
        "study_group": "treatment",
        "enrollment_date": future_date,
        "status": "active",
        "age": 30,
        "gender": "F",
    }
    response = client.post("/api/participants", json=payload, headers=auth_headers)
    assert response.status_code == 422


def test_create_participant_invalid_age(client, auth_headers):
    payload = {
        "subject_id": "P105",
        "study_group": "control",
        "enrollment_date": "2024-01-01",
        "status": "active",
        "age": 150,  # exceeds max 120
        "gender": "M",
    }
    response = client.post("/api/participants", json=payload, headers=auth_headers)
    assert response.status_code == 422


def test_filter_participants(client, auth_headers, db_session):
    p1 = {
        "subject_id": "P201",
        "study_group": "treatment",
        "enrollment_date": "2024-01-01",
        "status": "active",
        "age": 30,
        "gender": "F",
    }
    p2 = {
        "subject_id": "P202",
        "study_group": "control",
        "enrollment_date": "2024-01-02",
        "status": "withdrawn",
        "age": 40,
        "gender": "M",
    }
    client.post("/api/participants", json=p1, headers=auth_headers)
    client.post("/api/participants", json=p2, headers=auth_headers)

    # Filter by status
    res_active = client.get("/api/participants?status=active", headers=auth_headers)
    assert res_active.status_code == 200
    assert len(res_active.json()) == 1
    assert res_active.json()[0]["subject_id"] == "P201"

    # Filter by study_group
    res_control = client.get("/api/participants?study_group=control", headers=auth_headers)
    assert res_control.status_code == 200
    assert len(res_control.json()) == 1
    assert res_control.json()[0]["subject_id"] == "P202"
