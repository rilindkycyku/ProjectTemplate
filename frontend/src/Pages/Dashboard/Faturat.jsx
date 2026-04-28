import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice, faPlus, faEye, faTrash, faArrowLeft,
  faSpinner, faSearch, faBuilding, faCalendar, faEuro
} from "@fortawesome/free-solid-svg-icons";
import Fatura from "../../Components/Fatura/Fatura";
import CustomSelect from "../../Components/layout/CustomSelect";
import CustomTable from "../../Components/layout/CustomTable";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

// ── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => parseFloat(n || 0).toFixed(2);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB") : "—";

// ── New Invoice Form ─────────────────────────────────────────────────────────
function ShtoFaturen({ onSuccess, onClose }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [header, setHeader] = useState({
    titulli: "FATURE", klientiEmri: "", klientiAdresa: "",
    klientiEmail: "", klientiTelefoni: "", shenime: "",
  });
  const [klientetOptions, setKlientetOptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  
  useEffect(() => {
    apiClient.get("/Klienti/ShfaqKlientet")
      .then(res => {
        setKlientetOptions(res.data.map(k => ({
          value: k.id,
          label: k.emriKompanise,
          clientData: k
        })));
      })
      .catch(console.error);
  }, []);

  const handleClientChange = (option) => {
    if (!option) {
      setHeader(p => ({ ...p, klientiEmri: "", klientiAdresa: "", klientiEmail: "", klientiTelefoni: "" }));
      return;
    }
    if (option.__isNew__) {
      setHeader(p => ({ ...p, klientiEmri: option.value, klientiAdresa: "", klientiEmail: "", klientiTelefoni: "" }));
    } else {
      setHeader(p => ({
        ...p,
        klientiEmri: option.clientData.emriKompanise || "",
        klientiAdresa: option.clientData.adresa || "",
        klientiEmail: option.clientData.email || "",
        klientiTelefoni: option.clientData.telefoni || "",
      }));
    }
  };

  const handleSaveClient = async () => {
    try {
      if (!header.klientiEmri) return alert("Emri i klientit është i detyrueshëm.");
      const res = await apiClient.post("/Klienti/ShtoKlientin", {
        emriKompanise: header.klientiEmri,
        adresa: header.klientiAdresa,
        email: header.klientiEmail,
        telefoni: header.klientiTelefoni,
      });
      setSuccessMessage("Klienti u ruajt me sukses në databazë!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setKlientetOptions(prev => [...prev, {
        value: res.data.id,
        label: res.data.emriKompanise,
        clientData: res.data
      }]);
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ruajtjes së klientit.");
    }
  };
  const [artikujt, setArtikujt] = useState([
    { kodi: "", emri: "", njesia: "pc", sasia: 1, cmimi: 0, rabati1: 0, rabati2: 0, rabati3: 0, tvsh: 18 }
  ]);

  const updateHeader = (k, v) => setHeader(p => ({ ...p, [k]: v }));

  const updateItem = (i, k, v) =>
    setArtikujt(p => p.map((it, idx) => idx === i ? { ...it, [k]: v } : it));

  const addItem = () =>
    setArtikujt(p => [...p, { kodi: "", emri: "", njesia: "pc", sasia: 1, cmimi: 0, rabati1: 0, rabati2: 0, rabati3: 0, tvsh: 18 }]);

  const removeItem = (i) =>
    setArtikujt(p => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (artikujt.length === 0) return alert("Shto të paktën një artikull.");
    setSaving(true);
    try {
      await apiClient.post("/Fatura/ShtoFaturen", {
        ...header,
        aspNetUserId: user?.id || null,
        artikujt: artikujt.map(a => ({
          ...a,
          sasia: parseFloat(a.sasia),
          cmimi: parseFloat(a.cmimi),
          rabati1: parseFloat(a.rabati1),
          rabati2: parseFloat(a.rabati2),
          rabati3: parseFloat(a.rabati3),
          tvsh: parseFloat(a.tvsh),
        })),
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ruajtjes së faturës.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-500";
  const labelCls = "block text-[0.7rem] uppercase tracking-wider text-indigo-300 font-bold mb-1";

  return (
    <div className="fixed inset-0 z-[1050] flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-8 right-8 z-[2000] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(16,185,129,0.2)] flex items-center gap-3 animate-[modal-in_0.3s_ease-out]">
          <FontAwesomeIcon icon={faPlus} className="text-xl" />
          <p className="m-0 font-bold">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-4 glass-card rounded-2xl border border-white/10 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faFileInvoice} />
            </div>
            <h2 className="text-xl font-bold text-white m-0">Faturë e Re</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-lg">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invoice type + notes */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
            <div>
              <label className={labelCls}>Lloji</label>
              <CustomSelect
                options={[
                  { value: "FATURE", label: "FATURE" },
                  { value: "OFERTE", label: "OFERTE" },
                  { value: "PARAGON", label: "PARAGON" },
                  { value: "KALKULIM", label: "KALKULIM" }
                ]}
                value={{ value: header.titulli, label: header.titulli }}
                onChange={(option) => updateHeader("titulli", option.value)}
                placeholder="Zgjidh llojin..."
              />
            </div>
            <div>
              <label className={labelCls}>Shënime</label>
              <input className={inputCls} value={header.shenime} onChange={e => updateHeader("shenime", e.target.value)} placeholder="Shënime shtesë..." />
            </div>
          </div>

          {/* Client info */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2 m-0">
                <FontAwesomeIcon icon={faBuilding} /> Të Dhënat e Klientit
              </p>
              <button type="button" onClick={handleSaveClient}
                className="text-xs bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} /> Ruaj Klientin në DB
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              <div>
                <label className={labelCls}>Emri i Klientit</label>
                <CustomSelect
                  isCreatable={true}
                  options={klientetOptions}
                  value={header.klientiEmri ? { label: header.klientiEmri, value: header.klientiEmri } : null}
                  onChange={handleClientChange}
                  placeholder="Kërko ose shkruaj emrin..."
                />
              </div>
              {[
                ["klientiAdresa", "Adresa", "Adresa..."],
                ["klientiEmail", "Email", "email@kompania.com"],
                ["klientiTelefoni", "Telefoni", "+383..."],
              ].map(([k, lbl, ph]) => (
                <div key={k}>
                  <label className={labelCls}>{lbl}</label>
                  <input className={inputCls} value={header[k]} onChange={e => updateHeader(k, e.target.value)} placeholder={ph} />
                </div>
              ))}
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[0.7rem] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2 m-0">
                Artikujt
              </p>
              <button type="button" onClick={addItem}
                className="text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} /> Shto Artikull
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-xs text-white min-w-[700px]">
                <thead>
                  <tr className="bg-white/5 text-gray-400 uppercase tracking-wider">
                    {["Kodi", "Emërtimi", "Njm", "Sasia", "Çmimi", "Rab1%", "Rab2%", "Rab3%", "TVSH%", ""].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {artikujt.map((it, i) => (
                    <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02]">
                      {["kodi", "emri", "njesia"].map(k => (
                        <td key={k} className="px-2 py-1.5">
                          <input className={inputCls + " min-w-[60px]"} value={it[k]}
                            onChange={e => updateItem(i, k, e.target.value)} />
                        </td>
                      ))}
                      {["sasia", "cmimi", "rabati1", "rabati2", "rabati3", "tvsh"].map(k => (
                        <td key={k} className="px-2 py-1.5">
                          <input type="number" min="0" step="0.01" className={inputCls + " min-w-[60px]"}
                            value={it[k]} onChange={e => updateItem(i, k, e.target.value)} />
                        </td>
                      ))}
                      <td className="px-2 py-1.5">
                        <button type="button" onClick={() => removeItem(i)}
                          className="text-red-400 hover:text-red-300 transition-colors px-2">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-white/10">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
            Anulo
          </button>
          <button type="submit" disabled={saving}
            className="btn-premium flex items-center gap-2 text-sm">
            {saving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faFileInvoice} />}
            {saving ? "Duke ruajtur..." : "Ruaj Faturën"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Main Faturat Page ─────────────────────────────────────────────────────────
export default function FaturatPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [faturat, setFaturat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [shfaqFormarin, setShfaqFormarin] = useState(false);
  const [activeFaturaId, setActiveFaturaId] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const isAdmin = user?.role?.includes("Admin") || user?.role?.includes("Menaxher");

  const fetchFaturat = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/Fatura/ShfaqFaturat");
      setFaturat(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchFaturat();
  }, [token, navigate, fetchFaturat]);

  const fshijFaturen = async (id) => {
    if (!confirm("A jeni i sigurt që dëshironi ta fshini këtë faturë?")) return;
    setDeleting(id);
    try {
      await apiClient.delete(`/Fatura/FshijFaturen/${id}`);
      setFaturat(p => p.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë fshirjes.");
    } finally {
      setDeleting(null);
    }
  };

  const columns = [
    { 
      header: "Nr. Faturës", 
      accessor: "nrFatures", 
      render: (f) => (
        <span className="font-mono text-indigo-300 font-bold text-xs bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
          {f.nrFatures || `#${f.id}`}
        </span>
      ) 
    },
    { 
      header: "Lloji", 
      accessor: "titulli", 
      render: (f) => (
        <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-md font-bold text-gray-300">
          {f.titulli || "FATURE"}
        </span>
      )
    },
    { header: "Klienti", accessor: "klientiEmri", render: (f) => <span className="text-gray-300">{f.klientiEmri || "—"}</span> },
    { header: "Data", accessor: "dataRegjistrimit", render: (f) => <span className="text-gray-400 text-xs">{fmtDate(f.dataRegjistrimit)}</span> },
    { 
      header: "Totali (€)", 
      accessor: "totaliMeTVSH", 
      render: (f) => <span className="font-bold text-emerald-400">€ {fmt(f.totaliMeTVSH)}</span> 
    },
    { 
      header: "Veprime", 
      accessor: "actions", 
      render: (f) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => setActiveFaturaId(f.id)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all"
          >
            <FontAwesomeIcon icon={faEye} /> Shiko
          </button>
          {isAdmin && (
            <button
              onClick={() => fshijFaturen(f.id)}
              disabled={deleting === f.id}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-50"
            >
              {deleting === f.id
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : <FontAwesomeIcon icon={faTrash} />}
              Fshi
            </button>
          )}
        </div>
      ) 
    }
  ];

  const filtered = faturat.filter(f =>
    (f.nrFatures || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.klientiEmri || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.titulli || "").toLowerCase().includes(search.toLowerCase())
  );

  // ── Show invoice viewer ────────────────────────────────────────────────────
  if (activeFaturaId) {
    return (
      <div className="w-full relative z-10">
        <div className="w-full mx-auto pb-4">
          <button
            onClick={() => setActiveFaturaId(null)}
            className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Kthehu te Lista
          </button>
        </div>
        <Fatura faturaId={activeFaturaId} mbyllFaturen={() => setActiveFaturaId(null)} />
      </div>
    );
  }

  return (
    <>
      <div className="w-full relative z-10">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4" data-aos="fade-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-[0_8px_24px_rgba(99,102,241,0.4)]">
              <FontAwesomeIcon icon={faFileInvoice} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white m-0 tracking-tight">Faturat</h1>
              <p className="text-gray-400 text-sm m-0 mt-0.5">Moduli i Faturimit — krijo, shiko dhe menaxho faturat</p>
            </div>
          </div>
          <button onClick={() => setShfaqFormarin(true)} className="btn-premium flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} /> Faturë e Re
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8 md:grid-cols-1" data-aos="fade-up" data-aos-delay="100">
          {[
            {
              label: "Totali i Faturave",
              value: faturat.length,
              icon: faFileInvoice,
              color: "from-indigo-500 to-purple-600",
              shadow: "rgba(99,102,241,0.3)",
            },
            {
              label: "Totali (€)",
              value: `€ ${fmt(faturat.reduce((s, f) => s + parseFloat(f.totaliMeTVSH || 0), 0))}`,
              icon: faEuro,
              color: "from-emerald-500 to-teal-600",
              shadow: "rgba(16,185,129,0.3)",
            },
            {
              label: "Muaji Aktual",
              value: faturat.filter(f => new Date(f.dataRegjistrimit).getMonth() === new Date().getMonth()).length,
              icon: faCalendar,
              color: "from-pink-500 to-rose-600",
              shadow: "rgba(236,72,153,0.3)",
            },
          ].map(({ label, value, icon, color, shadow }) => (
            <div key={label} className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-[0_4px_16px_${shadow}] shrink-0`}>
                <FontAwesomeIcon icon={icon} />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-bold m-0">{label}</p>
                <p className="text-white text-2xl font-black m-0">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table Area */}
        <div className="glass-card p-6" data-aos="fade-up" data-aos-delay="150">
          <CustomTable 
            data={filtered}
            columns={columns}
            loading={loading}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Kërko sipas numrit, klientit ose llojit..."
          />
        </div>
      </div>

      {shfaqFormarin && (
        <ShtoFaturen
          onSuccess={() => { setShfaqFormarin(false); fetchFaturat(); }}
          onClose={() => setShfaqFormarin(false)}
        />
      )}
    </>
  );
}
