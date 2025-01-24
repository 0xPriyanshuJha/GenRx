from google.auth.transport import requests
from google.oauth2 import id_token
from fastapi import HTTPException
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

def google_authenticate(token: str):
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        
        # Extract user information from the token
        user_info = {
            "user_id": idinfo["sub"],
            "email": idinfo["email"],
            "name": idinfo["name"],
            "picture": idinfo.get("picture")
        }
        
        return user_info
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid token")
