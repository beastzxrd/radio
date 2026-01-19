# 🔧 Solución Rápida - Error 404 en Vercel

## Problema
```
404: NOT_FOUND
Code: NOT_FOUND
ID: iad1::x7rcf-1768852786489-8a10060487fb
```

## Solución

### Paso 1: Configurar variables de entorno en Vercel

#### Opción A: Desde la terminal
```bash
vercel env add VITE_API_URL production
# Cuando te pregunte, ingresa la URL de tu backend, ejemplo:
# https://tu-backend.onrender.com/api
```

#### Opción B: Desde el Dashboard de Vercel
1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `radio`
3. Ve a **Settings** → **Environment Variables**
4. Agrega una nueva variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tu-backend-url.com/api`
   - **Environment**: Marca `Production`
5. Guarda

### Paso 2: Verificar archivos de configuración

Los siguientes archivos ya están actualizados:
- ✅ `vercel.json` - Configuración correcta
- ✅ `client/vite.config.js` - Build configurado
- ✅ `.vercelignore` - Archivos ignorados

### Paso 3: Redesplegar

```bash
# Desde la terminal en el directorio raíz del proyecto
vercel --prod
```

O desde el Dashboard de Vercel:
1. Ve a **Deployments**
2. Click en el menú (⋯) del último deployment
3. Click **Redeploy**

### Paso 4: Verificar el despliegue

1. Espera a que el build termine (2-3 minutos)
2. Visita: `https://radio.thirtyonerecord.com`
3. Verifica en la consola del navegador (F12) que no haya errores

## Opciones de Backend

Si aún no tienes el backend desplegado, aquí tienes opciones gratuitas:

### Opción 1: Render (Recomendado)
1. Ve a https://render.com
2. Crea un nuevo **Web Service**
3. Conecta tu repositorio
4. Configura:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: Agrega `DATABASE_URL`, `JWT_SECRET`, etc.
5. Copia la URL generada (ej: `https://radio-api.onrender.com`)

### Opción 2: Railway
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login y desplegar
railway login
railway init
railway up
```

### Opción 3: Fly.io
```bash
# Instalar flyctl
curl -L https://fly.io/install.sh | sh

# Desplegar
fly launch
fly deploy
```

## ¿Qué hace cada archivo actualizado?

### vercel.json
```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "framework": "vite"
}
```
- Indica a Vercel dónde está el código del cliente
- Especifica el comando de build correcto
- Define el directorio de salida

### Rewrites
```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```
- Redirige todas las rutas a `index.html` para React Router

## Verificación Final

Después de redesplegar, verifica:

```bash
# Test 1: Verificar que el sitio carga
curl -I https://radio.thirtyonerecord.com

# Test 2: Verificar que el API está configurado
curl https://radio.thirtyonerecord.com/_next/static/chunks/main.js | grep VITE_API_URL
```

## ¿Aún tienes problemas?

1. **Verifica los logs en Vercel**:
   - Dashboard → Deployments → Click en el deployment → Ver logs

2. **Verifica la consola del navegador**:
   - Presiona F12 → Console
   - Busca errores en rojo

3. **Limpia caché de Vercel**:
   ```bash
   vercel --prod --force
   ```

## Contacto de Soporte

Si nada funciona, revisa:
- Los logs de build en Vercel Dashboard
- La configuración de DNS
- Que el dominio apunte correctamente a Vercel
