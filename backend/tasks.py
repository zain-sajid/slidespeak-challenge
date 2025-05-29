from celery import Celery
import httpx
import uuid
from botocore.exceptions import BotoCoreError, NoCredentialsError
from config import settings
from aws import s3_client

celery_app = Celery("tasks", broker=settings.redis_url, backend=settings.redis_url)


@celery_app.task(time_limit=200)
def convert_and_upload(file_content: bytes, filename: str, content_type: str):
    # Using unique folders to avoid collisions but keep the same filename
    key = f"pdfs/{uuid.uuid4()}/{filename}.pdf"

    files = {
        "file": (filename, file_content, content_type),
        "convert-to": (None, "pdf"),
    }

    try:
        timeout = httpx.Timeout(100)
        print(f"{settings.unoserver_url}/request")
        response = httpx.post(
            f"{settings.unoserver_url}/request", files=files, timeout=timeout
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
