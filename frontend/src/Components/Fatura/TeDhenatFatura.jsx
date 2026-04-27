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
  table: { width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#ccc", fontFamily: "Quicksand" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc" },
  header: { backgroundColor: "#f0f0f0", fontWeight: "bold" },
  cell: { padding: 3, fontSize: 7, textAlign: "center" },
  cellNr:          { width: "5%" },
  cellShifra:      { width: "10%", padding: 3, fontSize: 7, textAlign: "center" },
  cellEmertimi:    { width: "25%", padding: 3, fontSize: 7, textAlign: "left" },
  cellNjm:         { width: "5%" },
  cellSasia:       { width: "6%" },
  cellQmPaTVSH:    { width: "8%" },
  cellRab1:        { width: "6%" },
  cellRab2:        { width: "6%" },
  cellRab3:        { width: "6%" },
  cellTVSHRate:    { width: "5%" },
  cellQmMeRabat:   { width: "10%" },
  cellTVSHValue:   { width: "8%" },
  cellShuma:       { width: "10%" },
});

/**
 * TeDhenatFatura — Line items table.
 *
 * Props:
 *   ProduktiPare   — start index in artikujt array (for PDF pagination)
 *   ProduktiFundit — end index
 *   isPDF          — boolean
 *   data           — { artikujt: FaturaArtikujtItem[] }
 *
 * Matches FaturaArtikujtItem model: kodi, emri, njesia, sasia, cmimi, rabati1/2/3, tvsh
 */
function TeDhenatFatura({ ProduktiPare, ProduktiFundit, isPDF, data }) {
  const { artikujt } = data || {};

  const rows = artikujt?.slice(ProduktiPare, ProduktiFundit).map((artikulli, index) => {
    const cmimi    = parseFloat(artikulli.cmimi)    || 0;
    const sasia    = parseFloat(artikulli.sasia)    || 0;
    const tvshRate = parseFloat(artikulli.tvsh)     || 0;
    const rabati1  = parseFloat(artikulli.rabati1)  || 0;
    const rabati2  = parseFloat(artikulli.rabati2)  || 0;
    const rabati3  = parseFloat(artikulli.rabati3)  || 0;

    const totalRabati  = (rabati1 + rabati2 + rabati3) / 100;
    const cmimiPaTVSH  = cmimi / (1 + tvshRate / 100);
    const cmimiMeRabat = cmimi * (1 - totalRabati);
    const tvshVlera    = cmimiMeRabat * (tvshRate / 100) * sasia;
    const shuma        = cmimiMeRabat * sasia;

    return { artikulli, index, cmimiPaTVSH, rabati1, rabati2, rabati3, tvshRate, cmimiMeRabat, tvshVlera, shuma, sasia };
  }) || [];

  if (isPDF) {
    return (
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.cellNr]}>Nr.</Text>
          <Text style={[styles.cell, styles.cellShifra]}>Kodi</Text>
          <Text style={[styles.cell, styles.cellEmertimi]}>Emërtimi</Text>
          <Text style={[styles.cell, styles.cellNjm]}>Njm</Text>
          <Text style={[styles.cell, styles.cellSasia]}>Sasia</Text>
          <Text style={[styles.cell, styles.cellQmPaTVSH]}>Çm. - TVSH</Text>
          <Text style={[styles.cell, styles.cellRab1]}>Rab. 1 %</Text>
          <Text style={[styles.cell, styles.cellRab2]}>Rab. 2 %</Text>
          <Text style={[styles.cell, styles.cellRab3]}>Rab. 3 %</Text>
          <Text style={[styles.cell, styles.cellTVSHRate]}>T %</Text>
          <Text style={[styles.cell, styles.cellQmMeRabat]}>Çm. + TVSH - Rab</Text>
          <Text style={[styles.cell, styles.cellTVSHValue]}>TVSH €</Text>
          <Text style={[styles.cell, styles.cellShuma]}>Shuma €</Text>
        </View>
        {rows.map(({ artikulli, index, cmimiPaTVSH, rabati1, rabati2, rabati3, tvshRate, cmimiMeRabat, tvshVlera, shuma, sasia }) => (
          <View style={styles.row} key={index}>
            <Text style={[styles.cell, styles.cellNr]}>{ProduktiPare + index + 1}</Text>
            <Text style={[styles.cell, styles.cellShifra]}>{artikulli.kodi || ""}</Text>
            <Text style={[styles.cell, styles.cellEmertimi]}>{artikulli.emri || ""}</Text>
            <Text style={[styles.cell, styles.cellNjm]}>{artikulli.njesia || ""}</Text>
            <Text style={[styles.cell, styles.cellSasia]}>{sasia.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.cellQmPaTVSH]}>{cmimiPaTVSH.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.cellRab1]}>{rabati1.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.cellRab2]}>{rabati2.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.cellRab3]}>{rabati3.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.cellTVSHRate]}>{tvshRate}</Text>
            <Text style={[styles.cell, styles.cellQmMeRabat]}>{cmimiMeRabat.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.cellTVSHValue]}>{tvshVlera.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.cellShuma]}>{shuma.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <div className="tabelaETeDhenaveProduktit">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th className="col-nr">Nr.</th>
              <th className="col-shifra">Kodi</th>
              <th className="col-emertimi">Emërtimi</th>
              <th className="col-njm">Njm</th>
              <th className="col-sasia">Sasia</th>
              <th className="col-qm-pa-tvsh">Çm. - TVSH</th>
              <th className="col-rab1">Rab. 1 %</th>
              <th className="col-rab2">Rab. 2 %</th>
              <th className="col-rab3">Rab. 3 %</th>
              <th className="col-tvsh-rate">T %</th>
              <th className="col-qm-me-rabat">Çm. + TVSH - Rab</th>
              <th className="col-tvsh-value">TVSH €</th>
              <th className="col-shuma">Shuma €</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ artikulli, index, cmimiPaTVSH, rabati1, rabati2, rabati3, tvshRate, cmimiMeRabat, tvshVlera, shuma, sasia }) => (
              <tr key={index}>
                <td className="col-nr">{ProduktiPare + index + 1}</td>
                <td className="col-shifra">{artikulli.kodi || ""}</td>
                <td className="col-emertimi">{artikulli.emri || ""}</td>
                <td className="col-njm">{artikulli.njesia || ""}</td>
                <td className="col-sasia">{sasia.toFixed(2)}</td>
                <td className="col-qm-pa-tvsh">{cmimiPaTVSH.toFixed(2)}</td>
                <td className="col-rab1">{rabati1.toFixed(2)}</td>
                <td className="col-rab2">{rabati2.toFixed(2)}</td>
                <td className="col-rab3">{rabati3.toFixed(2)}</td>
                <td className="col-tvsh-rate">{tvshRate}</td>
                <td className="col-qm-me-rabat">{cmimiMeRabat.toFixed(2)}</td>
                <td className="col-tvsh-value">{tvshVlera.toFixed(2)}</td>
                <td className="col-shuma">{shuma.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeDhenatFatura;
