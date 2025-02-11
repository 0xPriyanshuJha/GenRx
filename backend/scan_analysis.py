from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime
import io
from PIL import Image
import base64
import ollama

router = APIRouter()

class AnalysisResponse(BaseModel):
    analysis: str
    recommendations: List[str]
    timestamp: str

def image_to_base64(image: Image.Image) -> str:
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode()

@router.post("/scan", response_model=AnalysisResponse)
async def analyze_scan(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        image_base64 = image_to_base64(image)
        
        prompt = f"""Analyze this medical scan carefully and provide:
1. Detailed observations
2. Key findings
3. Potential areas of concern
4. Recommendations

Medical Scan: <image>{image_base64}</image>"""
        
        response = ollama.chat(
            model="llama3.2-vision",  # Ensure you have this model locally via Ollama
            messages=[
                {"role": "system", "content": "You are a medical scan analysis expert. Provide detailed and accurate analysis of medical scans."},
                {"role": "user", "content": prompt}
            ]
        )
        
        analysis = response["message"]["content"]
        recommendations = [line.strip('- ') for line in analysis.split('\n') 
                           if line.strip().startswith('-')][:3]
        
        return AnalysisResponse(
            analysis=analysis,
            recommendations=recommendations,
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
