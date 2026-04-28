import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faBolt, faCopyright } from "@fortawesome/free-solid-svg-icons";
import { useSiteSettings } from "../../Context/SiteSettingsContext";

// Logo will be looked for on the frontend server relative to root

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { settings } = useSiteSettings();

    const logoSrc = (settings?.logo)
        ? `/img/web/${settings.logo}`
        : null;

    const socialLinks = [
        { href: settings?.facebook, icon: faFacebook, label: "Facebook", hoverClass: "hover:bg-primary hover:text-white" },
        { href: settings?.instagram, icon: faInstagram, label: "Instagram", hoverClass: "hover:bg-secondary hover:text-white" },
        { href: settings?.twitter, icon: faTwitter, label: "Twitter", hoverClass: "hover:bg-[#1DA1F2] hover:text-white" },
        { href: settings?.gitHub, icon: faGithub, label: "GitHub", hoverClass: "hover:bg-white hover:text-black" },
        { href: settings?.linkedIn, icon: faLinkedin, label: "LinkedIn", hoverClass: "hover:bg-[#0A66C2] hover:text-white" },
    ].filter(s => s.href && s.href !== "#" || s.href === "#"); // show all, just use what's set

    return (
        <footer className="bg-bg-darker border-t border-white/5 pt-12 md:pt-16 pb-8 relative z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary-light/30 before:to-transparent">
            <div className="max-w-[1200px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.5fr] gap-10 md:gap-12 pb-12">

                {/* Brand */}
                <div className="flex flex-col gap-5">
                    <Link to="/" className="font-display text-[1.35rem] font-extrabold text-white no-underline tracking-[-0.04em] flex items-center gap-2">
                        {logoSrc ? (
                            <img src={logoSrc} alt={settings?.siteEmri || "Logo"} className="h-9 w-auto object-contain" />
                        ) : (
                            <>
                                <span className="text-white">{settings?.siteEmri?.split(" ")[0] || "Project"}</span>
                                <span className="bg-gradient-to-br from-primary-light to-accent-light bg-clip-text text-transparent">
                                    {settings?.siteEmri?.split(" ").slice(1).join(" ") || "Template"}
                                </span>
                            </>
                        )}
                    </Link>

                    {/* Editable description */}
                    <p className="text-text-muted text-[0.95rem] leading-[1.7] m-0 max-w-[400px]">
                        {settings?.pershkrimi}
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-3 mt-2 flex-wrap">
                        {socialLinks.map(s => (
                            <a key={s.label} href={s.href || "#"} aria-label={s.label} target="_blank" rel="noreferrer"
                                className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted transition-all ${s.hoverClass} hover:-translate-y-1`}>
                                <FontAwesomeIcon icon={s.icon} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div className="flex gap-12 sm:gap-16">
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold text-[1.05rem] mb-2">Pages</h4>
                        <Link to="/" className="text-text-muted text-[0.95rem] transition-colors hover:text-primary-light">Home</Link>
                        <Link to="/AboutUs" className="text-text-muted text-[0.95rem] transition-colors hover:text-primary-light">About Us</Link>
                        <Link to="/ContactUs" className="text-text-muted text-[0.95rem] transition-colors hover:text-primary-light">Contact Us</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold text-[1.05rem] mb-2">Account</h4>
                        <Link to="/Dashboard" className="text-text-muted text-[0.95rem] transition-colors hover:text-primary-light">Dashboard</Link>
                        <Link to="/LogIn" className="text-text-muted text-[0.95rem] transition-colors hover:text-primary-light">Log In</Link>
                        <Link to="/SignUp" className="text-text-muted text-[0.95rem] transition-colors hover:text-primary-light">Sign Up</Link>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-white font-bold text-[1.05rem] mb-2">Contact</h4>
                    {settings?.email && (
                        <a href={`mailto:${settings.email}`} className="text-text-muted text-[0.95rem] transition-colors hover:text-primary-light break-all">
                            {settings.email}
                        </a>
                    )}
                    {settings?.telefoni && (
                        <a href={`tel:${settings.telefoni}`} className="text-text-muted text-[0.95rem] transition-colors hover:text-primary-light">
                            {settings.telefoni}
                        </a>
                    )}
                    {settings?.adresa && (
                        <p className="text-text-muted text-[0.95rem] m-0">{settings.adresa}</p>
                    )}
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-center md:text-left">
                <p className="text-text-dim text-[0.9rem] m-0">
                    <FontAwesomeIcon icon={faCopyright} /> {currentYear} {settings?.siteEmri || "Project Template"}. All rights reserved.
                </p>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-4 py-2 text-[0.8rem] text-text-muted font-medium">
                    <FontAwesomeIcon icon={faBolt} className="text-amber-400" />
                    Built with React + ASP.NET Core
                </div>
            </div>
        </footer>
    );
};

export default Footer;
