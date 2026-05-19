from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.config.db import Base, engine

from app.models.user import User
from app.models.admin import Admin
from app.models.attendance import Attendance

from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.attendance import router as attendance_router
import logging

logger =logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(attendance_router)

@app.middleware("http")
async def log_requests(request, call_next):
    print("➡️ REQUEST:", request.method, request.url)
    response = await call_next(request)
    print("⬅️ RESPONSE:", response.status_code)
    return response

@app.get("/")
def root():
    print("Hello welcome",flush=True)
    return {
        "message": "Biometric API running"
    }


@app.get("/health")
def health():
    logger.debug("This is a debug")
    return {
        "status": "healthy",
        "database": "connected"
    }