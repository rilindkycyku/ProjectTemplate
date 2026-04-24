import { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "../api/apiClient";

const SiteSettingsContext = createContext(null);

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        siteEmri: "Project Template",
        logo: null,
        pershkrimi: "A premium starting point for your next big idea. Built with efficiency, scalability, and modern best practices in mind.",
        email: "contact@template.com",
        telefoni: "+383 44 000 000",
        adresa: "Prishtine, Kosove",
        facebook: "#",
        instagram: "#",
        twitter: "#",
        gitHub: "#",
        linkedIn: "#",
    });

    const fetchSettings = useCallback(async () => {
        try {
            const res = await apiClient.get("/SiteSettings/ShfaqCilesimet");
            setSettings(res.data);
        } catch (err) {
            console.error("Could not load site settings:", err);
        }
    }, []);

    useEffect(() => { fetchSettings(); }, [fetchSettings]);

    return (
        <SiteSettingsContext.Provider value={{ settings, fetchSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};
