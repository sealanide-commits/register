import os
import random
from typing import Dict, Optional


HEART_LINE_MEANINGS = [
    "Derin ve tutkulu bir kalp çizgisi – duygusal bağlılığınız güçlü.",
    "Uzun kalp çizgisi – romantik ve idealist bir ruh taşıyorsunuz.",
    "Kısa ve düz kalp çizgisi – pratik aşk anlayışına sahipsiniz.",
    "Çatallı kalp çizgisi – hem kalpten hem akıldan sevensiniz.",
    "Dalgalı kalp çizgisi – duygusal hayatınız zengin ve çeşitli.",
]

HEAD_LINE_MEANINGS = [
    "Uzun ve derin kafa çizgisi – analitik ve stratejik bir zihne sahipsiniz.",
    "Kısa kafa çizgisi – pratik kararlar verir, eyleme odaklanırsınız.",
    "Eğimli kafa çizgisi – yaratıcı ve sezgisel bir düşünce yapısı.",
    "Çift kafa çizgisi – iki farklı bakış açısını bir arada tutabilirsiniz.",
    "Dalgalı kafa çizgisi – çok boyutlu ve esnek bir düşünür.",
]

FATE_LINE_MEANINGS = [
    "Güçlü kader çizgisi – hayatınız belirli bir misyon doğrultusunda şekilleniyor.",
    "Kesik kader çizgisi – hayatınızda büyük değişimler ve yeniden doğuşlar var.",
    "Kader çizgisi yok – kaderinizi kendi ellerinizle yazıyorsunuz.",
    "Çatallı kader çizgisi – birden fazla kariyer veya yol seçeneği önünüzde.",
    "Geç başlayan kader çizgisi – asıl gücünüz orta yaşta ortaya çıkacak.",
]

FACE_MEANINGS = {
    "aura": [
        "Yüzünüzde güçlü bir liderlik aurası var.",
        "Bilge ve derin bir enerji yayıyorsunuz.",
        "Şefkat ve iyileştirme enerjisi yüzünüzden okunuyor.",
        "Yaratıcı ve sanatçı bir ruh yüzünüze yansıyor.",
        "Güçlü bir koruyucu enerji taşıyorsunuz.",
    ],
    "eyes": [
        "Gözleriniz derin bir sezgiyi yansıtıyor.",
        "Gözlerinizde geleceği görebilen bir bilgelik var.",
        "Bakışlarınız insanların içini okuyor.",
        "Gözleriniz spiritüel bir uyanışı işaret ediyor.",
    ],
}


def analyze_palm(image_path: str) -> Dict:
    seed = hash(image_path) % 10000
    random.seed(seed)

    return {
        "heart_line": random.choice(HEART_LINE_MEANINGS),
        "head_line": random.choice(HEAD_LINE_MEANINGS),
        "fate_line": random.choice(FATE_LINE_MEANINGS),
        "life_line_strength": random.randint(70, 99),
        "overall": (
            f"Avuç izi analiziniz tamamlandı. "
            f"{random.choice(HEART_LINE_MEANINGS)} "
            f"{random.choice(FATE_LINE_MEANINGS)}"
        ),
        "palm_score": random.randint(75, 98),
    }


def analyze_face(image_path: str) -> Dict:
    seed = hash(image_path + "face") % 10000
    random.seed(seed)

    return {
        "aura": random.choice(FACE_MEANINGS["aura"]),
        "eye_reading": random.choice(FACE_MEANINGS["eyes"]),
        "energy_level": random.randint(70, 99),
        "overall": (
            f"{random.choice(FACE_MEANINGS['aura'])} "
            f"{random.choice(FACE_MEANINGS['eyes'])}"
        ),
    }
