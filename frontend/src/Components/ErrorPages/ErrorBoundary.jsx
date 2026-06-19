import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faArrowRotateRight, faHouse } from "@fortawesome/free-solid-svg-icons";

/**
 * ErrorBoundary — catches uncaught render errors anywhere below it and shows
 * a fallback instead of a blank white screen.
 *
 * Deliberately does NOT reuse NavBar/Footer or any Context (Auth, SiteSettings):
 * if the crash originated in one of those, reusing them in the fallback would
 * just crash again. Navigation uses window.location, not react-router, for the
 * same reason — it must not depend on anything that could be broken.
 */
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught render error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-bg-darker flex items-center justify-center px-6 py-20">
        <div className="glass-card text-center border border-white/10 rounded-3xl p-12 max-w-lg w-full shadow-[0_25px_50px_rgba(0,0,0,0.4)]">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-red-400">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-4xl" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">Ndodhi një gabim i papritur</h1>
          <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto mb-8">
            Diçka shkoi keq dhe faqja nuk mund të vazhdojë normalisht. Provoni të rifreskoni
            faqen ose kthehuni në ballinë.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-text-muted hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
            >
              <FontAwesomeIcon icon={faArrowRotateRight} /> Rifresko
            </button>
            <button
              onClick={() => { window.location.href = "/"; }}
              className="btn-premium flex items-center gap-2 text-sm"
            >
              <FontAwesomeIcon icon={faHouse} /> Ballina
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
