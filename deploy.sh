#!/bin/bash
# MistikAI VPS Deployment Script
# Gereksinim: Ubuntu 22.04+, Docker, Docker Compose

set -e

echo "🔮 MistikAI VPS kurulumu başlıyor..."

# Docker kontrolü
if ! command -v docker &> /dev/null; then
  echo "Docker kuruluyor..."
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker $USER
fi

# Docker Compose kontrolü
if ! command -v docker-compose &> /dev/null; then
  apt-get install -y docker-compose-plugin 2>/dev/null || \
  pip install docker-compose
fi

# .env dosyası
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  .env dosyası oluşturuldu. İyzico canlı anahtarlarını girin:"
  echo "   nano .env"
fi

# Servisleri başlat
echo "🚀 Servisler başlatılıyor..."
docker compose up -d --build

# Ollama model çek
echo "🤖 AI modeli indiriliyor (ilk kez ~2GB)..."
sleep 5
docker exec mistikai-ollama ollama pull dolphin-llama3.2:3b || \
docker exec mistikai-ollama ollama pull llama3.2:3b

echo ""
echo "✅ MistikAI hazır!"
echo "   API:     http://$(hostname -I | awk '{print $1}'):8000"
echo "   Docs:    http://$(hostname -I | awk '{print $1}'):8000/docs"
echo "   Website: http://$(hostname -I | awk '{print $1}'):80"
echo ""
echo "📱 Mobil uygulamayı bağlamak için .env dosyasına API adresini girin:"
echo "   EXPO_PUBLIC_API_URL=http://$(hostname -I | awk '{print $1}'):8000"
