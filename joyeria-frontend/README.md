# Joyería MARR — Frontend

SPA en React (Create React App) con React Router, Tailwind CSS y panel de administración.

## Requisitos

- Node.js 18+
- Backend API en ejecución (ver README raíz)

## Configuración

```bash
npm install
cp .env.example .env
```

En `.env`:

```
REACT_APP_API_BASE_URL=http://localhost:5053
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm start` | Desarrollo en [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Build de producción en `build/` |
| `npm test -- --watchAll=false` | Tests unitarios |

## Arquitectura relevante

- **`AuthContext`** — JWT, rol y logout centralizado; interceptor 401 en `utils/api.ts`.
- **`ProtectedRoute`** — Rutas de cliente (`requireAuth`) y panel admin (roles `Admin` / `Employee`).
- **`/dashboard`** — Redirige según rol (staff → `/admin/dashboard`, cliente → inicio).
- **`getApiErrorMessage`** — Lee errores del API (`{ error, code }`).
- **Carrito** — `localStorage`; stock se **refresca al volver a la pestaña** y **antes del checkout** (sin WebSockets).

## Stock concurrente

Si dos clientes compran el mismo producto a la vez, el backend valida stock en transacción con token de concurrencia (`StockVersion`). El segundo pedido recibe un error claro; el carrito se re-sincroniza y el usuario puede reintentar.

## Despliegue

Tras `npm run build`, servir la carpeta `build/` como sitio estático y apuntar `REACT_APP_API_BASE_URL` al API en producción. Configurar `Cors:AllowedOrigins` en el backend.
