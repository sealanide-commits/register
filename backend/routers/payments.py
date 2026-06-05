from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.database import get_db, User, Purchase
from models.schemas import PurchaseVerify, PurchaseResponse, PACKAGES, PackageInfo
from typing import List

router = APIRouter()


@router.get("/packages", response_model=List[PackageInfo])
def list_packages():
    return PACKAGES


@router.post("/verify", response_model=PurchaseResponse)
def verify_purchase(payload: PurchaseVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == payload.device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    package = next((p for p in PACKAGES if p.id == payload.package_id), None)
    if not package:
        raise HTTPException(status_code=400, detail="Geçersiz paket")

    purchase = Purchase(
        user_id=user.id,
        package_id=payload.package_id,
        amount_tl=package.price_tl,
        questions_granted=package.questions,
        payment_ref=payload.payment_ref,
        verified=True,
    )
    db.add(purchase)

    if package.questions == 9999:
        user.questions_remaining = 9999
    elif package.questions == 100:
        user.questions_remaining = 999
    else:
        user.questions_remaining = (user.questions_remaining or 0) + package.questions

    db.commit()

    return PurchaseResponse(
        success=True,
        questions_remaining=user.questions_remaining,
        message=f"{package.name} paketi aktif edildi! {package.questions if package.questions < 100 else 'Sınırsız'} soru hakkınız var.",
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
    }
