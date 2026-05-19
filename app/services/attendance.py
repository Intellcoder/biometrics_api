from app.models.attendance import Attendance

def create_attendance_record(
    db,
    user_id: int,
    confidence: float | None = None,
    image_path: str | None = None,
):
    print("Running in attendance")
    record = Attendance(
        db=db,
        user_id=user_id,
        status="PRESENT",
        confidence=confidence,
        image_path=image_path,
    )

    db.add(record)
    print("BEFORE COMMIT")
    db.commit()
    print("AFTER COMMIT")
    db.refresh(record)

    return record