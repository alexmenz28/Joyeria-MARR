# Joyería MARR - Sistema de Gestión

Sistema de gestión para joyería: backend en ASP.NET Core y frontend en React (SPA con React Router).

---

## Estructura del proyecto

```
joyeria-backend/          Backend API (ASP.NET Core, EF Core, SQL Server)
joyeria-frontend/         SPA (React, React Router, Tailwind CSS)
JoyeriaBackend.Tests/     Tests de integración (xUnit)
```

---

## Requisitos

- .NET 10 SDK
- Node.js 18.x o superior
- SQL Server
- Cuenta en Cloudinary (imágenes)

---

## Cómo ejecutarlo

### Backend

```bash
cd joyeria-backend
dotnet restore
```

Configurar: copiar `appsettings.Example.json` como `appsettings.json` y rellenar cadena de conexión, JWT y Cloudinary. Luego:

```bash
dotnet ef database update
dotnet run
```

API en desarrollo: `http://localhost:5053` · Health check: `GET /health` · Swagger: `/swagger` (solo Development).

**Docker (backend):** desde la raíz del repo, `docker build -f joyeria-backend/Dockerfile -t joyeria-api .`

### Tests del backend

```bash
dotnet test JoyeriaBackend.Tests/JoyeriaBackend.Tests.csproj
```

### Frontend

```bash
cd joyeria-frontend
npm install
```

Copiar `.env.example` como `.env` y definir `REACT_APP_API_BASE_URL`. Luego:

```bash
npm start
```

---

## Características

- **Backend:** API REST con **DTOs** de entrada/salida, autenticación JWT (rate limit en `/api/auth/*`), Entity Framework Core con SQL Server, **transacciones y concurrencia de stock**, soft-delete de productos, Swagger con JWT, Cloudinary (validación de imágenes), **health check**, roles (**Admin**, **Employee**, **Customer**), catálogo con categorías y materiales normalizados.
- **Frontend:** React, React Router (navegación SPA), Tailwind CSS, modo claro/oscuro (por defecto claro), **carrito** (localStorage) y **checkout** para clientes, **pedido personalizado**, **perfil y cambio de contraseña**, catálogo con **paginación en servidor**, “mis pedidos”, panel admin en **inglés** con layout unificado (hero + contenedor ancho fijo), dashboard con KPIs y **gráfico de ventas mensuales** (API real, USD/`en-US`), **gestión de usuarios** (solo Admin), **informe de ventas** (Admin y Employee).

---

## Roles

| Rol        | Acceso (resumen) |
|------------|------------------|
| **Admin**  | Panel completo; borrar productos y pedidos; resto igual que Employee. |
| **Employee** | Panel: productos y pedidos (listado, estado); no borra productos/pedidos. |
| **Customer** | Tienda: catálogo, carrito, **sus** pedidos; no ve el listado global de pedidos. |

Detalle de endpoints JWT y troubleshooting: **[`docs/PERMISOS-Y-API.md`](docs/PERMISOS-Y-API.md)**.

---

## Datos de prueba

Si la base de datos está vacía, al arrancar el backend en **Development** se insertan automáticamente usuarios y productos de ejemplo. Contraseña común: **`Test123!`**

| Rol        | Email                    |
|------------|--------------------------|
| Admin      | admin@joyeriamarr.com    |
| Employee   | empleado@joyeriamarr.com |
| Customer   | cliente@joyeriamarr.com  |

*(Los emails del seeder siguen siendo los mismos; los nombres de rol en BD son en inglés: Admin, Employee, Customer.)*

---

## Seguridad

- No subir `appsettings.json` ni `.env` al repositorio; usar `appsettings.Example.json`, User Secrets o variables de entorno.
- Configurar `Cors:AllowedOrigins` en producción.
- Rotar `JwtSettings:Key` y credenciales de Cloudinary si se expusieron.

---

## Documentación adicional

- [`docs/PERMISOS-Y-API.md`](docs/PERMISOS-Y-API.md) — roles, permisos del admin, paginación y errores típicos (401/403, HTTPS).
- [`docs/PLAN-MAESTRO-PROYECTO.md`](docs/PLAN-MAESTRO-PROYECTO.md) — planificación del proyecto.

---

## Contribución

1. Fork del proyecto
2. Rama para tu cambio (`git checkout -b feature/nombre`)
3. Commit y push a tu rama
4. Abrir Pull Request

---

## Licencia

MIT.
