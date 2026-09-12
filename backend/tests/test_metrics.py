"""Tests for trial metrics calculations."""


def test_metrics_unauthenticated(client):
    response = client.get("/api/metrics")
    assert response.status_code == 401


def test_metrics_empty_db(client, auth_headers):
    response = client.get("/api/metrics", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_participants"] == 0
    assert data["active"] == 0
    assert data["completed"] == 0
    assert data["withdrawn"] == 0
    assert data["treatment"] == 0
    assert data["control"] == 0
    assert data["average_age"] is None


def test_metrics_with_data(client, auth_headers):
    participants = [
        {"subject_id": "P301", "study_group": "treatment", "enrollment_date": "2024-01-01", "status": "active", "age": 40, "gender": "F"},
        {"subject_id": "P302", "study_group": "treatment", "enrollment_date": "2024-01-02", "status": "completed", "age": 50, "gender": "M"},
        {"subject_id": "P303", "study_group": "control", "enrollment_date": "2024-01-03", "status": "withdrawn", "age": 60, "gender": "Other"},
    ]
    for p in participants:
        res = client.post("/api/participants", json=p, headers=auth_headers)
        assert res.status_code == 201

    response = client.get("/api/metrics", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_participants"] == 3
    assert data["active"] == 1
    assert data["completed"] == 1
    assert data["withdrawn"] == 1
    assert data["treatment"] == 2
    assert data["control"] == 1
    assert data["average_age"] == 50.0
