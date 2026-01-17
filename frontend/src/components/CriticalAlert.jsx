import { useEffect, useState } from "react";

export const CriticalAlert = ({ visible, language = "EN" }) => {
    const [opacity, setOpacity] = useState(0);
    const [isShowing, setIsShowing] = useState(false);

    const text = language === "ES" 
        ? "NIVEL DE ESTRÉS CRÍTICO DETECTADO" 
        : "CRITICAL STRESS LEVEL DETECTED";

    useEffect(() => {
        if (visible && !isShowing) {
            setIsShowing(true);
            // Fade in over 200ms
            const fadeIn = setTimeout(() => setOpacity(1), 50);
            
            // Auto disappear after showing
            const fadeOut = setTimeout(() => {
                setOpacity(0);
            }, 1800);
            
            const hide = setTimeout(() => {
                setIsShowing(false);
            }, 2200);
            
            return () => {
                clearTimeout(fadeIn);
                clearTimeout(fadeOut);
                clearTimeout(hide);
            };
        }
    }, [visible, isShowing]);

    if (!isShowing) return null;

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
                    className="font-bold text-sm tracking-[0.25em] uppercase leading-relaxed"
                    style={{ 
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#8B0000",
                        textShadow: "0 0 30px rgba(139, 0, 0, 0.8), 0 0 60px rgba(139, 0, 0, 0.4)",
                    }}
                >
                    {text}
                </div>
            </div>
        </div>
    );
};

export default CriticalAlert;
