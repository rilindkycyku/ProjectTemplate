import "./Styles/Fatura.css";
import { View, Text, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Quicksand",
  fonts: [
    { src: "/fonts/Quicksand-Regular.ttf" },
    { src: "/fonts/Quicksand-Bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, fontFamily: "Quicksand" },
  column: { width: "48%", fontSize: 9 },
  bold: { fontWeight: "bold", marginTop: 6 },
  boldT: { fontWeight: "bold" },
  hr: { borderBottomWidth: 1, borderColor: "black", marginVertical: 5 },
  signatures: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  signature: { textAlign: "center", fontSize: 7, marginTop: 20 },
  bankTable: { width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#ccc", marginTop: 5 },
  bankRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc" },
  bankHeader: { backgroundColor: "#f0f0f0" },
  bankCell: { flex: 1, padding: 3, fontSize: 7, textAlign: "center" },
  table: { width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#ccc" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc" },
  header: { backgroundColor: "#f0f0f0" },
  cell: { flex: 1, padding: 3, fontSize: 7, textAlign: "center" },
  total: { fontSize: 14, fontWeight: "bold", textAlign: "right" },
});

const CONVERSION = { USD: 1.1, CHF: 0.95 };

/**
 * FooterFatura — Totals, bank accounts, signature lines.
 *
 * Props:
 *   Barkodi — barcode / invoice number string
 *   isPDF   — boolean
 *   data    — { fatura, bankat }
 *
 * fatura.totaliMeTVSH, fatura.rabati, etc. come from /api/Fatura/ShfaqFaturen/:id
 * bankat comes from /api/Fatura/ShfaqBankat
 */
function FooterFatura({ Barkodi, isPDF, data }) {
  const { fatura, bankat = [] } = data || {};

  const totaliMeTVSH = parseFloat(fatura?.totaliMeTVSH) || 0;
  const rabati       = parseFloat(fatura?.rabati)       || 0;
  const totaliPaTVSH = parseFloat(fatura?.totaliPaTVSH) || 0;
  const tvsh8        = parseFloat(fatura?.tvsh8)        || 0;
  const tvsh18       = parseFloat(fatura?.tvsh18)       || 0;

  const activeBanks = bankat.filter(b => b.isActive !== false);

  const bankTablePDF = () => {
    if (activeBanks.length === 0)
      return <Text style={{ fontSize: 7 }}>Nuk ka të dhëna për bankat.</Text>;

    return (
      <View style={styles.bankTable}>
        <View style={[styles.bankRow, styles.bankHeader]}>
          <Text style={styles.bankCell}>Emri i Bankës</Text>
          <Text style={styles.bankCell}>Numri i Llogarisë</Text>
          <Text style={styles.bankCell}>Valuta</Text>
        </View>
        {activeBanks.map((b, i) => (
          <View style={styles.bankRow} key={b.id || i}>
            <Text style={styles.bankCell}>{b.emriBankes || ""}</Text>
            <Text style={styles.bankCell}>{b.nrLlogaris || ""}</Text>
            <Text style={styles.bankCell}>{b.valuta || ""}</Text>
          </View>
        ))}
      </View>
    );
  };

  const bankTableHTML = () => {
    if (activeBanks.length === 0)
      return <p>Nuk ka të dhëna për bankat.</p>;

    return (
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginTop: "5px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ccc", padding: "4px" }}>Emri i Bankës</th>
            <th style={{ border: "1px solid #ccc", padding: "4px" }}>Numri i Llogarisë</th>
            <th style={{ border: "1px solid #ccc", padding: "4px" }}>Valuta</th>
          </tr>
        </thead>
        <tbody>
          {activeBanks.map((b, i) => (
            <tr key={b.id || i}>
              <td style={{ border: "1px solid #ccc", padding: "4px" }}>{b.emriBankes || ""}</td>
              <td style={{ border: "1px solid #ccc", padding: "4px" }}>{b.nrLlogaris || ""}</td>
              <td style={{ border: "1px solid #ccc", padding: "4px" }}>{b.valuta || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (isPDF) {
    return (
      <View style={{ marginTop: "auto" }}>
        <View style={styles.footer}>
          {/* Left — bank payment info */}
          <View style={styles.column}>
            {Barkodi && (
              <Text style={{ fontSize: 8 }}>
                Gjatë pagesës ju lutem të shkruani numrin e Faturës:{" "}
                <Text style={styles.bold}>{Barkodi}</Text>
              </Text>
            )}
            <Text style={{ fontSize: 8 }}>
              <Text style={styles.bold}>
                Pagesa duhet të bëhet në një nga llogaritë e cekura më poshtë:
              </Text>
            </Text>
            {bankTablePDF()}
          </View>

          {/* Right — totals */}
          <View style={styles.column}>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.boldT, styles.header]}>Nëntotali</Text>
                <Text style={styles.cell}>{(totaliMeTVSH + rabati).toFixed(2)} €</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.boldT, styles.header]}>Rabati</Text>
                <Text style={styles.cell}>{(-rabati).toFixed(2)} €</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.boldT, styles.header]}>Totali Pa TVSH</Text>
                <Text style={styles.cell}>{totaliPaTVSH.toFixed(2)} €</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.boldT, styles.header]}>TVSH 8%</Text>
                <Text style={styles.cell}>{tvsh8.toFixed(2)} €</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.boldT, styles.header]}>TVSH 18%</Text>
                <Text style={styles.cell}>{tvsh18.toFixed(2)} €</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.boldT, styles.header]}>Çmimi Total</Text>
                <Text style={[styles.cell, styles.header, styles.boldT]}>{totaliMeTVSH.toFixed(2)} €</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.boldT, styles.header]}>Çmimi Total $</Text>
                <Text style={[styles.cell, styles.header, styles.boldT]}>
                  {(totaliMeTVSH * CONVERSION.USD).toFixed(2)} $
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.boldT, styles.header]}>Çmimi Total CHF</Text>
                <Text style={[styles.cell, styles.header, styles.boldT]}>
                  {(totaliMeTVSH * CONVERSION.CHF).toFixed(2)} CHF
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.hr} />

        <View style={styles.signatures}>
          <View style={styles.signature}>
            <Text>_________________________________________________</Text>
            <Text>(Emri, Mbiemri, Nënshkrimi &amp; Vula)</Text>
            <Text>(Personi Përgjegjës)</Text>
          </View>
          <View style={styles.signature}>
            <Text>_________________________________________________</Text>
            <Text>(Emri, Mbiemri, Nënshkrimi)</Text>
            <Text>(Klienti)</Text>
          </View>
        </View>
      </View>
    );
  }

  // ── HTML render ────────────────────────────────────────────────────────────
  return (
    <div style={{ marginTop: "auto" }}>
      <div className="header">
        <div className="teDhenatKompanis">
          {Barkodi && (
            <>
              <p>
                Gjatë pagesës ju lutem të shkruani numrin e Faturës:{" "}
                <strong>{Barkodi}</strong>
              </p>
              <p>
                <strong>Pagesa duhet të bëhet në një nga llogaritë e cekura më poshtë:</strong>
              </p>
              {bankTableHTML()}
            </>
          )}
        </div>

        <div className="data">
          <p><strong>Nëntotali: </strong>{(totaliMeTVSH + rabati).toFixed(2)} €</p>
          <p><strong>Rabati: </strong>{(-rabati).toFixed(2)} €</p>
          <p><strong>Totali Pa TVSH: </strong>{totaliPaTVSH.toFixed(2)} €</p>
          <p><strong>TVSH 8%: </strong>{tvsh8.toFixed(2)} €</p>
          <p><strong>TVSH 18%: </strong>{tvsh18.toFixed(2)} €</p>
          <p>
            <strong style={{ fontSize: "14pt" }}>Çmimi Total: </strong>
            <strong style={{ fontSize: "14pt" }}>{totaliMeTVSH.toFixed(2)} €</strong>
          </p>
          <p style={{ fontSize: "10pt" }}>
            {(totaliMeTVSH * CONVERSION.USD).toFixed(2)} $
          </p>
          <p style={{ fontSize: "10pt" }}>
            {(totaliMeTVSH * CONVERSION.CHF).toFixed(2)} CHF
          </p>
        </div>
      </div>

      <hr style={{ height: "1px", borderWidth: 0, backgroundColor: "black", margin: "0.5em 0" }} />

      <div className="nenshkrimet">
        <div className="nenshkrimi">
          <span>_________________________________________________</span>
          <span>(Emri, Mbiemri, Nënshkrimi &amp; Vula)</span>
          <span>(Personi Përgjegjës)</span>
        </div>
        <div className="nenshkrimi">
          <span>_________________________________________________</span>
          <span>(Emri, Mbiemri, Nënshkrimi)</span>
          <span>(Klienti)</span>
        </div>
      </div>
    </div>
  );
}

export default FooterFatura;
