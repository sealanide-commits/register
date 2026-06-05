from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    device_id: str
    name: str
    birth_date: str
    birth_time: Optional[str] = None
    birth_city: Optional[str] = None
    push_token: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    device_id: str
    name: str
    birth_date: str
    birth_time: Optional[str]
    birth_city: Optional[str]
    questions_remaining: int
    streak_days: int
    palm_image_path: Optional[str]
    face_image_path: Optional[str]

    class Config:
        from_attributes = True


class AskQuestion(BaseModel):
    device_id: str
    question: str


class ReadingResponse(BaseModel):
    id: int
    question: str
    answer: str
    numerology_data: Optional[str]
    astrology_data: Optional[str]
    tarot_cards: Optional[str]
    palm_analysis: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PackageInfo(BaseModel):
    id: str
    name: str
    description: str
    price_tl: float
    questions: int
    popular: bool = False


class PurchaseVerify(BaseModel):
    device_id: str
    package_id: str
    payment_ref: Optional[str] = None


class PurchaseResponse(BaseModel):
    success: bool
    questions_remaining: int
    message: str


PACKAGES: List[PackageInfo] = [
    PackageInfo(id="starter", name="Başlangıç", description="3 soru + 1 tarot çekimi", price_tl=49, questions=3),
    PackageInfo(id="monthly", name="Aylık Premium", description="Sınırsız soru + günlük burç + tarot", price_tl=149, questions=100, popular=True),
    PackageInfo(id="yearly", name="Yıllık Premium", description="Her şey + öncelikli yanıt", price_tl=799, questions=9999),
    PackageInfo(id="special", name="Özel Okuma", description="Detaylı doğum haritası + PDF rapor", price_tl=299, questions=10),
]
