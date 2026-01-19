# 🎵 Radio - ThirtyOne Record

Una aplicación web moderna de streaming de música construida con React, Node.js y PostgreSQL.

## 🌐 URLs de Despliegue

- **Dominio Principal**: https://radio.thirtyonerecord.com
- **GitHub Pages**: https://beastzxrd.github.io/radio/
- **Vercel**: (configurar en vercel.com)

## 🚀 Despliegue Rápido

### Opción 1: GitHub Pages (Automático)
1. Ve a **Settings** → **Pages** → Source: **GitHub Actions**
2. Agrega Secret: `VITE_API_URL` con la URL de tu backend
3. Haz push: `git push origin main`
4. Visita: https://beastzxrd.github.io/radio/

[Ver guía completa](GITHUB-PAGES-SETUP.md)

### Opción 2: Vercel
```bash
vercel env add VITE_API_URL production
vercel --prod
```
[Ver guía completa](DEPLOYMENT.md)

### Opción 3: VPS con Docker
```bash
./setup-ssl.sh
docker-compose up -d
```
[Ver guía completa](DEPLOYMENT.md)

## 📦 Instalación Local

```bash
# Instalar dependencias
npm run install:all

# Configurar variables de entorno
cp client/.env.example client/.env
cp server/.env.example server/.env

# Iniciar en modo desarrollo
npm run dev
```

## 🛠️ Stack Tecnológico

- **Frontend**: React 18, Vite, TailwindCSS, Radix UI
- **Backend**: Node.js, Express, PostgreSQL
- **Autenticación**: JWT
- **Despliegue**: GitHub Pages, Vercel, Docker

## 📚 Documentación

- [Guía de Deployment](DEPLOYMENT.md)
- [Configuración GitHub Pages](GITHUB-PAGES-SETUP.md)
- [Solución Error 404 Vercel](VERCEL-FIX-404.md)
- [Entidades y Esquemas](README-ENTITIES.md)

## 🐛 Solución de Problemas

### Error 404 en GitHub Pages
Sigue las instrucciones en [GITHUB-PAGES-SETUP.md](GITHUB-PAGES-SETUP.md)

### Error 404 en Vercel
Sigue las instrucciones en [VERCEL-FIX-404.md](VERCEL-FIX-404.md)

### Error SSL en VPS
Ejecuta: `./setup-ssl.sh` para configurar certificados SSL automáticamente

## 📄 Licencia

MIT
