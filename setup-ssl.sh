#!/bin/bash

echo "🔐 Configurando certificados SSL para radio.thirtyonerecord.com"

# Verificar si estamos en el servidor correcto
if [ ! -f docker-compose.yml ]; then
    echo "❌ Error: Ejecuta este script desde la carpeta raíz del proyecto"
    exit 1
fi

# Instalar Certbot si no está instalado
if ! command -v certbot &> /dev/null; then
    echo "📦 Instalando Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Detener temporalmente los contenedores
echo "🛑 Deteniendo contenedores..."
docker-compose down

# Obtener certificado SSL
echo "📜 Obteniendo certificado SSL de Let's Encrypt..."
sudo certbot certonly --standalone \
    -d radio.thirtyonerecord.com \
    --non-interactive \
    --agree-tos \
    --email tu-email@ejemplo.com \
    --preferred-challenges http

# Verificar si el certificado se obtuvo correctamente
if [ $? -eq 0 ]; then
    echo "✅ Certificado SSL obtenido exitosamente"
    
    # Configurar renovación automática
    echo "🔄 Configurando renovación automática..."
    (crontab -l 2>/dev/null; echo "0 0 1 * * certbot renew --quiet && docker-compose restart frontend") | crontab -
    
    # Reiniciar contenedores
    echo "🚀 Reiniciando contenedores..."
    docker-compose up -d --build
    
    echo "✅ ¡Configuración completada!"
    echo "🌐 Tu sitio ahora está disponible en: https://radio.thirtyonerecord.com"
else
    echo "❌ Error al obtener el certificado SSL"
    echo "Verifica que:"
    echo "1. El dominio radio.thirtyonerecord.com apunte a este servidor"
    echo "2. Los puertos 80 y 443 estén abiertos en el firewall"
    exit 1
fi
