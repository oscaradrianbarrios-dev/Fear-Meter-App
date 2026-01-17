import { useRef, useEffect, useState } from "react";

export const Oscilloscope = ({ bpm, isActive, isPanic }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const phaseRef = useRef(0);
    const startTimeRef = useRef(null);
    const [isRamping, setIsRamping] = useState(false);

    useEffect(() => {
        if (isActive) {
            startTimeRef.current = Date.now();
            setIsRamping(true);
            // Ramp completes after 2 seconds
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

            // Draw grid lines - barely visible
            ctx.strokeStyle = "rgba(255, 0, 0, 0.06)";
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
                // Flat line when inactive - subtle
                ctx.strokeStyle = "rgba(255, 0, 0, 0.15)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, centerY);
                ctx.lineTo(width, centerY);
                ctx.stroke();
                return;
            }

            // Calculate amplitude ramp (0.3 -> 1.0 over 2 seconds)
            let amplitudeMultiplier = 1;
            if (startTimeRef.current) {
                const elapsed = Date.now() - startTimeRef.current;
                const rampProgress = Math.min(elapsed / 2000, 1);
                // Ease out cubic for natural acceleration
                amplitudeMultiplier = 0.3 + (0.7 * (1 - Math.pow(1 - rampProgress, 3)));
            }

            const frequency = bpm / 60;
            const speed = (frequency * 4) + (isPanic ? 1.5 : 0);
            const baseAmplitude = isPanic ? height * 0.38 : height * 0.28;
            const amplitude = baseAmplitude * amplitudeMultiplier;
            
            // Subtle jitter - micro imperfection
            const jitter = isPanic ? Math.random() * 3 - 1.5 : Math.random() * 0.5 - 0.25;

            phaseRef.current += speed * 0.02;

            // ECG waveform - restrained glow
            ctx.strokeStyle = "rgba(255, 0, 0, 0.85)";
            ctx.lineWidth = isPanic ? 2 : 1.5;
            ctx.shadowColor = "#FF0000";
            ctx.shadowBlur = isPanic ? 8 : 4;
            ctx.beginPath();

            for (let x = 0; x < width; x++) {
                const t = (x / width) * Math.PI * 4 + phaseRef.current;
                
                let y = 0;
                const cyclePos = (t % (Math.PI * 2)) / (Math.PI * 2);
                
                if (cyclePos < 0.1) {
                    y = Math.sin(cyclePos * Math.PI * 10) * 0.2;
                } else if (cyclePos < 0.15) {
                    y = 0;
                } else if (cyclePos < 0.2) {
                    y = -0.1;
                } else if (cyclePos < 0.25) {
                    y = Math.sin((cyclePos - 0.2) * Math.PI * 20) * 1;
                } else if (cyclePos < 0.3) {
                    y = -0.2;
                } else if (cyclePos < 0.35) {
                    y = 0;
                } else if (cyclePos < 0.5) {
                    y = Math.sin((cyclePos - 0.35) * Math.PI * 6.67) * 0.3;
                } else {
                    y = 0;
                }

                const yPos = centerY - (y * amplitude) + jitter;
                
                if (x === 0) {
                    ctx.moveTo(x, yPos);
                } else {
                    ctx.lineTo(x, yPos);
                }
            }

            ctx.stroke();
            ctx.shadowBlur = 0;

            // Scan line in panic - subtle
            if (isPanic) {
                const scanY = (Date.now() % 3000) / 3000 * height;
                ctx.strokeStyle = "rgba(139, 0, 0, 0.25)";
                ctx.lineWidth = 1;
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
            className={`relative w-full h-40 rounded overflow-hidden ${
                isPanic ? "micro-tremor" : ""
            }`}
            style={{
                border: "1px solid rgba(255, 0, 0, 0.15)",
                backgroundColor: "#000000"
            }}
        >
            <canvas
                ref={canvasRef}
                className={`w-full h-full ${isRamping ? "amplitude-ramp" : ""}`}
                style={{ display: "block" }}
            />
            
            {/* Corner indicator - minimal */}
            <div className="absolute top-2 left-2 flex items-center gap-1">
                <div 
                    className={`w-1 h-1 rounded-full transition-all duration-500 ${
                        isActive ? "animate-pulse-red" : ""
                    }`}
                    style={{ 
                        backgroundColor: isActive ? "rgba(255, 0, 0, 0.7)" : "rgba(176, 176, 176, 0.2)" 
                    }}
                />
                <span 
                    className="text-[9px] tracking-[0.15em]"
                    style={{ color: "rgba(176, 176, 176, 0.4)" }}
                >
                    ECG
                </span>
            </div>
            
            {isPanic && (
                <div className="absolute top-2 right-2">
                    <span 
                        className="text-[9px] tracking-[0.15em] font-bold"
                        style={{ color: "rgba(255, 0, 0, 0.8)" }}
                    >
                        ALERT
                    </span>
                </div>
            )}
        </div>
    );
};

export default Oscilloscope;
