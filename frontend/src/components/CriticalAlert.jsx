import { useEffect, useState, useMemo } from "react";

export const CriticalAlert = ({ visible, language = "EN" }) => {
    const [opacity, setOpacity] = useState(0);
    const [isShowing, setIsShowing] = useState(false);
    const [textPhase, setTextPhase] = useState(0);

    const texts = useMemo(() => ({
        EN: [
            "CRITICAL FEAR RESPONSE",
            "NO ESCAPE DETECTED",
            "DATA CONTINUES RECORDING",
        ],
        ES: [
            "RESPUESTA DE MIEDO CRÍTICA",
            "SIN ESCAPE DETECTADO",
            "DATOS CONTINÚAN REGISTRÁNDOSE",
        ],
    }), []);

    useEffect(() => {
        if (visible && !isShowing) {
            setIsShowing(true);
            setTextPhase(0);
            
            // Fade in over 200ms
            const fadeIn = setTimeout(() => setOpacity(1), 50);
            
            // Phase through different messages for psychological effect
            const phase1 = setTimeout(() => setTextPhase(1), 800);
            const phase2 = setTimeout(() => setTextPhase(2), 1500);
            
            // Auto disappear after showing
            const fadeOut = setTimeout(() => {
                setOpacity(0);
            }, 2500);
            
            const hide = setTimeout(() => {
                setIsShowing(false);
                setTextPhase(0);
            }, 2900);
            
            return () => {
                clearTimeout(fadeIn);
                clearTimeout(phase1);
                clearTimeout(phase2);
                clearTimeout(fadeOut);
                clearTimeout(hide);
            };
        }
    }, [visible, isShowing]);

    if (!isShowing) return null;

    const currentText = texts[language][textPhase] || texts.EN[textPhase];

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-[9998] pointer-events-none"
            style={{ backgroundColor: "transparent" }}
        >
            <div 
                className="text-center px-6"
                style={{
                    opacity,
                    transition: "opacity 200ms ease-out",
                }}
            >
                <div 
                    className="font-bold text-sm tracking-[0.25em] uppercase leading-relaxed fear-text-reveal"
                    style={{ 
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#8B0000",
                        textShadow: "0 0 30px rgba(139, 0, 0, 0.8), 0 0 60px rgba(139, 0, 0, 0.4)",
                    }}
                >
                    {currentText}
                </div>
                
                {/* Subtle watching indicator */}
                <div 
                    className="mt-4 flex items-center justify-center gap-2"
                    style={{ opacity: textPhase >= 2 ? 0.5 : 0, transition: "opacity 0.5s" }}
                >
                    <div 
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: "rgba(139, 0, 0, 0.6)" }}
                    />
                    <span 
                        className="text-[8px] tracking-[0.2em]"
                        style={{ color: "rgba(139, 0, 0, 0.4)" }}
                    >
                        RECORDING
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CriticalAlert;
