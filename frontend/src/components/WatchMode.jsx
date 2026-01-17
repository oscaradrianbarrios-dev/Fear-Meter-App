import { useRef, useEffect } from "react";

export const WatchMode = ({ bpm, stress, isActive, isPanic }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const size = Math.min(canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = size * 0.4;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Progress arc based on BPM (60-140 range)
        const progress = isActive ? (bpm - 60) / 80 : 0; // 0 to 1
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (Math.PI * 2 * Math.min(progress, 1));

        // Glow effect for arc
        ctx.shadowColor = "#FF0000";
        ctx.shadowBlur = isPanic ? 30 : 15;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = isPanic ? "#FF0000" : "#FF0000";
        ctx.lineWidth = isPanic ? 8 : 6;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Inner circle decoration
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Tick marks
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12 - Math.PI / 2;
            const innerR = radius * 0.9;
            const outerR = radius * 0.95;
            
            ctx.beginPath();
            ctx.moveTo(
                centerX + Math.cos(angle) * innerR,
                centerY + Math.sin(angle) * innerR
            );
            ctx.lineTo(
                centerX + Math.cos(angle) * outerR,
                centerY + Math.sin(angle) * outerR
            );
            ctx.strokeStyle = "rgba(255, 0, 0, 0.4)";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

    }, [bpm, isActive, isPanic]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const updateSize = () => {
            const container = canvas.parentElement;
            const size = Math.min(container.offsetWidth, 280);
            canvas.width = size * window.devicePixelRatio;
            canvas.height = size * window.devicePixelRatio;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;
            const ctx = canvas.getContext("2d");
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="text-fear-gray text-[10px] tracking-[0.3em] uppercase mb-6">
                WATCH MODE
            </div>
            
            <div className={`relative ${isPanic ? "animate-jitter" : ""}`}>
                <canvas
                    ref={canvasRef}
                    className="block"
                />
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div 
                        className={`text-5xl font-bold ${
                            isPanic 
                                ? "text-fear-red text-glow-red-intense" 
                                : isActive 
                                    ? "text-fear-red text-glow-red" 
                                    : "text-fear-gray/50"
                        }`}
                    >
                        {isActive ? bpm : "---"}
                    </div>
                    <div className="text-fear-gray text-[10px] tracking-[0.2em] mt-1">
                        BPM
                    </div>
                </div>
            </div>

            {/* Status indicator */}
            <div className="mt-6 flex items-center gap-2">
                <div 
                    className={`w-2 h-2 rounded-full ${
                        isPanic 
                            ? "bg-fear-red animate-pulse-aggressive" 
                            : isActive 
                                ? "bg-fear-red animate-pulse-red" 
                                : "bg-fear-gray/30"
                    }`} 
                />
                <span className={`text-xs tracking-wider ${
                    isPanic ? "text-fear-red" : isActive ? "text-fear-gray" : "text-fear-gray/50"
                }`}>
                    {isPanic ? "CRITICAL" : isActive ? "MONITORING" : "STANDBY"}
                </span>
            </div>

            {/* Stress indicator */}
            {isActive && (
                <div className="mt-4 w-48">
                    <div className="flex justify-between text-[10px] text-fear-gray mb-1">
                        <span>STRESS</span>
                        <span className={isPanic ? "text-fear-red" : ""}>{stress}%</span>
                    </div>
                    <div className="h-1 bg-fear-gray/20 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-300 ${
                                isPanic ? "bg-fear-red glow-red" : "bg-fear-red/70"
                            }`}
                            style={{ width: `${stress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default WatchMode;
