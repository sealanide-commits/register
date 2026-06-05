from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from models.database import engine, Base
from routers import readings, users, uploads, payments

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MistikAI API", version="1.0.0", description="Okült & Numeroloji & Tarot & Astroloji API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(users.router, prefix="/user", tags=["users"])
app.include_router(readings.router, prefix="/reading", tags=["readings"])
app.include_router(uploads.router, prefix="/upload", tags=["uploads"])
app.include_router(payments.router, prefix="/payment", tags=["payments"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "MistikAI API"}
