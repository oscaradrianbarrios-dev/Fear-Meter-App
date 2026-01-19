import { useMemo } from "react";

export const ExpirationWarning = ({
    visible,
    hoursLeft,
    onRecalibrate,
    language = "EN",
}) => {
    const texts = useMemo(() => ({
        EN: {
            warning: "CALIBRATION EXPIRING",
            hoursLeft: (h) => `${h} HOUR${h !== 1 ? 'S' : ''} REMAINING`,
            recalibrate: "RECALIBRATE NOW",
            dismiss: "DISMISS",
        },
        ES: {
            warning: "CALIBRACIÓN EXPIRANDO",
            hoursLeft: (h) => `${h} HORA${h !== 1 ? 'S' : ''} RESTANTE${h !== 1 ? 'S' : ''}`,
            recalibrate: "RECALIBRAR AHORA",
            dismiss: "DESCARTAR",
        },
    }), []);
    
    const t = texts[language] || texts.EN;
    
    if (!visible) return null;
    
    return (
        <div 
            className="fixed top-16 left-4 right-4 z-30 py-3 px-4"
            style={{ 
                backgroundColor: "rgba(139, 0, 0, 0.95)",
                border: "1px solid rgba(255, 0, 0, 0.4)",
                boxShadow: "0 4px 20px rgba(139, 0, 0, 0.3)",
            }}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {/* Warning icon */}
                        <div 
                            className="w-2 h-2 rounded-full"
                            style={{ 
                                backgroundColor: "#FF0000",
                                animation: "pulse-warning 1s ease-in-out infinite",
                            }}
                        />
                        <span 
                            className="text-[9px] tracking-[0.2em] font-bold"
                            style={{ color: "#FF0000" }}
                        >
                            {t.warning}
                        </span>
                    </div>
                    <p 
                        className="text-[8px] tracking-[0.15em]"
                        style={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                        {t.hoursLeft(hoursLeft || 0)}
                    </p>
                </div>
                
                <button
                    onClick={onRecalibrate}
                    className="py-1.5 px-3 text-[8px] tracking-[0.15em] transition-all duration-200"
                    style={{ 
                        backgroundColor: "#FF0000",
                        color: "#000000",
                        border: "none",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 0, 0, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    {t.recalibrate}
                </button>
            </div>
            
            {/* CSS Animation */}
            <style>{`
                @keyframes pulse-warning {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }
            `}</style>
        </div>
    );
};

export default ExpirationWarning;
