from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.attendance import Attendance
from app.models.user import User

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.get("/")
def get_all_attendance(db: Session = Depends(get_db)):
    records = db.query(Attendance).all()
    return records


@router.get("/user/{user_id}")
def get_user_attendance(user_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(Attendance)
        .filter(Attendance.user_id == user_id)
        .order_by(Attendance.timestamp.desc())
        .all()
    )

    return records