using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JoyeriaBackend.Migrations
{
    /// <inheritdoc />
    public partial class NormalizacionRolesCategoriasEstados : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Crear tablas normalizadas
            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table => table.PrimaryKey("PK_Roles", x => x.Id));

            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table => table.PrimaryKey("PK_Categorias", x => x.Id));

            migrationBuilder.CreateTable(
                name: "EstadosPedido",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table => table.PrimaryKey("PK_EstadosPedido", x => x.Id));

            migrationBuilder.CreateIndex(name: "IX_Roles_Nombre", table: "Roles", column: "Nombre", unique: true);
            migrationBuilder.CreateIndex(name: "IX_Categorias_Nombre", table: "Categorias", column: "Nombre", unique: true);
            migrationBuilder.CreateIndex(name: "IX_EstadosPedido_Nombre", table: "EstadosPedido", column: "Nombre", unique: true);

            // 2. Seed datos por defecto
            migrationBuilder.Sql(@"
                INSERT INTO Roles (Nombre) VALUES ('Admin'), ('Empleado'), ('Cliente');
                INSERT INTO Categorias (Nombre) VALUES ('Anillos'), ('Collares'), ('Pulseras'), ('Aretes'), ('Dijes'), ('Conjuntos'), ('Otros');
                INSERT INTO EstadosPedido (Nombre) VALUES ('Pendiente'), ('En Proceso'), ('Completado'), ('Cancelado');
            ");

            // 3. Añadir columnas FK (nullable para migrar datos existentes)
            migrationBuilder.AddColumn<int>(
                name: "RolId",
                table: "Usuarios",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CategoriaId",
                table: "Productos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EstadoPedidoId",
                table: "Pedidos",
                type: "int",
                nullable: true);

            // 4. Migrar datos: asignar FKs desde los textos existentes
            migrationBuilder.Sql(@"
                UPDATE Usuarios SET RolId = (SELECT TOP 1 Id FROM Roles WHERE Nombre = Usuarios.Rol);
                UPDATE Usuarios SET RolId = (SELECT TOP 1 Id FROM Roles WHERE Nombre = 'Cliente') WHERE RolId IS NULL;

                UPDATE Productos SET CategoriaId = (SELECT TOP 1 Id FROM Categorias WHERE Nombre = Productos.Categoria);
                UPDATE Productos SET CategoriaId = (SELECT TOP 1 Id FROM Categorias WHERE Nombre = 'Otros') WHERE CategoriaId IS NULL;

                UPDATE Pedidos SET EstadoPedidoId = (SELECT TOP 1 Id FROM EstadosPedido WHERE Nombre = Pedidos.Estado);
                UPDATE Pedidos SET EstadoPedidoId = (SELECT TOP 1 Id FROM EstadosPedido WHERE Nombre = 'Pendiente') WHERE EstadoPedidoId IS NULL;
            ");

            // 5. Hacer las FK no nullables
            migrationBuilder.AlterColumn<int>(
                name: "RolId",
                table: "Usuarios",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CategoriaId",
                table: "Productos",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "EstadoPedidoId",
                table: "Pedidos",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            // 6. Eliminar columnas antiguas
            migrationBuilder.DropColumn(name: "Rol", table: "Usuarios");
            migrationBuilder.DropColumn(name: "Categoria", table: "Productos");
            migrationBuilder.DropColumn(name: "Estado", table: "Pedidos");

            // 7. Crear índices y FKs
            migrationBuilder.CreateIndex(name: "IX_Usuarios_RolId", table: "Usuarios", column: "RolId");
            migrationBuilder.CreateIndex(name: "IX_Productos_CategoriaId", table: "Productos", column: "CategoriaId");
            migrationBuilder.CreateIndex(name: "IX_Pedidos_EstadoPedidoId", table: "Pedidos", column: "EstadoPedidoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Roles_RolId",
                table: "Usuarios",
                column: "RolId",
                principalTable: "Roles",
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
                name: "FK_Pedidos_EstadosPedido_EstadoPedidoId",
                table: "Pedidos",
                column: "EstadoPedidoId",
                principalTable: "EstadosPedido",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Usuarios_Roles_RolId", table: "Usuarios");
            migrationBuilder.DropForeignKey(name: "FK_Productos_Categorias_CategoriaId", table: "Productos");
            migrationBuilder.DropForeignKey(name: "FK_Pedidos_EstadosPedido_EstadoPedidoId", table: "Pedidos");

            migrationBuilder.DropIndex(name: "IX_Usuarios_RolId", table: "Usuarios");
            migrationBuilder.DropIndex(name: "IX_Productos_CategoriaId", table: "Productos");
            migrationBuilder.DropIndex(name: "IX_Pedidos_EstadoPedidoId", table: "Pedidos");

            migrationBuilder.AddColumn<string>(name: "Rol", table: "Usuarios", type: "nvarchar(max)", nullable: false, defaultValue: "Cliente");
            migrationBuilder.AddColumn<string>(name: "Categoria", table: "Productos", type: "nvarchar(max)", nullable: false, defaultValue: "Otros");
            migrationBuilder.AddColumn<string>(name: "Estado", table: "Pedidos", type: "nvarchar(max)", nullable: false, defaultValue: "Pendiente");

            migrationBuilder.Sql(@"
                UPDATE Usuarios SET Rol = (SELECT Nombre FROM Roles WHERE Id = Usuarios.RolId);
                UPDATE Productos SET Categoria = (SELECT Nombre FROM Categorias WHERE Id = Productos.CategoriaId);
                UPDATE Pedidos SET Estado = (SELECT Nombre FROM EstadosPedido WHERE Id = Pedidos.EstadoPedidoId);
            ");

            migrationBuilder.DropColumn(name: "RolId", table: "Usuarios");
            migrationBuilder.DropColumn(name: "CategoriaId", table: "Productos");
            migrationBuilder.DropColumn(name: "EstadoPedidoId", table: "Pedidos");

            migrationBuilder.DropTable(name: "Roles");
            migrationBuilder.DropTable(name: "Categorias");
            migrationBuilder.DropTable(name: "EstadosPedido");
        }
    }
}
