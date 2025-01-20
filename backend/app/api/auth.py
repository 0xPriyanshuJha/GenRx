from fastapi import FastAPI, HTTPException, Depends
from google.auth.transport import requests
from google.oauth2 import id_token
from sqlalchemy import Column, String, DateTime, create_engine, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Database Configuration
DATABASE_URL = "sqlite:///./test.db"

Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define User Model
class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)  # Google User ID
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    picture = Column(String, nullable=True)
    last_login = Column(DateTime, server_default=func.now(), onupdate=func.now())

# Create Tables
Base.metadata.create_all(bind=engine)

# FastAPI App
app = FastAPI()

GOOGLE_CLIENT_ID = "<YOUR_CLIENT_ID>"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/auth/google")
async def google_auth(token: dict, db: Session = Depends(get_db)):
    try:
        # Validate the token
        idinfo = id_token.verify_oauth2_token(
            token["token"], requests.Request(), GOOGLE_CLIENT_ID
        )

        # Extract user information
        user_id = idinfo["sub"]
        email = idinfo["email"]
        name = idinfo["name"]
        picture = idinfo.get("picture")

        # Check if the user already exists in the database
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            # Update last login time
            user.last_login = func.now()
        else:
            # Create a new user
            user = User(id=user_id, email=email, name=name, picture=picture)
            db.add(user)

        db.commit()  # Save changes to the database
        db.refresh(user)  # Refresh the user object to return updated info

        return {
            "message": "Login successful",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "picture": user.picture,
                "last_login": user.last_login,
            },
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
