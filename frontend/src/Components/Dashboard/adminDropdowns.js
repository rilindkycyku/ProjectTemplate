import {
  faUsers,
  faChartLine,
  faShieldHalved,
  faServer,
  faDatabase,
  faGlobe,
  faFileInvoice,
  faFileInvoiceDollar,
  faUniversity,
} from "@fortawesome/free-solid-svg-icons";
import TabelaEPerdoruesve from "../users/TabelaEPerdoruesve";
import Statistika from "./Statistika";
import CilesimiSajtit from "./CilesimiSajtit";
import Gjurmimi from "../../Pages/Dashboard/Gjurmimi";
import Faturat from "../../Pages/Dashboard/Faturat";
import Bankat from "../../Pages/Dashboard/Bankat";
import Klientet from "../../Pages/Dashboard/Klientet";

/**
 * adminDropdowns — single source of truth for the Admin Console sidebar.
 *
 * Same idea as FinanCare's roleBasedDropdowns: a declarative tree of
 * categories → items, each gated by `roles`. AdminDashboard.jsx renders
 * this config instead of hardcoding buttons + RoleCheck wrappers per tab.
 *
 * To add a new admin tab: add an entry to the right category's `items`
 * (or a new category) — no JSX changes needed in AdminDashboard.jsx.
 *
 * Item shape:
 *   key        — unique tab id, used as activeTab value
 *   label      — sidebar button text
 *   icon       — FontAwesome icon for the sidebar button
 *   roles      — roles allowed to see/use this tab
 *   component  — React component rendered in the content area
 *   headerTitle — text shown in the content header bar
 */
export const adminDropdowns = [
  {
    key: "identity",
    label: "Identity & Access",
    icon: faShieldHalved,
    items: [
      {
        key: "users",
        label: "User Directory",
        icon: faUsers,
        roles: ["Admin"],
        component: TabelaEPerdoruesve,
        headerTitle: "User Directory Management",
      },
    ],
  },
  {
    key: "system",
    label: "System Operations",
    icon: faServer,
    items: [
      {
        key: "stats",
        label: "System Analytics",
        icon: faChartLine,
        roles: ["Admin", "Menaxher"],
        component: Statistika,
        headerTitle: "System Statistics & Health",
      },
      {
        key: "logs",
        label: "System Logs",
        icon: faDatabase,
        roles: ["Admin"],
        component: Gjurmimi,
        headerTitle: "System Tracking Logs",
      },
    ],
  },
  {
    key: "siteConfig",
    label: "Site Config",
    icon: faGlobe,
    items: [
      {
        key: "siteSettings",
        label: "Site Settings",
        icon: faGlobe,
        roles: ["Admin"],
        component: CilesimiSajtit,
        headerTitle: "Site Configuration",
      },
    ],
  },
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
      {
        key: "bankat",
        label: "Llogaritë Bankare",
        icon: faUniversity,
        roles: ["Admin", "Menaxher"],
        component: Bankat,
        headerTitle: "Llogaritë Bankare",
      },
      {
        key: "klientet",
        label: "Klientët",
        icon: faUsers,
        roles: ["Admin", "Menaxher"],
        component: Klientet,
        headerTitle: "Lista e Klientëve",
      },
    ],
  },
];
