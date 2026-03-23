using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JoyeriaBackend.Migrations
{
    /// <inheritdoc />
    public partial class EnglishSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
UPDATE Roles SET Nombre = N'Employee' WHERE Nombre = N'Empleado';
UPDATE Roles SET Nombre = N'Customer' WHERE Nombre = N'Cliente';
UPDATE EstadosPedido SET Nombre = N'Pending' WHERE Nombre = N'Pendiente';
UPDATE EstadosPedido SET Nombre = N'In Progress' WHERE Nombre = N'En Proceso';
UPDATE EstadosPedido SET Nombre = N'Completed' WHERE Nombre = N'Completado';
UPDATE EstadosPedido SET Nombre = N'Cancelled' WHERE Nombre = N'Cancelado';
UPDATE Categorias SET Nombre = N'Rings' WHERE Nombre = N'Anillos';
UPDATE Categorias SET Nombre = N'Necklaces' WHERE Nombre = N'Collares';
UPDATE Categorias SET Nombre = N'Bracelets' WHERE Nombre = N'Pulseras';
UPDATE Categorias SET Nombre = N'Earrings' WHERE Nombre = N'Aretes';
UPDATE Categorias SET Nombre = N'Charms' WHERE Nombre = N'Dijes';
UPDATE Categorias SET Nombre = N'Sets' WHERE Nombre = N'Conjuntos';
UPDATE Categorias SET Nombre = N'Other' WHERE Nombre = N'Otros';
");

            migrationBuilder.DropForeignKey(name: "FK_DetallesPedido_Pedidos_PedidoId", table: "DetallesPedido");
            migrationBuilder.DropForeignKey(name: "FK_DetallesPedido_Productos_ProductoId", table: "DetallesPedido");
            migrationBuilder.DropForeignKey(name: "FK_Pedidos_EstadosPedido_EstadoPedidoId", table: "Pedidos");
            migrationBuilder.DropForeignKey(name: "FK_Pedidos_Usuarios_UsuarioId", table: "Pedidos");
            migrationBuilder.DropForeignKey(name: "FK_Productos_Categorias_CategoriaId", table: "Productos");
            migrationBuilder.DropForeignKey(name: "FK_Usuarios_Roles_RolId", table: "Usuarios");

            migrationBuilder.RenameColumn(name: "PedidoId", table: "DetallesPedido", newName: "OrderId");
            migrationBuilder.RenameColumn(name: "ProductoId", table: "DetallesPedido", newName: "ProductId");
            migrationBuilder.RenameColumn(name: "Cantidad", table: "DetallesPedido", newName: "Quantity");
            migrationBuilder.RenameColumn(name: "PrecioUnitario", table: "DetallesPedido", newName: "UnitPrice");
            migrationBuilder.RenameColumn(name: "DescripcionPersonalizada", table: "DetallesPedido", newName: "CustomDescription");

            migrationBuilder.RenameIndex(name: "IX_DetallesPedido_PedidoId", newName: "IX_OrderLines_OrderId", table: "DetallesPedido");
            migrationBuilder.RenameIndex(name: "IX_DetallesPedido_ProductoId", newName: "IX_OrderLines_ProductId", table: "DetallesPedido");
            migrationBuilder.RenameTable(name: "DetallesPedido", newName: "OrderLines");

            migrationBuilder.RenameColumn(name: "UsuarioId", table: "Pedidos", newName: "UserId");
            migrationBuilder.RenameColumn(name: "EstadoPedidoId", table: "Pedidos", newName: "OrderStatusId");
            migrationBuilder.RenameColumn(name: "FechaPedido", table: "Pedidos", newName: "OrderedAt");
            migrationBuilder.RenameColumn(name: "Notas", table: "Pedidos", newName: "Notes");
            migrationBuilder.RenameIndex(name: "IX_Pedidos_UsuarioId", newName: "IX_Orders_UserId", table: "Pedidos");
            migrationBuilder.RenameIndex(name: "IX_Pedidos_EstadoPedidoId", newName: "IX_Orders_OrderStatusId", table: "Pedidos");
            migrationBuilder.RenameTable(name: "Pedidos", newName: "Orders");

            migrationBuilder.RenameColumn(name: "CategoriaId", table: "Productos", newName: "CategoryId");
            migrationBuilder.RenameColumn(name: "Nombre", table: "Productos", newName: "Name");
            migrationBuilder.RenameColumn(name: "Descripcion", table: "Productos", newName: "Description");
            migrationBuilder.RenameColumn(name: "Precio", table: "Productos", newName: "Price");
            migrationBuilder.RenameColumn(name: "ImagenUrl", table: "Productos", newName: "ImageUrl");
            migrationBuilder.RenameColumn(name: "Disponible", table: "Productos", newName: "IsAvailable");
            migrationBuilder.RenameColumn(name: "Peso", table: "Productos", newName: "Weight");
            migrationBuilder.RenameColumn(name: "FechaCreacion", table: "Productos", newName: "CreatedAt");
            migrationBuilder.RenameColumn(name: "FechaActualizacion", table: "Productos", newName: "UpdatedAt");
            migrationBuilder.RenameIndex(name: "IX_Productos_CategoriaId", newName: "IX_Products_CategoryId", table: "Productos");
            migrationBuilder.RenameTable(name: "Productos", newName: "Products");

            migrationBuilder.RenameColumn(name: "Nombre", table: "Categorias", newName: "Name");
            migrationBuilder.RenameIndex(name: "IX_Categorias_Nombre", newName: "IX_Categories_Name", table: "Categorias");
            migrationBuilder.RenameTable(name: "Categorias", newName: "Categories");

            migrationBuilder.RenameColumn(name: "Nombre", table: "EstadosPedido", newName: "Name");
            migrationBuilder.RenameIndex(name: "IX_EstadosPedido_Nombre", newName: "IX_OrderStatuses_Name", table: "EstadosPedido");
            migrationBuilder.RenameTable(name: "EstadosPedido", newName: "OrderStatuses");

            migrationBuilder.RenameColumn(name: "Nombre", table: "Usuarios", newName: "FirstName");
            migrationBuilder.RenameColumn(name: "Apellido", table: "Usuarios", newName: "LastName");
            migrationBuilder.RenameColumn(name: "FechaCreacion", table: "Usuarios", newName: "CreatedAt");
            migrationBuilder.RenameColumn(name: "Activo", table: "Usuarios", newName: "IsActive");
            migrationBuilder.RenameColumn(name: "RolId", table: "Usuarios", newName: "RoleId");
            migrationBuilder.RenameIndex(name: "IX_Usuarios_Email", newName: "IX_Users_Email", table: "Usuarios");
            migrationBuilder.RenameIndex(name: "IX_Usuarios_RolId", newName: "IX_Users_RoleId", table: "Usuarios");
            migrationBuilder.RenameTable(name: "Usuarios", newName: "Users");

            migrationBuilder.RenameColumn(name: "Nombre", table: "Roles", newName: "Name");
            migrationBuilder.RenameIndex(name: "IX_Roles_Nombre", newName: "IX_Roles_Name", table: "Roles");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderLines_Orders_OrderId",
                table: "OrderLines",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderLines_Products_ProductId",
                table: "OrderLines",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_OrderStatuses_OrderStatusId",
                table: "Orders",
                column: "OrderStatusId",
                principalTable: "OrderStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_UserId",
                table: "Orders",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_OrderLines_Orders_OrderId", table: "OrderLines");
            migrationBuilder.DropForeignKey(name: "FK_OrderLines_Products_ProductId", table: "OrderLines");
            migrationBuilder.DropForeignKey(name: "FK_Orders_OrderStatuses_OrderStatusId", table: "Orders");
            migrationBuilder.DropForeignKey(name: "FK_Orders_Users_UserId", table: "Orders");
            migrationBuilder.DropForeignKey(name: "FK_Products_Categories_CategoryId", table: "Products");
            migrationBuilder.DropForeignKey(name: "FK_Users_Roles_RoleId", table: "Users");

            migrationBuilder.RenameColumn(name: "Name", table: "Roles", newName: "Nombre");
            migrationBuilder.RenameIndex(name: "IX_Roles_Name", newName: "IX_Roles_Nombre", table: "Roles");

            migrationBuilder.RenameTable(name: "Users", newName: "Usuarios");
            migrationBuilder.RenameColumn(name: "FirstName", table: "Usuarios", newName: "Nombre");
            migrationBuilder.RenameColumn(name: "LastName", table: "Usuarios", newName: "Apellido");
            migrationBuilder.RenameColumn(name: "CreatedAt", table: "Usuarios", newName: "FechaCreacion");
            migrationBuilder.RenameColumn(name: "IsActive", table: "Usuarios", newName: "Activo");
            migrationBuilder.RenameColumn(name: "RoleId", table: "Usuarios", newName: "RolId");
            migrationBuilder.RenameIndex(name: "IX_Users_Email", newName: "IX_Usuarios_Email", table: "Usuarios");
            migrationBuilder.RenameIndex(name: "IX_Users_RoleId", newName: "IX_Usuarios_RolId", table: "Usuarios");

            migrationBuilder.RenameTable(name: "OrderStatuses", newName: "EstadosPedido");
            migrationBuilder.RenameColumn(name: "Name", table: "EstadosPedido", newName: "Nombre");
            migrationBuilder.RenameIndex(name: "IX_OrderStatuses_Name", newName: "IX_EstadosPedido_Nombre", table: "EstadosPedido");

            migrationBuilder.RenameTable(name: "Categories", newName: "Categorias");
            migrationBuilder.RenameColumn(name: "Name", table: "Categorias", newName: "Nombre");
            migrationBuilder.RenameIndex(name: "IX_Categories_Name", newName: "IX_Categorias_Nombre", table: "Categorias");

            migrationBuilder.RenameTable(name: "Products", newName: "Productos");
            migrationBuilder.RenameColumn(name: "CategoryId", table: "Productos", newName: "CategoriaId");
            migrationBuilder.RenameColumn(name: "Name", table: "Productos", newName: "Nombre");
            migrationBuilder.RenameColumn(name: "Description", table: "Productos", newName: "Descripcion");
            migrationBuilder.RenameColumn(name: "Price", table: "Productos", newName: "Precio");
            migrationBuilder.RenameColumn(name: "ImageUrl", table: "Productos", newName: "ImagenUrl");
            migrationBuilder.RenameColumn(name: "IsAvailable", table: "Productos", newName: "Disponible");
            migrationBuilder.RenameColumn(name: "Weight", table: "Productos", newName: "Peso");
            migrationBuilder.RenameColumn(name: "CreatedAt", table: "Productos", newName: "FechaCreacion");
            migrationBuilder.RenameColumn(name: "UpdatedAt", table: "Productos", newName: "FechaActualizacion");
            migrationBuilder.RenameIndex(name: "IX_Products_CategoryId", newName: "IX_Productos_CategoriaId", table: "Productos");

            migrationBuilder.RenameTable(name: "Orders", newName: "Pedidos");
            migrationBuilder.RenameColumn(name: "UserId", table: "Pedidos", newName: "UsuarioId");
            migrationBuilder.RenameColumn(name: "OrderStatusId", table: "Pedidos", newName: "EstadoPedidoId");
            migrationBuilder.RenameColumn(name: "OrderedAt", table: "Pedidos", newName: "FechaPedido");
            migrationBuilder.RenameColumn(name: "Notes", table: "Pedidos", newName: "Notas");
            migrationBuilder.RenameIndex(name: "IX_Orders_UserId", newName: "IX_Pedidos_UsuarioId", table: "Pedidos");
            migrationBuilder.RenameIndex(name: "IX_Orders_OrderStatusId", newName: "IX_Pedidos_EstadoPedidoId", table: "Pedidos");

            migrationBuilder.RenameTable(name: "OrderLines", newName: "DetallesPedido");
            migrationBuilder.RenameColumn(name: "OrderId", table: "DetallesPedido", newName: "PedidoId");
            migrationBuilder.RenameColumn(name: "ProductId", table: "DetallesPedido", newName: "ProductoId");
            migrationBuilder.RenameColumn(name: "Quantity", table: "DetallesPedido", newName: "Cantidad");
            migrationBuilder.RenameColumn(name: "UnitPrice", table: "DetallesPedido", newName: "PrecioUnitario");
            migrationBuilder.RenameColumn(name: "CustomDescription", table: "DetallesPedido", newName: "DescripcionPersonalizada");
            migrationBuilder.RenameIndex(name: "IX_OrderLines_OrderId", newName: "IX_DetallesPedido_PedidoId", table: "DetallesPedido");
            migrationBuilder.RenameIndex(name: "IX_OrderLines_ProductId", newName: "IX_DetallesPedido_ProductoId", table: "DetallesPedido");

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesPedido_Pedidos_PedidoId",
                table: "DetallesPedido",
                column: "PedidoId",
                principalTable: "Pedidos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesPedido_Productos_ProductoId",
                table: "DetallesPedido",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Pedidos_EstadosPedido_EstadoPedidoId",
                table: "Pedidos",
                column: "EstadoPedidoId",
                principalTable: "EstadosPedido",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedidos_Usuarios_UsuarioId",
                table: "Pedidos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Categorias_CategoriaId",
                table: "Productos",
                column: "CategoriaId",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Roles_RolId",
                table: "Usuarios",
                column: "RolId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.Sql(@"
UPDATE Roles SET Nombre = N'Empleado' WHERE Nombre = N'Employee';
UPDATE Roles SET Nombre = N'Cliente' WHERE Nombre = N'Customer';
UPDATE EstadosPedido SET Nombre = N'Pendiente' WHERE Nombre = N'Pending';
UPDATE EstadosPedido SET Nombre = N'En Proceso' WHERE Nombre = N'In Progress';
UPDATE EstadosPedido SET Nombre = N'Completado' WHERE Nombre = N'Completed';
UPDATE EstadosPedido SET Nombre = N'Cancelado' WHERE Nombre = N'Cancelled';
UPDATE Categorias SET Nombre = N'Anillos' WHERE Nombre = N'Rings';
UPDATE Categorias SET Nombre = N'Collares' WHERE Nombre = N'Necklaces';
UPDATE Categorias SET Nombre = N'Pulseras' WHERE Nombre = N'Bracelets';
UPDATE Categorias SET Nombre = N'Aretes' WHERE Nombre = N'Earrings';
UPDATE Categorias SET Nombre = N'Dijes' WHERE Nombre = N'Charms';
UPDATE Categorias SET Nombre = N'Conjuntos' WHERE Nombre = N'Sets';
UPDATE Categorias SET Nombre = N'Otros' WHERE Nombre = N'Other';
");
        }
    }
}
