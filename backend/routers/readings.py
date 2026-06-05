from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
import random

from models.database import get_db, User, Reading
from models.schemas import AskQuestion, ReadingResponse
from services.numerology_engine import calculate_all
from services.astrology_engine import calculate_natal_chart
from services.tarot_engine import draw_three_card_spread
from services.image_analyzer import analyze_palm, analyze_face
from services.ollama_service import generate_reading

router = APIRouter()


@router.post("/ask")
async def ask_question(payload: AskQuestion, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == payload.device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    if user.questions_remaining <= 0:
        raise HTTPException(status_code=402, detail="Soru hakkınız kalmadı. Paket satın alın.")

    numerology = calculate_all(user.name, user.birth_date)
    astrology = calculate_natal_chart(user.name, user.birth_date, user.birth_time, user.birth_city)
    tarot = draw_three_card_spread(seed=random.randint(0, 99999))

    palm_analysis = None
    face_analysis = None
    if user.palm_image_path:
        palm_analysis = analyze_palm(user.palm_image_path)
    if user.face_image_path:
        face_analysis = analyze_face(user.face_image_path)

    answer = await generate_reading(
        name=user.name,
        question=payload.question,
        numerology_data=numerology,
        astrology_data=astrology,
        tarot_cards=tarot,
        palm_analysis=palm_analysis,
        face_analysis=face_analysis,
    )

    reading = Reading(
        user_id=user.id,
        question=payload.question,
        answer=answer,
        numerology_data=json.dumps(numerology, ensure_ascii=False),
        astrology_data=json.dumps(astrology, ensure_ascii=False),
        tarot_cards=json.dumps(tarot, ensure_ascii=False),
        palm_analysis=json.dumps(palm_analysis, ensure_ascii=False) if palm_analysis else None,
    )
    db.add(reading)

    user.questions_remaining -= 1
    user.total_questions_used = (user.total_questions_used or 0) + 1
    db.commit()
    db.refresh(reading)

    return {
        "id": reading.id,
        "question": reading.question,
        "answer": reading.answer,
        "tarot_cards": tarot,
        "numerology": numerology,
        "astrology": astrology,
        "palm_analysis": palm_analysis,
        "face_analysis": face_analysis,
        "questions_remaining": user.questions_remaining,
        "created_at": reading.created_at,
    }


@router.get("/history/{device_id}")
def get_history(device_id: str, limit: int = 10, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    readings = (
        db.query(Reading)
        .filter(Reading.user_id == user.id)
        .order_by(Reading.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": r.id,
            "question": r.question,
            "answer": r.answer,
            "created_at": r.created_at,
        }
        for r in readings
    ]


@router.get("/tarot")
async def get_daily_tarot(device_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    from datetime import date
    seed = int(str(date.today()).replace('-', '')) + user.id
    return draw_three_card_spread(seed=seed)
