from sqlalchemy import Column, Integer, String, Boolean
from app.config.db import Base


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)

    role = Column(String, default="admin")

    is_super_admin = Column(Boolean, default=False)