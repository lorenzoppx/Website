from fastapi import FastAPI, File, UploadFile, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi.responses import JSONResponse
import os
from proc import function_clip
from fastapi import BackgroundTasks
import json


import threading
from typing import Dict, List

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable for embeddings (thread-safe)
global_embeddings: Dict[str, List[float]] = {}
embeddings_lock = threading.Lock()

import torch
import open_clip
from PIL import Image
import json
import aiofiles
import io

device = "cuda" if torch.cuda.is_available() else "cpu"
model, _, preprocess = open_clip.create_model_and_transforms('coca_ViT-L-14', pretrained='laion2B-s13B-b90k')

async def function_clip_(image_path:str,name:str):

    #image_path = "./jpg/myImage-1746412040806.png"
    if name not in global_embeddings:
        async with aiofiles.open(image_path, mode='rb') as f:
            content = await f.read()
        pil_image = Image.open(io.BytesIO(content)).convert("RGB")  # Ensure 3 channels

        image = preprocess(pil_image).unsqueeze(0)
        embedding = model.encode_image(image).squeeze().tolist()

        print(json.dumps(embedding))

        # Store in global variable
        with embeddings_lock:
            global_embeddings[name] = embedding
        print(f"Stored embedding for {name} in global variable")

        response = {"embedding": json.dumps(embedding)}

    return 0
    #return JSONResponse(content=response, status_code=200)

"""
import subprocess
async def function_clip_0(image_path:str,name:str):

    image_path = "C:/Users/loren/source/repos/Website/server/jpg/myImage-1746412040806.png"

    result = subprocess.run(
                ["python", "embed_img.py"],
                capture_output=True,
                text=True,
                check=True
            )
    print(f"Subprocess for {name} completed: {result.stdout}")

    response = {"embedding": image_path}

    return JSONResponse(content=response, status_code=200)
"""

@app.post("/clip1")
async def receive_clip(img: UploadFile = File(...), name: str = Header(...), background_tasks: BackgroundTasks = None):
    try:
        
        # Save the uploaded blob as a file
        save_path = f"./jpg/{name}"
        print(save_path)
        os.makedirs("./jpg", exist_ok=True)
        with open(save_path, "wb") as f:
            content = await img.read()
            f.write(content)

        print(f"✅ Received and saved clip as {save_path}")

        import json
        background_tasks.add_task(function_clip_, save_path, name)
        #background_tasks.add_task(threading.Thread, target=function_clip_, args=(save_path, name))
        #em = await function_clip_(save_path,name)

        response = {"embedding": "Processing","message": "File received", "filename": name}
        print(f"Sending response: {json.dumps(response)}")
        return JSONResponse(content=json.dumps(response), status_code=200)

    except Exception as e:
        print(f"❌ Error: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/embedding_status/{filename}")
async def check_embedding_status(filename: str):
    try:
        with embeddings_lock:
            # Check global variable
            if filename in global_embeddings:
                print(f"Embedding found for {filename} in global variable")
                return JSONResponse(
                    content={
                        "status": "complete",
                        "filename": filename,
                        "embedding": global_embeddings[filename],
                    },
                    status_code=200,
                )
            else:
                print(f"Embedding not found for {filename}, still processing")
                return JSONResponse(content={"status": "processing"}, status_code=202)

    except Exception as e:
        print(f"Error checking embedding status: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, timeout_keep_alive=60)