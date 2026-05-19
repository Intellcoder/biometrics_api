from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from datetime import datetime
from app.config.db import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    status = Column(String, default="PRESENT")
    confidence = Column(Float, nullable=True)

    timestamp = Column(DateTime, default=datetime.now)

    image_path = Column(String, nullable=True)