import { useEffect, useRef } from "react";

export const MainButton = ({
    isActive,
    isPanic,
    onClick,
    texts,
    disabled,
    isRecovering,
}) => {
    const buttonRef = useRef(null);
    const pulseIntervalRef = useRef(null);

    // Violent pulsing during panic - biological, not smooth
    useEffect(() => {
        if (isPanic && buttonRef.current) {
            let intensity = 0;
            const violentPulse = () => {
                if (!buttonRef.current) return;
                
                // Irregular timing
                const nextDelay = 150 + Math.random() * 100;
                intensity = intensity === 0 ? 1 : 0;
                
                const scale = intensity ? 1.03 : 0.98;
                const shadowIntensity = intensity ? 0.5 : 0.2;
                
                buttonRef.current.style.transform = `scale(${scale})`;
                buttonRef.current.style.boxShadow = `0 0 ${20 + intensity * 15}px rgba(139, 0, 0, ${shadowIntensity}), inset 0 0 ${15 + intensity * 10}px rgba(139, 0, 0, ${shadowIntensity * 0.5})`;
                
                pulseIntervalRef.current = setTimeout(violentPulse, nextDelay);
            };
            
            violentPulse();
            
            return () => {
                if (pulseIntervalRef.current) {
                    clearTimeout(pulseIntervalRef.current);
                }
                if (buttonRef.current) {
                    buttonRef.current.style.transform = "scale(1)";
                }
            };
        }
    }, [isPanic]);

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            disabled={disabled}
            className={`
                w-28 h-28 rounded-full
                font-bold text-[10px] tracking-[0.2em] uppercase
                flex items-center justify-center
                ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={{
                border: isPanic 
                    ? "2px solid #8B0000"
                    : isActive 
                        ? "1px solid rgba(255, 0, 0, 0.5)"
                        : "1px solid rgba(176, 176, 176, 0.25)",
                backgroundColor: isPanic 
                    ? "#8B0000" // Solid during panic
                    : isActive 
                        ? "rgba(255, 0, 0, 0.05)"
                        : "transparent",
                color: isPanic 
                    ? "#FFFFFF"
                    : isActive 
                        ? "rgba(255, 0, 0, 0.8)"
                        : "rgba(176, 176, 176, 0.6)",
                boxShadow: isPanic 
                    ? "0 0 25px rgba(139, 0, 0, 0.4), inset 0 0 20px rgba(139, 0, 0, 0.3)"
                    : isActive 
                        ? "0 0 10px rgba(255, 0, 0, 0.15)"
                        : "none",
                transition: isPanic ? "none" : "all 0.5s ease",
            }}
            onMouseEnter={(e) => {
                if (!isActive && !disabled && !isPanic) {
                    e.currentTarget.style.borderColor = "rgba(255, 0, 0, 0.4)";
                    e.currentTarget.style.color = "rgba(255, 0, 0, 0.7)";
                    e.currentTarget.style.boxShadow = "0 0 8px rgba(255, 0, 0, 0.1)";
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive && !disabled && !isPanic) {
                    e.currentTarget.style.borderColor = "rgba(176, 176, 176, 0.25)";
                    e.currentTarget.style.color = "rgba(176, 176, 176, 0.6)";
                    e.currentTarget.style.boxShadow = "none";
                }
            }}
        >
            <span 
                className="text-center leading-tight px-2"
                style={{
                    textShadow: isPanic 
                        ? "0 0 15px rgba(255, 255, 255, 0.5)"
                        : isActive 
                            ? "0 0 4px rgba(255, 0, 0, 0.3)"
                            : "none"
                }}
            >
                {isActive ? texts.stopSession : texts.startSession}
            </span>
        </button>
    );
};

export default MainButton;
