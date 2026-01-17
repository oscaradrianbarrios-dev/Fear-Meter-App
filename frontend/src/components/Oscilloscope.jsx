import { useRef, useEffect, useCallback } from "react";

export const Oscilloscope = ({ bpm, isActive, isPanic }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const phaseRef = useRef(0);
    const dataPointsRef = useRef([]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        // Clear canvas
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines (subtle)
        ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
        ctx.lineWidth = 1;
        
        // Horizontal lines
        for (let y = 0; y <= height; y += height / 4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Vertical lines
        for (let x = 0; x <= width; x += width / 8) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        if (!isActive) {
            // Flat line when inactive
            ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();
            return;
        }

        // Calculate wave parameters based on BPM
        const frequency = bpm / 60; // Beats per second
        const speed = (frequency * 4) + (isPanic ? 2 : 0);
        const amplitude = isPanic ? height * 0.4 : height * 0.3;
        const jitter = isPanic ? Math.random() * 6 - 3 : 0;

        // Update phase
        phaseRef.current += speed * 0.02;

        // Generate ECG-like waveform
        ctx.strokeStyle = isPanic ? "#FF0000" : "#FF0000";
        ctx.lineWidth = isPanic ? 3 : 2;
        ctx.shadowColor = "#FF0000";
        ctx.shadowBlur = isPanic ? 20 : 10;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
            const t = (x / width) * Math.PI * 4 + phaseRef.current;
            
            // Create ECG-like pattern
            let y = 0;
            const cyclePos = (t % (Math.PI * 2)) / (Math.PI * 2);
            
            if (cyclePos < 0.1) {
                // P wave
                y = Math.sin(cyclePos * Math.PI * 10) * 0.2;
            } else if (cyclePos < 0.15) {
                // PR segment
                y = 0;
            } else if (cyclePos < 0.2) {
                // Q wave
                y = -0.1;
            } else if (cyclePos < 0.25) {
                // R wave (spike)
                y = Math.sin((cyclePos - 0.2) * Math.PI * 20) * 1;
            } else if (cyclePos < 0.3) {
                // S wave
                y = -0.2;
            } else if (cyclePos < 0.35) {
                // ST segment
                y = 0;
            } else if (cyclePos < 0.5) {
                // T wave
                y = Math.sin((cyclePos - 0.35) * Math.PI * 6.67) * 0.3;
            } else {
                // Baseline
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

        // Add scan line effect in panic mode
        if (isPanic) {
            const scanY = (Date.now() % 2000) / 2000 * height;
            ctx.strokeStyle = "rgba(139, 0, 0, 0.5)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(width, scanY);
            ctx.stroke();
        }

        animationRef.current = requestAnimationFrame(draw);
    }, [bpm, isActive, isPanic]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size
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
        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [draw]);

    return (
        <div 
            className={`relative w-full h-40 border border-fear-red/30 bg-fear-black rounded overflow-hidden ${
                isPanic ? "animate-jitter" : ""
            }`}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ display: "block" }}
            />
            
            {/* Corner indicators */}
            <div className="absolute top-2 left-2 flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-fear-red" : "bg-fear-gray/30"}`} />
                <span className="text-[10px] text-fear-gray tracking-wider">ECG</span>
            </div>
            
            {isPanic && (
                <div className="absolute top-2 right-2">
                    <span className="text-[10px] text-fear-red tracking-wider animate-pulse-aggressive font-bold">
                        ⚠ ALERT
                    </span>
                </div>
            )}
        </div>
    );
};

export default Oscilloscope;
