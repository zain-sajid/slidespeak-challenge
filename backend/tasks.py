from celery import Celery
import httpx
import uuid
from botocore.exceptions import BotoCoreError, NoCredentialsError
from config import settings, s3_client

celery_app = Celery(
    "tasks", broker="redis://localhost:6379/0", backend="redis://localhost:6379/0"
)


@celery_app.task
def add(x, y):
    return x + y


@celery_app.task(time_limit=150)
def convert_and_upload(file_content: bytes, filename: str, content_type: str):
    key = f"{uuid.uuid4()}.pdf"

    files = {
        "file": (filename, file_content, content_type),
        "convert-to": (None, "pdf"),
    }

    try:
        timeout = httpx.Timeout(100)
        response = httpx.post(
            "http://127.0.0.1:2004/request", files=files, timeout=timeout
        )
    except httpx.RequestError as e:
        raise Exception(f"Error converting the file: {str(e)}")

    if response.status_code != 200:
        raise Exception("Failed to convert file")

    try:
        s3_client.put_object(
            Bucket=settings.aws_s3_bucket,
            Key=key,
            Body=response.content,
            ContentType="application/pdf",
        )
    except (BotoCoreError, NoCredentialsError) as e:
        raise Exception(f"Failed to upload PDF: {str(e)}")

    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.aws_s3_bucket, "Key": key},
            ExpiresIn=3600,
        )
    except Exception as e:
        raise Exception(f"Failed to generate presigned URL: {str(e)}")

    return url
