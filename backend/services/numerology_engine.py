from typing import Dict


LETTER_VALUES = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
    'Ç': 3, 'Ğ': 7, 'İ': 9, 'Ö': 6, 'Ş': 1, 'Ü': 3,
}
VOWELS = set('AEIİOÖUÜ')

MASTER_NUMBERS = {11, 22, 33}

LIFE_PATH_MEANINGS = {
    1: "Lider ruh – bağımsız, hırslı, öncü. Kendi yolunu çizmek için doğdun.",
    2: "Uzlaştırıcı – hassas, empatik, ilişkilere değer veren. İşbirliği senin gücün.",
    3: "Yaratıcı ifade – neşeli, sanatsal, iletişimci. Dünyayı renklerle boyayanlar.",
    4: "İnşaacı – disiplinli, güvenilir, sistemci. Sağlam temeller üzerine yaşarsın.",
    5: "Özgür ruh – maceraperest, değişim sever, çok yönlü. Özgürlük senin havanın.",
    6: "Şefkat – sorumlu, sevgi dolu, aile odaklı. İnsanları iyileştirmek için buradasın.",
    7: "Araştırmacı – spiritüel, analitik, içe dönük. Hakikati aramak senin yolun.",
    8: "Güç ve bolluk – pragmatik, hırslı, finansal zeka. Maddi dünyayı yönetmek için doğdun.",
    9: "İnsancıl – merhamet, evrensel sevgi, idealist. Hizmet etmek senin kaderin.",
    11: "Aydınlanmış lider – yüksek sezgi, ruhsal görev. Master sayı: ilham kaynağısın.",
    22: "Master inşaacı – büyük vizyonlar, pratik bilgelik. Dünyayı dönüştürecek güçtesin.",
    33: "Master öğretmen – saf sevgi ve şifa enerjisi. En yüksek spiritüel yol.",
}


def reduce_to_single(n: int) -> int:
    while n > 9 and n not in MASTER_NUMBERS:
        n = sum(int(d) for d in str(n))
    return n


def life_path_number(birth_date: str) -> Dict:
    parts = birth_date.replace('/', '-').replace('.', '-').split('-')
    digits = ''.join(parts)
    total = sum(int(d) for d in digits)
    number = reduce_to_single(total)
    return {
        "number": number,
        "is_master": number in MASTER_NUMBERS,
        "meaning": LIFE_PATH_MEANINGS.get(number, ""),
    }


def expression_number(name: str) -> Dict:
    name_upper = name.upper().replace(' ', '')
    total = sum(LETTER_VALUES.get(c, 0) for c in name_upper)
    number = reduce_to_single(total)
    return {"number": number, "is_master": number in MASTER_NUMBERS}


def soul_urge_number(name: str) -> Dict:
    name_upper = name.upper().replace(' ', '')
    total = sum(LETTER_VALUES.get(c, 0) for c in name_upper if c in VOWELS)
    number = reduce_to_single(total)
    return {"number": number, "is_master": number in MASTER_NUMBERS}


def personality_number(name: str) -> Dict:
    name_upper = name.upper().replace(' ', '')
    total = sum(LETTER_VALUES.get(c, 0) for c in name_upper if c not in VOWELS and c in LETTER_VALUES)
    number = reduce_to_single(total)
    return {"number": number, "is_master": number in MASTER_NUMBERS}


def calculate_all(name: str, birth_date: str) -> Dict:
    lp = life_path_number(birth_date)
    ex = expression_number(name)
    su = soul_urge_number(name)
    pn = personality_number(name)

    return {
        "life_path": lp,
        "expression": ex,
        "soul_urge": su,
        "personality": pn,
        "summary": (
            f"Yaşam Yolu: {lp['number']}{'(Master)' if lp['is_master'] else ''} | "
            f"İfade: {ex['number']} | "
            f"Ruh Dürtüsü: {su['number']} | "
            f"Kişilik: {pn['number']}"
        ),
        "life_path_description": lp["meaning"],
    }
