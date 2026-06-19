# ProjectTemplate

## Rreth Projektit

> [!WARNING]
> **Kujdes:** Arkitektura dhe kodet mund të ndryshojnë në çdo kohë dhe mund të ketë prezencë të 'bugs'.
> 
> *Ky projekt është ndërtuar duke u bazuar në arkitekturat e projekteve të mëparshme: **FinanCare** dhe **TechStore-Lab1**.*

Ky projekt është një **Template i plotë** për aplikacione Web të ndërtuar me teknologjitë moderne. Ai ofron një strukturë të gatshme, komponentë të ripërdorshëm, sistem autentikimi dhe menaxhim rolesh, të vlefshme për çdo lloj aplikacioni modern.

## Teknologjitë e Përdorura

| Teknologjia | Versioni | Përdorimi |
| --- | --- | --- |
| React | 19 | UI Framework |
| Vite | 5+ | Build Tool |
| Tailwind CSS | 4+ | Stilizimi |
| ASP.NET Core | .NET 6+ | REST API Backend |
| Entity Framework Core | 7+ | ORM / Migrations |
| SQL Server | - | Database |
| JWT | - | Autentikimi dhe Siguria |
| FontAwesome | 6 | Ikonat |

## Konfigurimi

Ju mund ta startoni projektin në dy mënyra: duke përdorur **Docker** (më e lehta) ose **Manulisht** përmes Visual Studio dhe terminalit.

### Opsioni 1: Përdorimi i Docker (Rekomandohet)

1. Në folderin kryesor të projektit, kopjoni file-in `.env.example` dhe emërtojeni `.env` (brenda folderit `frontend`).
2. Hapni terminalin në folderin kryesor dhe ekzekutoni komandën:
   ```bash
   docker compose up -d --build
   ```
   *(Kjo komandë do të ndërtojë dhe startojë automatikisht të tre shërbimet: databazën MSSQL, WebAPI-në dhe Frontend-in. Databaza do të migrohet dhe të dhënat fillestare do të shtohen vetë).*
3. Pasi të jenë startuar të gjitha kontejnerët, hapni shfletuesin tuaj dhe shkoni te:
   - **Frontend:** `http://localhost:3000`
   - **API (Swagger):** `http://localhost:5274/swagger`

   > **Shënim:** Frontend-i tani është i kontejnerizuar dhe i servuar nga nginx. Nuk keni nevojë të ekzekutoni `npm run dev` kur përdorni Docker.

### Opsioni 2: Konfigurimi Manual (Pa Docker)

1. Së pari duhet të bëhet konfigurimi i Connection String në `WebAPI/WebAPI/appsettings.json` dhe duhet të ndërrohet emri i serverit me atë të serverit tuaj lokal:

```json
"ConnectionStrings": {
  "Conn": "Server=EMRI_I_SERVERIT_TUAJ; Database=ProjectTemplateDB; Trusted_Connection=True; TrustServerCertificate=True"
}
```

2. Në **Visual Studio**, hapni **Package Manager Console** (me projektin **WebAPI** si Default Project), dhe ekzekutoni:
```powershell
EntityFrameworkCore\update-database
```
*(Kjo do të gjenerojë automatikisht databazën dhe do të insertojë të dhënat bazike si rolet dhe përdoruesit fillestarë).*

3. Startoni **WebAPI** nga Visual Studio.
4. Hapni folderin `frontend` në **VS Code / Terminal** dhe ekzekutoni këto komanda për të nisur ndërfaqen:
```bash
npm install      # Instalon paketat e nevojshme (vetëm herën e parë)
npm run dev      # Starton serverin e development-it (Vite + HMR)
```

## Të Dhënat e Kyçjes (Login) dhe Rolet

Pasi të startoni aplikacionin, mund të kyçeni me këto kredenciale fillestare:

| **Email** | **Password** | **Roli** | **Aksesi dhe Lejet** |
| --- | --- | --- | --- |
| admin@template.com | Admin1@ | `Admin` | **I plotë:** Sheh të gjitha tabet në Admin Console (Users, Logs, Site Settings, Faturat, Bankat, Klientët etj.) |
| menaxher@template.com | Menaxher1@ | `Menaxher` | **I pjesshëm:** Sheh vetëm modulet operative (Faturat, Bankat, Klientët, Statistika). Nuk sheh Users/Logs/Site Settings. |
| user@template.com | User1@ | `User` | **I thjeshtë:** Vetëm `/Dashboard` (profili personal). Nuk ka akses në Admin Console. |

> **Shënim:** Roli i ruajtur në JWT (`user.role`) është `Admin` / `Menaxher` / `User`. Cilat tabe shfaqen për cilin rol kontrollohet përmes `adminDropdowns.js`.

## Struktura e Projektit

```text
ProjectTemplate/
├── WebAPI/          → ASP.NET Core Backend
│   └── WebAPI/
│       ├── Controllers/
│       ├── Data/
│       ├── Migrations/
│       └── appsettings.json
└── frontend/        → React + Vite Frontend
    └── src/
        ├── Components/   → Komponentët e ripërdorshëm (Table, Modal, Select etj.)
        ├── Context/      → Context API për Auth dhe Settings
        ├── Pages/        → Faqet kryesore të aplikacionit
        └── api/          → Axios apiClient dhe shërbimet e backend-it
```

---

## Udhëzues për Frontend (React + Vite + Tailwind)

Përveç setup-it standard, ky template përfshin komponentë të ripërdorshëm, sistemin e roleve dhe trajtimin e gabimeve që janë "building blocks" kryesore për çdo modul të ri.

### Struktura e Komponentëve të Ripërdorshëm

Komponentët e bazës gjenden në `src/Components/layout/` dhe janë projektuar për t'u përdorur në çdo modul të ri (Klientë, Banka, Fatura, etc.) pa dashur të rishkruhet stilizimi nga e para.

#### 1. CustomTable — `src/Components/layout/CustomTable.jsx`

Tabelë me sort, search, filtrim sipas datës, paginim, eksport në Excel dhe butona veprimi (Edit/Delete/Details).

Ka **dy mënyra përdorimi**:

**a) Mënyra "auto-columns" (e thjeshtë)** — vetëm jepi `data` (array objektesh të rrafshëta) dhe kolonat gjenerohen automatikisht nga `Object.keys()`:

```jsx
<CustomTable
  data={klientet}                 // array of { ID, Emri, Email, ... }
  title="Klientët"
  icon={faUsers}
  kaButona                        // shfaq kolonën Actions
  mosShfaqID                      // fshih kolonën "ID" nga headers
  funksionButonShto={() => setShowAddModal(true)}
  funksionButonEdit={(id) => editoKlientin(id)}
  funksionButonFshij={(id) => fshijKlientin(id)}
  funksionShfaqDetajet={(id) => shfaqDetajet(id)}
  dateField="DataRegjistrimit"   // aktivizon filtrin Date Range
/>
```

**b) Mënyra "explicit columns" (e avancuar)** — kur do kontroll të plotë (render i personalizuar i një kolone, badges, formatime):

```jsx
<CustomTable
  data={faturat}
  title="Faturat"
  columns={[
    { header: "Nr. Faturës", accessor: "nrFatures" },
    { header: "Klienti", accessor: "klientiEmri" },
    {
      header: "Statusi",
      accessor: "statusi",
      render: (row) => (
        <span className={row.statusi === "Paguar" ? "text-green-400" : "text-amber-400"}>
          {row.statusi}
        </span>
      ),
    },
  ]}
  kaButona
  funksionShfaqDetajet={(id) => navigate(`/fatura/${id}`)}
/>
```

Props kryesore:

| Prop | Tipi | Default | Përshkrim |
|---|---|---|---|
| `data` | array | `[]` | Të dhënat (kërkohet) |
| `columns` | array | — | Kolona explicite `{ header, accessor, render?, className?, tdClassName? }` |
| `kaButona` | bool | `false` | Shfaq kolonën e veprimeve |
| `mosShfaqID` | bool | `false` | Fshih kolonën "ID" (vetëm në auto-mode) |
| `funksionButonShto` | fn | — | Handler për butonin "Add New" në header |
| `funksionButonEdit` / `funksionButonFshij` / `funksionShfaqDetajet` | fn(id) | — | Handlers për butonat e rreshtit |
| `searchable` / `sortable` / `exportable` | bool | `true` | Aktivizo/çaktivizo veçoritë |
| `dateField` | string | — | Emri i fushës për filtrin Date Range |
| `hiddenColumns` | array | `[]` | Accessor-ët që nuk duhen shfaqur |
| `itemsPerPage` | number | `10` | Madhësia fillestare e faqes |

> **Shënim:** Butonat e veprimit (`funksionButonEdit`, etj.) presin që çdo rresht të ketë fushën `item.ID`.

#### 2. CustomModal — `src/Components/layout/CustomModal.jsx`

Modal i bazuar në React Portal (renderon direkt në `document.body`, kështu shmang problemet e stacking-context me `backdrop-filter`/`transform`).

```jsx
<CustomModal
  show={showModal}
  onHide={() => setShowModal(false)}
  title="Shto Klient të Ri"
  size="lg"                 // 'sm' | 'md' | 'lg' | 'xl'
  footer={
    <>
      <button onClick={() => setShowModal(false)}>Anulo</button>
      <button className="btn-premium" onClick={ruajKlientin}>Ruaj</button>
    </>
  }
>
  <FormForKlienti />
</CustomModal>
```

Props: `show`, `onHide`, `title`, `children`, `footer`, `size` (default `md`), `closeButton` (default `true`).

#### 3. CustomSelect — `src/Components/layout/CustomSelect.jsx`

Wrapper rreth `react-select` me stilizim të errët (dark theme) që përputhet me Tailwind tokens. Mbështet edhe `isMulti`, edhe `isCreatable`.

```jsx
<CustomSelect
  options={[{ value: 1, label: "Tiranë" }, { value: 2, label: "Prishtinë" }]}
  value={qyteti}
  onChange={(opt) => setQyteti(opt)}
  placeholder="Zgjidh qytetin..."
  isMulti={false}
  isCreatable={false}
/>
```

Çdo prop ekstra (`isClearable`, `noOptionsMessage`, etj.) kalohet direkt te `react-select`/`CreatableSelect` përmes `{...props}`.

---

### Sistemi i Roleve (Kontrolli i Aksesit)

Rolet vijnë nga JWT token (`user.role`, mund të jetë string ose array) dhe menaxhohen nga `src/Context/AuthContext.jsx`. Ka **tre mënyra** për të kontrolluar aksesin, sipas nevojës:

#### a) `ProtectedRoute` — mbron një rrugë (route) të tërë

```jsx
// shembull: si mund të kufizoni një route të re vetëm për disa role
<Route
  path="/Furnitoret"
  element={
    <ProtectedRoute roles={["Admin", "Menaxher"]}>
      <Furnitoret />
    </ProtectedRoute>
  }
/>
```

- Nëse nuk je i kyçur → redirect te `/login`.
- Nëse je i kyçur por nuk ke rolin e duhur → redirect te `/403`.
- Nëse `roles` nuk jepet, vetëm kontrollon autentikimin (jo rolin).

> **Shënim mbi `/admin-dashboard`:** në `App.jsx` aktual, `ProtectedRoute` për këtë rrugë **nuk** merr `roles` — kontrollon vetëm autentikimin. Filtrimi sipas rolit (cilat tabe shfaqen) ndodh brenda `AdminDashboard.jsx`, përmes `adminDropdowns.js` (shih seksionin përkatës më poshtë). Nëse doni të bllokoni krejt aksesin në `/admin-dashboard` për rolin `User`, shtoni `roles={["Admin", "Menaxher"]}` te ky route.

#### b) `RoleGuard` — mbron një faqe nga brenda (kur nuk do një wrapper route)

```jsx
function Klientet() {
  return (
    <>
      <RoleGuard roletELejuara={["Admin", "Menaxher"]} />
      {/* pjesa tjeter e faqes... */}
    </>
  );
}
```

Renderon `null`, por bën redirect te `/login` ose `/403` brenda një `useEffect`.

#### c) `RoleCheck` — fsheh/shfaq pjesë të UI-t (jo një faqe e tërë)

```jsx
<RoleCheck roletELejuara={["Admin"]} fallback={<p>Nuk keni akses.</p>}>
  <button onClick={fshijPerdoruesin}>Fshi Përdoruesin</button>
</RoleCheck>
```

E dobishme për të fshehur butona/seksione (p.sh. "Fshi", "Editoj Rolet") nga roli `User` ose `Menaxher`, pa pasur nevojë të mbrosh të gjithë faqen.

---

### `adminDropdowns.js` — Konfigurimi i Admin Console

Sidebar-i i `AdminDashboard.jsx` **nuk** ka butona/kategori të hardcoduara në JSX. Në vend të kësaj, gjithçka vjen nga një konfigurim i vetëm: `src/Components/Dashboard/adminDropdowns.js` — i njëjti ide si `roleBasedDropdowns.jsx` nga FinanCare (grupe → items, secili i filtruar sipas roleve).

```js
// src/Components/Dashboard/adminDropdowns.js
export const adminDropdowns = [
  {
    key: "modules",
    label: "Modules",
    icon: faFileInvoice,
    items: [
      {
        key: "faturat",
        label: "Faturat",
        icon: faFileInvoiceDollar,
        roles: ["Admin", "Menaxher"],
        component: Faturat,
        headerTitle: "Menaxhimi i Faturave",
      },
      // ...
    ],
  },
];
```

`AdminDashboard.jsx` filtron këtë listë sipas roleve të përdoruesit (`useMemo` mbi `user.role`), gjeneron sidebar-in (kategori + butona) dhe e ren­deron `component`-in e `item`-it aktiv te `activeTab`, me `headerTitle` si titull i header-it të përmbajtjes.

**Si të shtoni një tab të ri në Admin Console:**

1. Hapni `src/Components/Dashboard/adminDropdowns.js`.
2. Importoni komponentin e ri (p.sh. `import Furnitoret from "../../Pages/Dashboard/Furnitoret";`).
3. Shtoni një `item` të ri brenda kategorisë ekzistuese (ose krijoni një kategori të re me `key`, `label`, `icon`, `items: []`):

```js
{
  key: "furnitoret",
  label: "Furnitorët",
  icon: faTruck,
  roles: ["Admin", "Menaxher"],
  component: Furnitoret,
  headerTitle: "Lista e Furnitorëve",
}
```

4. **S'ka nevojë të prekni `AdminDashboard.jsx`** — tab-i i ri shfaqet automatikisht në sidebar për rolet e specifikuara, dhe `component` renderohet kur klikohet.

> **Shënim:** Vetëm `AdminDashboard.jsx` (konsola e adminit) përdor këtë pattern. NavBar-i publik (`navLinks.js`) mbetet i thjeshtë (lista e sheshtë) — shih shënimin më poshtë te "Si të Shtoni një Modul të Ri".

---

### Moduli i Faturës (Fatura)

Moduli `src/Components/Fatura/` gjeneron dhe shfaq faturat si "A4 preview" në browser dhe i eksporton në PDF.

**Komponentët:**

| File | Roli |
|---|---|
| `Fatura.jsx` | Komponenti kryesor — merr të dhënat nga API, ndan artikujt në faqe, gjeneron PDF |
| `HeaderFatura.jsx` | Header i faturës (logo, të dhënat e kompanisë nga `SiteSettingsContext`) |
| `DetajeFatura.jsx` | Tabela e artikujve/produkteve të faturës (një faqe e vetme) |
| `FooterFatura.jsx` | Footer me të dhënat bankare (nga `Banka`) dhe barkodin |

**Përdorimi** (zakonisht brenda një modali ose route të dedikuar):

```jsx
import Fatura from "../../Components/Fatura/Fatura";

function FaturaViewer({ faturaId, onClose }) {
  return <Fatura faturaId={faturaId} mbyllFaturen={onClose} />;
}
```

Props:
- `faturaId` — ID e faturës që do shfaqet/ngarkohet (kërkohet)
- `mbyllFaturen` — callback kur përdoruesi mbyll viewer-in (ose pasi shkarkon PDF-në)

**Si funksionon nga brenda:**
1. Fetch paralel: `GET /api/Fatura/ShfaqFaturen/:id` (fatura + artikujt) dhe `GET /api/Banka/ShfaqBankat` (llogaritë bankare për footer).
2. Të dhënat e kompanisë (logo, emri, adresa) vijnë nga `useSiteSettings()`.
3. Faturat me shumë artikuj ndahen automatikisht në disa faqe A4 (24 artikuj/faqe, max 14 në faqen e fundit përpara se footer-i të kalojë në faqe të re).
4. Butoni "Ruaj Faturën" gjeneron PDF me `@react-pdf/renderer` dhe e shkarkon direkt nga browseri (`pdf().toBlob()` + `URL.createObjectURL`).

---

### `ErrorBoundary` — Trajtimi Global i Gabimeve

`src/Components/ErrorPages/ErrorBoundary.jsx` është një **class component** (kërkohet nga React — error boundaries nuk mund të jenë function components) që mbështjell krejt aplikacionin te `src/main.jsx`:

```jsx
// src/main.jsx
<StrictMode>
  <ErrorBoundary>
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <SiteSettingsProvider>
            <App />
          </SiteSettingsProvider>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  </ErrorBoundary>
</StrictMode>
```

Nëse ndonjë komponent hedh një gabim gjatë render-it (p.sh. `undefined.map(...)`, përgjigje API e papritur, etj.), `ErrorBoundary` e kap dhe shfaq një faqe fallback ("Ndodhi një gabim i papritur") në vend të një ekrani të bardhë bosh.

---

### Si të Shtoni një Modul të Ri (Checklist)

1. Krijo një folder në `src/Components/<EmriModulit>/` me komponentin kryesor + `Styles/` nëse nevojitet CSS shtesë.
2. Krijo faqen përkatëse në `src/Pages/Dashboard/<EmriModulit>.jsx` që përdor `CustomTable` për listën.
3. Përdor `CustomModal` për formularët Add/Edit dhe `CustomSelect` për dropdown-et brenda tyre.
4. **Nëse moduli shfaqet brenda Admin Console** (si Faturat/Bankat/Klientët): shtoje si `item` te `adminDropdowns.js` (shih seksionin më lart) — jo si route e veçantë.
   **Nëse duhet route e veçantë jashtë admin console**: mbroje në `App.jsx` me `<ProtectedRoute roles={[...]}>`, ose përdor `RoleGuard`/`RoleCheck` brenda faqes.
5. Shto endpoint-et përkatëse në `src/api/apiClient.js` (instance Axios me JWT interceptors të gatshme).
6. Nëse moduli ka eksport PDF (si Fatura), ndaj logjikën në Header/Detaje/Footer për ripërdorim.

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

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

---

## Të Drejtat e Autorit (Copyright & License)

Ky projekt është pronë intelektuale e **Rilind Kyçyku**. Nuk lejohet përdorimi, kopjimi, modifikimi apo shpërndarja e këtij kodi pa pëlqimin paraprak dhe miratimin me shkrim nga autori. Çdo përdorim i paautorizuar është rreptësisht i ndaluar.
