from fastapi import APIRouter, Depends, HTTPException
from fastapi import UploadFile,File
from sqlalchemy.orm import Session

from app.config.db import get_db
from app.models.admin import Admin
from app.models.user import User

from app.utils.hash import verify_password
from app.utils.jwt import create_access_token
from app.services.face_services import verify_face
from app.services.attendance import create_attendance_record

import shutil
import uuid
import os

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/admin-login")
def admin_login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):

    admin = db.query(Admin).filter(
        Admin.email == email
    ).first()

    if not admin:
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    valid_password = verify_password(
        password,
        admin.password
    )

    if not valid_password:
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "id": admin.id,
        "role": "admin"
    })

    return {
        "token": token
    }



@router.post("/face-login")
async def face_login(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    filename = f"{uuid.uuid4()}.jpg"

    filepath = os.path.join(
        UPLOAD_DIR,
        filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    users = db.query(User).all()

    for user in users:

        known_encoding = eval(
            user.face_encoding
        )

        matched = verify_face(
            known_encoding,
            filepath
        )

        if matched:

            token = create_access_token({
                "id": user.id,
                "role": "user"
            })
            
            create_attendance_record(
               db=db,
               user_id=user.id,
               confidence=98.5,
               image_path=filepath
               
               )
            return {
                "message": "Authentication successful",
                "token": token,
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email":user.email
                }
            }

    raise HTTPException(
        status_code=401,
        detail="Face not recognized"
    )
   