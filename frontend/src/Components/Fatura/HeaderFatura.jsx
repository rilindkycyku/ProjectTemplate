import "./Styles/Fatura.css";
import { useRef } from "react";
import { View, Text, StyleSheet, Image, Font } from "@react-pdf/renderer";
import Barcode from "react-barcode";
import JsBarcode from "jsbarcode";

Font.register({
  family: "Quicksand",
  fonts: [
    { src: "/fonts/Quicksand-Regular.ttf" },
    { src: "/fonts/Quicksand-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Quicksand-SemiBold.ttf", fontWeight: 600 },
  ],
});

// PDF styles — no custom font so we use the built-in default
const styles = StyleSheet.create({
  header:          { flexDirection: "row", justifyContent: "space-between", fontFamily: "Quicksand" },
  column:          { width: "48%" },
  title:           { fontSize: 16, textAlign: "left", marginTop: 2 },
  text:            { fontSize: 10, marginBottom: 2 },
  bold:            { fontWeight: "bold" },
  barcodeImage:    { marginTop: 5 },
  barcodeContainer:{ alignItems: "center" },
});

/**
 * HeaderFatura
 *
 * Props:
 *   Barkodi        — barcode / invoice number string
 *   NrFaqes / NrFaqeve — page numbers
 *   isPDF          — boolean
 *   data           — { fatura, siteTeDhenat }
 *
 * siteTeDhenat → from useSiteSettings() (SiteSettings model)
 * Logo is served by the FRONTEND at /img/web/<filename>, NOT the API.
 */
function HeaderFatura({ faturaID, Barkodi, NrFaqes, NrFaqeve, isPDF, data }) {
  const { fatura, siteTeDhenat } = data || {};
  const barcodeRef = useRef(null);

  // Logo: served at /img/web/<file> by the Vite dev server / static hosting.
  // For PDF we need an absolute URL.
  const hasLogo = siteTeDhenat?.logo && siteTeDhenat.logo !== "PaLogo.png";
  const logoSrcHTML = hasLogo ? `/img/web/${siteTeDhenat.logo}` : null;
  const logoSrcPDF  = hasLogo ? `${window.location.origin}/img/web/${siteTeDhenat.logo}` : null;

  const generateBarcodeDataUrl = () => {
    if (!Barkodi) return null;
    try {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, Barkodi, { width: 2, height: 40, fontSize: 15, margin: 6, displayValue: true });
      return canvas.toDataURL("image/png");
    } catch (e) {
      console.warn("Barcode generation failed:", e);
      return null;
    }
  };

  const hasClient = fatura?.klientiEmri || fatura?.klientiAdresa ||
                    fatura?.klientiTelefoni || fatura?.klientiEmail;

  // ── PDF render ─────────────────────────────────────────────────────────────
  if (isPDF) {
    const barcodeDataUrl = Barkodi ? generateBarcodeDataUrl() : null;

    return (
      <View style={styles.header}>
        {/* Left — company info */}
        <View style={styles.column}>
          {logoSrcPDF && (
            <Image src={logoSrcPDF} style={{ width: 80, height: 40, objectFit: "contain", marginBottom: 4 }} />
          )}
          <Text style={[styles.title, styles.bold]}>{siteTeDhenat?.siteEmri || ""}</Text>
          {siteTeDhenat?.adresa && (
            <Text style={styles.text}><Text style={styles.bold}>Adresa: </Text>{siteTeDhenat.adresa}</Text>
          )}
          {(siteTeDhenat?.telefoni || siteTeDhenat?.email) && (
            <Text style={styles.text}>
              <Text style={styles.bold}>Kontakti: </Text>
              {siteTeDhenat.telefoni || ""}{siteTeDhenat.email ? ` - ${siteTeDhenat.email}` : ""}
            </Text>
          )}
          <Text style={styles.text}>
            <Text style={styles.bold}>Data e Faturës: </Text>
            {new Date(fatura?.dataRegjistrimit || Date.now()).toLocaleDateString("en-GB")}
          </Text>
          {fatura?.shenime && (
            <Text style={styles.text}><Text style={styles.bold}>Shënime: </Text>{fatura.shenime}</Text>
          )}
          <Text style={styles.bold}>Faqe: {NrFaqes} / {NrFaqeve}</Text>
        </View>

        {/* Right — document type, barcode, client */}
        <View style={styles.column}>
          <View style={styles.barcodeContainer}>
            <Text style={[styles.title, styles.bold]}>{fatura?.titulli || "FATURE"}</Text>
            {barcodeDataUrl && <Image src={barcodeDataUrl} style={styles.barcodeImage} />}
          </View>
          {hasClient && (
            <View style={{ marginTop: 6, borderWidth: 1, borderColor: "black", padding: 4 }}>
              {fatura.klientiEmri    && <Text style={[styles.text, styles.bold]}>{fatura.klientiEmri}</Text>}
              {fatura.klientiAdresa  && <Text style={styles.text}>{fatura.klientiAdresa}</Text>}
              {(fatura.klientiTelefoni || fatura.klientiEmail) && (
                <Text style={styles.text}>
                  {fatura.klientiTelefoni || ""}
                  {fatura.klientiEmail ? ` - ${fatura.klientiEmail}` : ""}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }

  // ── HTML render ────────────────────────────────────────────────────────────
  return (
    <div className="header">
      <div className="teDhenatKompanis">
        {logoSrcHTML && (
          <img src={logoSrcHTML} alt="Logo" style={{ width: "80px", height: "40px", objectFit: "contain" }} />
        )}
        <h2>{siteTeDhenat?.siteEmri || ""}</h2>
        {siteTeDhenat?.adresa && (
          <p><strong>Adresa: </strong>{siteTeDhenat.adresa}</p>
        )}
        {(siteTeDhenat?.telefoni || siteTeDhenat?.email) && (
          <p>
            <strong>Kontakti: </strong>
            {siteTeDhenat.telefoni || ""}{siteTeDhenat.email ? ` - ${siteTeDhenat.email}` : ""}
          </p>
        )}
        <p>
          <strong>Data e Faturës: </strong>
          {new Date(fatura?.dataRegjistrimit || Date.now()).toLocaleDateString("en-GB")}
        </p>
        {fatura?.shenime && <p><strong>Shënime: </strong>{fatura.shenime}</p>}
      </div>

      <div className="data">
        <div className="barkodi">
          <h3>{fatura?.titulli || "FATURE"}</h3>
          {Barkodi && (
            <Barcode value={Barkodi} height={50} width={1} fontSize={12} ref={barcodeRef} />
          )}
        </div>
        {/* Only render client box if there's actually client data */}
        {hasClient && (
          <div className="teDhenatEKlientit">
            {fatura.klientiEmri    && <p><strong>{fatura.klientiEmri}</strong></p>}
            {fatura.klientiAdresa  && <p>{fatura.klientiAdresa}</p>}
            {(fatura.klientiTelefoni || fatura.klientiEmail) && (
              <p>
                {fatura.klientiTelefoni || ""}
                {fatura.klientiEmail ? ` - ${fatura.klientiEmail}` : ""}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderFatura;
