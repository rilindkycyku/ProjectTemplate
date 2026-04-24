using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class VendosjaETeDhenaveNeTabelaFillestare : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0267d4fd-5bac-4552-9930-8e528b2fec1b", "bcb0a7f8-41b2-48ce-bf39-fbc24516012e", "Admin", "ADMIN" },
                    { "db3dd60d-a159-4f85-a9a5-d1444ee1013d", "3e215a86-6eeb-48a6-90d9-fe12a7a70f28", "Menaxher", "MENAXHER" },
                    { "be4b8ef8-abf0-454c-852c-676cdab20e3b", "264000ea-9d66-4686-b48b-e06165a906fc", "User", "USER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[,]
                {
                    { "9d6b2651-641d-4c85-9154-99761863fc65", 0, "241f5600-e4e1-4e08-b789-9b0fc9367502", "user@template.com", false, false, null, "USER@TEMPLATE.COM", "USER", "AQAAAAEAACcQAAAAEFvlpjPerR25vlxvKiV9GnWzzfQGEk9LCpEfnHG/yUyyaYXsRp/sN52ZWgKNbsq1JA==", "", false, "3VINW7OQ6CJ7CZE3737G4L6WGMKBHWPT", false, "user" },
                    { "d2a7088f-a25e-4f3f-8488-b616eeaff928", 0, "297b4ee1-133a-4ad2-8242-201592f7a43d", "menaxher@template.com", false, false, null, "MENAXHER@TEMPLATE.COM", "MENAXHER", "AQAAAAEAACcQAAAAEP60Y+OpxVc3CPWS9NZu79pNu/KAAsxbrm8qTWpL9+ILK+Sd/3Pw4yLEas1N2TXL+g==", "", false, "2TO7IOMEDSKTLMHBALX52ICRC3HX3FNQ", false, "menaxher" },
                    { "f2bb7622-23ac-4c5f-8d71-00032b281e37", 0, "5dd7b4ea-994f-43c2-bdfd-1bef310ebf29", "admin@template.com", false, false, null, "ADMIN@TEMPLATE.COM", "ADMIN", "AQAAAAEAACcQAAAAEAy6t6f1jILbKXRyqzSZGrR4zq/Wl8G525tgzrBsqYIG4ksRH5HySRRlJrMtzvfTug==", "", false, "RHCE5BDZYCGBDPAZQ74P3IWVFBNDWMEX", false, "admin" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    // user  → User
                    { "be4b8ef8-abf0-454c-852c-676cdab20e3b", "9d6b2651-641d-4c85-9154-99761863fc65" },
                    // menaxher → Menaxher + User
                    { "db3dd60d-a159-4f85-a9a5-d1444ee1013d", "d2a7088f-a25e-4f3f-8488-b616eeaff928" },
                    { "be4b8ef8-abf0-454c-852c-676cdab20e3b", "d2a7088f-a25e-4f3f-8488-b616eeaff928" },
                    // admin → Admin + User
                    { "0267d4fd-5bac-4552-9930-8e528b2fec1b", "f2bb7622-23ac-4c5f-8d71-00032b281e37" },
                    { "be4b8ef8-abf0-454c-852c-676cdab20e3b", "f2bb7622-23ac-4c5f-8d71-00032b281e37" }
                });

            migrationBuilder.InsertData(
                table: "Perdoruesi",
                columns: new[] { "UserId", "AspNetUserId", "Email", "Emri", "Mbiemri", "Username" },
                values: new object[,]
                {
                    { 1, "f2bb7622-23ac-4c5f-8d71-00032b281e37", "admin@template.com", "Administrator", "Template", "admin" },
                    { 2, "d2a7088f-a25e-4f3f-8488-b616eeaff928", "menaxher@template.com", "Menaxher", "Template", "menaxher" },
                    { 3, "9d6b2651-641d-4c85-9154-99761863fc65", "user@template.com", "User", "Template", "user" }
                });

            migrationBuilder.InsertData(
                table: "TeDhenatPerdoruesit",
                columns: new[] { "TeDhenatId", "Adresa", "NrKontaktit", "Qyteti", "Shteti", "UserId", "ZipKodi" },
                values: new object[,]
                {
                    { 1, "Prishtine", "044123456", "Prishtine", "Kosove", 1, 10000 },
                    { 2, "Prishtine", "044123456", "Prishtine", "Kosove", 2, 10000 },
                    { 3, "Prishtine", "044123456", "Prishtine", "Kosove", 3, 10000 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(table: "TeDhenatPerdoruesit", keyColumn: "TeDhenatId", keyValue: 1);
            migrationBuilder.DeleteData(table: "TeDhenatPerdoruesit", keyColumn: "TeDhenatId", keyValue: 2);
            migrationBuilder.DeleteData(table: "TeDhenatPerdoruesit", keyColumn: "TeDhenatId", keyValue: 3);

            migrationBuilder.DeleteData(table: "Perdoruesi", keyColumn: "UserId", keyValue: 1);
            migrationBuilder.DeleteData(table: "Perdoruesi", keyColumn: "UserId", keyValue: 2);
            migrationBuilder.DeleteData(table: "Perdoruesi", keyColumn: "UserId", keyValue: 3);

            migrationBuilder.DeleteData(table: "AspNetUserRoles", keyColumns: new[] { "RoleId", "UserId" }, keyValues: new object[] { "be4b8ef8-abf0-454c-852c-676cdab20e3b", "9d6b2651-641d-4c85-9154-99761863fc65" });
            migrationBuilder.DeleteData(table: "AspNetUserRoles", keyColumns: new[] { "RoleId", "UserId" }, keyValues: new object[] { "db3dd60d-a159-4f85-a9a5-d1444ee1013d", "d2a7088f-a25e-4f3f-8488-b616eeaff928" });
            migrationBuilder.DeleteData(table: "AspNetUserRoles", keyColumns: new[] { "RoleId", "UserId" }, keyValues: new object[] { "be4b8ef8-abf0-454c-852c-676cdab20e3b", "d2a7088f-a25e-4f3f-8488-b616eeaff928" });
            migrationBuilder.DeleteData(table: "AspNetUserRoles", keyColumns: new[] { "RoleId", "UserId" }, keyValues: new object[] { "0267d4fd-5bac-4552-9930-8e528b2fec1b", "f2bb7622-23ac-4c5f-8d71-00032b281e37" });
            migrationBuilder.DeleteData(table: "AspNetUserRoles", keyColumns: new[] { "RoleId", "UserId" }, keyValues: new object[] { "be4b8ef8-abf0-454c-852c-676cdab20e3b", "f2bb7622-23ac-4c5f-8d71-00032b281e37" });

            migrationBuilder.DeleteData(table: "AspNetUsers", keyColumn: "Id", keyValue: "9d6b2651-641d-4c85-9154-99761863fc65");
            migrationBuilder.DeleteData(table: "AspNetUsers", keyColumn: "Id", keyValue: "d2a7088f-a25e-4f3f-8488-b616eeaff928");
            migrationBuilder.DeleteData(table: "AspNetUsers", keyColumn: "Id", keyValue: "f2bb7622-23ac-4c5f-8d71-00032b281e37");

            migrationBuilder.DeleteData(table: "AspNetRoles", keyColumn: "Id", keyValue: "0267d4fd-5bac-4552-9930-8e528b2fec1b");
            migrationBuilder.DeleteData(table: "AspNetRoles", keyColumn: "Id", keyValue: "db3dd60d-a159-4f85-a9a5-d1444ee1013d");
            migrationBuilder.DeleteData(table: "AspNetRoles", keyColumn: "Id", keyValue: "be4b8ef8-abf0-454c-852c-676cdab20e3b");
        }
    }
}
