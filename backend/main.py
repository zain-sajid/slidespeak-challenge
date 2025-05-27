from fastapi import FastAPI, UploadFile, File, HTTPException
import os
import uuid


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

    input_path = os.path.join(tmp_dir, "input.pptx")

    # Save uploaded PPTX
    with open(input_path, "wb") as f:
        f.write(await file.read())

    return {"message": "PPTX converted to PDF"}
