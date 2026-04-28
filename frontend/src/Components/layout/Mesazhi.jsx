import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";

function Mesazhi(props) {
    const handleMesazhiMbyll = () => {
        props.setShfaqMesazhin(false);
    }

    const isSuccess = props.tipi === "success";

    // Prevent body scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleMesazhiMbyll}
            ></div>

            {/* Modal Content */}
            <div className="glass-card relative z-10 w-full max-w-[450px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-[fadeInUp_0.3s_ease-out]">
                <button 
                    onClick={handleMesazhiMbyll}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-transparent border-none text-text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                <div className="mb-6 flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isSuccess ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-secondary/10 text-secondary-light border border-secondary/20'}`}>
                        <FontAwesomeIcon icon={isSuccess ? faCircleCheck : faCircleExclamation} />
                    </div>
                    <h3 className={`m-0 text-2xl ${isSuccess ? 'text-teal-400' : 'text-secondary-light'}`}>
                        {isSuccess ? "Success" : "Error"}
                    </h3>
                </div>

                <div className="text-[1.05rem] text-text-main leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: props.pershkrimi }} />

                <button className="btn-premium w-full py-3" onClick={handleMesazhiMbyll}>
                    Continue
                </button>
            </div>
        </div>,
        document.body
    );
}

export default Mesazhi;
