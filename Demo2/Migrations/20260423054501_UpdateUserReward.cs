using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Demo2.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserReward : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GeneratedCode",
                table: "UserRewards",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsUsed",
                table: "UserRewards",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "Rewards",
                columns: new[] { "Id", "Description", "Name", "PointsRequired", "VoucherCode" },
                values: new object[,]
                {
                    { 1, "Giảm giá 20% cho mọi dịch vụ", "Vé giảm 20%", 500, "GIAM20" },
                    { 2, "Giảm giá 10% cho mọi dịch vụ", "Vé giảm 10 %", 250, "GIAM10" },
                    { 3, "Giảm ngay 200.000đ", "Vé Giảm Giá 200k", 300, "HOTEL200" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Rewards",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Rewards",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Rewards",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DropColumn(
                name: "GeneratedCode",
                table: "UserRewards");

            migrationBuilder.DropColumn(
                name: "IsUsed",
                table: "UserRewards");
        }
    }
}
