from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_invalid_file_type():
    response = client.post(
        "/convert", files={"file": ("test.txt", b"fake content", "text/plain")}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Only .pptx files are supported"


def test_missing_file():
    response = client.post("/convert", files={})
    assert response.status_code == 422
