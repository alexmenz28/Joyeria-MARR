# Despliegue — Joyería MARR

Guía para llevar el proyecto a un entorno de staging o producción.

---

## Arquitectura

| Componente | Tecnología | Puerto habitual |
|------------|------------|-----------------|
| Frontend | React (build estático) + nginx | 80 / 443 |
| API | ASP.NET Core 10 | 8080 (Docker) / 5053 (dev) |
| Base de datos | SQL Server | 1433 |

---

## Variables de entorno / configuración

### Backend (`appsettings.json` o variables de entorno)

| Clave | Descripción |
|-------|-------------|
| `ConnectionStrings:DefaultConnection` | Cadena SQL Server |
| `JwtSettings:Key` | Clave secreta ≥ 32 caracteres |
| `JwtSettings:Issuer` / `Audience` | Emisor y audiencia JWT |
| `CloudinarySettings:*` | Credenciales para imágenes de productos |
| `Checkout:DefaultShippingAmount` | Coste de envío estándar (USD) |
| `Checkout:FreeShippingThreshold` | Subtotal a partir del cual el envío es gratis |
| `Checkout:TaxRates:*` | Tasas por código de país ISO-2 (`MX`, `US`, `ES`, `DEFAULT`) |
| `Cors:AllowedOrigins` | URLs del frontend en producción (ej. `https://tienda.tudominio.com`) |

En Docker, las claves anidadas usan doble guion: `JwtSettings__Key`.

### Frontend (build time)

| Variable | Descripción |
|----------|-------------|
| `REACT_APP_API_BASE_URL` | URL pública del API (ej. `https://api.tudominio.com`) |

**Importante:** en Create React App las variables se inyectan en **build**, no en runtime. Reconstruye la imagen si cambias la URL del API.

---

## Opción A — Desarrollo local

```bash
# Backend
cd joyeria-backend
dotnet ef database update
dotnet run

# Frontend
cd joyeria-frontend
cp .env.example .env
npm install && npm start
```

---

## Opción B — Docker Compose (stack completo)

Desde la raíz del repositorio:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000  
- API: http://localhost:5053  
- SQL Server: `localhost:1433` (usuario `sa`, contraseña en `docker-compose.yml`)

**Primera vez:** aplicar migraciones contra la BD del contenedor:

```bash
cd joyeria-backend
dotnet ef database update --connection "Server=localhost,1433;Database=JoyeriaDB;User Id=sa;Password=JoyeriaMarr2026!;TrustServerCertificate=True"
```

En producción, cambia contraseñas, `JwtSettings:Key` y credenciales Cloudinary en `docker-compose.yml` o usa un archivo `.env` no versionado.

---

## Opción C — Producción manual

### 1. Base de datos

- Crear base `JoyeriaDB` en SQL Server gestionado (Azure SQL, RDS, etc.).
- Ejecutar `dotnet ef database update` desde un agente con acceso a la red de la BD.

### 2. API

```bash
docker build -f joyeria-backend/Dockerfile -t joyeria-api .
docker run -d -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="..." \
  -e JwtSettings__Key="..." \
  -e Cors__AllowedOrigins__0="https://tu-frontend.com" \
  joyeria-api
```

O publicar con `dotnet publish` y hospedar en IIS / Azure App Service / Linux + systemd.

### 3. Frontend

```bash
docker build -f joyeria-frontend/Dockerfile \
  --build-arg REACT_APP_API_BASE_URL=https://api.tudominio.com \
  -t joyeria-web .
docker run -d -p 80:80 joyeria-web
```

Alternativa: `npm run build` y subir `build/` a S3 + CloudFront, Netlify, Vercel, etc.

---

## Checklist pre-producción

- [ ] Rotar `JwtSettings:Key` y secretos Cloudinary
- [ ] `Cors:AllowedOrigins` solo con dominios reales
- [ ] HTTPS en API y frontend
- [ ] `ASPNETCORE_ENVIRONMENT=Production` (desactiva seed y Swagger)
- [ ] Backup automático de SQL Server
- [ ] Health check: `GET /health` en el balanceador
- [ ] Rate limits activos en `/api/auth/*` y `/api/contact`
- [ ] Revisar `npm audit` y dependencias .NET

---

## CI

El workflow `.github/workflows/ci.yml` ejecuta en cada push/PR:

- `dotnet build` + `dotnet test` (backend, BD en memoria)
- `npm test` + `npm run build` (frontend)

---

## Referencias

- [`README.md`](../README.md) — visión general
- [`PERMISOS-Y-API.md`](PERMISOS-Y-API.md) — roles y endpoints
- [`PLAN-MAESTRO-PROYECTO.md`](PLAN-MAESTRO-PROYECTO.md) — roadmap completo
