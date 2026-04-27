using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class KlientiFkAndSeedFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KlientiId",
                table: "Faturat",
                type: "int",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Bankat",
                columns: new[] { "Id", "EmriBankes", "IsActive", "NrLlogaris", "Valuta" },
                values: new object[,]
                {
                    { 100, "Raiffeisen Bank", true, "1501 0000 0000 0001", "EUR" },
                    { 101, "ProCredit Bank", true, "1110 0000 0000 0001", "EUR" }
                });

            migrationBuilder.InsertData(
                table: "Klientet",
                columns: new[] { "Id", "Adresa", "Email", "EmriKompanise", "NRB", "NUI", "Telefoni" },
                values: new object[,]
                {
                    { 100, "Prishtinë, Kosovë", "info@klienti.com", "Klienti Test Sh.p.k", "70000000", "811000000", "+383 44 111 222" },
                    { 101, "Tiranë, Shqipëri", "contact@model.al", "Kompania Model L.L.C.", "K81234567B", "L12345678A", "+355 69 111 2222" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Faturat_KlientiId",
                table: "Faturat",
                column: "KlientiId");

            migrationBuilder.AddForeignKey(
                name: "FK_Faturat_Klientet_KlientiId",
                table: "Faturat",
                column: "KlientiId",
                principalTable: "Klientet",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Faturat_Klientet_KlientiId",
                table: "Faturat");

            migrationBuilder.DropIndex(
                name: "IX_Faturat_KlientiId",
                table: "Faturat");

            migrationBuilder.DeleteData(
                table: "Bankat",
                keyColumn: "Id",
                keyValue: 100);

            migrationBuilder.DeleteData(
                table: "Bankat",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.DeleteData(
                table: "Klientet",
                keyColumn: "Id",
                keyValue: 100);

            migrationBuilder.DeleteData(
                table: "Klientet",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.DropColumn(
                name: "KlientiId",
                table: "Faturat");
        }
    }
}
