from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from pydantic import BaseModel
from auth import google_authenticate  # Import Google authentication function
from llm import analyze_prescription, analyze_scan, generate_management_plan  # Import LLM functions

app = FastAPI()

class Prescription(BaseModel):
    prescription_text: str

class PatientData(BaseModel):
    age: int
    medical_history: str
    current_conditions: str
    daily_metrics: dict  # Example: {"blood_sugar": 120, "blood_pressure": "130/85"}

# Route to authenticate user with Google OAuth2
@app.post("/api/auth/google")
async def google_auth(token: dict):
    user_info = google_authenticate(token["token"])
    return {"message": "Login successful", "user": user_info}

# Route for prescription analysis
@app.post("/api/analyze_prescription")
async def analyze_prescription_endpoint(prescription: Prescription):
    try:
        result = analyze_prescription(prescription.prescription_text)
        return {"message": "Prescription analysis successful", "analysis": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")

# Route for scan analysis (upload scan image)
@app.post("/api/analyze_scan")
async def analyze_scan_endpoint(file: UploadFile = File(...)):
    try:
        scan_analysis = analyze_scan(file)
        report = generate_management_plan(scan_analysis)
        return {"message": "Scan analysis successful", "report": report}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")

# Route for chronic disease management
@app.post("/api/chronic_disease_management")
async def chronic_disease_management_endpoint(patient_data: PatientData):
    try:
        plan = generate_management_plan(patient_data.dict())
        return {"message": "Chronic disease management plan generated", "plan": plan}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
