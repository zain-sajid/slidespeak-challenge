from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from tasks import convert_and_upload
from main import app

client = TestClient(app)


def test_convert_invalid_file_type():
    response = client.post(
        "/convert", files={"file": ("test.txt", b"fake content", "text/plain")}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Only .pptx files are supported"


def test_convert_missing_file():
    response = client.post("/convert", files={})
    assert response.status_code == 422


def test_convert_pptx_to_pdf_success():
    file_content = b"dummy content"
    dummy_task_id = "fake-task-id"

    with patch.object(convert_and_upload, "delay") as mock_delay:
        mock_task = MagicMock()
        mock_task.id = dummy_task_id
        mock_delay.return_value = mock_task

        files = {
            "file": (
                "test.pptx",
                file_content,
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            )
        }
        response = client.post("/convert", files=files)

        assert response.status_code == 200
        assert response.json() == {
            "message": "Task started",
            "task_id": dummy_task_id,
        }


def test_get_task_result_pending():
    with patch("main.AsyncResult") as mock_result_class:
        mock_result = MagicMock()
        mock_result.ready.return_value = False
        mock_result.status = "PENDING"
        mock_result_class.return_value = mock_result

        response = client.get("/task/fake-task-id")
        assert response.status_code == 200
        assert response.json() == {"status": "PENDING"}


def test_get_task_result_success():
    with patch("main.AsyncResult") as mock_result_class:
        mock_result = MagicMock()
        mock_result.ready.return_value = True
        mock_result.status = "SUCCESS"
        mock_result.result = "https://example.com/download"
        mock_result_class.return_value = mock_result

        response = client.get("/task/fake-task-id")
        assert response.status_code == 200
        assert response.json() == {
            "status": "SUCCESS",
            "result": "https://example.com/download",
        }


def test_cancel_task():
    with patch("main.AsyncResult") as mock_result_class:
        mock_result = MagicMock()
        mock_result.revoke.return_value = None
        mock_result_class.return_value = mock_result

        response = client.delete("/cancel-task/fake-task-id")
        assert response.status_code == 200
        assert response.json() == {
            "status": "REVOKED",
            "task_id": "fake-task-id",
        }
