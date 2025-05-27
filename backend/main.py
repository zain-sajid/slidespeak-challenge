from fastapi import FastAPI, UploadFile, File, HTTPException
import os
import uuid
import httpx

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/convert")
async def convert_pptx_to_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pptx"):
        raise HTTPException(status_code=400, detail="Only .pptx files are supported")

    tmp_dir = f"tmp/{uuid.uuid4()}"
    os.makedirs(tmp_dir, exist_ok=True)
    output_path = os.path.join(tmp_dir, "output.pdf")

    try:
        content = await file.read()

        files = {
            "file": (file.filename, content, file.content_type),
            "convert-to": (None, "pdf"),
        }

        async with httpx.AsyncClient() as client:
            response = await client.post("http://127.0.0.1:2004/request", files=files)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Conversion failed")

        with open(output_path, "wb") as out:
            out.write(response.content)

        return {"message": "PPTX converted to PDF"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
