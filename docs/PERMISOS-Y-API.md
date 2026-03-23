# Roles, permisos y API (Joyería MARR)

Documento de referencia para **qué puede hacer cada rol** en backend y frontend, y cómo está paginada la API.

---

## Roles en base de datos

| Rol (campo `Roles.Name`) | Uso |
|--------------------------|-----|
| **Admin** | Acceso total al panel de administración y operaciones sensibles (p. ej. borrar productos o pedidos). |
| **Employee** | Panel admin para gestión diaria (productos, pedidos, estados), sin algunas acciones solo-Admin. |
| **Customer** | Cliente de la tienda: catálogo, carrito, crear pedidos (`POST /api/orders`), ver **sus** pedidos. |

Los nombres son **exactos y en inglés** (`Admin`, `Employee`, `Customer`): la autorización `[Authorize(Roles = "Admin")]` distingue mayúsculas.

---

## ¿Qué permisos tiene el **Admin**?

En el **JWT** el admin lleva el claim **`role`: `"Admin"`** (y el claim estándar de .NET para rol). Con eso el backend autoriza:

| Área | Permisos típicos del Admin |
|------|----------------------------|
| **Pedidos** | Listar **todos** los pedidos paginados (`GET /api/orders`), ver cualquier pedido por id, cambiar estado (`PATCH .../status`), **eliminar** pedidos (`DELETE /api/orders/{id}`). |
| **Usuarios** | Listar usuarios paginados (`GET /api/admin/users`), actualizar rol y cuenta activa (`PATCH /api/admin/users/{id}`), listar roles (`GET /api/admin/roles`) → **solo Admin** (no Employee). |
| **Productos** | Crear y editar (`POST` / `PUT` con rol Admin o Employee), **eliminar** productos (`DELETE` → **solo Admin**). |
| **Catálogo público** | Igual que cualquier usuario autenticado o anónimo según el endpoint (ver tabla siguiente). |
| **Mis pedidos** | Como usuario autenticado: `GET /api/orders/my` (sus propios pedidos paginados). |

El **Employee** coincide con Admin en listado/gestión de pedidos y productos **excepto** en lo marcado como solo **Admin** (p. ej. borrar producto, borrar pedido, **gestión de usuarios**).

El **Customer** **no** puede llamar a `GET /api/orders` (listado global): obtendría **403 Forbidden** si el token es válido pero el rol no es Admin ni Employee.

---

## JWT (login)

Claims relevantes (al generar el token se usan los tipos estándar de .NET; en el JSON del JWT el nombre del claim puede verse como **`role`** o como URI larga `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`):

| Claim | Ejemplo | Uso |
|-------|---------|-----|
| Identificador de usuario | `"1"` | Id de usuario (p. ej. `nameid` / `NameIdentifier` en el payload). |
| Email | `admin@...` | Email. |
| **Rol** | `"Admin"` | Autorización `[Authorize(Roles = "...")]` en el servidor. |

El frontend (`jwtRole.ts`) lee `role`, `Role` o el URI largo de .NET para mostrar el menú admin.

**Importante:** tras cambios de rol o de lógica de claims, el usuario debe **volver a iniciar sesión** para obtener un token nuevo.

---

## Endpoints principales y acceso

### Públicos (sin token)

- `GET /api/products` — Lista paginada de productos (catálogo / admin usa la misma forma). Filtros: `category` (nombre exacto), **`material`** (nombre exacto de `Materials.Name`), `search`, `minPrice`, `maxPrice`, `inStockOnly`, `sortBy`.
- `GET /api/products/{id}`
- `GET /api/products/category/{name}`
- `GET /api/categories` — Nombres de categoría.
- `GET /api/materials` — Lista `{ id, name }` de materiales (referencia para filtros y formularios).
- `POST /api/auth/register`, `POST /api/auth/login`

### Autenticado (cualquier rol)

- `GET /api/account/me` — Perfil (sin contraseña).
- `PATCH /api/account/me` — Actualizar nombre y apellidos.
- `POST /api/account/me/password` — Cambiar contraseña (`currentPassword`, `newPassword`, `confirmPassword`).
- `GET /api/orders/my` — Pedidos del usuario actual (paginado).
- `GET /api/orders/{id}` — Detalle si es el dueño del pedido **o** Admin/Employee.

### Solo **Customer**

- `POST /api/orders` — Crear pedido:
  - **Catálogo:** cada línea con `productId` y `quantity` (sin `customDescription`).
  - **Personalizado / presupuesto:** línea sin `productId` (o `null`) con `customDescription` y `quantity`; el precio unitario queda en **0** hasta que el taller cotice.
  - Se pueden combinar líneas de catálogo y personalizadas en el mismo pedido.

### **Admin** y **Employee**

- `GET /api/admin/stats` — Resumen del panel: conteos (productos, pedidos, clientes, usuarios), suma de `Order.Total`, últimos 5 pedidos (sin datos sensibles).
- `GET /api/admin/sales/summary?months=12` — Informe de ventas: agregación mensual de `Order.Total` y número de pedidos (meses en calendario consecutivos, 1–36). Misma fuente que el gráfico del dashboard (últimos 6 meses en el panel).
- `GET /api/orders` — Todos los pedidos (paginado).
- `PATCH /api/orders/{id}/status`
- `POST` / `PUT /api/products` — Crear / actualizar productos (multipart: categoría por nombre, imagen en creación; campo opcional **`materialId`** numérico o vacío para quitar material; validar contra `GET /api/materials`).

### Solo **Admin**

- `DELETE /api/products/{id}`
- `DELETE /api/orders/{id}`
- `GET /api/admin/users` — Listado paginado de usuarios (`page`, `pageSize`, `search` opcional).
- `PATCH /api/admin/users/{id}` — Cuerpo JSON opcional: `roleId`, `isActive` (al menos uno). Reglas: no desactivar el propio usuario; no cambiar el propio rol fuera de Admin; no dejar sin administrador activo al desactivar o bajar de rol al último admin. Las cuentas inactivas no pueden iniciar sesión.
- `GET /api/admin/roles` — Lista de roles para desplegables en la UI.

---

## Paginación (respuesta `PagedResult<T>`)

Los listados paginados devuelven JSON en camelCase:

```json
{
  "items": [ ... ],
  "totalCount": 1234,
  "page": 1,
  "pageSize": 10,
  "totalPages": 124
}
```

Parámetros habituales: `page`, `pageSize` (máx. **100** en servidor en la mayoría de casos).  
`GET /api/products` admite además `search`, `category`, **`material`** (nombre exacto de un registro en `Materials`), `minPrice`, `maxPrice`, `inStockOnly`, `sortBy`.  
`GET /api/orders` admite `search` (id numérico o texto en email/nombre).  
`GET /api/admin/users` admite `page`, `pageSize` (máx. 100), `search` (email o nombre).

---

## Problemas frecuentes

### “Could not load orders / Check your permissions” en el admin

El mensaje del frontend aparece ante **cualquier** error de red o HTTP, no solo 403.

1. **401 Unauthorized** — Token ausente, caducado o firma/issuer/audience incorrectos. Solución: login de nuevo y revisar `JwtSettings` en `appsettings.json`.
2. **403 Forbidden** — Token válido pero rol **Customer** (o sin rol reconocido). Solución: usuario con rol **Admin** o **Employee** en BD.
3. **Redirect HTTP → HTTPS** — Si el front usa `http://localhost:5053` y el API redirige a HTTPS, algunos clientes **no reenvían** `Authorization` en el redirect → 401. En este proyecto, en **Development** se desactiva `UseHttpsRedirection` para evitarlo; en producción usa la URL HTTPS correcta en `REACT_APP_API_BASE_URL`.

### Error 500 al listar pedidos (admin) con `passwordHash` en el log

Si el servidor registra `JsonPropertyInfo 'passwordHash' ... is marked required but does not specify a setter`, la causa es la combinación **`required` + `[JsonIgnore]`** en el modelo `User` con **System.Text.Json** (.NET 9+). En el código ya se evita `required` en `PasswordHash` (sigue oculto en JSON con `[JsonIgnore]`).

### La UI de admin se ve pero los datos no cargan

La ruta `/admin/*` solo comprueba en el cliente que el JWT diga `Admin` o `Employee`. El **servidor** vuelve a comprobar el rol en cada petición: si el token no lleva bien el claim `role`, fallará la API aunque el menú se muestre (token antiguo o error de configuración JWT).

---

## Referencias en el repo

- Backend: `Controllers/*.cs`, `Program.cs` (JWT + CORS), `Services/UserService.cs` (generación del token).
- Frontend: `utils/jwtRole.ts`, `utils/api.ts` (header `Authorization`), `components/common/ProtectedRoute.tsx`.
- Pruebas HTTP: `joyeria-backend/JoyeriaBackend.http`.
