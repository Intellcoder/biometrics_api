import face_recognition
import numpy as np
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.attendance import Attendance


# 🔥 Generate Face Encoding
def generate_face_encoding(image_path: str):
    image = face_recognition.load_image_file(image_path)

    encodings = face_recognition.face_encodings(image)

    if len(encodings) == 0:
        return None

    return encodings[0].tolist()


# 🔥 Verify Face
def verify_face(known_encoding, unknown_image):
    image = face_recognition.load_image_file(unknown_image)

    unknown_encodings = face_recognition.face_encodings(image)

    if len(unknown_encodings) == 0:
        return False

    result = face_recognition.compare_faces(
        [known_encoding],
        unknown_encodings[0]
    )

    return result[0]


# 🔥 NEW: Match Face Against All Users
def recognize_face(db: Session, unknown_image: str):
    image = face_recognition.load_image_file(unknown_image)

    unknown_encodings = face_recognition.face_encodings(image)

    if len(unknown_encodings) == 0:
        return None

    unknown_encoding = unknown_encodings[0]

    users = db.query(User).all()

    for user in users:
        try:
            known_encoding = np.array(
                eval(user.face_encoding)
            )

            matches = face_recognition.compare_faces(
                [known_encoding],
                unknown_encoding
            )

            face_distance = face_recognition.face_distance(
                [known_encoding],
                unknown_encoding
            )

            confidence = round(
                (1 - float(face_distance[0])) * 100,
                2
            )

            if matches[0]:

                # 🔥 CREATE ATTENDANCE RECORD
                attendance = Attendance(
                    user_id=user.id,
                    status="PRESENT",
                    confidence=confidence
                )

                # db.add(attendance)
                # db.commit()
                # db.refresh(attendance)

                return {
                    "user": user,
                    "confidence": confidence,
                    "attendance": attendance
                }

        except Exception as e:
            print("FACE MATCH ERROR:", e)

    return None