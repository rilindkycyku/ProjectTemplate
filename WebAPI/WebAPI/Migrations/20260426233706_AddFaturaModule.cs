using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddFaturaModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Bankat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmriBankes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NrLlogaris = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Valuta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bankat", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Faturat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NrFatures = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Titulli = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataRegjistrimit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Shenime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KlientiEmri = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KlientiAdresa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KlientiEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KlientiTelefoni = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotaliMeTVSH = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotaliPaTVSH = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TVSH8 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TVSH18 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Rabati = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AspNetUserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Faturat", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FaturaArtikujt",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FaturaId = table.Column<int>(type: "int", nullable: false),
                    Kodi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Emri = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Njesia = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sasia = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    Cmimi = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    Rabati1 = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    Rabati2 = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    Rabati3 = table.Column<decimal>(type: "decimal(18,4)", nullable: false),
                    Tvsh = table.Column<decimal>(type: "decimal(18,4)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FaturaArtikujt", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FaturaArtikujt_Faturat_FaturaId",
                        column: x => x.FaturaId,
                        principalTable: "Faturat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FaturaArtikujt_FaturaId",
                table: "FaturaArtikujt",
                column: "FaturaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bankat");

            migrationBuilder.DropTable(
                name: "FaturaArtikujt");

            migrationBuilder.DropTable(
                name: "Faturat");
        }
    }
}
