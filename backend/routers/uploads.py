import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from PIL import Image
import io

from models.database import get_db, User

router = APIRouter()

UPLOAD_DIR = "uploads"
MAX_SIZE_MB = 10
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic"}


async def save_image(file: UploadFile, subfolder: str) -> str:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Desteklenmeyen dosya türü. JPEG veya PNG yükleyin.")

    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"Dosya çok büyük. Maksimum {MAX_SIZE_MB}MB.")

    try:
        img = Image.open(io.BytesIO(contents))
        img.verify()
        img = Image.open(io.BytesIO(contents))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        if max(img.size) > 2048:
            img.thumbnail((2048, 2048), Image.LANCZOS)
    except Exception:
        raise HTTPException(status_code=400, detail="Geçersiz görsel dosyası.")

    folder = os.path.join(UPLOAD_DIR, subfolder)
    os.makedirs(folder, exist_ok=True)
    filename = f"{uuid.uuid4()}.jpg"
    path = os.path.join(folder, filename)

    img.save(path, "JPEG", quality=85)
    return path


@router.post("/palm")
async def upload_palm(
    device_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.device_id == device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    path = await save_image(file, "palms")
    user.palm_image_path = path
    db.commit()

    from services.image_analyzer import analyze_palm
    analysis = analyze_palm(path)

    return {"success": True, "path": path, "analysis": analysis}


@router.post("/face")
async def upload_face(
    device_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.device_id == device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    path = await save_image(file, "faces")
    user.face_image_path = path
    db.commit()

    from services.image_analyzer import analyze_face
    analysis = analyze_face(path)

    return {"success": True, "path": path, "analysis": analysis}
