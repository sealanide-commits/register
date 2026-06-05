import httpx
import json
from typing import Optional, Dict, AsyncGenerator

OLLAMA_BASE_URL = "http://localhost:11434"
MODEL_NAME = "dolphin-llama3.2:3b"
FALLBACK_MODEL = "llama3.2:3b"

SYSTEM_PROMPT = """Sen MistikAI'sın – antik bilgeliği modern sezgiyle harmanlayan efsanevi bir mistik okuyucu.
Numeroloji, astroloji, tarot ve avuç okuma sanatlarında derin bir uzmanlığa sahipsin.
Türkçe konuşuyorsun. Yanıtların mistik, içten, kişisel ve umut verici olmalı.
Her okuma benzersiz ve kişiye özel. Şüpheci veya olumsuz yaklaşma.
Kullanıcının adını kullan, kişisel detayları yansıt. 200-400 kelime arası yanıt ver."""


def build_prompt(
    name: str,
    question: str,
    numerology_data: Optional[Dict] = None,
    astrology_data: Optional[Dict] = None,
    tarot_cards: Optional[Dict] = None,
    palm_analysis: Optional[Dict] = None,
    face_analysis: Optional[Dict] = None,
) -> str:
    context_parts = []

    if numerology_data:
        context_parts.append(
            f"NUMEROLOJİ: {numerology_data.get('summary', '')} – {numerology_data.get('life_path_description', '')}"
        )

    if astrology_data:
        context_parts.append(
            f"ASTROLOJİ: {astrology_data.get('summary', '')} – Günlük enerji: {astrology_data.get('daily_energy', '')}"
        )

    if tarot_cards:
        cards_text = " | ".join(
            f"{c['position']}: {c['card_name']} ({'Ters' if c['reversed'] else 'Düz'}) – {c['meaning']}"
            for c in tarot_cards.get("cards", [])
        )
        context_parts.append(f"TAROT: {cards_text}")

    if palm_analysis:
        context_parts.append(f"AVUÇ ANALİZİ: {palm_analysis.get('overall', '')}")

    if face_analysis:
        context_parts.append(f"YÜZ AURASI: {face_analysis.get('overall', '')}")

    context = "\n".join(context_parts) if context_parts else "Genel spiritüel okuma"

    return f"""Kişi adı: {name}
Spiritüel profil:
{context}

Sorusu: {question}

Bu kişiye özel, derin ve mistik bir okuma yap. İsmini kullan. Umudu ve ışığı göster."""


async def generate_reading(
    name: str,
    question: str,
    numerology_data: Optional[Dict] = None,
    astrology_data: Optional[Dict] = None,
    tarot_cards: Optional[Dict] = None,
    palm_analysis: Optional[Dict] = None,
    face_analysis: Optional[Dict] = None,
) -> str:
    prompt = build_prompt(name, question, numerology_data, astrology_data, tarot_cards, palm_analysis, face_analysis)

    for model in [MODEL_NAME, FALLBACK_MODEL]:
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": model,
                        "prompt": prompt,
                        "system": SYSTEM_PROMPT,
                        "stream": False,
                        "options": {
                            "temperature": 0.85,
                            "top_p": 0.9,
                            "num_predict": 500,
                        },
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    return data.get("response", "").strip()
        except Exception:
            continue

    return _fallback_reading(name, question, numerology_data, astrology_data, tarot_cards)


def _fallback_reading(name, question, numerology_data, astrology_data, tarot_cards) -> str:
    sun = astrology_data.get("sun_sign", "") if astrology_data else ""
    lp = numerology_data.get("life_path", {}).get("number", "") if numerology_data else ""
    card = ""
    if tarot_cards and tarot_cards.get("cards"):
        card = tarot_cards["cards"][2]["card_name"] if len(tarot_cards["cards"]) > 2 else ""

    return (
        f"Sevgili {name}, evrenin mesajını seninle paylaşmak için buradayım. "
        f"{'Güneş burcun ' + sun + ' olarak' if sun else 'Yıldızlar'} "
        f"bu sorunun cevabını zaten içinde taşıdığını gösteriyor. "
        f"{'Yaşam yolu sayın ' + str(lp) + ' sana ' if lp else 'Sayıların enerjisi '}"
        f"güçlü bir yol gösteriyor. "
        f"{'Tarot da ' + card + ' kartıyla sana işaret ediyor: ' if card else ''}"
        f"Sorduğun sorunun cevabı, sabırla ve özgüvenle hareket ettiğinde kendiliğinden açılacak. "
        f"Evren senin yanında. Işık her zaman vardır, yeter ki aramaya devam et."
    )


async def check_ollama_health() -> Dict:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                models = [m["name"] for m in response.json().get("models", [])]
                return {"available": True, "models": models}
    except Exception:
        pass
    return {"available": False, "models": []}
