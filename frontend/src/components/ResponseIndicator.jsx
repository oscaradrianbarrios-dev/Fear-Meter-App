import { useEffect, useState, useMemo, useRef } from "react";
import { RESPONSE_TYPE } from "@/hooks/useCalibration";

export const ResponseIndicator = ({
    responseType,
    isCalibrated,
    isActive,
    language = "EN",
    movementIntensity = 0,
}) => {
    const [flashing, setFlashing] = useState(false);
    const prevResponseRef = useRef(responseType);
    
    // Derive visibility from props
    const visible = useMemo(() => {
        return isActive && responseType !== RESPONSE_TYPE.NONE;
    }, [isActive, responseType]);
    
    const texts = {
        EN: {
            [RESPONSE_TYPE.NONE]: "SIGNAL STABLE",
            [RESPONSE_TYPE.EXERCISE]: "PHYSICAL ACTIVITY — DATA RECORDED",
            [RESPONSE_TYPE.FEAR]: "BIOMETRIC PATTERN ALTERED",
            [RESPONSE_TYPE.STRESS]: "EMOTIONAL ANOMALY DETECTED",
            [RESPONSE_TYPE.ANXIETY]: "SIGNAL UNSTABLE",
            notCalibrated: "SUBJECT UNVERIFIED",
            inactive: "AWAITING SUBJECT",
            calibrated: "SUBJECT CALIBRATED",
            panicSuppressed: "DATA RECORDED",
        },
        ES: {
            [RESPONSE_TYPE.NONE]: "SEÑAL ESTABLE",
            [RESPONSE_TYPE.EXERCISE]: "ACTIVIDAD FÍSICA — DATOS REGISTRADOS",
            [RESPONSE_TYPE.FEAR]: "PATRÓN BIOMÉTRICO ALTERADO",
            [RESPONSE_TYPE.STRESS]: "ANOMALÍA EMOCIONAL DETECTADA",
            [RESPONSE_TYPE.ANXIETY]: "SEÑAL INESTABLE",
            notCalibrated: "SUJETO NO VERIFICADO",
            inactive: "ESPERANDO SUJETO",
            calibrated: "SUJETO CALIBRADO",
            panicSuppressed: "DATOS REGISTRADOS",
        },
    };
    
    const t = texts[language];
    
    // Flash effect when response type changes - using callback pattern
    useEffect(() => {
        if (responseType !== prevResponseRef.current && responseType !== RESPONSE_TYPE.NONE) {
            prevResponseRef.current = responseType;
            // Use requestAnimationFrame to defer state update
            requestAnimationFrame(() => {
                setFlashing(true);
            });
            const timer = setTimeout(() => setFlashing(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [responseType]);
    
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
    const isExercise = responseType === RESPONSE_TYPE.EXERCISE;
    
    if (!isActive && !isCalibrated) return null;
    
    return (
        <div 
            className="w-full py-2 px-3 text-center transition-all duration-300"
            style={{ 
                backgroundColor: isCritical 
                    ? "rgba(255, 0, 0, 0.08)" 
                    : isExercise
                        ? "rgba(255, 0, 0, 0.03)"
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
                
                {/* Exercise indicator - shows that panic is being suppressed */}
                {isExercise && isCalibrated && (
                    <div 
                        className="ml-1 px-1.5 py-0.5 text-[7px] tracking-[0.1em]"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.05)",
                            color: "rgba(255, 0, 0, 0.4)",
                            border: "1px solid rgba(255, 0, 0, 0.1)",
                        }}
                    >
                        SAFE
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
