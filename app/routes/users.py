from fastapi import APIRouter, Depends, HTTPException
from fastapi import UploadFile, File, Form
from sqlalchemy.orm import Session

from app.config.db import get_db
from app.models.user import User
import traceback
from fastapi.responses import JSONResponse

from app.services.face_services import (
    generate_face_encoding
)

from app.utils.hash import hash_password

import shutil
import uuid
import os

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)



@router.post("/enroll")
async def enroll_user(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        print("🔥 ENROLL STARTED")

        existing_user = db.query(User).filter(User.email == email).first()

        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        filename = f"{uuid.uuid4()}.jpg"

        filepath = os.path.join(UPLOAD_DIR, filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        encoding = generate_face_encoding(filepath)

        print("ENCODING:", encoding)

        if encoding is None:
            raise HTTPException(status_code=400, detail="No face detected")

        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            biometric_id=str(uuid.uuid4()),
            face_encoding=str(list(encoding)),  # ✅ safer
            image=filepath
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        print("✅ USER SAVED")

        return {
            "message": "User enrolled successfully",
            "user_id": user.id
        }

    except Exception as e:
        db.rollback()
        print("❌ FULL ERROR TRACEBACK:")
        traceback.print_exc()

        return JSONResponse(
            status_code=500,
            content={
                "error":str(e)
            }
        )
       