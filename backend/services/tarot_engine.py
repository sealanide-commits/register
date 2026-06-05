import random
import json
import os
from typing import List, Dict


DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'tarot_meanings.json')

_cards_cache = None


def load_cards() -> List[Dict]:
    global _cards_cache
    if _cards_cache is None:
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            _cards_cache = json.load(f)
    return _cards_cache


def draw_three_card_spread(seed: int = None) -> Dict:
    if seed is not None:
        random.seed(seed)
    cards = load_cards()
    selected = random.sample(cards, 3)
    spread = []
    positions = ["Geçmiş", "Şimdi", "Gelecek"]
    for i, card in enumerate(selected):
        reversed_card = random.random() < 0.3
        spread.append({
            "position": positions[i],
            "card_name": card["name"],
            "reversed": reversed_card,
            "meaning": card["reversed_meaning"] if reversed_card else card["upright_meaning"],
            "keywords": card["reversed_keywords"] if reversed_card else card["upright_keywords"],
            "image_key": card["image_key"],
        })
    return {
        "spread_type": "three_card",
        "cards": spread,
        "summary": " | ".join(
            f"{c['position']}: {c['card_name']}{'(Ters)' if c['reversed'] else ''}"
            for c in spread
        ),
    }


def draw_celtic_cross(seed: int = None) -> Dict:
    if seed is not None:
        random.seed(seed)
    cards = load_cards()
    selected = random.sample(cards, 10)
    positions = [
        "Mevcut Durum", "Zorluk", "Bilinçaltı", "Yakın Geçmiş",
        "Olası Sonuç", "Yakın Gelecek", "Sen", "Dışsal Etkenler",
        "Umutlar/Korkular", "Nihai Sonuç"
    ]
    spread = []
    for i, card in enumerate(selected):
        reversed_card = random.random() < 0.3
        spread.append({
            "position": positions[i],
            "card_name": card["name"],
            "reversed": reversed_card,
            "meaning": card["reversed_meaning"] if reversed_card else card["upright_meaning"],
            "keywords": card["reversed_keywords"] if reversed_card else card["upright_keywords"],
            "image_key": card["image_key"],
        })
    return {
        "spread_type": "celtic_cross",
        "cards": spread,
        "summary": f"Celtic Cross: {', '.join(c['card_name'] for c in spread[:3])} ve daha fazlası...",
    }
