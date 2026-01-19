import { useRef, useEffect, useState } from "react";

export const Oscilloscope = ({ bpm, isActive, isPanic, isRecovering }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const phaseRef = useRef(0);
    const startTimeRef = useRef(null);
    const [isRamping, setIsRamping] = useState(false);
    
    // Biological irregularity seed
    const irregularityRef = useRef({
        timingVariation: 0,
        amplitudeVariation: 0,
        nextUpdate: 0,
    });

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
        return () => window.removeEventListener("resize", updateSize);
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
            const now = Date.now();

            // Clear canvas - absolute black
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, width, height);

            // Draw grid lines - very subtle
            const gridOpacity = isPanic ? 0.02 : 0.04;
            ctx.strokeStyle = `rgba(255, 0, 0, ${gridOpacity})`;
            ctx.lineWidth = 1;
            
            // Horizontal grid lines - asymmetric spacing
            const gridSpacings = [0.18, 0.35, 0.5, 0.68, 0.85];
            gridSpacings.forEach(ratio => {
                ctx.beginPath();
                ctx.moveTo(0, height * ratio);
                ctx.lineTo(width, height * ratio);
                ctx.stroke();
            });

            // Vertical grid lines - irregular
            for (let i = 0; i < 7; i++) {
                const x = width * (0.12 + (i * 0.13) + (i % 2 === 0 ? 0.01 : -0.01));
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Inactive state - flat line with slight drift
            if (!isActive) {
                const drift = Math.sin(now * 0.001) * 1;
                ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, centerY + drift);
                ctx.lineTo(width, centerY + drift);
                ctx.stroke();
                animationRef.current = requestAnimationFrame(draw);
                return;
            }

            // Update biological irregularity every ~800ms
            if (now > irregularityRef.current.nextUpdate) {
                irregularityRef.current = {
                    timingVariation: (Math.random() - 0.5) * 0.08,
                    amplitudeVariation: 0.85 + Math.random() * 0.3,
                    nextUpdate: now + 600 + Math.random() * 400,
                };
            }

            // Calculate amplitude ramp on start
            let amplitudeMultiplier = 1;
            if (startTimeRef.current) {
                const elapsed = now - startTimeRef.current;
                const rampProgress = Math.min(elapsed / 2000, 1);
                amplitudeMultiplier = 0.3 + (0.7 * (1 - Math.pow(1 - rampProgress, 3)));
            }

            // BPM to frequency
            const baseFrequency = bpm / 60;
            const frequencyMultiplier = isPanic ? 1.8 : 1.0;
            const frequency = baseFrequency * frequencyMultiplier;
            
            // Animation speed with biological variation
            const speed = (frequency * 4) + (isPanic ? 2 : 0);
            const timingVar = irregularityRef.current.timingVariation;
            
            // Amplitude with biological variation
            const baseAmplitude = isPanic ? height * 0.38 : height * 0.25;
            const amplitude = baseAmplitude * amplitudeMultiplier * irregularityRef.current.amplitudeVariation;
            
            // Micro jitter - more "human"
            const jitterAmount = isPanic ? 4 : 0.8;
            const jitter = (Math.random() - 0.5) * jitterAmount;

            phaseRef.current += speed * 0.02;

            // Color based on state
            const strokeColor = isPanic 
                ? "rgba(139, 0, 0, 0.9)" 
                : "rgba(255, 0, 0, 0.75)";
            const glowColor = isPanic ? "#8B0000" : "#FF0000";
            
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = isPanic ? 2 : 1.5;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = isPanic ? 10 : 3;
            ctx.beginPath();

            for (let x = 0; x < width; x++) {
                const t = (x / width) * Math.PI * 4 * frequencyMultiplier + phaseRef.current;
                
                let y = 0;
                const cyclePos = ((t + timingVar) % (Math.PI * 2)) / (Math.PI * 2);
                
                // ECG waveform with imperfections
                if (cyclePos < 0.1) {
                    // P wave - slightly irregular
                    const pVariation = 0.18 + (Math.sin(t * 0.3) * 0.04);
                    y = Math.sin(cyclePos * Math.PI * 10) * pVariation;
                } else if (cyclePos < 0.15) {
                    // PR segment - slight drift
                    y = (Math.random() - 0.5) * 0.02;
                } else if (cyclePos < 0.2) {
                    // Q wave
                    y = -0.08 - (Math.random() * 0.04);
                } else if (cyclePos < 0.25) {
                    // R wave spike - main peak with variation
                    const spikeVariation = isPanic ? 1.2 + Math.random() * 0.2 : 1 + Math.random() * 0.1;
                    y = Math.sin((cyclePos - 0.2) * Math.PI * 20) * spikeVariation;
                } else if (cyclePos < 0.3) {
                    // S wave
                    y = isPanic ? -0.25 - Math.random() * 0.1 : -0.15 - Math.random() * 0.05;
                } else if (cyclePos < 0.35) {
                    // ST segment - slight variation
                    y = (Math.random() - 0.5) * 0.03;
                } else if (cyclePos < 0.5) {
                    // T wave - asymmetric
                    const tPhase = (cyclePos - 0.35) / 0.15;
                    const tWave = Math.sin(tPhase * Math.PI);
                    // Asymmetry: slower rise, faster fall
                    y = tWave * (0.25 + Math.sin(t * 0.2) * 0.05) * (tPhase < 0.6 ? 1 : 0.9);
                } else {
                    // Baseline with micro drift
                    y = (Math.random() - 0.5) * 0.01;
                }

                // Add biological noise
                const noise = (Math.random() - 0.5) * (isPanic ? 1.5 : 0.3);
                const yPos = centerY - (y * amplitude) + jitter + noise;
                
                if (x === 0) {
                    ctx.moveTo(x, yPos);
                } else {
                    ctx.lineTo(x, yPos);
                }
            }

            ctx.stroke();
            ctx.shadowBlur = 0;

            // Critical state scan line
            if (isPanic) {
                const scanSpeed = 2000;
                const scanY = (now % scanSpeed) / scanSpeed * height;
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
            className="relative w-full h-40 overflow-hidden"
            style={{
                border: `1px solid rgba(255, 0, 0, ${isPanic ? 0.25 : 0.1})`,
                backgroundColor: "#000000",
            }}
        >
            <canvas
                ref={canvasRef}
                className={`w-full h-full ${isRamping ? "amplitude-ramp" : ""}`}
                style={{ display: "block" }}
            />
            
            {/* ECG label - minimal */}
            <div className="absolute top-2 left-2 flex items-center gap-1">
                <div 
                    className={`w-1 h-1 rounded-full ${isActive ? "animate-pulse-red" : ""}`}
                    style={{ 
                        backgroundColor: isPanic 
                            ? "#8B0000"
                            : isActive 
                                ? "rgba(255, 0, 0, 0.6)" 
                                : "rgba(176, 176, 176, 0.15)" 
                    }}
                />
                <span 
                    className="text-[8px] tracking-[0.15em]"
                    style={{ color: "rgba(176, 176, 176, 0.3)" }}
                >
                    ECG
                </span>
            </div>
            
            {/* Critical indicator */}
            {isPanic && (
                <div className="absolute top-2 right-2">
                    <span 
                        className="text-[8px] tracking-[0.2em]"
                        style={{ color: "#8B0000" }}
                    >
                        CRITICAL
                    </span>
                </div>
            )}
            
            {isRecovering && (
                <div className="absolute bottom-2 right-2">
                    <span 
                        className="text-[7px] tracking-[0.1em]"
                        style={{ color: "rgba(176, 176, 176, 0.25)" }}
                    >
                        STABILIZING
                    </span>
                </div>
            )}
        </div>
    );
};

export default Oscilloscope;
