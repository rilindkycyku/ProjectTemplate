import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faArrowLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";
import { adminDropdowns } from "./adminDropdowns";
import { useAuth } from "../../Context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const userRoles = useMemo(
    () => (Array.isArray(user?.role) ? user.role : [user?.role].filter(Boolean)),
    [user]
  );
  // Filter the config down to what this user is allowed to see.
  const visibleCategories = useMemo(() => {
    const hasRole = (roles) => !roles || roles.some((r) => userRoles.includes(r));
    return adminDropdowns
      .map((cat) => ({ ...cat, items: cat.items.filter((item) => hasRole(item.roles)) }))
      .filter((cat) => cat.items.length > 0);
  }, [userRoles]);

  const allVisibleItems = useMemo(
    () => visibleCategories.flatMap((cat) => cat.items),
    [visibleCategories]
  );

  const [activeTab, setActiveTab] = useState(() => allVisibleItems[0]?.key ?? null);
  const [expandedCategories, setExpandedCategories] = useState(
    () => Object.fromEntries(adminDropdowns.map((cat) => [cat.key, true]))
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const activeItem = allVisibleItems.find((item) => item.key === activeTab);
  const ActiveComponent = activeItem?.component;

  return (
    <div className="bg-bg-darker min-h-screen flex flex-col">
      <Helmet>
        <title>Admin Console | Project Template</title>
      </Helmet>
      
      <NavBar />
      <div className="orb-bg"></div>

      <main className="flex-1 max-w-[1600px] w-full mx-auto py-6 px-4 md:py-12 md:px-6 relative z-10 flex flex-col">
        <div className="glass-card w-full flex relative flex-1 shadow-[0_0_50px_rgba(0,0,0,0.2)] border border-white/10 rounded-2xl overflow-hidden min-h-[600px] md:min-h-[750px]">
          
          {/* Mobile Sidebar Backdrop */}
          {sidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar Toggle FAB */}
          <button 
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-2xl z-[100] flex items-center justify-center text-xl border-2 border-white/20 transition-transform duration-300"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon icon={faCogs} className={`transition-transform duration-300 ${sidebarOpen ? "rotate-90" : ""}`} />
          </button>

          {/* Sidebar SubNav */}
          <aside className={`
            fixed inset-y-0 left-0 w-72 bg-[#0a0f1d] z-[90] transition-transform duration-300 transform 
            md:relative md:translate-x-0 md:bg-black/20 border-r border-white/10 flex flex-col shadow-xl flex-shrink-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
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

              {/* Categories + items rendered directly from adminDropdowns config */}
              {visibleCategories.map((cat) => (
                <div className="mb-4 mt-6 first:mt-0" key={cat.key}>
                  <button
                    className="w-full flex items-center justify-between text-[0.75rem] font-bold text-text-muted uppercase tracking-[0.1em] mb-2 px-2 hover:text-white transition-colors"
                    onClick={() => toggleCategory(cat.key)}
                  >
                    <span className="flex items-center gap-2"><FontAwesomeIcon icon={cat.icon} /> {cat.label}</span>
                    <FontAwesomeIcon icon={faChevronRight} className={`transition-transform duration-300 ${expandedCategories[cat.key] ? 'rotate-90' : ''}`} />
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-1 ${expandedCategories[cat.key] ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {cat.items.map((item) => (
                      <button
                        key={item.key}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.key ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'text-text-muted hover:bg-white/5 hover:text-white border border-transparent'}`}
                        onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
                      >
                        <FontAwesomeIcon icon={item.icon} className="w-4" /> {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-bg-darker/50">
            {/* Context Header */}
            <div className="h-16 md:h-20 border-b border-white/5 bg-white/[0.02] flex items-center px-4 md:px-8 shadow-sm">
              <h3 className="text-lg md:text-xl font-bold text-white m-0">
                {activeItem?.headerTitle ?? 'Admin Area'}
              </h3>
            </div>

            {/* Component Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
