import { faHome, faInfoCircle, faEnvelope, faTableColumns } from "@fortawesome/free-solid-svg-icons";

/**
 * Defines all nav links in one place.
 * `requiresAuth: true` — only show when logged in
 * `roles` — only show when user has one of these roles (omit = all roles)
 */
export const navLinks = [
    { to: "/",          label: "Home",      icon: faHome,         requiresAuth: false },
    { to: "/AboutUs",   label: "About",     icon: faInfoCircle,   requiresAuth: false },
    { to: "/ContactUs", label: "Contact",   icon: faEnvelope,     requiresAuth: false },
    { to: "/Dashboard", label: "Dashboard", icon: faTableColumns, requiresAuth: true  },
];
