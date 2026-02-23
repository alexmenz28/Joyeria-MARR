# Joyería MARR - Sistema de Gestión

Sistema de gestión para joyería: backend en ASP.NET Core y frontend en React.

## Estructura del proyecto

```
joyeria-backend/     Backend API (ASP.NET Core, EF Core, SQL Server)
joyeria-frontend/   SPA (React, Tailwind CSS)
```

## Requisitos

- .NET 9 SDK o superior
- Node.js 18.x o superior
- SQL Server
- Cuenta en Cloudinary (imágenes)

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

### Frontend

```bash
cd joyeria-frontend
npm install
```

Copiar `.env.example` como `.env` y definir `REACT_APP_API_BASE_URL`. Luego:

```bash
npm start
```

## Características

- **Backend:** API REST, autenticación JWT, Entity Framework Core con SQL Server, Swagger, Cloudinary, roles (Admin, Empleado, Cliente).
- **Frontend:** React, Tailwind CSS, rutas protegidas, catálogo, carrito, panel de administración.

## Roles

| Rol      | Acceso |
|----------|--------|
| Admin    | Total  |
| Empleado | Productos y pedidos |
| Cliente  | Catálogo y pedidos personalizados |

## Contribución

1. Fork del proyecto
2. Rama para tu cambio (`git checkout -b feature/nombre`)
3. Commit y push a tu rama
4. Abrir Pull Request

## Licencia

MIT.
