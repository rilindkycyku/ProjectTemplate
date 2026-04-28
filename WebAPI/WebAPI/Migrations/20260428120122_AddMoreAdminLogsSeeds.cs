using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddMoreAdminLogsSeeds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AdminLogs",
                columns: new[] { "Id", "Detaje", "Entiteti", "EntitetiId", "Koha", "StafiId", "Veprimi" },
                values: new object[,]
                {
                    { 1, "Sistemi i gjurmimit u inicializua automatikisht.", "Sistemi", "0", new DateTime(2024, 1, 1, 8, 0, 0, 0, DateTimeKind.Utc), null, "Shto" },
                    { 2, "U shtua përdoruesi fillestar (Admin).", "Perdoruesit", "1", new DateTime(2024, 1, 2, 9, 15, 0, 0, DateTimeKind.Utc), null, "Shto" },
                    { 3, "U përditësuan cilësimet bazë të platformës.", "Cilesimet e Sajtit", "1", new DateTime(2024, 1, 3, 10, 30, 0, 0, DateTimeKind.Utc), null, "Ndrysho" },
                    { 4, "U shtua klienti: Klienti Template Sh.p.k", "Klientet", "1", new DateTime(2024, 1, 4, 11, 45, 0, 0, DateTimeKind.Utc), null, "Shto" },
                    { 5, "U shtua banka: Banka Kryesore", "Bankat", "1", new DateTime(2024, 1, 5, 13, 20, 0, 0, DateTimeKind.Utc), null, "Shto" },
                    { 6, "U shtua fatura: FAT-060124-0001", "Faturat", "1", new DateTime(2024, 1, 6, 14, 10, 0, 0, DateTimeKind.Utc), null, "Shto" },
                    { 7, "U shtua klienti: Partneri ABC", "Klientet", "2", new DateTime(2024, 1, 7, 9, 5, 0, 0, DateTimeKind.Utc), null, "Shto" },
                    { 8, "U shtua fatura: FAT-080124-0002", "Faturat", "2", new DateTime(2024, 1, 8, 16, 40, 0, 0, DateTimeKind.Utc), null, "Shto" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AdminLogs",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AdminLogs",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AdminLogs",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "AdminLogs",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "AdminLogs",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "AdminLogs",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "AdminLogs",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "AdminLogs",
                keyColumn: "Id",
                keyValue: 8);
        }
    }
}
