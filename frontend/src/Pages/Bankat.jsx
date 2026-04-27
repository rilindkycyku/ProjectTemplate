import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faUniversity } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../api/apiClient";
import CustomTable from "../Components/layout/CustomTable";
import CustomSelect from "../Components/layout/CustomSelect";

export default function Bankat() {
    const [bankat, setBankat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingBank, setEditingBank] = useState(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        emriBankes: "",
        nrLlogaris: "",
        valuta: "EUR",
        isActive: true
    });

    useEffect(() => {
        fetchBankat();
    }, []);

    const fetchBankat = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get("/Banka/ShfaqTeGjithaBankat");
            setBankat(res.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching bank accounts", err);
            setError("Gabim gjatë shkarkimit të llogarive bankare.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (bank = null) => {
        if (bank) {
            setEditingBank(bank);
            setForm({
                emriBankes: bank.emriBankes || "",
                nrLlogaris: bank.nrLlogaris || "",
                valuta: bank.valuta || "EUR",
                isActive: bank.isActive ?? true
            });
        } else {
            setEditingBank(null);
            setForm({
                emriBankes: "",
                nrLlogaris: "",
                valuta: "EUR",
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBank(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingBank) {
                await apiClient.put(`/Banka/PerditesBanken/${editingBank.id}`, form);
            } else {
                await apiClient.post("/Banka/ShtoBanken", form);
            }
            await fetchBankat();
            handleCloseModal();
        } catch (err) {
            console.error("Error saving bank account", err);
            alert("Gabim gjatë ruajtjes së llogarisë bankare.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("A jeni i sigurt që dëshironi ta fshini këtë llogari bankare?")) return;
        try {
            await apiClient.delete(`/Banka/FshijBanken/${id}`);
            await fetchBankat();
        } catch (err) {
            console.error("Error deleting bank account", err);
            alert("Gabim gjatë fshirjes.");
        }
    };

    // Filter banks for table
    const filteredBanks = bankat.filter(b => 
        (b.emriBankes || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.nrLlogaris || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Emri i Bankës", accessor: "emriBankes" },
        { header: "Nr. Llogarisë", accessor: "nrLlogaris" },
        { header: "Valuta", accessor: "valuta", render: (b) => <span className="font-bold text-primary-light">{b.valuta}</span> },
        { header: "Statusi", accessor: "isActive", render: (b) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {b.isActive ? "Aktiv" : "Jo Aktiv"}
            </span>
        )},
        { header: "Veprime", accessor: "actions", render: (b) => (
            <div className="flex items-center gap-2">
                <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors" onClick={() => handleOpenModal(b)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg transition-colors" onClick={() => handleDelete(b.id)}>
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
                        <FontAwesomeIcon icon={faUniversity} className="text-primary-light" />
                        Llogaritë Bankare
                    </h1>
                    <p className="text-text-muted mt-1">Menaxho llogaritë bankare që do të shfaqen në fund të faturave.</p>
                </div>
                <button className="btn-premium" onClick={() => handleOpenModal()}>
                    <FontAwesomeIcon icon={faPlus} /> Shto Llogari
                </button>
            </div>

            {/* Table Area */}
            <div className="glass-card p-6">
                <CustomTable 
                    data={filteredBanks}
                    columns={columns}
                    loading={loading}
                    error={error}
                    searchQuery={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Kërko me emër banke ose nr. llogarie..."
                />
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-lg p-6 animate-[pulse-ring_0.3s_ease-out]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editingBank ? "Ndrysho Llogarinë" : "Shto Llogari të Re"}
                            </h2>
                            <button onClick={handleCloseModal} className="text-text-muted hover:text-white transition-colors text-xl leading-none">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div className="form-group-premium mb-0">
                                <label>Emri i Bankës</label>
                                <input 
                                    name="emriBankes" 
                                    value={form.emriBankes} 
                                    onChange={handleChange} 
                                    required 
                                    className="form-control-premium" 
                                    placeholder="p.sh. Raiffeisen Bank, TEB..." 
                                />
                            </div>

                            <div className="form-group-premium mb-0">
                                <label>Numri i Llogarisë</label>
                                <input 
                                    name="nrLlogaris" 
                                    value={form.nrLlogaris} 
                                    onChange={handleChange} 
                                    required 
                                    className="form-control-premium" 
                                    placeholder="p.sh. 15000000000000" 
                                />
                            </div>

                            <div className="form-group-premium mb-0">
                                <label>Valuta</label>
                                <CustomSelect 
                                    options={[
                                        { value: "EUR", label: "EUR (€)" },
                                        { value: "USD", label: "USD ($)" },
                                        { value: "CHF", label: "CHF" }
                                    ]}
                                    value={{ value: form.valuta, label: form.valuta === "EUR" ? "EUR (€)" : form.valuta === "USD" ? "USD ($)" : "CHF" }}
                                    onChange={(option) => handleChange({ target: { name: "valuta", value: option.value }})}
                                />
                            </div>

                            <div className="flex items-center gap-3 mt-2 mb-4 bg-white/5 p-4 rounded-lg border border-white/10">
                                <input 
                                    type="checkbox" 
                                    name="isActive" 
                                    checked={form.isActive} 
                                    onChange={handleChange} 
                                    id="isActiveCheck"
                                    className="w-5 h-5 accent-primary cursor-pointer"
                                />
                                <label htmlFor="isActiveCheck" className="text-white cursor-pointer font-medium mb-0">
                                    Llogari Aktive <span className="text-text-muted text-xs font-normal block">Llogaritë jo-aktive nuk do të shfaqen në faturat e reja.</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={handleCloseModal} className="btn-outline">Anulo</button>
                                <button type="submit" disabled={saving} className="btn-premium min-w-[120px]">
                                    {saving ? "Duke ruajtur..." : "Ruaj"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
