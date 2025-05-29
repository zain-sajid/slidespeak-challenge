from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tasks import celery_app, convert_and_upload
from celery.result import AsyncResult
from config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


@app.get("/")
async def root():
    return {"message": "Health Check"}


@app.post("/convert")
async def convert_pptx_to_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pptx"):
        raise HTTPException(status_code=400, detail="Only .pptx files are supported")

    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading the uploaded file: {str(e)}"
        )

    # Start Celery task
    task = convert_and_upload.delay(content, file.filename, file.content_type)

    return {"message": "Task started", "task_id": task.id}


@app.get("/task/{task_id}")
def get_task_result(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    if result.ready():
        return {"status": result.status, "result": str(result.result)}

    return {"status": result.status}


@app.delete("/cancel-task/{task_id}")
def cancel_task(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    result.revoke(terminate=True, signal="SIGKILL")
    return {"status": "REVOKED", "task_id": task_id}
