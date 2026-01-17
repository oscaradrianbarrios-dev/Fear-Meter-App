import { useState } from "react";
import { Trash2, Clock, Activity, TrendingUp } from "lucide-react";

export const History = ({ sessions, texts, onClear }) => {
    const [viewMode, setViewMode] = useState("list");

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
                <ListView sessions={sessions} texts={texts} />
            ) : (
                <GraphView sessions={sessions} />
            )}
        </div>
    );
};

const ListView = ({ sessions, texts }) => {
    return (
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)] no-scrollbar">
            {sessions.map((session, index) => (
                <div
                    key={session.id}
                    className="rounded p-3 transition-all duration-200"
                    style={{
                        backgroundColor: "#000000",
                        border: "1px solid rgba(255, 0, 0, 0.12)",
                        borderLeft: "2px solid rgba(255, 0, 0, 0.4)",
                    }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div 
                                className="flex items-center gap-1.5 text-[10px] tracking-wider"
                                style={{ color: "rgba(176, 176, 176, 0.5)" }}
                            >
                                <Clock className="w-3 h-3" />
                                {session.date}
                            </div>
                            <div 
                                className="text-xs mt-1 tracking-wide"
                                style={{ color: "rgba(255, 0, 0, 0.7)" }}
                            >
                                {session.name}
                            </div>
                        </div>
                        <div 
                            className="text-[9px]"
                            style={{ color: "rgba(176, 176, 176, 0.3)" }}
                        >
                            #{String(sessions.length - index).padStart(2, '0')}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <div 
                            className="rounded p-2"
                            style={{ backgroundColor: "rgba(255, 0, 0, 0.03)" }}
                        >
                            <div 
                                className="text-[9px] tracking-wider flex items-center gap-1"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                <Activity className="w-2.5 h-2.5" />
                                {texts.maxBpm}
                            </div>
                            <div 
                                className="text-lg font-bold mt-0.5"
                                style={{ color: "rgba(255, 0, 0, 0.8)" }}
                            >
                                {session.maxBpm}
                            </div>
                        </div>
                        <div 
                            className="rounded p-2"
                            style={{ backgroundColor: "rgba(255, 0, 0, 0.03)" }}
                        >
                            <div 
                                className="text-[9px] tracking-wider flex items-center gap-1"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                <TrendingUp className="w-2.5 h-2.5" />
                                {texts.maxStress}
                            </div>
                            <div 
                                className="text-lg font-bold mt-0.5"
                                style={{ color: "rgba(255, 0, 0, 0.8)" }}
                            >
                                {session.maxStress}%
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const GraphView = ({ sessions }) => {
    const generatePath = () => {
        if (sessions.length === 0) return "";
        
        const width = 300;
        const height = 150;
        const padding = 10;
        
        const maxBpm = Math.max(...sessions.map(s => s.maxBpm), 140);
        const minBpm = Math.min(...sessions.map(s => s.maxBpm), 60);
        
        const points = sessions.slice(-10).map((session, i, arr) => {
            const x = padding + (i / Math.max(arr.length - 1, 1)) * (width - padding * 2);
            const y = height - padding - ((session.maxBpm - minBpm) / (maxBpm - minBpm || 1)) * (height - padding * 2);
            return { x, y };
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
                        const maxBpm = Math.max(...sessions.map(s => s.maxBpm), 140);
                        const minBpm = Math.min(...sessions.map(s => s.maxBpm), 60);
                        const x = 10 + (i / Math.max(arr.length - 1, 1)) * 280;
                        const y = 140 - ((session.maxBpm - minBpm) / (maxBpm - minBpm || 1)) * 130;
                        
                        return (
                            <circle
                                key={session.id}
                                cx={x}
                                cy={y}
                                r="3"
                                fill="#FF0000"
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
            </div>
        </div>
    );
};

export default History;
