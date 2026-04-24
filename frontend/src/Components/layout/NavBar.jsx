import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../Context/AuthContext";
import { useSiteSettings } from "../../Context/SiteSettingsContext";
import { navLinks } from "./navLinks";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const NavBar = () => {
    const { token, user, logout } = useAuth();
    const { settings } = useSiteSettings();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    // Filter links based on auth state
    const visibleLinks = navLinks.filter(link => !link.requiresAuth || token);

    const logoSrc = settings?.logo
        ? `/img/web/${settings.logo}`
        : "/img/web/PaLogo.png";

    // Shared desktop link class
    const desktopLinkClass = (path) =>
        `block text-text-muted font-medium text-[0.9rem] px-3.5 py-2 rounded-lg transition-all duration-200 hover:text-white hover:bg-white/5 ${isActive(path) ? "text-white bg-white/5" : ""}`;

    // Shared mobile link class
    const mobileLinkClass = "text-text-muted text-[1.05rem] font-medium px-4 py-3.5 rounded-xl flex items-center gap-3 w-full transition-colors hover:text-white hover:bg-white/5";

    return (
        <>
            <nav className={`sticky top-0 z-[1000] bg-[rgba(7,11,24,0.8)] backdrop-blur-[20px] border-b border-white/5 h-[72px] flex items-center transition-all duration-300 ${scrolled ? "bg-[rgba(7,11,24,0.96)] shadow-[0_4px_30px_rgba(0,0,0,0.4)]" : ""}`}>
                <div className="w-full max-w-[1400px] mx-auto px-8 flex justify-between items-center gap-8">

                    {/* Brand / Logo */}
                    <Link to="/" className="font-display text-[1.35rem] font-extrabold text-white no-underline tracking-[-0.04em] flex items-center gap-2 shrink-0">
                        {logoSrc ? (
                            <img src={logoSrc} alt={settings?.siteEmri || "Logo"} className="h-9 w-auto object-contain" />
                        ) : (
                            <>
                                {settings?.siteEmri?.split(" ")[0] || "Project"}
                                <span className="bg-gradient-to-br from-primary-light to-accent-light bg-clip-text text-transparent">
                                    {settings?.siteEmri?.split(" ").slice(1).join(" ") || "Template"}
                                </span>
                            </>
                        )}
                    </Link>

                    {/* Desktop Nav Links */}
                    <ul className="hidden md:flex gap-1 m-0 p-0 list-none">
                        {visibleLinks.map(link => (
                            <li key={link.to}>
                                <Link to={link.to} className={desktopLinkClass(link.to)}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3 shrink-0">
                        {token ? (
                            <div className="flex items-center gap-4 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                                <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-[0.75rem] text-white font-bold">
                                    {(user?.unique_name || "U")[0].toUpperCase()}
                                </div>
                                <span className="text-white font-medium text-[0.88rem]">
                                    {user?.unique_name || "Profile"}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-transparent border-none text-red-400 cursor-pointer font-semibold text-[0.82rem] p-0 flex items-center gap-1.5 transition-all duration-200 hover:text-red-300"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/LogIn" className="text-text-muted font-medium text-[0.9rem] px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 hover:text-white hover:bg-white/5">
                                    <FontAwesomeIcon icon={faSignInAlt} /> Login
                                </Link>
                                <Link to="/SignUp" className="btn-premium !py-2 !px-5 !text-[0.875rem]">
                                    <FontAwesomeIcon icon={faUserPlus} /> Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Hamburger */}
                    <button
                        className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-2 rounded-lg transition-colors duration-200 hover:bg-white/5"
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-[22px] h-[2px] bg-text-muted rounded-[2px] transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                        <span className={`block w-[22px] h-[2px] bg-text-muted rounded-[2px] transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
                        <span className={`block w-[22px] h-[2px] bg-text-muted rounded-[2px] transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-x-0 top-[72px] bottom-0 bg-[rgba(7,11,24,0.97)] backdrop-blur-xl z-[999] p-8 flex flex-col gap-2 border-t border-white/5 transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>

                {/* Mobile Nav Links — single source, no duplication */}
                {visibleLinks.map(link => (
                    <Link key={link.to} to={link.to} className={mobileLinkClass}>
                        <FontAwesomeIcon icon={link.icon} /> {link.label}
                    </Link>
                ))}

                <div className="h-px bg-white/5 my-3" />

                {token ? (
                    <button onClick={handleLogout} className={`${mobileLinkClass} cursor-pointer bg-transparent border-none text-left`}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                ) : (
                    <>
                        <Link to="/LogIn" className={mobileLinkClass}>
                            <FontAwesomeIcon icon={faSignInAlt} /> Login
                        </Link>
                        <Link to="/SignUp" className={mobileLinkClass}>
                            <FontAwesomeIcon icon={faUserPlus} /> Sign Up
                        </Link>
                    </>
                )}
            </div>
        </>
    );
};

export default NavBar;
