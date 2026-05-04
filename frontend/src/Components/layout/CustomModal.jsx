import { useEffect } from "react";
import "./Styles/ModalDheTabela.css";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

/**
 * CustomModal — Tailwind-based modal using React Portal.
 * Renders directly to document.body, bypassing all stacking contexts
 * (backdrop-filter, transform, etc.) that would trap Bootstrap modals.
 *
 * Props:
 *   show        — boolean, controls visibility
 *   onHide      — function, called on backdrop click or close button
 *   title       — string or JSX
 *   children    — modal body content
 *   footer      — JSX for footer actions (optional)
 *   size        — 'sm' | 'md' | 'lg' | 'xl'  (default: 'md')
 *   closeButton — bool (default: true)
 */
const CustomModal = ({
  show,
  onHide,
  title,
  children,
  footer,
  size = "md",
  closeButton = true,
}) => {
  // Lock body scroll while open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size] ?? "max-w-lg";

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-2 sm:p-4"
      style={{ zIndex: 99999 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onHide}
      />

      {/* Dialog */}
      <div
        className={`relative w-full ${sizeClass} bg-[#0d1424] border border-white/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col max-h-[95vh] md:max-h-[90vh] animate-[modal-in_0.2s_ease-out]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || closeButton) && (
          <div className="flex items-center justify-between p-4 md:p-6 pb-2 md:pb-4 border-b border-white/5 shrink-0">
            {title && (
              <h5 className="text-white font-bold text-base md:text-lg m-0 flex items-center gap-2">
                {title}
              </h5>
            )}
            {closeButton && (
              <button
                onClick={onHide}
                className="ml-auto w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 md:p-6 pt-0 shrink-0 flex items-center justify-end gap-3 border-t border-white/5 mt-2">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default CustomModal;
