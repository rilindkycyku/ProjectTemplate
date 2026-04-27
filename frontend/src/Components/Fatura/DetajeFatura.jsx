import "./Styles/Fatura.css";
import { View, StyleSheet, Font } from "@react-pdf/renderer";
import HeaderFatura from "./HeaderFatura";
import TeDhenatFatura from "./TeDhenatFatura";
import FooterFatura from "./FooterFatura";

Font.register({
  family: "Quicksand",
  fonts: [
    { src: "/fonts/Quicksand-Regular.ttf" },
    { src: "/fonts/Quicksand-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Quicksand-SemiBold.ttf", fontWeight: 600 },
  ],
});


const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 11, fontFamily: "Quicksand" },
  hr:   { borderBottomWidth: 1, borderColor: "black", marginVertical: 5 },
});

/**
 * DetajeFatura — Page wrapper used for PDF pagination.
 * Renders one "page" of a multi-page invoice.
 *
 * Props: same as Fatura.jsx passes down.
 */
function DetajeFatura({ nrFatures, Barkodi, ProduktiPare, ProduktiFundit, LargoFooter, NrFaqes, NrFaqeve, isPDF, data, forceFooterNewPage = false }) {
  const { artikujt } = data;
  const pageItems = artikujt.slice(ProduktiPare, ProduktiFundit);

  if (isPDF) {
    if (pageItems.length === 0) return null;

    return (
      <View style={styles.page}>
        <HeaderFatura faturaID={nrFatures} Barkodi={Barkodi} NrFaqes={NrFaqes} NrFaqeve={NrFaqeve} isPDF={true} data={data} />
        <View style={styles.hr} />
        <TeDhenatFatura ProduktiPare={ProduktiPare} ProduktiFundit={ProduktiFundit} isPDF={true} data={data} />
        {!LargoFooter && !forceFooterNewPage && (
          <View>
            <View style={styles.hr} />
            <FooterFatura Barkodi={Barkodi} isPDF={true} data={data} />
          </View>
        )}
      </View>
    );
  }

  return (
    <div style={{ height: "100%" }}>
      <HeaderFatura faturaID={nrFatures} Barkodi={Barkodi} NrFaqes={NrFaqes} NrFaqeve={NrFaqeve} isPDF={false} data={data} />
      <hr style={{ height: "1px", borderWidth: 0, backgroundColor: "black", margin: "0.5em 0" }} />
      <TeDhenatFatura ProduktiPare={ProduktiPare} ProduktiFundit={ProduktiFundit} isPDF={false} data={data} />
      {!LargoFooter && !forceFooterNewPage && (
        <div>
          <hr style={{ height: "1px", borderWidth: 0, backgroundColor: "black", margin: "0.5em 0" }} />
          <FooterFatura Barkodi={Barkodi} isPDF={false} data={data} />
        </div>
      )}
    </div>
  );
}

export default DetajeFatura;
