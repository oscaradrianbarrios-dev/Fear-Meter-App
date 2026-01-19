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

    // Clinical system messages based on state
    const systemMessages = useMemo(() => ({
        monitoring: "MONITORING SUBJECT",
        elevated: "FEAR PATTERN IDENTIFIED",
        high: "STRESS RESPONSE DETECTED",
        critical: "NO ESCAPE RESPONSE",
        recording: "DATA CONTINUES RECORDING",
    }), []);

    // Staged reveal for psychological effect
    useEffect(() => {
        if (isActive && !showData) {
            // Phase 1: Show placeholders (100ms)
            const timer1 = setTimeout(() => setRevealPhase(1), 100);
            // Phase 2: Reveal BPM (250ms)
            const timer2 = setTimeout(() => setRevealPhase(2), 250);
            // Phase 3: Reveal Stress (400ms)
            const timer3 = setTimeout(() => setRevealPhase(3), 400);
            // Phase 4: Reveal Signal (550ms)
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

    const getSignalClass = () => {
        if (!isActive || revealPhase < 4) return "text-fear-gray/40";
        if (signal === "CRITICAL") return "text-fear-red text-glow-red-intense fear-micro-shake";
        if (signal === "UNSTABLE") return "text-fear-red/70";
        return "text-fear-red/90";
    };

    // Determine breathing speed based on BPM
    const getBpmBreathingClass = () => {
        if (!isActive || !showData) return "";
        if (bpm > 100) return "fear-data-breathe-fast";
        return "fear-data-breathe";
    };

    return (
        <div 
            className="grid grid-cols-3 fear-uncomfortable-grid"
            style={{ 
                gap: '11px 13px', // Asymmetric
                marginLeft: '1px',
            }}
        >
            {/* BPM Block */}
            <div 
                className={`data-block p-3 rounded micro-tremor fear-border-flicker ${
                    isActive && showData ? (isPanic ? "critical" : "active") : ""
                }`}
                style={{ marginTop: '2px' }} // Subtle misalignment
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-1 fear-text-reveal-delay-1"
                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                >
                    {texts.bpm}
                </div>
                <div 
                    className={`text-2xl font-bold transition-all duration-500 ${getBpmBreathingClass()} ${
                        isPanic && showData
                            ? "text-fear-red text-glow-red-intense fear-micro-shake" 
                            : isActive && revealPhase >= 2
                                ? "text-fear-red/90 text-glow-red" 
                                : "text-fear-gray/40"
                    }`}
                    style={{ 
                        opacity: revealPhase >= 2 ? 1 : 0.3,
                        transition: 'opacity 0.3s ease-out',
                    }}
                >
                    {isActive && revealPhase >= 2 ? bpm : "---"}
                </div>
            </div>

            {/* Stress Block */}
            <div 
                className={`data-block p-3 rounded micro-tremor fear-border-flicker ${
                    isActive && showData ? (isPanic ? "critical" : "active") : ""
                }`}
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-1 fear-text-reveal-delay-2"
                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                >
                    {texts.stress}
                </div>
                <div 
                    className={`text-2xl font-bold transition-all duration-500 ${
                        stress > 60 ? 'fear-data-breathe-fast' : 'fear-data-breathe'
                    } ${
                        isPanic && showData
                            ? "text-fear-red text-glow-red-intense" 
                            : isActive && revealPhase >= 3
                                ? "text-fear-red/90 text-glow-red" 
                                : "text-fear-gray/40"
                    }`}
                    style={{ 
                        opacity: revealPhase >= 3 ? 1 : 0.3,
                        transition: 'opacity 0.3s ease-out',
                    }}
                >
                    {isActive && revealPhase >= 3 ? `${stress}%` : "---"}
                </div>
            </div>

            {/* Signal Block */}
            <div 
                className={`data-block p-3 rounded micro-tremor fear-border-flicker ${
                    isActive && showData ? (isPanic ? "critical" : "active") : ""
                }`}
                style={{ marginBottom: '1px' }} // Subtle misalignment
            >
                <div 
                    className="text-[10px] tracking-[0.2em] uppercase mb-1 fear-text-reveal-delay-3"
                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                >
                    {texts.signal}
                </div>
                <div 
                    className={`text-sm font-bold tracking-wider transition-all duration-500 ${getSignalClass()}`}
                    style={{ 
                        opacity: revealPhase >= 4 ? 1 : 0.3,
                        transition: 'opacity 0.3s ease-out',
                    }}
                >
                    {getSignalText()}
                </div>
            </div>
        </div>
    );
};

export default DataGrid;
