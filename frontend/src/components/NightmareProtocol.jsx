import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Activity, ChevronLeft, Power } from "lucide-react";
import { useNightmareProtocol, NIGHTMARE_STATE, EVENT_SEVERITY } from "@/hooks/useNightmareProtocol";

export const NightmareProtocol = ({ language = "EN" }) => {
    const navigate = useNavigate();
    const [showLog, setShowLog] = useState(false);
    
    const {
        protocolState,
        isActive,
        currentBpm,
        baselineBpm,
        events,
        currentEvent,
        totalEventsTonight,
        isNighttime,
        tonightEvents,
        startProtocol,
        stopProtocol,
        clearLog,
    } = useNightmareProtocol();
    
    const texts = useMemo(() => ({
        EN: {
            title: "NIGHTMARE PROTOCOL",
            subtitle: "NOCTURNAL FEAR MONITORING",
            standby: "STANDBY — AWAITING NIGHTFALL",
            monitoring: "MONITORING ACTIVE",
            eventDetected: "NOCTURNAL FEAR EVENT DETECTED",
            subconscious: "SUBCONSCIOUS STRESS RESPONSE",
            currentBpm: "CURRENT BPM",
            baseline: "BASELINE",
            eventsTonight: "EVENTS TONIGHT",
            activate: "ACTIVATE PROTOCOL",
            deactivate: "DEACTIVATE",
            nightmareLog: "NIGHTMARE LOG",
            noEvents: "NO EVENTS RECORDED",
            clearLog: "CLEAR LOG",
            back: "BACK",
            severity: {
                [EVENT_SEVERITY.MINOR]: "MINOR DISTURBANCE",
                [EVENT_SEVERITY.MODERATE]: "MODERATE EVENT",
                [EVENT_SEVERITY.SEVERE]: "SEVERE NIGHTMARE",
                [EVENT_SEVERITY.CRITICAL]: "CRITICAL TERROR EVENT",
            },
            intensity: "INTENSITY",
            duration: "DURATION",
            peak: "PEAK",
            seconds: "SEC",
            instructions: [
                "PLACE DEVICE NEAR BED",
                "ACTIVATE BEFORE SLEEP",
                "DO NOT DISTURB MODE RECOMMENDED",
            ],
            warning: "SILENT MONITORING — NO ALERTS DURING SLEEP",
        },
        ES: {
            title: "PROTOCOLO PESADILLA",
            subtitle: "MONITOREO NOCTURNO DE MIEDO",
            standby: "ESPERA — AGUARDANDO NOCHE",
            monitoring: "MONITOREO ACTIVO",
            eventDetected: "EVENTO DE MIEDO NOCTURNO DETECTADO",
            subconscious: "RESPUESTA DE ESTRÉS SUBCONSCIENTE",
            currentBpm: "BPM ACTUAL",
            baseline: "LÍNEA BASE",
            eventsTonight: "EVENTOS ESTA NOCHE",
            activate: "ACTIVAR PROTOCOLO",
            deactivate: "DESACTIVAR",
            nightmareLog: "REGISTRO DE PESADILLAS",
            noEvents: "SIN EVENTOS REGISTRADOS",
            clearLog: "BORRAR REGISTRO",
            back: "VOLVER",
            severity: {
                [EVENT_SEVERITY.MINOR]: "PERTURBACIÓN MENOR",
                [EVENT_SEVERITY.MODERATE]: "EVENTO MODERADO",
                [EVENT_SEVERITY.SEVERE]: "PESADILLA SEVERA",
                [EVENT_SEVERITY.CRITICAL]: "EVENTO DE TERROR CRÍTICO",
            },
            intensity: "INTENSIDAD",
            duration: "DURACIÓN",
            peak: "PICO",
            seconds: "SEG",
            instructions: [
                "COLOQUE EL DISPOSITIVO CERCA DE LA CAMA",
                "ACTIVE ANTES DE DORMIR",
                "MODO NO MOLESTAR RECOMENDADO",
            ],
            warning: "MONITOREO SILENCIOSO — SIN ALERTAS DURANTE EL SUEÑO",
        },
    }), []);
    
    const t = texts[language] || texts.EN;
    
    // Get status color
    const getStatusColor = () => {
        switch (protocolState) {
            case NIGHTMARE_STATE.EVENT_DETECTED:
                return "#FF0000";
            case NIGHTMARE_STATE.MONITORING:
                return "#8B0000";
            case NIGHTMARE_STATE.STANDBY:
                return "rgba(139, 0, 0, 0.5)";
            default:
                return "rgba(139, 0, 0, 0.3)";
        }
    };
    
    // Get severity color
    const getSeverityColor = (severity) => {
        switch (severity) {
            case EVENT_SEVERITY.CRITICAL:
                return "#FF0000";
            case EVENT_SEVERITY.SEVERE:
                return "rgba(255, 0, 0, 0.85)";
            case EVENT_SEVERITY.MODERATE:
                return "rgba(139, 0, 0, 0.8)";
            default:
                return "rgba(139, 0, 0, 0.6)";
        }
    };
    
    const renderInactiveView = () => (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            {/* Moon Icon */}
            <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
                style={{ 
                    border: "1px solid rgba(139, 0, 0, 0.3)",
                    backgroundColor: "rgba(139, 0, 0, 0.05)",
                }}
            >
                <Moon 
                    className="w-12 h-12" 
                    style={{ color: "rgba(139, 0, 0, 0.6)" }}
                />
            </div>
            
            {/* Title */}
            <h1 
                className="text-lg tracking-[0.4em] font-bold mb-2"
                style={{ color: "#8B0000" }}
            >
                {t.title}
            </h1>
            <p 
                className="text-[10px] tracking-[0.3em] mb-10"
                style={{ color: "rgba(139, 0, 0, 0.5)" }}
            >
                {t.subtitle}
            </p>
            
            {/* Instructions */}
            <div className="mb-10 space-y-2">
                {t.instructions.map((instruction, i) => (
                    <p 
                        key={i}
                        className="text-[9px] tracking-[0.15em]"
                        style={{ color: "rgba(139, 0, 0, 0.4)" }}
                    >
                        [{String(i + 1).padStart(2, '0')}] {instruction}
                    </p>
                ))}
            </div>
            
            {/* Warning */}
            <div 
                className="mb-10 py-2 px-4"
                style={{ 
                    backgroundColor: "rgba(139, 0, 0, 0.05)",
                    border: "1px solid rgba(139, 0, 0, 0.15)",
                }}
            >
                <p 
                    className="text-[8px] tracking-[0.2em]"
                    style={{ color: "rgba(139, 0, 0, 0.5)" }}
                >
                    {t.warning}
                </p>
            </div>
            
            {/* Activate Button */}
            <button
                onClick={startProtocol}
                className="py-3 px-8 text-[10px] tracking-[0.25em] transition-all duration-300"
                style={{ 
                    backgroundColor: "#8B0000",
                    color: "#000000",
                    border: "none",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 30px rgba(139, 0, 0, 0.4)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                {t.activate}
            </button>
        </div>
    );
    
    const renderActiveView = () => (
        <div className="flex flex-col h-full">
            {/* Status Header */}
            <div 
                className="py-4 px-4 text-center"
                style={{ 
                    backgroundColor: protocolState === NIGHTMARE_STATE.EVENT_DETECTED 
                        ? "rgba(255, 0, 0, 0.1)" 
                        : "rgba(139, 0, 0, 0.05)",
                    borderBottom: `1px solid ${getStatusColor()}`,
                }}
            >
                <div className="flex items-center justify-center gap-2 mb-1">
                    <div 
                        className="w-2 h-2 rounded-full"
                        style={{ 
                            backgroundColor: getStatusColor(),
                            animation: protocolState === NIGHTMARE_STATE.MONITORING 
                                ? "pulse-slow 3s ease-in-out infinite" 
                                : protocolState === NIGHTMARE_STATE.EVENT_DETECTED
                                    ? "pulse-fast 0.5s ease-in-out infinite"
                                    : "none",
                        }}
                    />
                    <span 
                        className="text-[10px] tracking-[0.25em]"
                        style={{ color: getStatusColor() }}
                    >
                        {protocolState === NIGHTMARE_STATE.STANDBY && t.standby}
                        {protocolState === NIGHTMARE_STATE.MONITORING && t.monitoring}
                        {protocolState === NIGHTMARE_STATE.EVENT_DETECTED && t.eventDetected}
                    </span>
                </div>
                
                {protocolState === NIGHTMARE_STATE.EVENT_DETECTED && (
                    <p 
                        className="text-[8px] tracking-[0.15em]"
                        style={{ color: "rgba(255, 0, 0, 0.7)" }}
                    >
                        {t.subconscious}
                    </p>
                )}
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                {/* BPM Display */}
                <div className="text-center mb-8">
                    <p 
                        className="text-[9px] tracking-[0.2em] mb-2"
                        style={{ color: "rgba(139, 0, 0, 0.5)" }}
                    >
                        {t.currentBpm}
                    </p>
                    <p 
                        className="text-5xl font-mono"
                        style={{ 
                            color: getStatusColor(),
                            textShadow: protocolState === NIGHTMARE_STATE.EVENT_DETECTED 
                                ? "0 0 20px rgba(255, 0, 0, 0.3)" 
                                : "none",
                        }}
                    >
                        {currentBpm}
                    </p>
                    <p 
                        className="text-[8px] tracking-[0.15em] mt-2"
                        style={{ color: "rgba(139, 0, 0, 0.4)" }}
                    >
                        {t.baseline}: {Math.round(baselineBpm)}
                    </p>
                </div>
                
                {/* Current Event Display */}
                {currentEvent && (
                    <div 
                        className="w-full mb-8 py-4 px-4 text-center"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.08)",
                            border: "1px solid rgba(255, 0, 0, 0.2)",
                        }}
                    >
                        <p 
                            className="text-[10px] tracking-[0.2em] mb-2"
                            style={{ color: getSeverityColor(currentEvent.severity) }}
                        >
                            {t.severity[currentEvent.severity]}
                        </p>
                        <div className="flex justify-center gap-6">
                            <div>
                                <p className="text-[8px]" style={{ color: "rgba(139, 0, 0, 0.5)" }}>
                                    {t.peak}
                                </p>
                                <p className="text-sm font-mono" style={{ color: "#8B0000" }}>
                                    {currentEvent.peakBpm}
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px]" style={{ color: "rgba(139, 0, 0, 0.5)" }}>
                                    {t.intensity}
                                </p>
                                <p className="text-sm font-mono" style={{ color: "#8B0000" }}>
                                    {currentEvent.intensity}%
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px]" style={{ color: "rgba(139, 0, 0, 0.5)" }}>
                                    {t.duration}
                                </p>
                                <p className="text-sm font-mono" style={{ color: "#8B0000" }}>
                                    {currentEvent.duration}{t.seconds}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Events Tonight Counter */}
                <div className="text-center mb-8">
                    <p 
                        className="text-[9px] tracking-[0.2em] mb-1"
                        style={{ color: "rgba(139, 0, 0, 0.4)" }}
                    >
                        {t.eventsTonight}
                    </p>
                    <p 
                        className="text-2xl font-mono"
                        style={{ color: "#8B0000" }}
                    >
                        {totalEventsTonight}
                    </p>
                </div>
                
                {/* Deactivate Button */}
                <button
                    onClick={stopProtocol}
                    className="py-2 px-6 text-[9px] tracking-[0.2em] transition-all duration-300"
                    style={{ 
                        backgroundColor: "transparent",
                        color: "rgba(139, 0, 0, 0.5)",
                        border: "1px solid rgba(139, 0, 0, 0.2)",
                    }}
                >
                    {t.deactivate}
                </button>
            </div>
            
            {/* CSS Animations */}
            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                @keyframes pulse-fast {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
    
    const renderLogView = () => (
        <div className="flex flex-col h-full">
            {/* Log Header */}
            <div 
                className="py-4 px-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(139, 0, 0, 0.15)" }}
            >
                <button
                    onClick={() => setShowLog(false)}
                    className="flex items-center gap-2 text-[9px] tracking-[0.15em]"
                    style={{ color: "rgba(139, 0, 0, 0.5)" }}
                >
                    <ChevronLeft className="w-4 h-4" />
                    {t.back}
                </button>
                
                {events.length > 0 && (
                    <button
                        onClick={clearLog}
                        className="text-[8px] tracking-[0.15em]"
                        style={{ color: "rgba(139, 0, 0, 0.4)" }}
                    >
                        {t.clearLog}
                    </button>
                )}
            </div>
            
            {/* Log Title */}
            <div className="py-4 px-4 text-center">
                <h2 
                    className="text-sm tracking-[0.3em]"
                    style={{ color: "#8B0000" }}
                >
                    {t.nightmareLog}
                </h2>
            </div>
            
            {/* Events List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                {events.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p 
                            className="text-[10px] tracking-[0.2em]"
                            style={{ color: "rgba(139, 0, 0, 0.3)" }}
                        >
                            {t.noEvents}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div 
                                key={event.id}
                                className="py-3 px-4"
                                style={{ 
                                    backgroundColor: "rgba(139, 0, 0, 0.03)",
                                    borderLeft: `2px solid ${getSeverityColor(event.severity)}`,
                                }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p 
                                            className="text-[9px] tracking-[0.15em]"
                                            style={{ color: getSeverityColor(event.severity) }}
                                        >
                                            {t.severity[event.severity]}
                                        </p>
                                        <p 
                                            className="text-[8px] mt-1"
                                            style={{ color: "rgba(139, 0, 0, 0.4)" }}
                                        >
                                            {event.date} • {event.time}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p 
                                            className="text-lg font-mono"
                                            style={{ color: "#8B0000" }}
                                        >
                                            {event.peakBpm}
                                        </p>
                                        <p 
                                            className="text-[7px]"
                                            style={{ color: "rgba(139, 0, 0, 0.4)" }}
                                        >
                                            PEAK BPM
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 text-[8px]">
                                    <span style={{ color: "rgba(139, 0, 0, 0.5)" }}>
                                        {t.intensity}: {event.intensity}%
                                    </span>
                                    <span style={{ color: "rgba(139, 0, 0, 0.5)" }}>
                                        {t.duration}: {event.duration}{t.seconds}
                                    </span>
                                    <span style={{ color: "rgba(139, 0, 0, 0.5)" }}>
                                        +{event.bpmSpike} BPM
                                    </span>
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
            {/* Header */}
            <div 
                className="py-3 px-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(139, 0, 0, 0.1)" }}
            >
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-[9px] tracking-[0.15em]"
                    style={{ color: "rgba(139, 0, 0, 0.5)" }}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span 
                    className="text-[9px] tracking-[0.3em]"
                    style={{ color: "rgba(139, 0, 0, 0.4)" }}
                >
                    NIGHTMARE_PROTOCOL_v1.0
                </span>
                
                <button
                    onClick={() => setShowLog(true)}
                    className="text-[9px] tracking-[0.15em]"
                    style={{ color: "rgba(139, 0, 0, 0.5)" }}
                >
                    LOG
                </button>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
                {showLog ? renderLogView() : (
                    isActive ? renderActiveView() : renderInactiveView()
                )}
            </div>
            
            {/* Footer */}
            <div 
                className="py-3 text-center"
                style={{ borderTop: "1px solid rgba(139, 0, 0, 0.05)" }}
            >
                <p 
                    className="text-[8px] tracking-[0.2em]"
                    style={{ color: "rgba(139, 0, 0, 0.2)" }}
                >
                    FEAR METER — NOCTURNAL SUBSYSTEM
                </p>
            </div>
        </div>
    );
};

export default NightmareProtocol;
