import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useNightmareProtocol, NIGHTMARE_STATE } from "@/hooks/useNightmareProtocol";

export const NightmareProtocol = () => {
    const navigate = useNavigate();
    const [showLog, setShowLog] = useState(false);
    
    const {
        protocolState,
        isActive,
        currentBpm,
        events,
        sessionEvents,
        peakBpm,
        showSummary,
        nightmareFlash,
        sessionDuration,
        totalSessionEvents,
        startProtocol,
        stopProtocol,
        dismissSummary,
        clearLog,
    } = useNightmareProtocol();
    
    // Handle tap to deactivate (anywhere on screen during active mode)
    const handleScreenTap = () => {
        if (isActive && !showSummary) {
            stopProtocol();
        }
    };
    
    // Render inactive/pre-activation view
    const renderInactiveView = () => (
        <div 
            className="flex-1 flex flex-col items-center justify-center px-6"
            onClick={() => startProtocol()}
        >
            <p 
                className="text-[10px] tracking-[0.3em] mb-8"
                style={{ color: "rgba(139, 0, 0, 0.4)" }}
            >
                PASSIVE BIOMETRIC MONITORING
            </p>
            
            <p 
                className="text-[9px] tracking-[0.2em] text-center max-w-xs"
                style={{ color: "rgba(139, 0, 0, 0.25)" }}
            >
                TAP ANYWHERE TO ACTIVATE
            </p>
        </div>
    );
    
    // Render active monitoring view (minimalist)
    const renderActiveView = () => (
        <div 
            className="flex-1 flex flex-col items-center justify-center relative"
            onClick={handleScreenTap}
        >
            {/* Nightmare flash overlay */}
            {nightmareFlash && (
                <div 
                    className="fixed inset-0 pointer-events-none z-50"
                    style={{ backgroundColor: "rgba(255, 0, 0, 0.3)" }}
                />
            )}
            
            {/* Nightmare detected text */}
            {protocolState === NIGHTMARE_STATE.NIGHTMARE_DETECTED ? (
                <div className="text-center">
                    <p 
                        className="text-xs tracking-[0.3em]"
                        style={{ 
                            color: "#FF0000",
                            textShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
                        }}
                    >
                        NIGHTMARE DETECTED
                    </p>
                </div>
            ) : (
                // Normal monitoring - minimal text
                <div className="text-center">
                    <p 
                        className="text-[10px] tracking-[0.25em]"
                        style={{ color: "#8B0000" }}
                    >
                        NIGHTMARE MODE ACTIVE
                    </p>
                </div>
            )}
            
            {/* Session events counter - subtle */}
            {totalSessionEvents > 0 && protocolState !== NIGHTMARE_STATE.NIGHTMARE_DETECTED && (
                <p 
                    className="absolute bottom-20 text-[8px] tracking-[0.2em]"
                    style={{ color: "rgba(139, 0, 0, 0.3)" }}
                >
                    EVENTS: {totalSessionEvents}
                </p>
            )}
        </div>
    );
    
    // Render summary view after deactivation
    const renderSummaryView = () => (
        <div 
            className="flex-1 flex flex-col items-center justify-center px-6"
            onClick={dismissSummary}
        >
            <div className="text-center space-y-6">
                <p 
                    className="text-[9px] tracking-[0.3em]"
                    style={{ color: "rgba(139, 0, 0, 0.4)" }}
                >
                    SESSION COMPLETE
                </p>
                
                {/* Night events detected */}
                <div>
                    <p 
                        className="text-[8px] tracking-[0.15em] mb-1"
                        style={{ color: "rgba(139, 0, 0, 0.4)" }}
                    >
                        NIGHT EVENTS DETECTED
                    </p>
                    <p 
                        className="text-3xl font-mono"
                        style={{ color: "#8B0000" }}
                    >
                        {totalSessionEvents}
                    </p>
                </div>
                
                {/* Peak BPM */}
                {peakBpm > 0 && (
                    <div>
                        <p 
                            className="text-[8px] tracking-[0.15em] mb-1"
                            style={{ color: "rgba(139, 0, 0, 0.4)" }}
                        >
                            PEAK BPM
                        </p>
                        <p 
                            className="text-2xl font-mono"
                            style={{ color: "#8B0000" }}
                        >
                            {peakBpm}
                        </p>
                    </div>
                )}
                
                {/* Duration */}
                <div>
                    <p 
                        className="text-[8px] tracking-[0.15em] mb-1"
                        style={{ color: "rgba(139, 0, 0, 0.4)" }}
                    >
                        DURATION
                    </p>
                    <p 
                        className="text-lg font-mono"
                        style={{ color: "#8B0000" }}
                    >
                        {sessionDuration}
                    </p>
                </div>
                
                <p 
                    className="text-[8px] tracking-[0.15em] mt-8"
                    style={{ color: "rgba(139, 0, 0, 0.2)" }}
                >
                    TAP TO DISMISS
                </p>
            </div>
        </div>
    );
    
    // Render log view
    const renderLogView = () => (
        <div className="flex-1 flex flex-col">
            {/* Log Header */}
            <div 
                className="py-4 px-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(139, 0, 0, 0.1)" }}
            >
                <button
                    onClick={() => setShowLog(false)}
                    className="text-[9px] tracking-[0.15em]"
                    style={{ color: "rgba(139, 0, 0, 0.5)" }}
                >
                    BACK
                </button>
                
                {events.length > 0 && (
                    <button
                        onClick={clearLog}
                        className="text-[8px] tracking-[0.15em]"
                        style={{ color: "rgba(139, 0, 0, 0.3)" }}
                    >
                        CLEAR
                    </button>
                )}
            </div>
            
            {/* Events List */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                {events.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p 
                            className="text-[9px] tracking-[0.2em]"
                            style={{ color: "rgba(139, 0, 0, 0.25)" }}
                        >
                            NO EVENTS RECORDED
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div 
                                key={event.id}
                                className="py-2"
                                style={{ borderBottom: "1px solid rgba(139, 0, 0, 0.05)" }}
                            >
                                <div className="flex justify-between items-center">
                                    <p 
                                        className="text-[8px] tracking-[0.1em]"
                                        style={{ color: "rgba(139, 0, 0, 0.4)" }}
                                    >
                                        {event.date} • {event.time}
                                    </p>
                                    <p 
                                        className="text-sm font-mono"
                                        style={{ color: "#8B0000" }}
                                    >
                                        {event.peakBpm} BPM
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
    
    return (
        <div 
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: "#000000" }}
        >
            {/* Header - minimal */}
            <div 
                className="py-3 px-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(139, 0, 0, 0.05)" }}
            >
                <button
                    onClick={() => navigate("/")}
                    className="p-1"
                    style={{ color: "rgba(139, 0, 0, 0.4)" }}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span 
                    className="text-[8px] tracking-[0.25em]"
                    style={{ color: "rgba(139, 0, 0, 0.3)" }}
                >
                    NIGHTMARE PROTOCOL
                </span>
                
                <button
                    onClick={() => setShowLog(true)}
                    className="text-[8px] tracking-[0.15em] p-1"
                    style={{ color: "rgba(139, 0, 0, 0.4)" }}
                >
                    LOG
                </button>
            </div>
            
            {/* Main Content */}
            {showLog ? (
                renderLogView()
            ) : showSummary ? (
                renderSummaryView()
            ) : isActive ? (
                renderActiveView()
            ) : (
                renderInactiveView()
            )}
        </div>
    );
};

export default NightmareProtocol;
