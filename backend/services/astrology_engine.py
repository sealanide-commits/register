from datetime import datetime, date
from typing import Dict, Optional


SIGNS = [
    ("Koç", (3, 21), (4, 19), "Ateş", "Mars"),
    ("Boğa", (4, 20), (5, 20), "Toprak", "Venüs"),
    ("İkizler", (5, 21), (6, 20), "Hava", "Merkür"),
    ("Yengeç", (6, 21), (7, 22), "Su", "Ay"),
    ("Aslan", (7, 23), (8, 22), "Ateş", "Güneş"),
    ("Başak", (8, 23), (9, 22), "Toprak", "Merkür"),
    ("Terazi", (9, 23), (10, 22), "Hava", "Venüs"),
    ("Akrep", (10, 23), (11, 21), "Su", "Plüton"),
    ("Yay", (11, 22), (12, 21), "Ateş", "Jüpiter"),
    ("Oğlak", (12, 22), (1, 19), "Toprak", "Satürn"),
    ("Kova", (1, 20), (2, 18), "Hava", "Uranüs"),
    ("Balık", (2, 19), (3, 20), "Su", "Neptün"),
]

SIGN_DESCRIPTIONS = {
    "Koç": "Cesur, enerjik ve öncü. Ateşin ilk kıvılcımı sende.",
    "Boğa": "Kararlı, sadık ve zevk seven. Toprağın sağlamlığı sende.",
    "İkizler": "Meraklı, uyarlanabilir ve iletişimci. Havanın özgürlüğü sende.",
    "Yengeç": "Sezgisel, koruyucu ve duygusal. Suyun derinliği sende.",
    "Aslan": "Karizmatik, cömert ve yaratıcı. Güneşin parlaklığı sende.",
    "Başak": "Analitik, titiz ve yardımsever. Toprağın verimliliği sende.",
    "Terazi": "Dengeli, adaletli ve estetik. Havanın uyumu sende.",
    "Akrep": "Yoğun, sezgisel ve dönüşümcü. Suyun gücü sende.",
    "Yay": "İyimser, özgür ve felsefi. Ateşin coşkusu sende.",
    "Oğlak": "Hırslı, disiplinli ve pratik. Toprağın sabrı sende.",
    "Kova": "Yenilikçi, hümanist ve bağımsız. Havanın devrimi sende.",
    "Balık": "Sezgisel, empatik ve yaratıcı. Suyun sonsuzluğu sende.",
}

MOON_SIGNS = ["Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak", "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"]

DAILY_THEMES = [
    "Bugün Merkür retrosu duygusal iletişimini güçlendiriyor.",
    "Venüs senin burcunu etkiliyor – aşk ve bereket kapıda.",
    "Mars enerjisi seni harekete geçirmeye hazır.",
    "Ay dolunayına yaklaşırken sezgilerin zirveye ulaşıyor.",
    "Jüpiter genişleme enerjisi gönderiyor – fırsatları kaçırma.",
    "Satürn'ün dersleri bugün netlik kazanıyor.",
    "Yeni ay başlangıçlar için mükemmel zaman sunuyor.",
    "Güneş burcun enerji verici ışınlarını yayıyor.",
    "Plüton'un dönüşüm gücü hayatının bir alanını değiştiriyor.",
    "Neptün sezgisel vizyonunu açıyor.",
]


def get_sun_sign(birth_date: str) -> Optional[str]:
    try:
        parts = birth_date.replace('/', '-').replace('.', '-').split('-')
        if len(parts) >= 3:
            year, month, day = int(parts[0]), int(parts[1]), int(parts[2])
        else:
            return None
    except Exception:
        return None

    for name, start, end, element, ruler in SIGNS:
        sm, sd = start
        em, ed = end
        if sm <= em:
            if (month == sm and day >= sd) or (month == em and day <= ed) or (sm < month < em):
                return name
        else:
            if (month == sm and day >= sd) or (month == em and day <= ed) or month > sm or month < em:
                return name
    return "Koç"


def get_moon_sign(birth_date: str) -> str:
    try:
        parts = birth_date.replace('/', '-').replace('.', '-').split('-')
        day_of_year = int(parts[1]) * 30 + int(parts[2])
        index = (day_of_year // 28 + int(parts[0]) % 12) % 12
        return MOON_SIGNS[index]
    except Exception:
        return "Yengeç"


def get_rising_sign(birth_time: Optional[str], birth_date: str) -> str:
    try:
        if not birth_time:
            return "Bilinmiyor"
        hour = int(birth_time.split(':')[0])
        sun_sign = get_sun_sign(birth_date)
        base = MOON_SIGNS.index(sun_sign) if sun_sign in MOON_SIGNS else 0
        index = (base + hour // 2) % 12
        return MOON_SIGNS[index]
    except Exception:
        return "Bilinmiyor"


def get_daily_energy(birth_date: str) -> str:
    try:
        today = date.today()
        idx = (today.timetuple().tm_yday + int(birth_date.replace('-', '').replace('/', '').replace('.', '')[-4:])) % len(DAILY_THEMES)
        return DAILY_THEMES[idx]
    except Exception:
        return DAILY_THEMES[0]


def calculate_natal_chart(name: str, birth_date: str, birth_time: Optional[str] = None, birth_city: Optional[str] = None) -> Dict:
    sun_sign = get_sun_sign(birth_date) or "Koç"
    moon_sign = get_moon_sign(birth_date)
    rising_sign = get_rising_sign(birth_time, birth_date)

    sun_info = None
    for s, start, end, element, ruler in SIGNS:
        if s == sun_sign:
            sun_info = {"element": element, "ruler": ruler}
            break

    daily_energy = get_daily_energy(birth_date)

    return {
        "sun_sign": sun_sign,
        "moon_sign": moon_sign,
        "rising_sign": rising_sign,
        "element": sun_info["element"] if sun_info else "Ateş",
        "ruling_planet": sun_info["ruler"] if sun_info else "Mars",
        "sun_description": SIGN_DESCRIPTIONS.get(sun_sign, ""),
        "daily_energy": daily_energy,
        "summary": (
            f"Güneş Burcu: {sun_sign} | Ay Burcu: {moon_sign} | "
            f"Yükselen: {rising_sign} | Element: {sun_info['element'] if sun_info else 'Ateş'}"
        ),
    }
