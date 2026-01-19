import { useEffect, useState, useMemo, useRef } from "react";
import { RESPONSE_TYPE } from "@/hooks/useCalibration";

export const ResponseIndicator = ({
    responseType,
    isCalibrated,
    isActive,
    language = "EN",
}) => {
    const [flashing, setFlashing] = useState(false);
    const prevResponseRef = useRef(responseType);
    
    // Derive visibility from props
    const visible = useMemo(() => {
        return isActive && responseType !== RESPONSE_TYPE.NONE;
    }, [isActive, responseType]);
    
    const texts = {
        EN: {
            [RESPONSE_TYPE.NONE]: "MONITORING...",
            [RESPONSE_TYPE.EXERCISE]: "PHYSICAL ACTIVITY DETECTED",
            [RESPONSE_TYPE.FEAR]: "FEAR RESPONSE CONFIRMED",
            [RESPONSE_TYPE.STRESS]: "STRESS WITHOUT MOVEMENT",
            [RESPONSE_TYPE.ANXIETY]: "ANXIETY PATTERN IDENTIFIED",
            notCalibrated: "CALIBRATION REQUIRED",
            inactive: "SESSION INACTIVE",
        },
        ES: {
            [RESPONSE_TYPE.NONE]: "MONITOREANDO...",
            [RESPONSE_TYPE.EXERCISE]: "ACTIVIDAD FÍSICA DETECTADA",
            [RESPONSE_TYPE.FEAR]: "RESPUESTA DE MIEDO CONFIRMADA",
            [RESPONSE_TYPE.STRESS]: "ESTRÉS SIN MOVIMIENTO",
            [RESPONSE_TYPE.ANXIETY]: "PATRÓN DE ANSIEDAD IDENTIFICADO",
            notCalibrated: "CALIBRACIÓN REQUERIDA",
            inactive: "SESIÓN INACTIVA",
        },
    };
    
    const t = texts[language];
    
    // Show indicator when response changes
    useEffect(() => {
        if (isActive && responseType !== RESPONSE_TYPE.NONE) {
            setVisible(true);
            setFlashing(true);
            
            // Stop flashing after 2 seconds
            const flashTimeout = setTimeout(() => setFlashing(false), 2000);
            
            return () => clearTimeout(flashTimeout);
        }
    }, [responseType, isActive]);
    
    // Get display text
    const getDisplayText = () => {
        if (!isActive) return t.inactive;
        if (!isCalibrated) return t.notCalibrated;
        return t[responseType] || t[RESPONSE_TYPE.NONE];
    };
    
    // Get color based on response type
    const getColor = () => {
        if (!isActive || !isCalibrated) {
            return "rgba(176, 176, 176, 0.4)";
        }
        
        switch (responseType) {
            case RESPONSE_TYPE.EXERCISE:
                return "rgba(255, 0, 0, 0.5)"; // Dim red for exercise
            case RESPONSE_TYPE.FEAR:
                return "#FF0000"; // Bright red for fear
            case RESPONSE_TYPE.STRESS:
                return "rgba(255, 0, 0, 0.7)"; // Medium red for stress
            case RESPONSE_TYPE.ANXIETY:
                return "rgba(255, 0, 0, 0.6)"; // Slightly dimmer for anxiety
            default:
                return "rgba(255, 0, 0, 0.3)";
        }
    };
    
    // Get border style
    const getBorderColor = () => {
        if (responseType === RESPONSE_TYPE.FEAR) {
            return "rgba(255, 0, 0, 0.5)";
        }
        return "rgba(255, 0, 0, 0.15)";
    };
    
    // Check if this is a critical response
    const isCritical = responseType === RESPONSE_TYPE.FEAR;
    
    if (!isActive && !isCalibrated) return null;
    
    return (
        <div 
            className="w-full py-2 px-3 text-center transition-all duration-300"
            style={{ 
                backgroundColor: isCritical 
                    ? "rgba(255, 0, 0, 0.08)" 
                    : "rgba(255, 0, 0, 0.02)",
                borderTop: `1px solid ${getBorderColor()}`,
                borderBottom: `1px solid ${getBorderColor()}`,
            }}
        >
            <div className="flex items-center justify-center gap-2">
                {/* Status dot */}
                <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ 
                        backgroundColor: getColor(),
                        boxShadow: isCritical ? `0 0 8px ${getColor()}` : "none",
                        animation: flashing ? "blink 0.3s ease-in-out infinite" : "none",
                    }}
                />
                
                {/* Response text */}
                <span 
                    className="text-[9px] tracking-[0.25em] uppercase font-mono"
                    style={{ 
                        color: getColor(),
                        textShadow: isCritical ? `0 0 10px ${getColor()}` : "none",
                        animation: flashing && isCritical ? "textFlash 0.15s ease-in-out infinite" : "none",
                    }}
                >
                    {getDisplayText()}
                </span>
                
                {/* Critical indicator */}
                {isCritical && (
                    <div 
                        className="ml-1 px-1.5 py-0.5 text-[7px] tracking-[0.15em]"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                            color: "#FF0000",
                            border: "1px solid rgba(255, 0, 0, 0.3)",
                        }}
                    >
                        CRITICAL
                    </div>
                )}
            </div>
            
            {/* CSS Animations */}
            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                @keyframes textFlash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
};

export default ResponseIndicator;
