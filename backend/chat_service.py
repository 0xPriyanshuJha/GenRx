from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import ollama

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    chat_type: str

class ChatResponse(BaseModel):
    response: str
    timestamp: str

@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        system_content = {
            "chronic_management": "You are a chronic disease management specialist. Provide guidance and support for managing chronic conditions while maintaining medical accuracy.",
        }.get(request.chat_type)
        
        if not system_content:
            raise HTTPException(status_code=400, detail="Invalid chat type")
        
        conversation = [
            {"role": "system", "content": system_content},
            {"role": "user", "content": request.message}
        ]
        
        response = ollama.chat(
            model="llama3.1", 
            messages=conversation
        )
        
        response_content = response["message"]["content"]
        
        return ChatResponse(
            response=response_content,
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))