# Joyería MARR — Frontend

SPA en React (Create React App) con React Router y Tailwind CSS.

## Configuración

```bash
npm install
cp .env.example .env
# REACT_APP_API_BASE_URL=http://localhost:5053
npm start
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm start` | Desarrollo en http://localhost:3000 |
| `npm run build` | Build de producción |
| `npm test -- --watchAll=false` | Tests unitarios |

## Sistema de diseño

Clases reutilizables en `src/index.css` (modo claro y oscuro):

| Clase | Uso |
|-------|-----|
| `app-shell` | Contenedor raíz de la app |
| `navbar-shell` | Barra de navegación (sticky) |
| `surface-panel` / `surface-card` | Paneles y tarjetas |
| `input-marr` / `btn-marr` | Formularios y botones |
| `page-hero` | Cabeceras de página |
| `admin-page` | Layout del panel admin |
| `alert-error` / `alert-success` / `alert-warning` | Mensajes |

Componentes compartidos: `UserMenu`, `UserAvatar`, `ProductGallery` (carrusel multi-imagen).

## Docker

Desde la raíz del monorepo:

```bash
docker build -f joyeria-frontend/Dockerfile --build-arg REACT_APP_API_BASE_URL=http://localhost:5053 -t joyeria-web .
```

Ver [`docs/DESPLIEGUE.md`](../docs/DESPLIEGUE.md) para el stack completo con `docker compose`.

## Rutas protegidas

- Cliente: `/profile`, `/orders` (`requireAuth`)
- Staff: `/admin/*` (roles Admin o Employee)
- `/dashboard` → redirige según rol

## Más documentación

- [`../README.md`](../README.md)
- [`../docs/PERMISOS-Y-API.md`](../docs/PERMISOS-Y-API.md)
