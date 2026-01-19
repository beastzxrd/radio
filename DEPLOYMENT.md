# 🚀 Guía de Despliegue - radio.thirtyonerecord.com

## Opción 1: Vercel (Recomendado) ⚡

### Prerequisitos
Tu backend debe estar desplegado en otro servicio (Render, Railway, Fly.io, etc.)

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Configurar variables de entorno (IMPORTANTE)
Antes de desplegar, configura la variable de entorno del API:
```bash
vercel env add VITE_API_URL
# Ingresa: https://tu-backend.ejemplo.com/api
```

O en el Dashboard de Vercel:
1. Ve a tu proyecto → Settings → Environment Variables
2. Agrega: `VITE_API_URL` = `https://tu-backend.ejemplo.com/api`

### 3. Desplegar
```bash
# Login
vercel login

# Desplegar
vercel --prod
```

### 4. Configurar dominio
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Domains
3. Agrega: `radio.thirtyonerecord.com`
4. Vercel te dará un registro CNAME

### 5. Configurar DNS
En tu proveedor de DNS (donde compraste thirtyonerecord.com):
```
Tipo: CNAME
Nombre: radio
Valor: cname.vercel-dns.com (o el que Vercel te proporcione)
```

### Solución de problemas Vercel

**Error 404: NOT_FOUND**
- Verifica que las variables de entorno estén configuradas
- Redespliega: `vercel --prod`
- Verifica que el build sea exitoso en el Dashboard

**Error de API/CORS**
- Verifica que `VITE_API_URL` apunte al backend correcto
- Verifica que el backend tenga CORS configurado para tu dominio de Vercel

---

## Opción 2: Netlify

### 1. Instalar Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Login y desplegar
```bash
netlify login
netlify init
netlify deploy --prod
```

### 3. Configurar dominio
1. Site settings → Domain management
2. Add custom domain: `radio.thirtyonerecord.com`
3. Netlify te dará registros DNS

### 4. Configurar DNS
```
Tipo: A
Nombre: radio
Valor: 75.2.60.5 (IP de Netlify)
```

---

## Opción 3: VPS/Servidor Propio (Ubuntu)

### 1. Requisitos del servidor
- Ubuntu 20.04 o superior
- Docker y Docker Compose instalados
- Dominio apuntando al servidor
- Puertos 80 y 443 abiertos en el firewall

### 2. Clonar repositorio
```bash
ssh usuario@tu-servidor
git clone https://github.com/beastzxrd/radio.git
cd radio
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
nano .env  # Editar con tus valores
```

### 4. Configurar certificados SSL
```bash
# Dar permisos de ejecución al script
chmod +x setup-ssl.sh

# Editar el script con tu email
nano setup-ssl.sh  # Cambiar tu-email@ejemplo.com por tu email real

# Ejecutar configuración SSL
./setup-ssl.sh
```

### 5. Verificar que todo funcione
```bash
# Ver logs
docker-compose logs -f

# Verificar certificado SSL
curl -I https://radio.thirtyonerecord.com
```

### Solución de problemas SSL

**Error: ERR_CERT_COMMON_NAME_INVALID**
- Verifica que el dominio apunte correctamente al servidor: `dig radio.thirtyonerecord.com`
- Verifica que los puertos estén abiertos: `sudo ufw status`
- Regenera el certificado: `sudo certbot delete` y vuelve a ejecutar `./setup-ssl.sh`

**Error: Connection refused**
- Verifica que los contenedores estén corriendo: `docker-compose ps`
- Verifica los logs: `docker-compose logs frontend`

---

## Configurar Nginx y SSL (Certbot)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Configurar dominio en nginx
sudo nano /etc/nginx/sites-available/radio.thirtyonerecord.com

# Contenido:
server {
    server_name radio.thirtyonerecord.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/radio.thirtyonerecord.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtener certificado SSL
sudo certbot --nginx -d radio.thirtyonerecord.com
```

### 6. Configurar DNS
En tu proveedor DNS:
```
Tipo: A
Nombre: radio
Valor: IP_DE_TU_SERVIDOR
```

---

## Opción 4: Railway

### 1. Crear cuenta en Railway.app

### 2. Nuevo proyecto desde GitHub
- Conecta tu repositorio
- Railway detectará automáticamente el monorepo

### 3. Configurar servicios
- Frontend: `client`
- Backend: `server`
- Database: PostgreSQL (agregar desde Railway)

### 4. Configurar dominio
1. Settings → Domains
2. Generate Domain o Custom Domain
3. Agregar: `radio.thirtyonerecord.com`

### 5. DNS
```
Tipo: CNAME
Nombre: radio
Valor: [tu-proyecto].up.railway.app
```

---

## Verificación

Después del despliegue, verifica:

1. **DNS propagado**: `nslookup radio.thirtyonerecord.com`
2. **SSL activo**: `https://radio.thirtyonerecord.com`
3. **API funcionando**: `https://radio.thirtyonerecord.com/api/health`
4. **Frontend cargando**: Abre el sitio en el navegador

---

## Mantenimiento

### Ver logs (Docker)
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Actualizar código
```bash
git pull
docker-compose down
docker-compose up -d --build
```

### Backup de base de datos
```bash
docker exec radio_db pg_dump -U postgres radio_db > backup.sql
```

### Restaurar backup
```bash
docker exec -i radio_db psql -U postgres radio_db < backup.sql
```
