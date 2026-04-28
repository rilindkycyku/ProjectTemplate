import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faHistory, faDownload } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../api/apiClient";
import CustomTable from "../../Components/layout/CustomTable";
import { format, parseISO } from "date-fns";

export default function Gjurmimet() {
    const [gjurmimet, setGjurmimet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        fetchGjurmimet();
    }, []);

    const fetchGjurmimet = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get("/AdminLogs/ShfaqGjurmimet");
            
            const transformedData = res.data.map((k) => ({
                id: k.id,
                stafi: k.stafi ? `${k.stafi.emri} ${k.stafi.mbiemri} - ${k.stafi.email}` : "N/A",
                koha: k.koha,
                veprimi: k.veprimi,
                entiteti: k.entiteti,
                entitetiId: k.entitetiId,
                detajet: k.detaje,
            }));
            
            setGjurmimet(transformedData);
            setError(null);
        } catch (err) {
            console.error("Error fetching logs", err);
            setError("Gabim gjatë shkarkimit të gjurmimeve.");
        } finally {
            setLoading(false);
        }
    };

    const handleClearAllLogs = async () => {
        if (!window.confirm("A jeni i sigurt? Kjo veprim nuk mund të rikthehet!")) return;
        
        try {
            setIsClearing(true);
            await apiClient.delete("/AdminLogs/FshijGjurmimetEGjitha");
            await fetchGjurmimet();
        } catch (err) {
            console.error("Error clearing logs", err);
            alert("Gabim gjatë fshirjes së gjurmimeve.");
        } finally {
            setIsClearing(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await apiClient.get("/AdminLogs/EksportoGjurmimet", {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Gjurmimet_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Error exporting logs", err);
            alert("Gabim gjatë eksportimit të gjurmimeve.");
        }
    };

    const formatDate = (dateStr) => {
        try {
            const date = parseISO(dateStr);
            return format(date, "dd/MM/yyyy HH:mm");
        } catch (e) {
            return dateStr;
        }
    };

    // Filter logs for table
    const filteredLogs = gjurmimet.filter(k => 
        (k.stafi || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (k.veprimi || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (k.entiteti || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (k.detajet || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Stafi", accessor: "stafi", render: (k) => <span className="font-bold text-white">{k.stafi}</span> },
        { header: "Koha", accessor: "koha", render: (k) => formatDate(k.koha) },
        { header: "Veprimi", accessor: "veprimi", render: (k) => (
            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                k.veprimi === "Shto" ? "bg-green-500/20 text-green-400" :
                k.veprimi === "Fshij" || k.veprimi === "Largo" ? "bg-red-500/20 text-red-400" :
                "bg-blue-500/20 text-blue-400"
            }`}>
                {k.veprimi}
            </span>
        ) },
        { header: "Entiteti", accessor: "entiteti" },
        { header: "Detajet", accessor: "detajet", render: (k) => (
            <div className="text-text-muted text-sm max-w-xs break-words">
                {k.detajet}
            </div>
        ) }
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FontAwesomeIcon icon={faHistory} className="text-primary-light" />
                        Gjurmimi i Sistemit
                    </h1>
                    <p className="text-text-muted mt-1">Monitoroni të gjitha veprimet e kryera në platformë.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2" 
                        onClick={handleExport}
                        disabled={gjurmimet.length === 0}
                    >
                        <FontAwesomeIcon icon={faDownload} /> Eksporto CSV
                    </button>
                    <button 
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-2" 
                        onClick={handleClearAllLogs}
                        disabled={gjurmimet.length === 0 || isClearing}
                    >
                        <FontAwesomeIcon icon={faTrash} /> {isClearing ? "Duke fshirë..." : "Pastro Të Gjitha"}
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="glass-card p-6">
                <CustomTable 
                    data={filteredLogs}
                    columns={columns}
                    loading={loading}
                    error={error}
                    searchQuery={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Kërko në gjurmime (stafi, veprimi, entiteti, detaje)..."
                />
            </div>
        </div>
    );
}
