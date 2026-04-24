import React, { useState, useEffect } from "react";
import NavBar from "../Components/layout/NavBar";
import Footer from "../Components/layout/Footer";
import { Helmet } from "react-helmet-async";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faUserShield, faUser } from "@fortawesome/free-solid-svg-icons";
import Mesazhi from "../Components/layout/Mesazhi";
import PerditesoTeDhenat from "../Components/Dashboard/PerditesoTeDhenat";
import { useAuth } from "../Context/AuthContext";

const Dashboard = () => {
  const [teDhenat, setTeDhenat] = useState(null);
  const [perditeso, setPerditeso] = useState("");
  const [loading, setLoading] = useState(true);
  const [mbyllPerditesoTeDhenat, setMbyllPerditesoTeDhenat] = useState(true);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState("");
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState("");

  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const vendosTeDhenat = async () => {
      try {
        const response = await apiClient.get(`/Perdoruesi/shfaqSipasID?idUserAspNet=${user.id}`);
        setTeDhenat(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      vendosTeDhenat();
    }
  }, [token, user, navigate, perditeso]);

  const isAdminOrManager = teDhenat?.rolet?.includes("Admin") || teDhenat?.rolet?.includes("Menaxher");

  return (
    <div className="bg-bg-darker min-h-screen flex flex-col">
      <Helmet>
        <title>Dashboard | Project Template</title>
      </Helmet>
      
      <NavBar />
      <div className="orb-bg"></div>

      <main className="flex-1 max-w-[1200px] w-full mx-auto py-16 px-8 relative z-10">
        {loading ? (
          <div className="Loader">
            <TailSpin height="60" width="60" color="#818cf8" visible={true} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8" data-aos="fade-up" data-aos-duration="600">
            <section className="glass-card p-12 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:right-0 after:w-[400px] after:h-[400px] after:bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_60%)] after:translate-x-[30%] after:-translate-y-[30%] after:pointer-events-none sm:p-8">
              <div className="flex items-center gap-8 mb-12 pb-8 border-b border-white/5 md:flex-col md:text-center md:gap-6">
                <div className="w-[100px] h-[100px] bg-gradient-to-br from-primary to-accent rounded-2xl flex justify-center items-center text-5xl text-white shadow-[0_12px_24px_rgba(99,102,241,0.3)] relative border-2 border-white/10 shrink-0">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div>
                  <h3 className="text-[2rem] m-0 mb-1.5 tracking-[-0.02em]">{teDhenat?.perdoruesi?.emri} {teDhenat?.perdoruesi?.mbiemri}</h3>
                  <p className="text-text-muted m-0 text-[1rem]">{teDhenat?.perdoruesi?.email}</p>
                  {isAdminOrManager && (
                    <div className="inline-block mt-2 text-[0.75rem] uppercase tracking-[0.1em] bg-secondary/15 text-secondary-light px-3 py-1 rounded-full font-bold border border-secondary/30">
                      {teDhenat.rolet.includes("Admin") ? "Administrator" : "Manager"}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10 mb-12 md:grid-cols-1 md:gap-6">
                <div className="flex flex-col gap-2 bg-white/[0.02] p-6 rounded-xl border border-white/[0.04]">
                  <label className="text-primary-light text-[0.75rem] uppercase tracking-[0.1em] font-bold">Username</label>
                  <span className="text-[1.15rem] font-medium text-white">{teDhenat?.perdoruesi?.username}</span>
                </div>
                <div className="flex flex-col gap-2 bg-white/[0.02] p-6 rounded-xl border border-white/[0.04]">
                  <label className="text-primary-light text-[0.75rem] uppercase tracking-[0.1em] font-bold">Phone</label>
                  <span className="text-[1.15rem] font-medium text-white">{teDhenat?.perdoruesi?.teDhenatPerdoruesit?.nrKontaktit || "Not set"}</span>
                </div>
                <div className="col-span-2 flex flex-col gap-2 bg-white/[0.02] p-6 rounded-xl border border-white/[0.04] md:col-span-1">
                  <label className="text-primary-light text-[0.75rem] uppercase tracking-[0.1em] font-bold">Address</label>
                  <span className="text-[1.15rem] font-medium text-white">{teDhenat?.perdoruesi?.teDhenatPerdoruesit ? 
                    `${teDhenat.perdoruesi.teDhenatPerdoruesit.adresa}, ${teDhenat.perdoruesi.teDhenatPerdoruesit.qyteti}` : 
                    "Not set"}</span>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap md:flex-col">
                <button
                  onClick={() => setMbyllPerditesoTeDhenat(false)}
                  className="btn-premium"
                >
                  <FontAwesomeIcon icon={faPenToSquare} /> Update Profile
                </button>

                {isAdminOrManager && (
                  <button 
                    className="btn-premium bg-gradient-to-br from-accent to-secondary shadow-[0_4px_14px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.5)]" 
                    onClick={() => navigate('/admin-dashboard')}
                  >
                    <FontAwesomeIcon icon={faUserShield} /> Admin Console
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {shfaqMesazhin && (
          <Mesazhi
            setShfaqMesazhin={setShfaqMesazhin}
            pershkrimi={pershkrimiMesazhit}
            tipi={tipiMesazhit}
          />
        )}
      </main>

      {!mbyllPerditesoTeDhenat && (
        <PerditesoTeDhenat
          setMbyllPerditesoTeDhenat={() => setMbyllPerditesoTeDhenat(true)}
          perditeso={() => setPerditeso(Date.now())}
          setShfaqMesazhin={() => setShfaqMesazhin(true)}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
          setTipiMesazhit={setTipiMesazhit}
        />
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
