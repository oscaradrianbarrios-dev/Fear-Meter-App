import { useState } from "react";
import { Trash2 } from "lucide-react";

export const History = ({ sessions, texts, onClear }) => {
    const [viewMode, setViewMode] = useState("list"); // "list" or "graph"

    if (sessions.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 border border-fear-gray/20 rounded-full flex items-center justify-center mb-4">
                    <div className="w-8 h-0.5 bg-fear-gray/30" />
                </div>
                <p className="text-fear-gray/50 text-xs tracking-widest uppercase">
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
                        className={`px-3 py-1.5 text-[10px] tracking-wider uppercase border rounded transition-colors ${
                            viewMode === "list"
                                ? "border-fear-red text-fear-red bg-fear-red/10"
                                : "border-fear-gray/30 text-fear-gray hover:border-fear-red/50"
                        }`}
                    >
                        LIST
                    </button>
                    <button
                        onClick={() => setViewMode("graph")}
                        className={`px-3 py-1.5 text-[10px] tracking-wider uppercase border rounded transition-colors ${
                            viewMode === "graph"
                                ? "border-fear-red text-fear-red bg-fear-red/10"
                                : "border-fear-gray/30 text-fear-gray hover:border-fear-red/50"
                        }`}
                    >
                        GRAPH
                    </button>
                </div>
                
                <button
                    onClick={onClear}
                    className="p-2 text-fear-gray/50 hover:text-fear-red transition-colors"
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
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
            {sessions.map((session, index) => (
                <div
                    key={session.id}
                    className="border border-fear-red/20 bg-fear-red/5 rounded p-3"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-fear-gray text-[10px] tracking-wider">
                                {session.date}
                            </div>
                            <div className="text-fear-red/80 text-xs mt-0.5">
                                {session.name}
                            </div>
                        </div>
                        <div className="text-[10px] text-fear-gray/50">
                            #{sessions.length - index}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="bg-fear-black/50 rounded p-2">
                            <div className="text-[9px] text-fear-gray/60 tracking-wider">
                                {texts.maxBpm}
                            </div>
                            <div className="text-fear-red text-lg font-bold">
                                {session.maxBpm}
                            </div>
                        </div>
                        <div className="bg-fear-black/50 rounded p-2">
                            <div className="text-[9px] text-fear-gray/60 tracking-wider">
                                {texts.maxStress}
                            </div>
                            <div className="text-fear-red text-lg font-bold">
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
    // Generate path from session data
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
            <div className="text-fear-gray text-[10px] tracking-[0.2em] mb-4">
                FEAR EVOLUTION
            </div>
            
            <div className="w-full max-w-sm border border-fear-red/20 rounded p-4 bg-fear-black">
                <svg 
                    viewBox="0 0 300 150" 
                    className="w-full h-auto"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255, 0, 0, 0.4))" }}
                >
                    {/* Grid */}
                    {[0, 1, 2, 3].map(i => (
                        <line
                            key={`h-${i}`}
                            x1="10"
                            y1={10 + i * 43.33}
                            x2="290"
                            y2={10 + i * 43.33}
                            stroke="rgba(255, 0, 0, 0.1)"
                            strokeWidth="1"
                        />
                    ))}
                    
                    {/* Data line */}
                    <path
                        d={generatePath()}
                        className="history-line"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
                                r="4"
                                fill="#FF0000"
                                stroke="#000"
                                strokeWidth="2"
                            />
                        );
                    })}
                </svg>
            </div>

            <div className="mt-4 text-center">
                <div className="text-fear-gray/60 text-[10px]">
                    {sessions.length} SESSION{sessions.length !== 1 ? 'S' : ''} RECORDED
                </div>
            </div>
        </div>
    );
};

export default History;
