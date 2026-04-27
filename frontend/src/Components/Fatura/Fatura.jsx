import "./Styles/FaturaModern.css";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdf, View, Text, StyleSheet } from "@react-pdf/renderer";
import { Download, ArrowLeft, FileText, AlertCircle } from "lucide-react";
import { useSiteSettings } from "../../Context/SiteSettingsContext";
import { useAuth } from "../../Context/AuthContext";
import apiClient from "../../api/apiClient";
import DetajeFatura from "./DetajeFatura";
import HeaderFatura from "./HeaderFatura";
import FooterFatura from "./FooterFatura";


const pdfStyles = StyleSheet.create({
  page: { padding: 20, fontSize: 11 },
  hr: { borderBottomWidth: 1, borderColor: "black", marginVertical: 5 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc" },
  header: { backgroundColor: "#f0f0f0", fontWeight: "bold" },
  cell: { flex: 1, padding: 3, fontSize: 7, textAlign: "center" },
});

/**
 * Fatura — Invoice viewer + PDF exporter.
 *
 * Props:
 *   faturaId     — integer ID of the invoice (/api/Fatura/ShfaqFaturen/:id)
 *   mbyllFaturen — callback to close/dismiss this viewer
 *
 * Data is fetched from:
 *   GET /api/Fatura/ShfaqFaturen/:id  → fatura + artikujt (line items)
 *   GET /api/Banka/ShfaqBankat       → bankat (bank accounts for footer)
 *   SiteSettings via useSiteSettings() → company info for header
 */
function Fatura({ faturaId, mbyllFaturen }) {
  const { settings: siteTeDhenat } = useSiteSettings();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [fatura, setFatura] = useState(null);
  const [artikujt, setArtikujt] = useState([]);
  const [bankat, setBankat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [estimatedPages, setEstimatedPages] = useState(1);

  // ── Data fetch ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    if (!faturaId) { setError("No invoice ID provided."); setLoading(false); return; }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [faturaRes, bankatRes] = await Promise.all([
          apiClient.get(`/Fatura/ShfaqFaturen/${faturaId}`),
          apiClient.get("/Banka/ShfaqBankat"),
        ]);

        const faturaData = faturaRes.data;
        const itemsData  = faturaData.artikujt || [];

        setFatura(faturaData);
        setArtikujt(itemsData);
        setBankat(bankatRes.data || []);

        // Estimate PDF pages
        const itemCount  = itemsData.length;
        const fullPages  = Math.floor(itemCount / 24);
        const remainder  = itemCount % 24;
        const totalPages = remainder > 0
          ? (remainder <= 14 ? fullPages + 1 : fullPages + 2)
          : Math.max(fullPages, 1);
        setEstimatedPages(totalPages);
      } catch (err) {
        console.error(err);
        setError("Gabim gjatë shkarkimit të faturës.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [faturaId, token, navigate]);

  // ── Barcode string ────────────────────────────────────────────────────────
  const barkodi = useMemo(() => fatura?.nrFatures || "", [fatura]);

  // ── Shared data object passed down to sub-components ─────────────────────
  const sharedData = useMemo(
    () => ({ fatura, artikujt, bankat, siteTeDhenat }),
    [fatura, artikujt, bankat, siteTeDhenat]
  );

  // ── PDF document builder ───────────────────────────────────────────────────
  const InvoicePDF = () => {
    const itemsPerFullPage = 24;
    const maxItemsLastPage = 14;
    const pages = [];
    let currentStart = 0;
    let pageNumber = 1;

    if (artikujt.length === 0) {
      return (
        <Document>
          <Page size="A4">
            <Text>Nuk ka artikuj në këtë faturë.</Text>
          </Page>
        </Document>
      );
    }

    while (currentStart < artikujt.length) {
      const remainingItems  = artikujt.length - currentStart;
      const isLastPage      = remainingItems <= itemsPerFullPage;
      const itemsPerPage    = isLastPage
        ? (remainingItems <= maxItemsLastPage ? remainingItems : itemsPerFullPage)
        : itemsPerFullPage;
      const end               = Math.min(currentStart + itemsPerPage, artikujt.length);
      const itemsOnPage       = end - currentStart;
      const forceFooterNewPage = isLastPage && itemsOnPage > maxItemsLastPage;

      pages.push(
        <Page size={{ width: 595, height: 842 }} key={pageNumber}>
          <DetajeFatura
            nrFatures={faturaId}
            Barkodi={barkodi}
            ProduktiPare={currentStart}
            ProduktiFundit={end}
            LargoFooter={forceFooterNewPage || end < artikujt.length}
            NrFaqes={pageNumber}
            NrFaqeve={estimatedPages}
            isPDF={true}
            data={sharedData}
            forceFooterNewPage={forceFooterNewPage}
          />
        </Page>
      );

      if (forceFooterNewPage) {
        pages.push(
          <Page size={{ width: 595, height: 842 }} key={pageNumber + 1}>
            <View style={pdfStyles.page}>
              <HeaderFatura faturaID={faturaId} Barkodi={barkodi} NrFaqes={pageNumber + 1} NrFaqeve={estimatedPages} isPDF={true} data={sharedData} />
              <View style={pdfStyles.hr} />
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.cell}> </Text>
              </View>
              <View style={pdfStyles.hr} />
              <FooterFatura Barkodi={barkodi} isPDF={true} data={sharedData} />
            </View>
          </Page>
        );
        pageNumber++;
      }

      currentStart += itemsPerPage;
      pageNumber++;
    }

    return <Document>{pages}</Document>;
  };

  // ── PDF download ──────────────────────────────────────────────────────────
  const ruajFaturen = async () => {
    try {
      setSaving(true);
      const blob = await pdf(<InvoicePDF />).toBlob();
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `${barkodi || "fatura"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      mbyllFaturen?.();
    } catch (err) {
      console.error("Gabim gjatë ruajtjes së PDF:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Render states ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted fw-bold">Duke përgatitur faturën...</p>
      </div>
    );
  }

  if (error || !fatura) {
    return (
      <div className="text-center py-5">
        <AlertCircle size={48} className="text-danger mb-3" />
        <h3>{error || "Gabim në shkarkimin e faturës"}</h3>
        <button className="btn btn-primary mt-3" onClick={mbyllFaturen}>Kthehu mbrapa</button>
      </div>
    );
  }

  // ── Main viewer ───────────────────────────────────────────────────────────
  return (
    <div className="invoice-viewer-container">
      <title>{`Fatura: ${barkodi}`}</title>

      {/* Sticky toolbar */}
      <div className="invoice-toolbar shadow-sm">
        <div className="d-flex align-items-center">
          <FileText size={24} className="text-primary me-3" />
          <h1 className="invoice-title-main mb-0">{barkodi}</h1>
        </div>

        <div className="d-flex align-items-center">
          <span className="invoice-page-hint d-none d-md-inline">
            Fatura ndahet në: <strong>{estimatedPages} faqe</strong>
          </span>

          <button
            className="btn-invoice-action btn-invoice-save me-3"
            onClick={ruajFaturen}
            disabled={saving}
          >
            {saving
              ? <span className="spinner-border spinner-border-sm" />
              : <Download size={18} />}
            {saving ? "Duke Ruajtur..." : "Ruaj Faturën"}
          </button>

          <button className="btn-invoice-action btn-invoice-close" onClick={mbyllFaturen}>
            <ArrowLeft size={18} /> Mbyll
          </button>
        </div>
      </div>

      {/* A4 paper preview */}
      <div className="invoice-paper" id="invoice-capture">
        <DetajeFatura
          nrFatures={faturaId}
          Barkodi={barkodi}
          ProduktiPare={0}
          ProduktiFundit={artikujt.length}
          LargoFooter={false}
          NrFaqes={1}
          NrFaqeve={estimatedPages}
          isPDF={false}
          data={sharedData}
          forceFooterNewPage={false}
        />
      </div>
    </div>
  );
}

export default Fatura;
