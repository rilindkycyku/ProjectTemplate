import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartLine, faCogs, faArrowLeft, faShieldHalved, faServer, faDatabase, faChevronRight, faGlobe, faFileInvoice, faFileInvoiceDollar, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";
import TabelaEPerdoruesve from "../users/TabelaEPerdoruesve";
import Statistika from "./Statistika";
import CilesimiSajtit from "./CilesimiSajtit";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [expandedCategories, setExpandedCategories] = useState({
    identity: true,
    system: true,
    siteConfig: true,
    modules: true,
  });
  
  const navigate = useNavigate();

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="bg-bg-darker min-h-screen flex flex-col">
      <Helmet>
        <title>Admin Console | Project Template</title>
      </Helmet>
      
      <NavBar />
      <div className="orb-bg"></div>

      <main className="flex-1 max-w-[1600px] w-full mx-auto py-12 px-6 relative z-10 flex flex-col">
        <div className="glass-card w-full flex relative flex-1 shadow-[0_0_50px_rgba(0,0,0,0.2)] border border-white/10 rounded-2xl overflow-hidden min-h-[750px]">
          
          {/* Sidebar SubNav */}
          <aside className="w-72 bg-black/20 border-r border-white/10 flex flex-col z-10 shadow-xl flex-shrink-0">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl shadow-[0_4px_15px_rgba(99,102,241,0.3)]">
                  <FontAwesomeIcon icon={faCogs} />
                </div>
                <div>
                  <h2 className="text-xl font-bold m-0 text-white leading-tight">Admin Console</h2>
                  <span className="text-[0.7rem] uppercase tracking-wider text-primary-light font-bold">Portal</span>
                </div>
              </div>
              <button 
                className="w-full btn-premium py-2 text-[0.8rem] flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10"
                onClick={() => navigate('/Dashboard')}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Profile
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
              
              {/* Category: Identity & Access */}
              <div className="mb-4">
                <button 
                  className="w-full flex items-center justify-between text-[0.75rem] font-bold text-text-muted uppercase tracking-[0.1em] mb-2 px-2 hover:text-white transition-colors"
                  onClick={() => toggleCategory('identity')}
                >
                  <span className="flex items-center gap-2"><FontAwesomeIcon icon={faShieldHalved} /> Identity & Access</span>
                  <FontAwesomeIcon icon={faChevronRight} className={`transition-transform duration-300 ${expandedCategories.identity ? 'rotate-90' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-1 ${expandedCategories.identity ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'text-text-muted hover:bg-white/5 hover:text-white border border-transparent'}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <FontAwesomeIcon icon={faUsers} className="w-4" /> User Directory
                  </button>
                </div>
              </div>

              {/* Category: System & Performance */}
              <div className="mb-4 mt-6">
                <button 
                  className="w-full flex items-center justify-between text-[0.75rem] font-bold text-text-muted uppercase tracking-[0.1em] mb-2 px-2 hover:text-white transition-colors"
                  onClick={() => toggleCategory('system')}
                >
                  <span className="flex items-center gap-2"><FontAwesomeIcon icon={faServer} /> System Operations</span>
                  <FontAwesomeIcon icon={faChevronRight} className={`transition-transform duration-300 ${expandedCategories.system ? 'rotate-90' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-1 ${expandedCategories.system ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'stats' ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'text-text-muted hover:bg-white/5 hover:text-white border border-transparent'}`}
                    onClick={() => setActiveTab('stats')}
                  >
                    <FontAwesomeIcon icon={faChartLine} className="w-4" /> System Analytics
                  </button>
                  <button 
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-text-muted hover:bg-white/5 hover:text-white border border-transparent`}
                    onClick={() => alert('Future feature: System Logs & Databases')}
                  >
                    <FontAwesomeIcon icon={faDatabase} className="w-4" /> Backup & Logs
                  </button>
                </div>
              </div>

              {/* Category: Site Configuration */}
              <div className="mb-4 mt-6">
                <button
                  className="w-full flex items-center justify-between text-[0.75rem] font-bold text-text-muted uppercase tracking-[0.1em] mb-2 px-2 hover:text-white transition-colors"
                  onClick={() => toggleCategory('siteConfig')}
                >
                  <span className="flex items-center gap-2"><FontAwesomeIcon icon={faGlobe} /> Site Config</span>
                  <FontAwesomeIcon icon={faChevronRight} className={`transition-transform duration-300 ${expandedCategories.siteConfig ? 'rotate-90' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-1 ${expandedCategories.siteConfig ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'siteSettings' ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'text-text-muted hover:bg-white/5 hover:text-white border border-transparent'}`}
                    onClick={() => setActiveTab('siteSettings')}
                  >
                    <FontAwesomeIcon icon={faGlobe} className="w-4" /> Site Settings
                  </button>
                </div>
              </div>

              {/* Category: Modules */}
              <div className="mb-4 mt-6">
                <button
                  className="w-full flex items-center justify-between text-[0.75rem] font-bold text-text-muted uppercase tracking-[0.1em] mb-2 px-2 hover:text-white transition-colors"
                  onClick={() => toggleCategory('modules')}
                >
                  <span className="flex items-center gap-2"><FontAwesomeIcon icon={faFileInvoice} /> Modules</span>
                  <FontAwesomeIcon icon={faChevronRight} className={`transition-transform duration-300 ${expandedCategories.modules ? 'rotate-90' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-1 ${expandedCategories.modules ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-text-muted hover:bg-white/5 hover:text-white border border-transparent"
                    onClick={() => navigate('/Faturat')}
                  >
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="w-4" /> Faturat
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-text-muted hover:bg-white/5 hover:text-white border border-transparent"
                    onClick={() => navigate('/Bankat')}
                  >
                    <FontAwesomeIcon icon={faUniversity} className="w-4" /> Llogaritë Bankare
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-text-muted hover:bg-white/5 hover:text-white border border-transparent"
                    onClick={() => navigate('/Klientet')}
                  >
                    <FontAwesomeIcon icon={faUsers} className="w-4" /> Klientët
                  </button>
                </div>
              </div>

            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-bg-darker/50">
            {/* Context Header */}
            <div className="h-20 border-b border-white/5 bg-white/[0.02] flex items-center px-8 shadow-sm">
              <h3 className="text-xl font-bold text-white m-0">
                {activeTab === 'users' ? 'User Directory Management'
                  : activeTab === 'stats' ? 'System Statistics & Health'
                  : activeTab === 'siteSettings' ? 'Site Configuration'
                  : 'Admin Area'}
              </h3>
            </div>

            {/* Component Content */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {activeTab === 'users' && <TabelaEPerdoruesve />}
              {activeTab === 'stats' && <Statistika />}
              {activeTab === 'siteSettings' && <CilesimiSajtit />}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
