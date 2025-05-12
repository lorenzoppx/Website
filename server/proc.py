import torch
import open_clip
from PIL import Image
import json

def function_clip(image_path):

    image_path = "C:/Users/loren/source/repos/Website/server/jpg/myImage-1746412040806.png"

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, _, preprocess = open_clip.create_model_and_transforms('coca_ViT-L-14', pretrained='laion2B-s13B-b90k')

    pil_image = Image.open(image_path).convert("RGB")  # Ensure 3 channels

    with torch.no_grad():
        image = preprocess(pil_image).unsqueeze(0)
        embedding = model.encode_image(image).squeeze().tolist()

    print(json.dumps(embedding))

    return json.dumps(embedding)
