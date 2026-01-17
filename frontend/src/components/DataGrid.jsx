export const DataGrid = ({
    bpm,
    stress,
    signal,
    isActive,
    isPanic,
    texts,
}) => {
    const getSignalText = () => {
        if (!isActive) return "---";
        if (signal === "CRITICAL") return texts.critical;
        if (signal === "UNSTABLE") return texts.unstable;
        return texts.active;
    };

    const getSignalClass = () => {
        if (!isActive) return "text-fear-gray/50";
        if (signal === "CRITICAL") return "text-fear-red text-glow-red-intense animate-pulse-aggressive";
        if (signal === "UNSTABLE") return "text-fear-red/80";
        return "text-fear-red";
    };

    return (
        <div className="grid grid-cols-3 gap-3">
            {/* BPM Block */}
            <div 
                className={`data-block p-3 rounded ${
                    isActive ? (isPanic ? "critical" : "active") : ""
                }`}
            >
                <div className="text-fear-gray text-[10px] tracking-[0.2em] uppercase mb-1">
                    {texts.bpm}
                </div>
                <div 
                    className={`text-2xl font-bold ${
                        isPanic 
                            ? "text-fear-red text-glow-red-intense" 
                            : isActive 
                                ? "text-fear-red text-glow-red" 
                                : "text-fear-gray/50"
                    }`}
                >
                    {isActive ? bpm : "---"}
                </div>
            </div>

            {/* Stress Block */}
            <div 
                className={`data-block p-3 rounded ${
                    isActive ? (isPanic ? "critical" : "active") : ""
                }`}
            >
                <div className="text-fear-gray text-[10px] tracking-[0.2em] uppercase mb-1">
                    {texts.stress}
                </div>
                <div 
                    className={`text-2xl font-bold ${
                        isPanic 
                            ? "text-fear-red text-glow-red-intense" 
                            : isActive 
                                ? "text-fear-red text-glow-red" 
                                : "text-fear-gray/50"
                    }`}
                >
                    {isActive ? `${stress}%` : "---"}
                </div>
            </div>

            {/* Signal Block */}
            <div 
                className={`data-block p-3 rounded ${
                    isActive ? (isPanic ? "critical" : "active") : ""
                }`}
            >
                <div className="text-fear-gray text-[10px] tracking-[0.2em] uppercase mb-1">
                    {texts.signal}
                </div>
                <div className={`text-sm font-bold tracking-wider ${getSignalClass()}`}>
                    {getSignalText()}
                </div>
            </div>
        </div>
    );
};

export default DataGrid;
