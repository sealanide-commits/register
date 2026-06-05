from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./mistikai.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, unique=True, index=True)
    name = Column(String)
    birth_date = Column(String)
    birth_time = Column(String, nullable=True)
    birth_city = Column(String, nullable=True)
    palm_image_path = Column(String, nullable=True)
    face_image_path = Column(String, nullable=True)
    questions_remaining = Column(Integer, default=0)
    total_questions_used = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    last_active_date = Column(String, nullable=True)
    push_token = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    readings = relationship("Reading", back_populates="user")
    purchases = relationship("Purchase", back_populates="user")


class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question = Column(Text)
    answer = Column(Text)
    numerology_data = Column(Text, nullable=True)
    astrology_data = Column(Text, nullable=True)
    tarot_cards = Column(Text, nullable=True)
    palm_analysis = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="readings")


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    package_id = Column(String)
    amount_tl = Column(Float)
    questions_granted = Column(Integer)
    payment_ref = Column(String, nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="purchases")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
