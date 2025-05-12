import sys
import torch
import clip
from PIL import Image
import json

#image_path = sys.argv[1]
image_path = r"C:/Users/loren/source/repos/Website/server/jpg/myImage-1746412040806.png"

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

pil_image = Image.open(image_path).convert("RGB")  # Ensure 3 channels

with torch.no_grad():
    image = preprocess(pil_image).unsqueeze(0)
    embedding = model.encode_image(image).squeeze().tolist()

print(json.dumps(embedding))