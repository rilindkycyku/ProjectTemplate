# CLAUDE.md

Guidance for AI assistants working in this repository. Read this before touching code.

## What this is

**ProjectTemplate** — a starting point, not a product. A full-stack scaffold (ASP.NET Core 6 REST
API + React 19/Vite SPA + SQL Server) with authentication, JWT, role-based access, an admin console,
audit logging, site settings, and a set of reusable UI components already wired together.

The point is that a new business application starts by **copying this and adding modules**, not by
setting up auth again. The `Fatura` / `Banka` / `Klienti` modules that ship with it are *worked
examples* of the pattern, not features anybody depends on. `RentWheels` in this same account is what
this template looks like once it has been built out.

That framing should decide most of your judgement calls: **keep it generic, keep it a pattern**. A
change that makes the template better at one specific domain usually makes it worse.

**`README.md` is a 419-line developer guide** — component props, role tables, module checklists,
seeded credentials. Read it before writing frontend code; it documents `CustomTable`,
`CustomModal`, `CustomSelect`, `RoleGuard`, `adminDropdowns.js` and the "add a new module" checklist
in detail, and this file does not repeat it.

Identifiers and UI copy are **Albanian**; framework-facing code is English.

## Commands

```bash
# Docker (the whole stack: SQL Server + API + nginx-served frontend)
make up            # docker compose up -d --build
make down
make logs

# Frontend alone
cd frontend
npm install
npm run dev        # node scripts/update-env.js && vite --host
npm run build      # regenerates .env, then vite build
npm run lint       # eslint .

# Backend alone (Visual Studio / dotnet CLI)
dotnet run --project WebAPI/WebAPI            # https://*:7285, http://*:5274, Swagger at /swagger
dotnet ef database update --project WebAPI/WebAPI
```

There is **no test suite on either side** — no xUnit project, no vitest. Verification is manual:
build both halves, exercise the affected screens, and say what you checked in the commit body.

Copy `.env.example` to `.env` at the repository root before `make up`; it supplies `DB_SA_PASSWORD`
and `JWT_SECRET` to compose.

## Layout

```
WebAPI/WebAPI/           ASP.NET Core 6 API
  Program.cs             Everything is configured here — DI, JWT, CORS, Swagger, auto-migrate
  Controllers/           AuthenticateController, PerdoruesiController, AdminLogsController,
                         SiteSettingsController, FaturaController, BankaController, KlientiController
  Models/                EF entities (Albanian names)
  Data/ApplicationDbContext.cs
  Migrations/            EF Core migrations — including the data seeds
  Auth/                  LogInModel, RegisterModel, AuthResults
  Configurations/JwtConfig.cs
  Services/              IAdminLogService + AdminLogService

frontend/
  src/App.jsx            Routes (not lazy)
  src/api/apiClient.js   The single axios instance — all requests go through it
  src/Context/           AuthContext, SiteSettingsContext
  src/Components/
    layout/              CustomTable, CustomModal, CustomSelect, NavBar, Footer, Mesazhi,
                         ScrollToTop, navLinks.js
    KontrolliAksesit/    ProtectedRoute, RoleCheck, RoleGuard
    Dashboard/           AdminDashboard, adminDropdowns.js, Statistika, CilesimiSajtit
    Fatura/, users/, ErrorPages/
  src/Pages/             Public/ (Home, AboutUs, ContactUs), Auth/, Dashboard/
  scripts/update-env.js  Writes frontend/.env with the machine's LAN IP

docker-compose.yml       db (SQL Server 2022) + api + frontend (nginx)
Makefile                 up / down / logs / dev
```

## Architecture rules

### 1. All frontend HTTP goes through `api/apiClient.js`

One axios instance with two interceptors that must not be bypassed:

- **Request**: attaches `Authorization: Bearer <token>` from `localStorage`.
- **Response**: on **401**, clears `token` and `id` and redirects to `/login`.

Never call `axios` or `fetch` directly in a component — you lose the token and the session-expiry
handling. `baseURL` is `import.meta.env.VITE_API_BASE_URL`, falling back to `/api` (which is what
the nginx container serves).

### 2. Auth is a JWT in `localStorage`, decoded on the client

`AuthContext` reads `token` from `localStorage`, decodes it with `jwt-decode`, checks `exp` itself,
and logs out if expired. `login(token)` also stores `decoded.id` as `id`.

Roles live in the token's `role` claim and are `Admin` / `Menaxher` / `User`. **Client-side role
checks are UI only** — `RoleGuard` and `RoleCheck` decide what is *rendered*. Every endpoint must
still be protected server-side with `[Authorize(Roles = ...)]`. Treat a missing attribute on a new
controller action as a security bug, not a style issue.

### 3. The admin console is configured, not hand-written

`Components/Dashboard/adminDropdowns.js` is the single source of truth for the admin sidebar: a
declarative tree of categories → items, each carrying `key`, `label`, `icon`, `roles`, `component`
and `headerTitle`. `AdminDashboard.jsx` renders that config.

**Adding an admin tab is an entry in this file** — no JSX changes, no new `RoleCheck` wrapper.

### 4. Lists use `CustomTable`; dialogs use `CustomModal`; selects use `CustomSelect`

`CustomTable` handles sort, search, date-range filter, pagination, Excel export and the
Edit/Delete/Details buttons. It has two modes — auto-columns from `Object.keys(data[0])`, or
explicit `columns` with per-column `render`. Its props are Albanian (`kaButona`, `mosShfaqID`,
`funksionButonEdit`, `funksionButonFshij`, `funksionShfaqDetajet`, `dateField`). The README has the
full prop table with examples.

Don't hand-roll a table, a modal, or a `<select>` for a new module. That's the whole point of the
template.

### 5. Schema changes are EF Core migrations, and seeds live in them

The database is created and populated by migrations — including roles and the starter users. There
is a migration named `MoveSeedToMigration` precisely because seeding belongs there rather than in
startup code.

`Program.cs` runs `db.Database.Migrate()` at startup, retrying five times with a 5-second sleep, so
the API survives starting before SQL Server is ready in Docker.

Rules that follow: **never edit a migration that has already been applied** — add the next one.
Never hand-edit `ApplicationDbContextModelSnapshot.cs`; let `dotnet ef migrations add` write it.

### 6. Admin actions are logged

`IAdminLogService.LogAsync(userId, veprimi, entiteti, entitetiId, detaje)` writes an `AdminLogs`
row stamped `DateTime.UtcNow`. It resolves the acting user by **email**, and throws if no matching
`Perdoruesi` exists.

Mutating admin endpoints are expected to log. When you add one, log it — the Gjurmimi (audit) tab
exists to show these, and a gap in it is invisible until someone needs it.

### 7. Site settings come from the database

`SiteSettingsController` + `SiteSettingsContext` let the site name, logo and similar be edited from
the admin console rather than hardcoded. Uploaded logos are served from `wwwroot/` via
`app.UseStaticFiles()`.

## Adding a new module

The README has the full checklist. In outline: EF model → `ApplicationDbContext` → migration →
controller (with `[Authorize(Roles = …)]` and audit logging) → a `Pages/Dashboard/` page built on
`CustomTable` → an entry in `adminDropdowns.js`. Frontend and backend naming stays Albanian.

## Gotchas

- **`make dev` is broken.** The Makefile runs `node updateEnv.js`, but the script is
  `frontend/scripts/update-env.js` and there is no `updateEnv.js` at the root. Use
  `npm run dev --prefix frontend` (which runs the script itself), or fix the Makefile.
- **`frontend/.env` is generated, not authored.** `scripts/update-env.js` overwrites it on every
  `dev` and `build` with the machine's current LAN IP:
  `VITE_API_BASE_URL=http://<ip>:5274/api`. Hand edits are lost on the next run, and the IP changes
  with the network. It hardcodes port **5274** (the `dotnet run` HTTP port), which is *not* the
  Docker port.
- **Port numbers disagree across the repo.** `docker-compose.yml` publishes the API on **5275** and
  the frontend on **3200**; the README tells you to open **5274** and **3000**; `update-env.js`
  writes **5274**. Check `docker-compose.yml` for what is actually running before debugging a
  "connection refused".
- **The JWT secret is committed** — the same literal string sits in `appsettings.json` and
  `.env.example`. That is acceptable for a template but is a live vulnerability the moment anything
  real is deployed. Any project copied from here must replace it, and `.env` must stay out of git.
- **JWT validation is loosened for development** in `Program.cs`: `ValidateIssuer`,
  `ValidateAudience` and `RequireExpirationTime` are all `false`, with comments saying so. CORS is
  `AllowAnyOrigin` + `AllowAnyHeader` + `AllowAnyMethod`, and `UseHttpsRedirection` is commented out
  to allow HTTP LAN testing. Tighten all of these before any real deployment.
- `builder.Services.AddControllers()` is called **three times** in `Program.cs` with different JSON
  options. It works, but if you are changing serializer settings, consolidate rather than adding a
  fourth call.
- The `.csproj` targets **net6.0** while referencing EF Core 7 packages, and has a Windows-only
  pre-build `taskkill /F /IM WebAPI.exe` target to dodge file locks. Both are intentional; don't
  "fix" the taskkill on a non-Windows machine — it is already conditioned on `$(OS)`.
- Frontend routes in `App.jsx` are **not** lazy-loaded, unlike the author's other React projects.
