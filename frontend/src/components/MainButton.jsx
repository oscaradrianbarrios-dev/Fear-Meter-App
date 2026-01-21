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
                
                const nextDelay = 150 + Math.random() * 100;
                intensity = intensity === 0 ? 1 : 0;
                
                const scale = intensity ? 1.04 : 0.97;
                const shadowIntensity = intensity ? 0.8 : 0.4;
                
                buttonRef.current.style.transform = `scale(${scale})`;
                buttonRef.current.style.boxShadow = `0 0 ${30 + intensity * 20}px rgba(255, 85, 85, ${shadowIntensity}), inset 0 0 ${20 + intensity * 15}px rgba(255, 85, 85, ${shadowIntensity * 0.5})`;
                
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
                w-32 h-32 rounded-full
                font-bold text-[11px] tracking-[0.2em] uppercase
                flex items-center justify-center
                ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={{
                border: isPanic 
                    ? "2px solid #FF5555"
                    : isActive 
                        ? "2px solid rgba(255, 85, 85, 0.7)"
                        : "2px solid rgba(255, 85, 85, 0.4)",
                backgroundColor: isPanic 
                    ? "rgba(255, 85, 85, 0.15)"
                    : isActive 
                        ? "rgba(255, 85, 85, 0.08)"
                        : "transparent",
                color: "#FF5555",
                boxShadow: isPanic 
                    ? "0 0 40px rgba(255, 85, 85, 0.6), 0 0 80px rgba(255, 85, 85, 0.3), inset 0 0 30px rgba(255, 85, 85, 0.2)"
                    : isActive 
                        ? "0 0 20px rgba(255, 85, 85, 0.4), inset 0 0 15px rgba(255, 85, 85, 0.1)"
                        : "0 0 10px rgba(255, 85, 85, 0.2)",
                transition: isPanic ? "none" : "all 0.3s ease",
            }}
            data-testid="main-button"
        >
            <span 
                className="text-center leading-tight px-2"
                style={{
                    textShadow: isPanic 
                        ? "0 0 20px #FF5555, 0 0 40px rgba(255, 85, 85, 0.8)"
                        : isActive 
                            ? "0 0 15px rgba(255, 85, 85, 0.6)"
                            : "0 0 8px rgba(255, 85, 85, 0.4)"
                }}
            >
                {isActive ? texts.stopSession : texts.startSession}
            </span>
        </button>
    );
};

export default MainButton;
