using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Demo2.Migrations
{
    /// <inheritdoc />
    public partial class AddVoucherCodeToReward : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VoucherCode",
                table: "Rewards",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VoucherCode",
                table: "Rewards");
        }
    }
}
