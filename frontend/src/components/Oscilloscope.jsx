import { useRef, useEffect, useState } from "react";

export const Oscilloscope = ({ bpm, isActive, isPanic, isRecovering }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const phaseRef = useRef(0);
    const startTimeRef = useRef(null);
    const [isRamping, setIsRamping] = useState(false);

    useEffect(() => {
        if (isActive) {
            startTimeRef.current = Date.now();
            setIsRamping(true);
            const timer = setTimeout(() => setIsRamping(false), 2000);
            return () => clearTimeout(timer);
        } else {
            startTimeRef.current = null;
            setIsRamping(false);
        }
    }, [isActive]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const updateSize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            const ctx = canvas.getContext("2d");
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        updateSize();
        window.addEventListener("resize", updateSize);

        return () => {
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const draw = () => {
            const ctx = canvas.getContext("2d");
            const rect = canvas.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const centerY = height / 2;

            // Clear canvas - absolute black
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, width, height);

            // Draw grid lines - even more subtle during panic
            const gridOpacity = isPanic ? 0.03 : 0.06;
            ctx.strokeStyle = `rgba(${isPanic ? '139, 0, 0' : '255, 0, 0'}, ${gridOpacity})`;
            ctx.lineWidth = 1;
            
            for (let y = 0; y <= height; y += height / 4) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            for (let x = 0; x <= width; x += width / 8) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            if (!isActive) {
                ctx.strokeStyle = "rgba(255, 0, 0, 0.15)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, centerY);
                ctx.lineTo(width, centerY);
                ctx.stroke();
                return;
            }

            // Calculate amplitude ramp
            let amplitudeMultiplier = 1;
            if (startTimeRef.current) {
                const elapsed = Date.now() - startTimeRef.current;
                const rampProgress = Math.min(elapsed / 2000, 1);
                amplitudeMultiplier = 0.3 + (0.7 * (1 - Math.pow(1 - rampProgress, 3)));
            }

            // PANIC MODE: Double frequency, lose regularity
            const baseFrequency = bpm / 60;
            const frequencyMultiplier = isPanic ? 2.0 : 1.0;
            const frequency = baseFrequency * frequencyMultiplier;
            
            const speed = (frequency * 4) + (isPanic ? 3 : 0);
            const baseAmplitude = isPanic ? height * 0.42 : height * 0.28;
            const amplitude = baseAmplitude * amplitudeMultiplier;
            
            // PANIC MODE: Increased micro jitter - irregular heartbeat
            const jitterAmount = isPanic ? 8 : 0.5;
            const jitter = (Math.random() - 0.5) * jitterAmount;
            
            // Additional timing irregularity during panic
            const timingJitter = isPanic ? (Math.random() - 0.5) * 0.15 : 0;

            phaseRef.current += speed * 0.02;

            // ECG waveform color - deeper red (#8B0000) ONLY during panic
            const strokeColor = isPanic ? "rgba(139, 0, 0, 0.95)" : "rgba(255, 0, 0, 0.85)";
            const glowColor = isPanic ? "#8B0000" : "#FF0000";
            
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = isPanic ? 2.5 : 1.5;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = isPanic ? 12 : 4;
            ctx.beginPath();

            for (let x = 0; x < width; x++) {
                const t = (x / width) * Math.PI * 4 * frequencyMultiplier + phaseRef.current;
                
                let y = 0;
                const cyclePos = ((t + timingJitter) % (Math.PI * 2)) / (Math.PI * 2);
                
                if (cyclePos < 0.1) {
                    y = Math.sin(cyclePos * Math.PI * 10) * 0.2;
                } else if (cyclePos < 0.15) {
                    y = 0;
                } else if (cyclePos < 0.2) {
                    y = -0.1;
                } else if (cyclePos < 0.25) {
                    // R wave spike - more violent during panic
                    const spikeMultiplier = isPanic ? 1.3 : 1;
                    y = Math.sin((cyclePos - 0.2) * Math.PI * 20) * spikeMultiplier;
                } else if (cyclePos < 0.3) {
                    y = isPanic ? -0.3 : -0.2;
                } else if (cyclePos < 0.35) {
                    y = 0;
                } else if (cyclePos < 0.5) {
                    y = Math.sin((cyclePos - 0.35) * Math.PI * 6.67) * 0.3;
                } else {
                    y = 0;
                }

                // Add per-pixel noise during panic
                const pixelNoise = isPanic ? (Math.random() - 0.5) * 2 : 0;
                const yPos = centerY - (y * amplitude) + jitter + pixelNoise;
                
                if (x === 0) {
                    ctx.moveTo(x, yPos);
                } else {
                    ctx.lineTo(x, yPos);
                }
            }

            ctx.stroke();
            ctx.shadowBlur = 0;

            // Scan line - more aggressive during panic
            if (isPanic) {
                const scanSpeed = 1500; // Faster
                const scanY = (Date.now() % scanSpeed) / scanSpeed * height;
                ctx.strokeStyle = "rgba(139, 0, 0, 0.4)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, scanY);
                ctx.lineTo(width, scanY);
                ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [bpm, isActive, isPanic]);

    return (
        <div 
            className={`relative w-full h-40 rounded overflow-hidden`}
            style={{
                border: `1px solid rgba(${isPanic ? '139, 0, 0' : '255, 0, 0'}, ${isPanic ? 0.4 : 0.15})`,
                backgroundColor: "#000000",
                // Micro tremor during panic
                animation: isPanic ? "micro-tremor 0.08s ease-in-out infinite" : "none",
            }}
        >
            <canvas
                ref={canvasRef}
                className={`w-full h-full ${isRamping ? "amplitude-ramp" : ""}`}
                style={{ display: "block" }}
            />
            
            <div className="absolute top-2 left-2 flex items-center gap-1">
                <div 
                    className={`w-1 h-1 rounded-full transition-all duration-500 ${
                        isActive ? "animate-pulse-red" : ""
                    }`}
                    style={{ 
                        backgroundColor: isPanic 
                            ? "rgba(139, 0, 0, 0.9)" 
                            : isActive 
                                ? "rgba(255, 0, 0, 0.7)" 
                                : "rgba(176, 176, 176, 0.2)" 
                    }}
                />
                <span 
                    className="text-[9px] tracking-[0.15em]"
                    style={{ color: isPanic ? "rgba(139, 0, 0, 0.6)" : "rgba(176, 176, 176, 0.4)" }}
                >
                    ECG
                </span>
            </div>
            
            {isPanic && (
                <div className="absolute top-2 right-2">
                    <span 
                        className="text-[9px] tracking-[0.15em] font-bold"
                        style={{ 
                            color: "#8B0000",
                            animation: "pulse-aggressive 0.3s ease-in-out infinite"
                        }}
                    >
                        CRITICAL
                    </span>
                </div>
            )}
            
            {isRecovering && (
                <div className="absolute bottom-2 right-2">
                    <span 
                        className="text-[8px] tracking-[0.1em]"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        STABILIZING...
                    </span>
                </div>
            )}
        </div>
    );
};

export default Oscilloscope;
