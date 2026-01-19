# 🚀 Configurar GitHub Pages

## Paso 1: Configurar GitHub Pages en el repositorio

1. Ve a tu repositorio en GitHub: https://github.com/beastzxrd/radio
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona:
   - **Source**: GitHub Actions
5. Guarda los cambios

## Paso 2: Configurar variables de entorno (Secret)

1. En el mismo repositorio, ve a **Settings** → **Secrets and variables** → **Actions**
2. Click en **New repository secret**
3. Agrega:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tu-backend-url.com/api`
4. Click en **Add secret**

## Paso 3: Push de los cambios

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

## Paso 4: Verificar el despliegue

1. Ve a **Actions** en tu repositorio
2. Verás el workflow "Deploy to GitHub Pages" ejecutándose
3. Espera a que termine (2-3 minutos)
4. Tu sitio estará disponible en:
   - **https://beastzxrd.github.io/radio/**

## Configurar dominio personalizado (opcional)

Si quieres usar `radio.thirtyonerecord.com`:

1. En **Settings** → **Pages**
2. En **Custom domain**, ingresa: `radio.thirtyonerecord.com`
3. Click en **Save**
4. En tu proveedor de DNS, agrega:
   ```
   Tipo: CNAME
   Nombre: radio
   Valor: beastzxrd.github.io
   ```

## Solución de problemas

### Error: "failed to load config"
- Asegúrate de que `client/package.json` tenga todas las dependencias
- Ejecuta `npm ci` localmente para verificar

### Error 404 en rutas
- El `vite.config.js` ya tiene configurado `base: '/radio/'` para GitHub Actions
- Esto es automático, no requiere cambios

### API no funciona
- Verifica que `VITE_API_URL` esté configurado en GitHub Secrets
- El backend debe tener CORS habilitado para `beastzxrd.github.io`

## Despliegue automático

Cada vez que hagas `git push` a la rama `main`, GitHub Pages se actualizará automáticamente.

## Comparación con otras opciones

| Opción | Costo | SSL | Dominio personalizado | Backend |
|--------|-------|-----|----------------------|---------|
| GitHub Pages | Gratis | ✅ | ✅ | ❌ Externo |
| Vercel | Gratis | ✅ | ✅ | ❌ Externo |
| Netlify | Gratis | ✅ | ✅ | ❌ Externo |
| VPS | $5-10/mes | ✅ | ✅ | ✅ Incluido |

**Nota**: GitHub Pages solo puede alojar el frontend. Necesitas desplegar el backend en Render, Railway, o similar.
