import { useRef, useEffect, useCallback, useState } from "react";

// Biometric arc that fills based on BPM
const BiometricRing = ({ bpm, isActive, status }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [vibrationOffset, setVibrationOffset] = useState(0);
    
    // Calculate progress (60-140 BPM range)
    const progress = isActive ? Math.min((bpm - 60) / 80, 1) : 0;
    const isElevated = bpm > 110;
    const isCritical = bpm > 120;
    
    // Vibration effect for elevated BPM
    useEffect(() => {
        if (!isElevated || !isActive) {
            setVibrationOffset(0);
            return;
        }
        
        const vibrate = () => {
            const intensity = isCritical ? 2 : 1;
            setVibrationOffset((Math.random() - 0.5) * intensity);
            animationRef.current = requestAnimationFrame(vibrate);
        };
        
        animationRef.current = requestAnimationFrame(vibrate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isElevated, isCritical, isActive]);

    // Trigger device vibration on critical
    useEffect(() => {
        if (isCritical && isActive && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }, [isCritical, isActive]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        const size = 300;
        const center = size / 2;
        const ringRadius = size * 0.42;
        const ringWidth = 8;
        
        // Set canvas size
        canvas.width = size * window.devicePixelRatio;
        canvas.height = size * window.devicePixelRatio;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        // Clear
        ctx.clearRect(0, 0, size, size);
        
        // Background ring (dark)
        ctx.beginPath();
        ctx.arc(center, center, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 0, 0, 0.08)";
        ctx.lineWidth = ringWidth;
        ctx.stroke();
        
        if (!isActive || progress <= 0) return;
        
        // Calculate arc angles
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (Math.PI * 2 * progress);
        
        // Glow effect - only on peaks
        if (isElevated) {
            ctx.shadowColor = "#FF0000";
            ctx.shadowBlur = isCritical ? 25 : 12;
        }
        
        // Active arc with vibration offset
        ctx.save();
        ctx.translate(vibrationOffset, vibrationOffset * 0.5);
        
        ctx.beginPath();
        ctx.arc(center, center, ringRadius, startAngle, endAngle);
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = ringWidth;
        ctx.lineCap = "round";
        ctx.stroke();
        
        ctx.restore();
        ctx.shadowBlur = 0;
        
    }, [bpm, isActive, progress, isElevated, isCritical, vibrationOffset]);
    
    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0"
            style={{ transform: `translate(${vibrationOffset}px, ${vibrationOffset * 0.5}px)` }}
        />
    );
};

// Central BPM display with heartbeat animation
const BpmDisplay = ({ bpm, isActive, status }) => {
    const [scale, setScale] = useState(1);
    const isCritical = status === "CRITICAL";
    
    // Heartbeat animation synced to BPM
    useEffect(() => {
        if (!isActive) return;
        
        // Calculate interval from BPM (ms between beats)
        const interval = 60000 / bpm;
        
        const heartbeat = () => {
            setScale(1.04);
            setTimeout(() => setScale(1), 100);
        };
        
        heartbeat();
        const timer = setInterval(heartbeat, interval);
        return () => clearInterval(timer);
    }, [bpm, isActive]);
    
    return (
        <div 
            className="flex flex-col items-center justify-center transition-transform"
            style={{ 
                transform: `scale(${scale})`,
                transitionDuration: "100ms",
                transitionTimingFunction: "ease-out",
            }}
        >
            <span 
                className="font-bold tracking-tight"
                style={{ 
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "72px",
                    color: "#FF0000",
                    textShadow: isCritical 
                        ? "0 0 30px rgba(255, 0, 0, 0.6)" 
                        : isActive 
                            ? "0 0 15px rgba(255, 0, 0, 0.3)"
                            : "none",
                    lineHeight: 1,
                }}
            >
                {isActive ? bpm : "---"}
            </span>
        </div>
    );
};

// Status text component
const StatusText = ({ status }) => {
    const colors = {
        STABLE: "rgba(176, 176, 176, 0.6)",
        ELEVATED: "#FF0000",
        CRITICAL: "#FF0000",
    };
    
    const glows = {
        STABLE: "none",
        ELEVATED: "0 0 10px rgba(255, 0, 0, 0.3)",
        CRITICAL: "0 0 20px rgba(255, 0, 0, 0.5)",
    };
    
    return (
        <span 
            className="text-xs tracking-[0.25em] uppercase mt-2"
            style={{ 
                fontFamily: "'JetBrains Mono', monospace",
                color: colors[status],
                textShadow: glows[status],
            }}
        >
            {status}
        </span>
    );
};

export const WatchMode = ({ bpm, stress, isActive, isPanic }) => {
    const containerRef = useRef(null);
    const [flashActive, setFlashActive] = useState(false);
    
    // Determine status based on BPM
    const getStatus = () => {
        if (!isActive) return "STABLE";
        if (bpm > 120) return "CRITICAL";
        if (bpm > 100) return "ELEVATED";
        return "STABLE";
    };
    
    const status = getStatus();
    
    // Tap interaction - micro flash
    const handleTap = useCallback(() => {
        if (!isActive) return;
        setFlashActive(true);
        setTimeout(() => setFlashActive(false), 150);
    }, [isActive]);
    
    return (
        <div 
            ref={containerRef}
            className="flex-1 flex items-center justify-center"
            style={{ backgroundColor: "#000000" }}
            onClick={handleTap}
            data-testid="watch-mode-container"
        >
            {/* Flash overlay on tap */}
            <div 
                className="fixed inset-0 pointer-events-none transition-opacity duration-150"
                style={{ 
                    backgroundColor: "rgba(255, 0, 0, 0.08)",
                    opacity: flashActive ? 1 : 0,
                }}
            />
            
            {/* Watch face - circular fullscreen simulation */}
            <div 
                className="relative flex items-center justify-center"
                style={{ 
                    width: "300px", 
                    height: "300px",
                }}
            >
                {/* Biometric ring */}
                <BiometricRing 
                    bpm={bpm} 
                    isActive={isActive} 
                    status={status}
                />
                
                {/* Center content */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <BpmDisplay 
                        bpm={bpm} 
                        isActive={isActive}
                        status={status}
                    />
                    <StatusText status={status} />
                </div>
            </div>
        </div>
    );
};

export default WatchMode;
