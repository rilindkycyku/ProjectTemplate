import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faUsers, faBuilding } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../api/apiClient";
import CustomTable from "../../Components/layout/CustomTable";
import CustomModal from "../../Components/layout/CustomModal";

export default function Klientet() {
    const [klientet, setKlientet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingKlient, setEditingKlient] = useState(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        emriKompanise: "",
        adresa: "",
        email: "",
        telefoni: "",
        nui: "",
        nrb: ""
    });

    useEffect(() => {
        fetchKlientet();
    }, []);

    const fetchKlientet = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get("/Klienti/ShfaqKlientet");
            setKlientet(res.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching clients", err);
            setError("Gabim gjatë shkarkimit të klientëve.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (klienti = null) => {
        if (klienti) {
            setEditingKlient(klienti);
            setForm({
                emriKompanise: klienti.emriKompanise || "",
                adresa: klienti.adresa || "",
                email: klienti.email || "",
                telefoni: klienti.telefoni || "",
                nui: klienti.nui || "",
                nrb: klienti.nrb || ""
            });
        } else {
            setEditingKlient(null);
            setForm({
                emriKompanise: "",
                adresa: "",
                email: "",
                telefoni: "",
                nui: "",
                nrb: ""
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingKlient(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingKlient) {
                await apiClient.put(`/Klienti/PerditesoKlientin/${editingKlient.id}`, form);
            } else {
                await apiClient.post("/Klienti/ShtoKlientin", form);
            }
            await fetchKlientet();
            handleCloseModal();
        } catch (err) {
            console.error("Error saving client", err);
            alert("Gabim gjatë ruajtjes së klientit.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("A jeni i sigurt që dëshironi ta fshini këtë klient?")) return;
        try {
            await apiClient.delete(`/Klienti/FshijKlientin/${id}`);
            await fetchKlientet();
        } catch (err) {
            console.error("Error deleting client", err);
            alert("Gabim gjatë fshirjes.");
        }
    };

    // Filter clients for table
    const filteredClients = klientet.filter(k => 
        (k.emriKompanise || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (k.nui || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (k.nrb || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Emri i Kompanisë", accessor: "emriKompanise", render: (k) => <span className="font-bold text-white">{k.emriKompanise}</span> },
        { header: "Adresa", accessor: "adresa" },
        { header: "Telefoni", accessor: "telefoni" },
        { header: "Email", accessor: "email" },
        { header: "NUI", accessor: "nui" },
        { header: "Veprime", accessor: "actions", render: (k) => (
            <div className="flex items-center gap-2">
                <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors" onClick={() => handleOpenModal(k)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg transition-colors" onClick={() => handleDelete(k.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        )}
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FontAwesomeIcon icon={faUsers} className="text-primary-light" />
                        Klientët
                    </h1>
                    <p className="text-text-muted mt-1">Menaxho klientët dhe partnerët për faturat.</p>
                </div>
                <button className="btn-premium" onClick={() => handleOpenModal()}>
                    <FontAwesomeIcon icon={faPlus} /> Shto Klient
                </button>
            </div>

            {/* Table Area */}
            <div className="glass-card p-6">
                <CustomTable 
                    data={filteredClients}
                    columns={columns}
                    loading={loading}
                    error={error}
                    searchQuery={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Kërko me emër kompanie, NUI ose NRB..."
                />
            </div>

            {/* Modal */}
            <CustomModal
                show={showModal}
                onHide={handleCloseModal}
                size="lg"
                title={
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faBuilding} className="text-primary-light" />
                        {editingKlient ? "Ndrysho Klientin" : "Shto Klient të Ri"}
                    </div>
                }
            >
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <div className="form-group-premium mb-0">
                        <label>Emri i Kompanisë</label>
                        <input 
                            name="emriKompanise" 
                            value={form.emriKompanise} 
                            onChange={handleChange} 
                            required 
                            className="form-control-premium" 
                            placeholder="p.sh. Klienti Test Sh.p.k" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group-premium mb-0">
                            <label>Email Adresa</label>
                            <input 
                                name="email" 
                                type="email"
                                value={form.email} 
                                onChange={handleChange} 
                                className="form-control-premium" 
                                placeholder="p.sh. contact@klienti.com" 
                            />
                        </div>
                        <div className="form-group-premium mb-0">
                            <label>Telefoni</label>
                            <input 
                                name="telefoni" 
                                value={form.telefoni} 
                                onChange={handleChange} 
                                className="form-control-premium" 
                                placeholder="p.sh. +383 44 111 222" 
                            />
                        </div>
                    </div>

                    <div className="form-group-premium mb-0">
                        <label>Adresa e plotë</label>
                        <input 
                            name="adresa" 
                            value={form.adresa} 
                            onChange={handleChange} 
                            className="form-control-premium" 
                            placeholder="p.sh. Rr. Agim Ramadani, Prishtinë" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group-premium mb-0">
                            <label>NUI (Numri Unik Identifikues)</label>
                            <input 
                                name="nui" 
                                value={form.nui} 
                                onChange={handleChange} 
                                className="form-control-premium" 
                                placeholder="p.sh. 811000000" 
                            />
                        </div>
                        <div className="form-group-premium mb-0">
                            <label>NRB (Numri i Regjistrimit të Biznesit)</label>
                            <input 
                                name="nrb" 
                                value={form.nrb} 
                                onChange={handleChange} 
                                className="form-control-premium" 
                                placeholder="p.sh. 70000000" 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                        <button type="button" onClick={handleCloseModal} className="btn-outline">Anulo</button>
                        <button type="submit" disabled={saving} className="btn-premium min-w-[120px]">
                            {saving ? "Duke ruajtur..." : "Ruaj Klientin"}
                        </button>
                    </div>
                </form>
            </CustomModal>
        </div>
    );
}
