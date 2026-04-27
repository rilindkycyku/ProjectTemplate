import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import { useSiteSettings } from "../../Context/SiteSettingsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faUpload, faGlobe, faEnvelope, faPhone, faMapMarkerAlt, faImage } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faTwitter, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { TailSpin } from "react-loader-spinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function CilesimiSajtit() {
    const { settings, fetchSettings } = useSiteSettings();
    const [form, setForm] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (settings) setForm({ ...settings });
    }, [settings]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleLogoUpload = async () => {
        if (!logoFile) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("logo", logoFile);
            await apiClient.post("/SiteSettings/NgarkoLogo", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            await fetchSettings();
            setLogoFile(null);
            setLogoPreview(null);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.put("/SiteSettings/PerditesCilesimet", form);
            await fetchSettings();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!form) return <div className="Loader"><TailSpin height="50" width="50" color="#6366f1" /></div>;

    const currentLogo = (settings?.logo && settings.logo !== "PaLogo.png") 
        ? `/img/web/${settings.logo}` 
        : null;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">Site Settings</h2>
                <p className="text-text-muted text-sm">Manage your site's branding, contact info, and social links.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                {/* ── Logo ─────────────────────────────────────────────── */}
                <section className="glass-card p-6">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faImage} className="text-primary-light" /> Logo
                    </h3>

                    <div className="flex items-center gap-6 flex-wrap">
                        {/* Current logo preview */}
                        <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            {(logoPreview || currentLogo) ? (
                                <img src={logoPreview || currentLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <span className="text-text-muted text-xs text-center px-2">No logo</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="relative cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                                    onChange={handleLogoChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <span className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUpload} /> Choose File
                                </span>
                            </label>
                            {logoFile && (
                                <button
                                    type="button"
                                    onClick={handleLogoUpload}
                                    disabled={uploading}
                                    className="btn-premium py-2 px-4 text-sm flex items-center gap-2"
                                >
                                    {uploading ? <TailSpin height="16" width="16" color="#fff" /> : <FontAwesomeIcon icon={faUpload} />}
                                    {uploading ? "Uploading…" : "Upload Logo"}
                                </button>
                            )}
                            <p className="text-text-muted text-xs">PNG, JPG, SVG, WEBP — max 5MB</p>
                        </div>
                    </div>
                </section>

                {/* ── Branding ──────────────────────────────────────────── */}
                <section className="glass-card p-6">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faGlobe} className="text-primary-light" /> Branding
                    </h3>
                    <div className="flex flex-col gap-4">
                        <div className="form-group-premium">
                            <label>Site Name</label>
                            <input name="siteEmri" value={form.siteEmri || ""} onChange={handleChange}
                                className="form-control-premium" placeholder="My Awesome App" />
                        </div>
                        <div className="form-group-premium">
                            <label>Footer Description</label>
                            <textarea name="pershkrimi" value={form.pershkrimi || ""} onChange={handleChange}
                                className="form-control-premium" rows={3}
                                placeholder="A short premium description shown in the footer…" />
                        </div>
                    </div>
                </section>

                {/* ── Contact ───────────────────────────────────────────── */}
                <section className="glass-card p-6">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-primary-light" /> Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group-premium">
                            <label><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                            <input name="email" value={form.email || ""} onChange={handleChange}
                                className="form-control-premium" placeholder="contact@yoursite.com" type="email" />
                        </div>
                        <div className="form-group-premium">
                            <label><FontAwesomeIcon icon={faPhone} /> Phone</label>
                            <input name="telefoni" value={form.telefoni || ""} onChange={handleChange}
                                className="form-control-premium" placeholder="+1 234 567 890" />
                        </div>
                        <div className="form-group-premium md:col-span-2">
                            <label><FontAwesomeIcon icon={faMapMarkerAlt} /> Address</label>
                            <input name="adresa" value={form.adresa || ""} onChange={handleChange}
                                className="form-control-premium" placeholder="City, Country" />
                        </div>
                    </div>
                </section>

                {/* ── Social Links ─────────────────────────────────────── */}
                <section className="glass-card p-6">
                    <h3 className="text-white font-bold text-lg mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { name: "facebook",  icon: faFacebook,  label: "Facebook",  color: "text-blue-400" },
                            { name: "instagram", icon: faInstagram, label: "Instagram", color: "text-pink-400" },
                            { name: "twitter",   icon: faTwitter,   label: "Twitter",   color: "text-sky-400"  },
                            { name: "gitHub",    icon: faGithub,    label: "GitHub",    color: "text-white"    },
                            { name: "linkedIn",  icon: faLinkedin,  label: "LinkedIn",  color: "text-blue-500" },
                        ].map(s => (
                            <div key={s.name} className="form-group-premium">
                                <label className={s.color}>
                                    <FontAwesomeIcon icon={s.icon} /> {s.label}
                                </label>
                                <input name={s.name} value={form[s.name] || ""} onChange={handleChange}
                                    className="form-control-premium" placeholder={`https://${s.label.toLowerCase()}.com/yourpage`} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Save */}
                <div className="flex items-center gap-4">
                    <button type="submit" disabled={loading} className="btn-premium py-3 px-8 flex items-center gap-2">
                        {loading ? <TailSpin height="18" width="18" color="#fff" /> : <FontAwesomeIcon icon={faSave} />}
                        {loading ? "Saving…" : "Save Changes"}
                    </button>
                    {success && (
                        <span className="text-green-400 text-sm font-semibold animate-pulse">
                            ✓ Saved successfully!
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}

export default CilesimiSajtit;
