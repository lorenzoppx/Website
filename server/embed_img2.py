import sys
import torch
import open_clip
from PIL import Image
import numpy as np
import json
import warnings
warnings.filterwarnings("ignore")
import os
os.environ["PYTHONWARNINGS"] = "ignore"

#image_path = sys.argv[1]
#image_path = "./server/jpg/myImage-1746375442129.png"
#image_path = sys.argv[1]
image_path = "C:/Users/loren/Downloads/cop.jpeg"

device = "cuda" if torch.cuda.is_available() else "cpu"
model, _, preprocess = open_clip.create_model_and_transforms('coca_ViT-L-14', pretrained='laion2B-s13B-b90k')

pil_image = Image.open(image_path).convert("RGB")  # Ensure 3 channels

with torch.no_grad():
    image = preprocess(pil_image).unsqueeze(0)
    embedding = model.encode_image(image).squeeze().tolist()

print(json.dumps(embedding))