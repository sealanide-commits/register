import os
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List

from models.database import get_db, User, Purchase
from models.schemas import PurchaseVerify, PurchaseResponse, PACKAGES, PackageInfo
from services.iyzico_service import create_payment_form, verify_payment_token

router = APIRouter()
TEST_MODE = os.getenv("TEST_MODE", "true").lower() == "true"
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")


@router.get("/packages", response_model=List[PackageInfo])
def list_packages():
    return PACKAGES


@router.post("/init")
async def init_payment(payload: PurchaseVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == payload.device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    package = next((p for p in PACKAGES if p.id == payload.package_id), None)
    if not package:
        raise HTTPException(status_code=400, detail="Geçersiz paket")

    result = await create_payment_form(
        user_id=user.id,
        package_id=payload.package_id,
        amount_tl=package.price_tl,
        buyer_name=user.name,
        buyer_email=f"user{user.id}@mistikai.com",
        callback_url=f"{API_BASE_URL}/payment/callback",
    )

    return {
        "package": package,
        "iyzico": result,
        "test_mode": TEST_MODE,
    }


@router.post("/callback")
async def payment_callback(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    token = form.get("token", "")
    status = form.get("status", "")

    if status == "success" or TEST_MODE:
        result = await verify_payment_token(str(token))
        if result.get("paymentStatus") == "SUCCESS" or result.get("test_mode"):
            return {"verified": True, "token": token}

    return {"verified": False}


@router.post("/verify", response_model=PurchaseResponse)
async def verify_purchase(payload: PurchaseVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == payload.device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    package = next((p for p in PACKAGES if p.id == payload.package_id), None)
    if not package:
        raise HTTPException(status_code=400, detail="Geçersiz paket")

    if not TEST_MODE and payload.payment_ref:
        result = await verify_payment_token(payload.payment_ref)
        if result.get("paymentStatus") != "SUCCESS":
            raise HTTPException(status_code=402, detail="Ödeme doğrulanamadı")

    existing = db.query(Purchase).filter(
        Purchase.user_id == user.id,
        Purchase.payment_ref == payload.payment_ref,
        Purchase.verified == True,
    ).first()
    if existing and payload.payment_ref and not TEST_MODE:
        raise HTTPException(status_code=400, detail="Bu ödeme zaten kullanıldı")

    purchase = Purchase(
        user_id=user.id,
        package_id=payload.package_id,
        amount_tl=package.price_tl,
        questions_granted=package.questions,
        payment_ref=payload.payment_ref,
        verified=True,
    )
    db.add(purchase)

    if package.questions >= 9999:
        user.questions_remaining = 9999
    elif package.questions >= 100:
        user.questions_remaining = 999
    else:
        user.questions_remaining = (user.questions_remaining or 0) + package.questions

    db.commit()

    return PurchaseResponse(
        success=True,
        questions_remaining=user.questions_remaining,
        message=f"{package.name} paketi aktif edildi! {'Sınırsız' if package.questions >= 100 else str(package.questions)} soru hakkınız var.",
    )


@router.get("/status/{device_id}")
def payment_status(device_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    purchases = db.query(Purchase).filter(Purchase.user_id == user.id, Purchase.verified == True).all()
    return {
        "questions_remaining": user.questions_remaining,
        "total_purchases": len(purchases),
        "is_premium": user.questions_remaining >= 100,
        "test_mode": TEST_MODE,
    }
