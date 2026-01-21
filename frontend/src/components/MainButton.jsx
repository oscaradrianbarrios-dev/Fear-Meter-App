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
                buttonRef.current.style.boxShadow = `0 0 ${30 + intensity * 20}px rgba(255, 0, 0, ${shadowIntensity}), inset 0 0 ${20 + intensity * 15}px rgba(255, 0, 0, ${shadowIntensity * 0.5})`;
                
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
                w-36 h-36 rounded-full
                font-bold text-[11px] tracking-[0.2em] uppercase
                flex items-center justify-center
                ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={{
                backgroundColor: isActive ? "#FF0000" : "transparent",
                border: isActive 
                    ? "none"
                    : "2px solid #FF0000",
                color: "#FFFFFF",
                boxShadow: isActive 
                    ? "0 0 40px rgba(255, 0, 0, 0.8), 0 0 80px rgba(255, 0, 0, 0.4)"
                    : "0 0 20px rgba(255, 0, 0, 0.6)",
                transition: isPanic ? "none" : "all 0.3s ease",
            }}
            data-testid="main-button"
        >
            <span className="text-center leading-tight px-2">
                {isActive ? texts.stopSession : texts.startSession}
            </span>
        </button>
    );
};

export default MainButton;
