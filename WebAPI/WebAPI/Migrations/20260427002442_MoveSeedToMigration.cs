using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class MoveSeedToMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Fatura Seed
            migrationBuilder.InsertData(
                table: "Faturat",
                columns: new[] { "Id", "NrFatures", "Titulli", "DataRegjistrimit", "Shenime", "KlientiEmri", "KlientiAdresa", "KlientiEmail", "KlientiTelefoni", "TotaliMeTVSH", "TotaliPaTVSH", "TVSH8", "TVSH18", "Rabati", "AspNetUserId", "KlientiId" },
                values: new object[,]
                {
                    { 200, "FAT-010125-0001", "FATURE", new DateTime(2025, 1, 1, 10, 0, 0, DateTimeKind.Utc), "Faturë Shembull", "Klienti Test Sh.p.k", "Prishtinë, Kosovë", "info@klienti.com", "+383 44 111 222", 1180m, 1000m, 0m, 180m, 0m, null, 100 }
                });

            // FaturaArtikujtItem Seed
            migrationBuilder.InsertData(
                table: "FaturaArtikujt",
                columns: new[] { "Id", "FaturaId", "Kodi", "Emri", "Njesia", "Sasia", "Cmimi", "Rabati1", "Rabati2", "Rabati3", "Tvsh" },
                values: new object[,]
                {
                    { 200, 200, "ART-001", "Laptop Dell XPS 15", "pc", 1m, 1000m, 0m, 0m, 0m, 18m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(table: "FaturaArtikujt", keyColumn: "Id", keyValue: 200);
            migrationBuilder.DeleteData(table: "Faturat", keyColumn: "Id", keyValue: 200);
        }
    }
}
