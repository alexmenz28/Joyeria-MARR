using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JoyeriaBackend.Migrations
{
    /// <summary>Adds Materials reference table, MaterialId on Products, migrates legacy Material text, drops Material column.</summary>
    public partial class MaterialsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Materials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    AlloyOrFineness = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Materials", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Materials_Name",
                table: "Materials",
                column: "Name",
                unique: true);

            migrationBuilder.AddColumn<int>(
                name: "MaterialId",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_MaterialId",
                table: "Products",
                column: "MaterialId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Materials_MaterialId",
                table: "Products",
                column: "MaterialId",
                principalTable: "Materials",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.Sql(
                """
                INSERT INTO [Materials] ([Name])
                SELECT DISTINCT [Material]
                FROM [Products]
                WHERE [Material] IS NOT NULL AND LTRIM(RTRIM([Material])) <> ''
                AND NOT EXISTS (SELECT 1 FROM [Materials] m WHERE m.[Name] = [Products].[Material]);
                """);

            migrationBuilder.Sql(
                """
                UPDATE p
                SET p.[MaterialId] = m.[Id]
                FROM [Products] p
                INNER JOIN [Materials] m ON m.[Name] = p.[Material]
                WHERE p.[Material] IS NOT NULL;
                """);

            migrationBuilder.DropColumn(
                name: "Material",
                table: "Products");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Material",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE p
                SET p.[Material] = m.[Name]
                FROM [Products] p
                INNER JOIN [Materials] m ON m.[Id] = p.[MaterialId]
                WHERE p.[MaterialId] IS NOT NULL;
                """);

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Materials_MaterialId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_MaterialId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MaterialId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "Materials");
        }
    }
}
