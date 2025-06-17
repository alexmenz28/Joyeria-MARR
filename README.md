# Joyería MARR - Sistema de Gestión

Sistema completo de gestión para joyería, desarrollado con ASP.NET Core y React.

## Estructura del Proyecto

```
📦 joyeria-backend/     # Backend en ASP.NET Core
📦 joyeria-frontend/    # Frontend en React + Tailwind
```

## Requisitos Previos

- .NET 6 SDK o superior
- Node.js 16.x o superior
- SQL Server
- Visual Studio 2022 o Visual Studio Code
- Cuenta en Cloudinary (para almacenamiento de imágenes)

## Configuración del Backend

1. Navegar al directorio del backend:
   ```bash
   cd joyeria-backend
   ```

2. Restaurar las dependencias:
   ```bash
   dotnet restore
   ```

3. Configurar la base de datos:
   - Actualizar la cadena de conexión en `appsettings.json`
   - Ejecutar las migraciones:
     ```bash
     dotnet ef migrations add InitialCreate
     dotnet ef database update
     ```

4. Configurar Cloudinary:
   - Actualizar las credenciales en `appsettings.json`

5. Ejecutar el proyecto:
   ```bash
   dotnet run
   ```

## Configuración del Frontend

1. Navegar al directorio del frontend:
   ```bash
   cd joyeria-frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crear archivo `.env` basado en `.env.example`
   - Actualizar las variables según sea necesario

4. Ejecutar el proyecto:
   ```bash
   npm start
   ```

## Características Principales

### Backend
- API RESTful con ASP.NET Core
- Autenticación JWT
- Entity Framework Core con SQL Server
- Swagger para documentación
- Manejo de imágenes con Cloudinary
- Roles de usuario (Admin, Empleado, Cliente)

### Frontend
- SPA con React
- Diseño responsivo con Tailwind CSS
- Rutas protegidas
- Gestión de estado
- Formularios validados
- Carrito de compras
- Panel de administración

## Roles de Usuario

- **Admin**: Acceso total al sistema
- **Empleado**: Gestión de productos y pedidos
- **Cliente**: Catálogo y pedidos personalizados

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles. 