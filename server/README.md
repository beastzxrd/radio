# Radio API

Backend para la aplicación Radio - ThirtyOne Record

## Despliegue en Render

Este proyecto está configurado para desplegarse en Render.com

### Variables de entorno requeridas:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://radio.thirtyonerecord.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=production
```

### Comandos:

- **Build**: `npm install`
- **Start**: `npm start`
- **Dev**: `npm run dev`
