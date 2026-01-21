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
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    border: `1px solid ${isPanic && showData ? "rgba(255, 0, 0, 0.6)" : "rgba(255, 0, 0, 0.3)"}`,
                    boxShadow: isPanic && showData 
                        ? "0 0 15px rgba(255, 0, 0, 0.3), inset 0 0 10px rgba(255, 0, 0, 0.1)"
                        : "0 0 8px rgba(255, 0, 0, 0.15)",
                }}
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-2"
                    style={{ 
                        color: "#CCCCCC",
                        textShadow: "none",
                    }}
                >
                    {texts.bpm}
                </div>
                <div 
                    className="text-3xl font-bold font-mono"
                    style={{ 
                        color: isActive && revealPhase >= 2 ? "#FFFFFF" : "rgba(255, 255, 255, 0.3)",
                        textShadow: isActive && revealPhase >= 2 
                            ? isPanic 
                                ? "0 0 10px rgba(255, 255, 255, 0.5)"
                                : "none"
                            : "none",
                        opacity: revealPhase >= 2 ? 1 : 0.4,
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
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    border: `1px solid ${isPanic && showData ? "rgba(255, 0, 0, 0.6)" : "rgba(255, 0, 0, 0.3)"}`,
                    boxShadow: isPanic && showData 
                        ? "0 0 15px rgba(255, 0, 0, 0.3), inset 0 0 10px rgba(255, 0, 0, 0.1)"
                        : "0 0 8px rgba(255, 0, 0, 0.15)",
                }}
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-2"
                    style={{ 
                        color: "#CCCCCC",
                        textShadow: "none",
                    }}
                >
                    {texts.stress}
                </div>
                <div 
                    className="text-3xl font-bold font-mono"
                    style={{ 
                        color: isActive && revealPhase >= 3 ? "#FFFFFF" : "rgba(255, 255, 255, 0.3)",
                        textShadow: isActive && revealPhase >= 3 
                            ? isPanic 
                                ? "0 0 10px rgba(255, 255, 255, 0.5)"
                                : "none"
                            : "none",
                        opacity: revealPhase >= 3 ? 1 : 0.4,
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
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    border: `1px solid ${isPanic && showData ? "rgba(255, 0, 0, 0.6)" : "rgba(255, 0, 0, 0.3)"}`,
                    boxShadow: isPanic && showData 
                        ? "0 0 15px rgba(255, 0, 0, 0.3), inset 0 0 10px rgba(255, 0, 0, 0.1)"
                        : "0 0 8px rgba(255, 0, 0, 0.15)",
                }}
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-2"
                    style={{ 
                        color: "#CCCCCC",
                        textShadow: "none",
                    }}
                >
                    {texts.signal}
                </div>
                <div 
                    className="text-sm font-bold tracking-wider"
                    style={{ 
                        color: isActive && revealPhase >= 4 ? "#FF0000" : "rgba(255, 0, 0, 0.3)",
                        textShadow: isActive && revealPhase >= 4 
                            ? signal === "CRITICAL"
                                ? "0 0 15px #FF0000, 0 0 30px rgba(255, 0, 0, 0.7)"
                                : "0 0 8px rgba(255, 0, 0, 0.5)"
                            : "none",
                        opacity: revealPhase >= 4 ? 1 : 0.4,
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
