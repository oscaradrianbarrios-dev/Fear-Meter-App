import { useState, useEffect } from "react";

export const DataGrid = ({
    bpm,
    stress,
    signal,
    isActive,
    isPanic,
    texts,
}) => {
    const [showData, setShowData] = useState(false);

    // 300ms delay before revealing data
    useEffect(() => {
        if (isActive && !showData) {
            const timer = setTimeout(() => setShowData(true), 300);
            return () => clearTimeout(timer);
        } else if (!isActive) {
            setShowData(false);
        }
    }, [isActive, showData]);

    const getSignalText = () => {
        if (!isActive || !showData) return "---";
        if (signal === "CRITICAL") return texts.critical;
        if (signal === "UNSTABLE") return texts.unstable;
        return texts.active;
    };

    const getSignalClass = () => {
        if (!isActive || !showData) return "text-fear-gray/40";
        if (signal === "CRITICAL") return "text-fear-red text-glow-red-intense";
        if (signal === "UNSTABLE") return "text-fear-red/70";
        return "text-fear-red/90";
    };

    return (
        <div className="grid grid-cols-3 gap-3">
            {/* BPM Block */}
            <div 
                className={`data-block p-3 rounded micro-tremor ${
                    isActive && showData ? (isPanic ? "critical" : "active") : ""
                }`}
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-1"
                    style={{ color: "rgba(176, 176, 176, 0.6)" }}
                >
                    {texts.bpm}
                </div>
                <div 
                    className={`text-2xl font-bold transition-all duration-500 ${
                        showData ? "data-reveal" : ""
                    } ${
                        isPanic && showData
                            ? "text-fear-red text-glow-red-intense" 
                            : isActive && showData
                                ? "text-fear-red/90 text-glow-red" 
                                : "text-fear-gray/40"
                    }`}
                    style={{ 
                        animationDelay: "0ms",
                        opacity: showData ? undefined : 1 
                    }}
                >
                    {isActive && showData ? bpm : "---"}
                </div>
            </div>

            {/* Stress Block */}
            <div 
                className={`data-block p-3 rounded micro-tremor ${
                    isActive && showData ? (isPanic ? "critical" : "active") : ""
                }`}
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-1"
                    style={{ color: "rgba(176, 176, 176, 0.6)" }}
                >
                    {texts.stress}
                </div>
                <div 
                    className={`text-2xl font-bold transition-all duration-500 ${
                        showData ? "data-reveal" : ""
                    } ${
                        isPanic && showData
                            ? "text-fear-red text-glow-red-intense" 
                            : isActive && showData
                                ? "text-fear-red/90 text-glow-red" 
                                : "text-fear-gray/40"
                    }`}
                    style={{ 
                        animationDelay: "80ms",
                        opacity: showData ? undefined : 1 
                    }}
                >
                    {isActive && showData ? `${stress}%` : "---"}
                </div>
            </div>

            {/* Signal Block */}
            <div 
                className={`data-block p-3 rounded micro-tremor ${
                    isActive && showData ? (isPanic ? "critical" : "active") : ""
                }`}
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-1"
                    style={{ color: "rgba(176, 176, 176, 0.6)" }}
                >
                    {texts.signal}
                </div>
                <div 
                    className={`text-sm font-bold tracking-wider transition-all duration-500 ${
                        showData ? "data-reveal" : ""
                    } ${getSignalClass()}`}
                    style={{ 
                        animationDelay: "160ms",
                        opacity: showData ? undefined : 1 
                    }}
                >
                    {getSignalText()}
                </div>
            </div>
        </div>
    );
};

export default DataGrid;
