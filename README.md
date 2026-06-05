# MistikAI 🔮

iOS ve Android için okült okuma, numeroloji, tarot ve astroloji uygulaması.

## Mimari

```
register/
├── backend/     FastAPI + Ollama (Python)
├── mobile/      React Native + Expo
└── website/     iOS direct install landing page
```

## Hızlı Başlangıç

### 1. Ollama Kurulumu

```bash
# Ollama'yı kur: https://ollama.ai
curl -fsSL https://ollama.ai/install.sh | sh

# Uncensored model (önerilen)
ollama pull dolphin-llama3.2:3b

# Alternatif standart model
ollama pull llama3.2:3b
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API: `http://localhost:8000`
Swagger: `http://localhost:8000/docs`

### 3. Mobil Uygulama

```bash
cd mobile
npm install
npx expo start
```

Expo Go uygulamasıyla QR kodu tara (iOS/Android).

Gerçek cihazda backend bağlantısı için `.env` dosyası:
```
EXPO_PUBLIC_API_URL=http://192.168.x.x:8000
```

### 4. iOS Direct Install

```bash
# .ipa dosyasını build et
cd mobile
eas build --platform ios --profile production

# install.plist ve .ipa dosyasını web sunucusuna yükle
# website/ klasörünü HTTPS'li bir sunucuya deploy et
```

## Paketler ve Fiyatlar

| Paket | Fiyat | İçerik |
|-------|-------|--------|
| Başlangıç | ₺49 | 3 soru + 1 tarot |
| Aylık | ₺149/ay | Sınırsız |
| Yıllık | ₺799/yıl | Sınırsız + öncelik |
| Özel | ₺299 | Doğum haritası PDF |

## Özellikler

- 🔮 AI ile derin kişisel okumalar (Ollama dolphin-llama3.2:3b)
- 🃏 78 kartlı tam tarot destesi + 3 kartlı spread
- ⭐ Güneş/Ay/Yükselen burç + natal chart
- 🔢 Pythagoras numeroloji (Yaşam Yolu, İfade, Ruh Dürtüsü)
- ✋ Avuç izi analizi (galeriden fotoğraf)
- 🧿 Yüz aura okuma (galeriden fotoğraf)
- 🔔 Günlük kişisel push bildirimler
- 🔥 Streak sistemi + rozet
- 💰 RevenueCat in-app purchase
