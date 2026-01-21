import { useState, useEffect, useMemo } from "react";

export const DataGrid = ({
    bpm,
    stress,
    signal,
    isActive,
    isPanic,
    texts,
}) => {
    const [showData, setShowData] = useState(false);
    const [revealPhase, setRevealPhase] = useState(0);

    // Staged reveal for psychological effect
    useEffect(() => {
        if (isActive && !showData) {
            const timer1 = setTimeout(() => setRevealPhase(1), 100);
            const timer2 = setTimeout(() => setRevealPhase(2), 250);
            const timer3 = setTimeout(() => setRevealPhase(3), 400);
            const timer4 = setTimeout(() => {
                setRevealPhase(4);
                setShowData(true);
            }, 550);
            
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
                clearTimeout(timer4);
            };
        } else if (!isActive) {
            setShowData(false);
            setRevealPhase(0);
        }
    }, [isActive, showData]);

    const getSignalText = () => {
        if (!isActive || revealPhase < 4) return "---";
        if (signal === "CRITICAL") return texts.critical;
        if (signal === "UNSTABLE") return texts.unstable;
        return texts.active;
    };

    return (
        <div 
            className="grid grid-cols-3"
            style={{ gap: '12px' }}
        >
            {/* BPM Block */}
            <div 
                className="p-4"
                style={{ 
                    backgroundColor: "#1A1A1A",
                    border: "1px solid #444444",
                    borderRadius: "8px",
                }}
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-2"
                    style={{ color: "#CCCCCC" }}
                >
                    {texts.bpm}
                </div>
                <div 
                    className="text-3xl font-bold font-mono"
                    style={{ 
                        color: isActive && revealPhase >= 2 ? "#FFFFFF" : "#888888",
                        transition: 'all 0.3s ease-out',
                    }}
                >
                    {isActive && revealPhase >= 2 ? bpm : "---"}
                </div>
            </div>

            {/* Stress Block */}
            <div 
                className="p-4"
                style={{ 
                    backgroundColor: "#1A1A1A",
                    border: "1px solid #444444",
                    borderRadius: "8px",
                }}
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-2"
                    style={{ color: "#CCCCCC" }}
                >
                    {texts.stress}
                </div>
                <div 
                    className="text-3xl font-bold font-mono"
                    style={{ 
                        color: isActive && revealPhase >= 3 ? "#FFFFFF" : "#888888",
                        transition: 'all 0.3s ease-out',
                    }}
                >
                    {isActive && revealPhase >= 3 ? `${stress}%` : "---"}
                </div>
            </div>

            {/* Signal Block */}
            <div 
                className="p-4"
                style={{ 
                    backgroundColor: "#1A1A1A",
                    border: "1px solid #444444",
                    borderRadius: "8px",
                }}
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-2"
                    style={{ color: "#CCCCCC" }}
                >
                    {texts.signal}
                </div>
                <div 
                    className="text-sm font-bold tracking-wider"
                    style={{ 
                        color: isActive && revealPhase >= 4 ? "#FF0000" : "#888888",
                        transition: 'all 0.3s ease-out',
                    }}
                >
                    {getSignalText()}
                </div>
            </div>
        </div>
    );
};

export default DataGrid;
