# 🎵 Radio ThirtyOne Record

Una plataforma de radio online donde los usuarios pueden escuchar música, crear perfiles y subir sus propias canciones.

**URL:** [radio.thirtyonerecord.com](https://radio.thirtyonerecord.com)

## 🚀 Tecnologías

### Frontend
- **React 18** con Vite
- **TailwindCSS** para estilos
- **Framer Motion** para animaciones
- **React Query** para gestión de estado del servidor
- **React Router** para navegación
- **Lucide React** para iconos

### Backend
- **Node.js** con Express
- **PostgreSQL** como base de datos
- **JWT** para autenticación
- **Cloudinary** para almacenamiento de archivos (opcional)
- **Bcrypt** para hash de contraseñas

## 📁 Estructura del Proyecto

```
radio/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── api/           # Cliente API
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   └── main.jsx       # Punto de entrada
│   └── package.json
│
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── config/       # Configuración
│   │   ├── routes/       # Rutas API
│   │   ├── middleware/   # Middlewares
│   │   └── index.js      # Servidor Express
│   └── package.json
│
└── package.json          # Root workspace
```

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/beastzxrd/radio.git
cd radio
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la base de datos

Crear la base de datos PostgreSQL:
```bash
psql -U postgres
CREATE DATABASE radio_db;
\q
```

Ejecutar el schema:
```bash
psql -U postgres -d radio_db -f server/src/database/schema.sql
```

### 4. Configurar variables de entorno

**Backend** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/radio_db
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Iniciar el proyecto

En modo desarrollo (ambos servidores simultáneamente):
```bash
npm run dev
```

O individualmente:
```bash
# Frontend (puerto 3000)
npm run dev:client

# Backend (puerto 5000)
npm run dev:server
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/users/me` - Obtener perfil actual
- `GET /api/users/:username` - Obtener perfil por username
- `GET /api/users/:username/tracks` - Obtener tracks del usuario
- `PUT /api/users/me` - Actualizar perfil
- `POST /api/users/:username/follow` - Seguir/dejar de seguir

### Tracks
- `GET /api/tracks` - Listar todos los tracks
- `GET /api/tracks/:id` - Obtener un track
- `POST /api/tracks` - Crear track (requiere auth)
- `PUT /api/tracks/:id` - Actualizar track (requiere auth)
- `DELETE /api/tracks/:id` - Eliminar track (requiere auth)
- `POST /api/tracks/:id/like` - Like/unlike track (requiere auth)

## 🎨 Características

- ✅ Reproductor de audio con controles completos
- ✅ Vista de lista y grid de canciones
- ✅ Filtros por género y mood
- ✅ Búsqueda en tiempo real
- ✅ Sistema de likes
- ✅ Perfiles de usuario
- ✅ Sistema de follows
- ✅ Autenticación JWT
- ⏳ Subida de archivos (próximamente)
- ⏳ Playlists (próximamente)
- ⏳ Comentarios (próximamente)

## 🚀 Despliegue

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Desplegar carpeta dist/
```

### Backend (Railway/Render/Heroku)
```bash
cd server
npm start
```

### Base de datos
Usar PostgreSQL en la nube:
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- [Neon](https://neon.tech)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto.

## 👥 Autor

**beastzxrd** - [GitHub](https://github.com/beastzxrd)

---

🎵 **ThirtyOne Record** - *La música es para compartir*
