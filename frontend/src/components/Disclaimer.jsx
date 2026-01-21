import { useSettings } from "@/contexts/SettingsContext";

export const Disclaimer = () => {
    const { showDisclaimer, dismissDisclaimer } = useSettings();
    
    if (!showDisclaimer) return null;
    
    const handleAccept = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dismissDisclaimer();
    };
    
    return (
        <div 
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ 
                backgroundColor: "#000000",
                zIndex: 99999,
                pointerEvents: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div 
                className="max-w-md w-full p-6 text-center"
                style={{ 
                    border: "1px solid #333333",
                    backgroundColor: "#000000",
                }}
            >
                {/* Warning icon */}
                <div 
                    className="w-12 h-12 mx-auto mb-4 flex items-center justify-center"
                    style={{ border: "1px solid #FF0000" }}
                >
                    <span 
                        className="text-2xl font-mono"
                        style={{ color: "#FF0000" }}
                    >
                        !
                    </span>
                </div>
                
                {/* Title */}
                <h2 
                    className="text-sm tracking-[0.3em] mb-4"
                    style={{ color: "#FF0000" }}
                >
                    IMPORTANT NOTICE
                </h2>
                
                {/* Main disclaimer */}
                <div className="space-y-4 mb-6">
                    <p 
                        className="text-[10px] tracking-[0.1em] leading-relaxed"
                        style={{ color: "#CCCCCC" }}
                    >
                        FEAR METER is an <span style={{ color: "#FF0000" }}>experimental entertainment application</span> that simulates biometric monitoring. All data displayed is simulated and does not represent actual physiological measurements.
                    </p>
                    
                    <p 
                        className="text-[10px] tracking-[0.1em] leading-relaxed"
                        style={{ color: "#CCCCCC" }}
                    >
                        This application is <span style={{ color: "#FF0000" }}>NOT a medical device</span> and should not be used for health monitoring, diagnosis, or treatment decisions.
                    </p>
                    
                    <p 
                        className="text-[10px] tracking-[0.1em] leading-relaxed"
                        style={{ color: "#999999" }}
                    >
                        For entertainment and experimental analysis only.
                    </p>
                </div>
                
                {/* Legal text */}
                <div 
                    className="py-3 px-4 mb-6"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.05)",
                        border: "1px solid rgba(255, 0, 0, 0.2)",
                    }}
                >
                    <p 
                        className="text-[8px] tracking-[0.15em]"
                        style={{ color: "#FF0000" }}
                    >
                        BY CONTINUING, YOU ACKNOWLEDGE THAT ALL BIOMETRIC DATA IS SIMULATED AND THIS APPLICATION HAS NO MEDICAL PURPOSE
                    </p>
                </div>
                
                {/* Accept button */}
                <button
                    onClick={handleAccept}
                    className="px-8 py-3 text-[10px] tracking-[0.2em] cursor-pointer"
                    style={{ 
                        backgroundColor: "#FF0000",
                        border: "none",
                        color: "#FFFFFF",
                        pointerEvents: "auto",
                    }}
                    data-testid="disclaimer-accept"
                >
                    I UNDERSTAND
                </button>
                
                {/* Legal footer */}
                <p 
                    className="mt-6 text-[8px] tracking-[0.2em]"
                    style={{ color: "#666666" }}
                >
                    © 2026 FEAR METER — ALL RIGHTS RESERVED
                </p>
                <p 
                    className="mt-1 text-[7px] tracking-[0.15em]"
                    style={{ color: "#444444" }}
                >
                    Experimental Biometric Horror System
                </p>
            </div>
        </div>
    );
};

export default Disclaimer;
