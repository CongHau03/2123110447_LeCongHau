using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Demo2.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUserFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "FullName", "PasswordHash", "Points", "Role", "Username" },
                values: new object[] { 999, "System Administrator", "admin123", 0, "Admin", "admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999);
        }
    }
}
