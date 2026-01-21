import { useState } from "react";
import { Trash2, Clock, Activity, TrendingUp, AlertTriangle, ChevronLeft, X } from "lucide-react";

export const History = ({ sessions, texts, onClear, onDeleteSession }) => {
    const [viewMode, setViewMode] = useState("list");
    const [selectedSession, setSelectedSession] = useState(null);

    if (sessions.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ border: "1px solid rgba(255, 0, 0, 0.15)" }}
                >
                    <Activity className="w-6 h-6" style={{ color: "rgba(255, 0, 0, 0.2)" }} />
                </div>
                <p 
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: "rgba(176, 176, 176, 0.4)" }}
                >
                    {texts.noSessions}
                </p>
            </div>
        );
    }

    // Detailed session view
    if (selectedSession) {
        return (
            <SessionDetail 
                session={selectedSession} 
                onClose={() => setSelectedSession(null)}
                texts={texts}
            />
        );
    }

    return (
        <div className="flex-1 flex flex-col py-4">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode("list")}
                        className="px-3 py-1.5 text-[10px] tracking-wider uppercase rounded transition-all duration-200"
                        style={{
                            border: viewMode === "list" 
                                ? "1px solid rgba(255, 0, 0, 0.5)" 
                                : "1px solid rgba(176, 176, 176, 0.15)",
                            color: viewMode === "list" ? "#FF0000" : "rgba(176, 176, 176, 0.5)",
                            backgroundColor: viewMode === "list" ? "rgba(255, 0, 0, 0.05)" : "transparent",
                        }}
                    >
                        LIST
                    </button>
                    <button
                        onClick={() => setViewMode("graph")}
                        className="px-3 py-1.5 text-[10px] tracking-wider uppercase rounded transition-all duration-200"
                        style={{
                            border: viewMode === "graph" 
                                ? "1px solid rgba(255, 0, 0, 0.5)" 
                                : "1px solid rgba(176, 176, 176, 0.15)",
                            color: viewMode === "graph" ? "#FF0000" : "rgba(176, 176, 176, 0.5)",
                            backgroundColor: viewMode === "graph" ? "rgba(255, 0, 0, 0.05)" : "transparent",
                        }}
                    >
                        GRAPH
                    </button>
                </div>
                
                <button
                    onClick={onClear}
                    className="p-2 transition-colors duration-200"
                    style={{ color: "rgba(176, 176, 176, 0.3)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#FF0000"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(176, 176, 176, 0.3)"}
                    title="Clear history"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {viewMode === "list" ? (
                <ListView 
                    sessions={sessions} 
                    texts={texts} 
                    onSelectSession={setSelectedSession}
                />
            ) : (
                <GraphView sessions={sessions} />
            )}
        </div>
    );
};

const ListView = ({ sessions, texts, onSelectSession }) => {
    return (
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)] no-scrollbar">
            {sessions.map((session, index) => (
                <div
                    key={session.id}
                    onClick={() => onSelectSession(session)}
                    className="rounded p-3 transition-all duration-200 cursor-pointer"
                    style={{
                        backgroundColor: "#000000",
                        border: session.hasPanicEvent 
                            ? "1px solid rgba(255, 0, 0, 0.5)" 
                            : "1px solid rgba(255, 0, 0, 0.12)",
                        borderLeft: session.hasPanicEvent 
                            ? "3px solid #FF0000" 
                            : "2px solid rgba(255, 0, 0, 0.4)",
                        animation: `fadeSlideIn 0.3s ease-out ${index * 50}ms both`,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.02)";
                        e.currentTarget.style.borderColor = session.hasPanicEvent 
                            ? "rgba(255, 0, 0, 0.7)" 
                            : "rgba(255, 0, 0, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#000000";
                        e.currentTarget.style.borderColor = session.hasPanicEvent 
                            ? "rgba(255, 0, 0, 0.5)" 
                            : "rgba(255, 0, 0, 0.12)";
                    }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <div 
                                    className="flex items-center gap-1.5 text-[10px] tracking-wider"
                                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                                >
                                    <Clock className="w-3 h-3" />
                                    {session.date}
                                </div>
                                {session.hasPanicEvent && (
                                    <div 
                                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] tracking-wider"
                                        style={{ 
                                            backgroundColor: "rgba(255, 0, 0, 0.3)",
                                            color: "#FF0000",
                                        }}
                                    >
                                        <AlertTriangle className="w-2.5 h-2.5" />
                                        PANIC
                                    </div>
                                )}
                            </div>
                            <div 
                                className="text-xs mt-1 tracking-wide"
                                style={{ color: session.hasPanicEvent ? "#FF0000" : "rgba(255, 0, 0, 0.7)" }}
                            >
                                {session.name}
                            </div>
                            {session.durationText && (
                                <div 
                                    className="text-[9px] mt-0.5"
                                    style={{ color: "rgba(176, 176, 176, 0.35)" }}
                                >
                                    Duration: {session.durationText}
                                </div>
                            )}
                        </div>
                        <div 
                            className="text-[9px]"
                            style={{ color: "rgba(176, 176, 176, 0.3)" }}
                        >
                            #{String(sessions.length - index).padStart(2, '0')}
                        </div>
                    </div>
                    
                    {/* Stress Bar */}
                    <div className="mt-2 mb-3">
                        <div 
                            className="h-1 rounded-full overflow-hidden"
                            style={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                        >
                            <div 
                                className="h-full rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${session.maxStress || 0}%`,
                                    backgroundColor: session.maxStress > 85 ? "#FF0000" : "#FF0000",
                                    boxShadow: session.maxStress > 85 
                                        ? "0 0 8px rgba(255, 0, 0, 0.5)" 
                                        : "0 0 4px rgba(255, 0, 0, 0.3)",
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                        <div 
                            className="rounded p-2"
                            style={{ backgroundColor: "rgba(255, 0, 0, 0.03)" }}
                        >
                            <div 
                                className="text-[8px] tracking-wider"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                PEAK BPM
                            </div>
                            <div 
                                className="text-base font-bold mt-0.5"
                                style={{ color: session.maxBpm > 120 ? "#FF0000" : "rgba(255, 0, 0, 0.8)" }}
                            >
                                {session.maxBpm || 0}
                            </div>
                        </div>
                        <div 
                            className="rounded p-2"
                            style={{ backgroundColor: "rgba(255, 0, 0, 0.03)" }}
                        >
                            <div 
                                className="text-[8px] tracking-wider"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                AVG BPM
                            </div>
                            <div 
                                className="text-base font-bold mt-0.5"
                                style={{ color: "rgba(255, 0, 0, 0.6)" }}
                            >
                                {session.avgBpm || session.maxBpm || 0}
                            </div>
                        </div>
                        <div 
                            className="rounded p-2"
                            style={{ backgroundColor: "rgba(255, 0, 0, 0.03)" }}
                        >
                            <div 
                                className="text-[8px] tracking-wider"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                MAX STRESS
                            </div>
                            <div 
                                className="text-base font-bold mt-0.5"
                                style={{ color: session.maxStress > 85 ? "#FF0000" : "rgba(255, 0, 0, 0.8)" }}
                            >
                                {session.maxStress || 0}%
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SessionDetail = ({ session, onClose, texts }) => {
    const hasCritical = session.maxBpm > 120 || session.maxStress > 85;
    
    // Generate mini BPM graph path
    const generateBpmPath = () => {
        if (!session.bpmHistory || session.bpmHistory.length === 0) {
            // Fallback: generate synthetic path based on max values
            return "M 10 75 Q 75 60, 150 45 T 290 35";
        }
        
        const history = session.bpmHistory;
        const width = 280;
        const height = 80;
        const padding = 10;
        
        const maxBpm = Math.max(...history.map(h => h.value), 140);
        const minBpm = Math.min(...history.map(h => h.value), 60);
        
        const points = history.map((point, i) => {
            const x = padding + (i / (history.length - 1 || 1)) * (width - padding * 2);
            const y = height - padding - ((point.value - minBpm) / (maxBpm - minBpm || 1)) * (height - padding * 2);
            return { x, y };
        });

        if (points.length === 1) {
            return `M ${points[0].x} ${points[0].y} L ${points[0].x + 1} ${points[0].y}`;
        }

        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    };

    return (
        <div 
            className="flex-1 flex flex-col py-4"
            style={{ animation: "fadeSlideIn 0.3s ease-out" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={onClose}
                    className="flex items-center gap-1 px-2 py-1 rounded transition-colors duration-200"
                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#FF0000"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(176, 176, 176, 0.5)"}
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-[10px] tracking-wider">BACK</span>
                </button>
                
                <div 
                    className="text-[10px] tracking-[0.2em]"
                    style={{ color: "rgba(176, 176, 176, 0.4)" }}
                >
                    SESSION DETAIL
                </div>
            </div>

            {/* Session Info */}
            <div 
                className="rounded p-4 mb-4"
                style={{ 
                    backgroundColor: "#000000",
                    border: session.hasPanicEvent 
                        ? "1px solid rgba(255, 0, 0, 0.5)" 
                        : "1px solid rgba(255, 0, 0, 0.15)",
                }}
            >
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <div 
                            className="text-sm font-bold tracking-wide"
                            style={{ color: session.hasPanicEvent ? "#FF0000" : "rgba(255, 0, 0, 0.8)" }}
                        >
                            {session.name}
                        </div>
                        <div 
                            className="text-[10px] mt-1"
                            style={{ color: "rgba(176, 176, 176, 0.5)" }}
                        >
                            {session.date}
                        </div>
                    </div>
                    {session.hasPanicEvent && (
                        <div 
                            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] tracking-wider"
                            style={{ 
                                backgroundColor: "rgba(255, 0, 0, 0.3)",
                                color: "#FF0000",
                            }}
                        >
                            <AlertTriangle className="w-3 h-3" />
                            PANIC EVENT
                        </div>
                    )}
                </div>

                {session.durationText && (
                    <div 
                        className="text-[10px] mb-3"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        DURATION: {session.durationText}
                    </div>
                )}

                {/* Mini BPM Graph */}
                <div 
                    className="rounded p-3 mb-3"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.02)",
                        border: "1px solid rgba(255, 0, 0, 0.1)",
                    }}
                >
                    <div 
                        className="text-[9px] tracking-wider mb-2"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        BPM TIMELINE
                    </div>
                    <svg 
                        viewBox="0 0 300 100" 
                        className="w-full h-20"
                        style={{ filter: "drop-shadow(0 0 3px rgba(255, 0, 0, 0.3))" }}
                    >
                        {/* Grid lines */}
                        {[0, 1, 2, 3].map(i => (
                            <line
                                key={`grid-${i}`}
                                x1="10"
                                y1={10 + i * 26.67}
                                x2="290"
                                y2={10 + i * 26.67}
                                stroke="rgba(255, 0, 0, 0.05)"
                                strokeWidth="1"
                            />
                        ))}
                        
                        {/* BPM line */}
                        <path
                            d={generateBpmPath()}
                            stroke={session.hasPanicEvent ? "#FF0000" : "#FF0000"}
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                    <div 
                        className="rounded p-3"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.03)" }}
                    >
                        <div 
                            className="text-[8px] tracking-wider mb-1"
                            style={{ color: "rgba(176, 176, 176, 0.4)" }}
                        >
                            PEAK BPM
                        </div>
                        <div 
                            className="text-2xl font-bold"
                            style={{ color: session.maxBpm > 120 ? "#FF0000" : "rgba(255, 0, 0, 0.8)" }}
                        >
                            {session.maxBpm || 0}
                        </div>
                    </div>
                    <div 
                        className="rounded p-3"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.03)" }}
                    >
                        <div 
                            className="text-[8px] tracking-wider mb-1"
                            style={{ color: "rgba(176, 176, 176, 0.4)" }}
                        >
                            MAX STRESS
                        </div>
                        <div 
                            className="text-2xl font-bold"
                            style={{ color: session.maxStress > 85 ? "#FF0000" : "rgba(255, 0, 0, 0.8)" }}
                        >
                            {session.maxStress || 0}%
                        </div>
                    </div>
                    <div 
                        className="rounded p-3"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.03)" }}
                    >
                        <div 
                            className="text-[8px] tracking-wider mb-1"
                            style={{ color: "rgba(176, 176, 176, 0.4)" }}
                        >
                            AVG BPM
                        </div>
                        <div 
                            className="text-2xl font-bold"
                            style={{ color: "rgba(255, 0, 0, 0.6)" }}
                        >
                            {session.avgBpm || session.maxBpm || 0}
                        </div>
                    </div>
                    <div 
                        className="rounded p-3"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.03)" }}
                    >
                        <div 
                            className="text-[8px] tracking-wider mb-1"
                            style={{ color: "rgba(176, 176, 176, 0.4)" }}
                        >
                            PANIC EVENTS
                        </div>
                        <div 
                            className="text-2xl font-bold"
                            style={{ color: session.panicCount > 0 ? "#FF0000" : "rgba(176, 176, 176, 0.4)" }}
                        >
                            {session.panicCount || 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Analysis */}
            <div 
                className="rounded p-4"
                style={{ 
                    backgroundColor: "#000000",
                    border: "1px solid rgba(255, 0, 0, 0.1)",
                }}
            >
                <div 
                    className="text-[9px] tracking-[0.2em] mb-3"
                    style={{ color: "rgba(176, 176, 176, 0.4)" }}
                >
                    TECHNICAL ANALYSIS
                </div>

                {session.maxBpm > 100 && (
                    <div 
                        className="flex items-center gap-2 py-2 px-3 rounded mb-2"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.05)",
                            borderLeft: "2px solid rgba(255, 0, 0, 0.5)",
                        }}
                    >
                        <TrendingUp className="w-3 h-3" style={{ color: "#FF0000" }} />
                        <span 
                            className="text-[10px] tracking-wider"
                            style={{ color: "rgba(255, 0, 0, 0.8)" }}
                        >
                            PEAK FEAR EVENT DETECTED
                        </span>
                    </div>
                )}

                {hasCritical && (
                    <div 
                        className="flex items-center gap-2 py-2 px-3 rounded mb-2"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.1)",
                            borderLeft: "2px solid #FF0000",
                        }}
                    >
                        <AlertTriangle className="w-3 h-3" style={{ color: "#FF0000" }} />
                        <span 
                            className="text-[10px] tracking-wider"
                            style={{ color: "#FF0000" }}
                        >
                            CRITICAL STRESS DETECTED
                        </span>
                    </div>
                )}

                {!session.maxBpm || session.maxBpm < 80 && (
                    <div 
                        className="text-[10px] tracking-wider"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        NOMINAL STRESS LEVELS
                    </div>
                )}
            </div>
        </div>
    );
};

const GraphView = ({ sessions }) => {
    const generatePath = () => {
        if (sessions.length === 0) return "";
        
        const width = 300;
        const height = 150;
        const padding = 10;
        
        const maxBpm = Math.max(...sessions.map(s => s.maxBpm || 0), 140);
        const minBpm = Math.min(...sessions.map(s => s.maxBpm || 60), 60);
        
        const points = sessions.slice(-10).map((session, i, arr) => {
            const x = padding + (i / Math.max(arr.length - 1, 1)) * (width - padding * 2);
            const y = height - padding - (((session.maxBpm || 60) - minBpm) / (maxBpm - minBpm || 1)) * (height - padding * 2);
            return { x, y, session };
        });

        if (points.length === 1) {
            return `M ${points[0].x} ${points[0].y} L ${points[0].x + 1} ${points[0].y}`;
        }

        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div 
                className="text-[10px] tracking-[0.2em] mb-4"
                style={{ color: "rgba(176, 176, 176, 0.4)" }}
            >
                FEAR EVOLUTION
            </div>
            
            <div 
                className="w-full max-w-sm rounded p-4"
                style={{ 
                    backgroundColor: "#000000",
                    border: "1px solid rgba(255, 0, 0, 0.15)"
                }}
            >
                <svg 
                    viewBox="0 0 300 150" 
                    className="w-full h-auto"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255, 0, 0, 0.3))" }}
                >
                    {/* Grid */}
                    {[0, 1, 2, 3].map(i => (
                        <line
                            key={`h-${i}`}
                            x1="10"
                            y1={10 + i * 43.33}
                            x2="290"
                            y2={10 + i * 43.33}
                            stroke="rgba(255, 0, 0, 0.08)"
                            strokeWidth="1"
                        />
                    ))}
                    
                    {/* Data line */}
                    <path
                        d={generatePath()}
                        stroke="#FF0000"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: "drop-shadow(0 0 4px rgba(255, 0, 0, 0.5))" }}
                    />
                    
                    {/* Data points */}
                    {sessions.slice(-10).map((session, i, arr) => {
                        const maxBpm = Math.max(...sessions.map(s => s.maxBpm || 0), 140);
                        const minBpm = Math.min(...sessions.map(s => s.maxBpm || 60), 60);
                        const x = 10 + (i / Math.max(arr.length - 1, 1)) * 280;
                        const y = 140 - (((session.maxBpm || 60) - minBpm) / (maxBpm - minBpm || 1)) * 130;
                        
                        return (
                            <circle
                                key={session.id}
                                cx={x}
                                cy={y}
                                r="3"
                                fill={session.hasPanicEvent ? "#FF0000" : "#FF0000"}
                                stroke="#000"
                                strokeWidth="1.5"
                            />
                        );
                    })}
                </svg>
            </div>

            <div className="mt-4 text-center">
                <div 
                    className="text-[10px]"
                    style={{ color: "rgba(176, 176, 176, 0.4)" }}
                >
                    {sessions.length} SESSION{sessions.length !== 1 ? 'S' : ''} RECORDED
                </div>
                {sessions.some(s => s.hasPanicEvent) && (
                    <div 
                        className="text-[9px] mt-1 flex items-center justify-center gap-1"
                        style={{ color: "#FF0000" }}
                    >
                        <AlertTriangle className="w-3 h-3" />
                        {sessions.filter(s => s.hasPanicEvent).length} PANIC EVENT{sessions.filter(s => s.hasPanicEvent).length !== 1 ? 'S' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
