from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings, SettingsConfigDict
import uuid
import httpx
import boto3
from botocore.exceptions import BotoCoreError, NoCredentialsError


class Settings(BaseSettings):
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str
    aws_endpoint_url: str
    aws_s3_bucket: str
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


s3_client = boto3.client(
    "s3",
    region_name=settings.aws_region,
    endpoint_url=settings.aws_endpoint_url,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/convert")
async def convert_pptx_to_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pptx"):
        raise HTTPException(status_code=400, detail="Only .pptx files are supported")

    key = f"{uuid.uuid4()}.pdf"

    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading the uploaded file: {str(e)}"
        )

    try:
        files = {
            "file": (file.filename, content, file.content_type),
            "convert-to": (None, "pdf"),
        }

        async with httpx.AsyncClient() as client:
            response = await client.post("http://127.0.0.1:2004/request", files=files)
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=502, detail=f"Conversion service error: {str(e)}"
        )

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to convert file")

    try:
        pdfContent = response.content
        s3_client.put_object(
            Bucket=settings.aws_s3_bucket,
            Key=key,
            Body=pdfContent,
            ContentType="application/pdf",
        )
    except (BotoCoreError, NoCredentialsError) as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload PDF: {str(e)}")

    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.aws_s3_bucket, "Key": key},
            ExpiresIn=3600,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate presigned URL: {str(e)}"
        )

    return {"message": "PPTX converted to PDF", "url": url}
