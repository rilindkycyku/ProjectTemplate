# ProjectTemplate

## Rreth Projektit

> [!WARNING]
> **Kujdes:** Ky projekt është ende në zhvillim e sipër (under development). Arkitektura dhe kodet mund të ndryshojnë në çdo kohë dhe mund të ketë prezencë të 'bugs'.
> 
> *Ky projekt është ndërtuar duke u bazuar në arkitekturat e projekteve të mëparshme: **FinanCare** dhe **TechStore-Lab1**.*

Ky projekt eshte nje **Template i plote** per aplikacione Web te ndertuar me teknologjite moderne.

Ky projekt eshte i punuar ne:

- **React JS + Vite** - Frontend
- **ASP.NET Core** - Backend (WebAPI)
- **MSSQL** - Database
- **Tailwind CSS** - Stilizimi

## Konfigurimi

Ju mund ta startoni projektin në dy mënyra: duke përdorur **Docker** (më e lehta) ose **Manulisht** përmes Visual Studio.

### Opsioni 1: Përdorimi i Docker (Rekomandohet)

1. Në folderin kryesor të projektit, kopjoni file-in `.env.example` dhe emërtojeni `.env`.
2. Hapni terminalin në folderin kryesor dhe ekzekutoni komandën:
   ```bash
   docker compose up -d --build
   ```
   *(Kjo komandë do të ndërtojë dhe startojë automatikisht të tre shërbimet: databazën MSSQL, WebAPI-në dhe Frontend-in. Databaza do të migrohet dhe të dhënat fillestare do të shtohen vetë).*
3. Pasi të jenë startuar të gjitha kontejnerët, hapni shfletuesin tuaj dhe shkoni te:
   - **Frontend:** `http://localhost:3000`
   - **API (Swagger):** `http://localhost:5274/swagger`

   > **Shënim:** Fronendi tani është i kontejnerizuar dhe i servuar nga nginx. Nuk keni nevojë të ekzekutoni `npm run dev` kur përdorni Docker.

### Opsioni 2: Konfigurimi Manual (Pa Docker)

1. Së pari duhet të bëhet konfigurimi i Connection String në `WebAPI/WebAPI/appsettings.json` dhe duhet të ndërrohet emri i serverit me atë të serverit tuaj:

```json
"ConnectionStrings": {
  "Conn": "Server=EMRI_I_SERVERIT_TUAJ; Database=ProjectTemplateDB; Trusted_Connection=True; TrustServerCertificate=True"
}
```

2. Pastaj në **Visual Studio**, në **Package Manager Console** (me projektin **WebAPI** si Default Project), duhet të bëni run komandën:

```
EntityFrameworkCore\update-database
```

Kjo do të gjenerojë automatikisht Databasën dhe do të insertojë të dhënat bazike (rolet dhe përdoruesit fillestar).

3. Pastaj duhet të startoni **WebAPI** nga Visual Studio, dhe në **VS Code / Terminal** të hapni folderin `frontend` dhe të bëni run këto komanda:

```
- npm install - Instalon paketat e nevojshme (vetëm herën e parë)
- npm run dev - Starton serverin e development-it
```

Pasi qe te behet konfigurimi, ju mund te kyqeni me keto te dhena:

| **Email** | **Password** | **Aksesi** |
| --- | --- | --- |
| admin@template.com | Admin1@ | Administrator (Akses i Plote) |
| menaxher@template.com | Menaxher1@ | Menaxher (Akses i Pjesshem) |
| user@template.com | User1@ | Perdorues (Akses i thjesht) |

## Struktura e Projektit

```
ProjectTemplate/
├── WebAPI/          → ASP.NET Core Backend
│   └── WebAPI/
│       ├── Controllers/
│       ├── Data/
│       ├── Migrations/
│       └── appsettings.json
└── frontend/        → React + Vite Frontend
    └── src/
        ├── Components/
        ├── Context/
        ├── Pages/
        └── api/
```

## Teknologjite e Perdorura

| Teknologjia | Versioni | Perdorimi |
| --- | --- | --- |
| React | 18+ | UI Framework |
| Vite | 5+ | Build Tool |
| Tailwind CSS | 4+ | Stilizimi |
| ASP.NET Core | .NET 6 | REST API |
| Entity Framework Core | 7 | ORM / Migrations |
| SQL Server | - | Database |
| JWT | - | Autentikimi |
| FontAwesome | 6 | Ikonat |

## Pamje nga Projekti (Screenshots)

### Ballina (Home Page)
![Home Page](GitHubImage/1Home.png)

### Rreth Nesh
![About Us](GitHubImage/2AboutUs.png)

### Kontakti
![Contact](GitHubImage/3Contact.png)

### Paneli i Përdoruesit (Dashboard)
![Dashboard Profile](GitHubImage/4Dashboard.png)

### Paneli i Administratorit (Admin Console)
![Admin Console 1](GitHubImage/5Dashboard.png)
![Admin Console 2](GitHubImage/6Dashboard.png)

### Web API (Swagger UI)
![Swagger API](GitHubImage/1API.png)
