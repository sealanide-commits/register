import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from models.database import get_db, User
from models.schemas import UserCreate, UserResponse
from services.numerology_engine import calculate_all
from services.astrology_engine import calculate_natal_chart

TEST_MODE = os.getenv("TEST_MODE", "true").lower() == "true"
FREE_QUESTIONS_ON_SIGNUP = 999 if TEST_MODE else 1

router = APIRouter()


@router.post("/create", response_model=UserResponse)
def create_or_update_user(user_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == user_data.device_id).first()
    if user:
        user.name = user_data.name
        user.birth_date = user_data.birth_date
        user.birth_time = user_data.birth_time
        user.birth_city = user_data.birth_city
        if user_data.push_token:
            user.push_token = user_data.push_token
    else:
        user = User(
            device_id=user_data.device_id,
            name=user_data.name,
            birth_date=user_data.birth_date,
            birth_time=user_data.birth_time,
            birth_city=user_data.birth_city,
            push_token=user_data.push_token,
            questions_remaining=FREE_QUESTIONS_ON_SIGNUP,
        )
        db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/profile/{device_id}", response_model=UserResponse)
def get_profile(device_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    _update_streak(user, db)
    return user


@router.get("/numerology/{device_id}")
def get_numerology(device_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return calculate_all(user.name, user.birth_date)


@router.get("/astrology/{device_id}")
def get_astrology(device_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.device_id == device_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return calculate_natal_chart(user.name, user.birth_date, user.birth_time, user.birth_city)


def _update_streak(user: User, db: Session):
    today = str(date.today())
    if user.last_active_date != today:
        if user.last_active_date:
            from datetime import datetime, timedelta
            try:
                last = datetime.strptime(user.last_active_date, "%Y-%m-%d").date()
                if (date.today() - last).days == 1:
                    user.streak_days = (user.streak_days or 0) + 1
                elif (date.today() - last).days > 1:
                    user.streak_days = 1
            except Exception:
                user.streak_days = 1
        else:
            user.streak_days = 1
        user.last_active_date = today
        db.commit()
