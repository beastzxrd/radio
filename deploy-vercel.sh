#!/bin/bash

echo "🚀 Configuración y Despliegue en Vercel"
echo "========================================="
echo ""

# Paso 1: Login
echo "📝 PASO 1: Login en Vercel"
echo "Ejecuta: vercel login"
echo "Se abrirá tu navegador para autenticarte"
echo ""
read -p "Presiona Enter después de hacer login..."

# Paso 2: Link del proyecto
echo ""
echo "🔗 PASO 2: Vincular proyecto"
echo "Ejecutando: vercel link"
vercel link

# Paso 3: Configurar variable de entorno
echo ""
echo "⚙️ PASO 3: Configurar variable de entorno"
echo "¿Cuál es la URL de tu backend? (ejemplo: https://radio-api.onrender.com/api)"
read -p "URL del backend: " BACKEND_URL

if [ -n "$BACKEND_URL" ]; then
    echo "$BACKEND_URL" | vercel env add VITE_API_URL production
    echo "✅ Variable VITE_API_URL configurada"
else
    echo "⚠️ No se configuró la variable. Deberás hacerlo manualmente después"
fi

# Paso 4: Desplegar
echo ""
echo "🚀 PASO 4: Desplegando a producción..."
vercel --prod

echo ""
echo "✅ ¡Despliegue completado!"
echo ""
echo "Tu sitio debería estar disponible en:"
echo "- https://radio.thirtyonerecord.com"
echo ""
echo "Si el dominio no funciona:"
echo "1. Ve a tu Dashboard de Vercel"
echo "2. Settings → Domains"
echo "3. Verifica que radio.thirtyonerecord.com esté agregado"
