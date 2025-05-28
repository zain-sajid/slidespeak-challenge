from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid
import httpx
from botocore.exceptions import BotoCoreError, NoCredentialsError
from tasks import celery_app, convert_and_upload
from config import settings, s3_client
from celery.result import AsyncResult

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/convert-task")
async def convert_pptx_to_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pptx"):
        raise HTTPException(status_code=400, detail="Only .pptx files are supported")

    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

    # Start Celery task
    task = convert_and_upload.delay(content, file.filename, file.content_type)

    return {"message": "Task started", "task_id": task.id}


@app.get("/task/{task_id}")
def get_task_result(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    if result.ready():
        return {"status": result.status, "result": result.result}
    return {"status": result.status}


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
