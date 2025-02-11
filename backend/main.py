from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scan_analysis import router as scan_router
from prescription_analysis import router as prescription_router
from chat_service import router as chat_router

app = FastAPI(title="Healthcare AI API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router, prefix="/api/analyze", tags=["scan"])
app.include_router(prescription_router, prefix="/api/analyze", tags=["prescription"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models": {
            "vision": "Ollama Vision Model",
            "chat": "Ollama Llama3.1"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
