from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.config.db import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)
    phone = Column(String)

    password = Column(String, nullable=False)

    biometric_id = Column(String, unique=True)
    face_encoding = Column(String)

    image = Column(String)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.now)