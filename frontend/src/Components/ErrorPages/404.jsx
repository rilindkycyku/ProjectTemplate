import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot, faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";
import { Helmet } from "react-helmet-async";

function NukUGjet() {
  const navigate = useNavigate();

  return (
    <div className="bg-bg-darker min-h-screen flex flex-col">
      <Helmet>
        <title>Nuk u Gjet | 404</title>
      </Helmet>

      <NavBar />
      <div className="orb-bg" />

      <main className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="glass-card text-center border border-white/10 rounded-3xl p-16 max-w-lg w-full shadow-[0_25px_50px_rgba(0,0,0,0.4)]"
          data-aos="zoom-in">

          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6
            shadow-[0_8px_24px_rgba(99,102,241,0.15)] text-indigo-400">
            <FontAwesomeIcon icon={faMapLocationDot} className="text-5xl" />
          </div>

          {/* Code */}
          <h1 className="text-[5rem] font-black leading-none mb-2 tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            404
          </h1>

          <h2 className="text-2xl font-bold text-white mb-3">Faqja nuk u Gjet</h2>

          <p className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto mb-8">
            Na vjen keq, por faqja që po kërkoni nuk ekziston ose mund të jetë
            zhvendosur.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-300
                hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Mbrapa
            </button>
            <button
              onClick={() => navigate("/")}
              className="btn-premium flex items-center gap-2 text-sm"
            >
              <FontAwesomeIcon icon={faHome} /> Ballina
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default NukUGjet;
