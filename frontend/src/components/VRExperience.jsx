import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Glasses, Wifi, WifiOff, Play, Square, Eye } from "lucide-react";

// VR Video categories based on fear level
const VR_VIDEOS = {
    calm: {
        label: "CALM",
        color: "rgba(255, 0, 0, 0.3)",
        scenes: [
            "Empty hospital corridor — fluorescent lights flickering",
            "Abandoned house entrance — wind sounds",
            "Dark forest path — distant owl calls",
            "Old elevator interior — mechanical hum",
        ],
    },
    tension: {
        label: "TENSION",
        color: "#FF0000",
        scenes: [
            "Shadow movement in peripheral vision",
            "Footsteps approaching from behind",
            "Door slowly creaking open",
            "Breathing sounds getting closer",
            "Lights flickering more intensely",
        ],
    },
    terror: {
        label: "TERROR",
        color: "#FF0000",
        scenes: [
            "⚠ ENTITY MANIFESTATION",
            "⚠ SUDDEN APPARITION",
            "⚠ CHASE SEQUENCE INITIATED",
            "⚠ DIRECT CONFRONTATION",
        ],
    },
};

// Simulated VR connection states
const CONNECTION_STATES = {
    DISCONNECTED: "DISCONNECTED",
    SEARCHING: "SEARCHING",
    CONNECTING: "CONNECTING",
    CONNECTED: "CONNECTED",
    STREAMING: "STREAMING",
};

export const VRExperience = () => {
    const navigate = useNavigate();
    const [connectionState, setConnectionState] = useState(CONNECTION_STATES.DISCONNECTED);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [currentBpm, setCurrentBpm] = useState(72);
    const [currentCategory, setCurrentCategory] = useState("calm");
    const [currentScene, setCurrentScene] = useState("");
    const [sessionDuration, setSessionDuration] = useState(0);
    const [terrorEvents, setTerrorEvents] = useState(0);
    const [peakBpm, setPeakBpm] = useState(72);
    const intervalRef = useRef(null);
    const sceneIntervalRef = useRef(null);

    // Simulate VR headset connection
    const connectVR = useCallback(() => {
        setConnectionState(CONNECTION_STATES.SEARCHING);
        
        setTimeout(() => {
            setConnectionState(CONNECTION_STATES.CONNECTING);
        }, 1500);
        
        setTimeout(() => {
            setConnectionState(CONNECTION_STATES.CONNECTED);
        }, 3000);
    }, []);

    // Disconnect VR
    const disconnectVR = useCallback(() => {
        setConnectionState(CONNECTION_STATES.DISCONNECTED);
        setIsSessionActive(false);
    }, []);

    // Start VR session
    const startSession = useCallback(() => {
        if (connectionState !== CONNECTION_STATES.CONNECTED) return;
        
        setIsSessionActive(true);
        setConnectionState(CONNECTION_STATES.STREAMING);
        setSessionDuration(0);
        setTerrorEvents(0);
        setPeakBpm(72);
        setCurrentBpm(72);
    }, [connectionState]);

    // Stop VR session
    const stopSession = useCallback(() => {
        setIsSessionActive(false);
        setConnectionState(CONNECTION_STATES.CONNECTED);
    }, []);

    // Simulate BPM changes and scene selection
    useEffect(() => {
        if (!isSessionActive) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (sceneIntervalRef.current) clearInterval(sceneIntervalRef.current);
            return;
        }

        // BPM simulation - random fluctuations with occasional spikes
        intervalRef.current = setInterval(() => {
            setCurrentBpm(prev => {
                // Random walk with occasional spikes
                const change = (Math.random() - 0.45) * 8;
                const spike = Math.random() < 0.05 ? 25 : 0; // 5% chance of spike
                let newBpm = prev + change + spike;
                
                // Keep in realistic range
                newBpm = Math.max(65, Math.min(145, newBpm));
                newBpm = Math.round(newBpm);
                
                setPeakBpm(p => Math.max(p, newBpm));
                
                // Determine category based on BPM
                if (newBpm > 110) {
                    setCurrentCategory("terror");
                    if (spike > 0) setTerrorEvents(e => e + 1);
                } else if (newBpm > 90) {
                    setCurrentCategory("tension");
                } else {
                    setCurrentCategory("calm");
                }
                
                return newBpm;
            });
            
            setSessionDuration(d => d + 1);
        }, 1000);

        // Scene changes
        sceneIntervalRef.current = setInterval(() => {
            setCurrentScene(prev => {
                const category = VR_VIDEOS[currentCategory];
                const scenes = category.scenes;
                const currentIdx = scenes.indexOf(prev);
                let newIdx = Math.floor(Math.random() * scenes.length);
                // Avoid same scene twice
                while (newIdx === currentIdx && scenes.length > 1) {
                    newIdx = Math.floor(Math.random() * scenes.length);
                }
                return scenes[newIdx];
            });
        }, 4000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (sceneIntervalRef.current) clearInterval(sceneIntervalRef.current);
        };
    }, [isSessionActive, currentCategory]);

    // Set initial scene
    useEffect(() => {
        if (isSessionActive && !currentScene) {
            setCurrentScene(VR_VIDEOS.calm.scenes[0]);
        }
    }, [isSessionActive, currentScene]);

    // Format duration
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Render connection panel
    const renderConnectionPanel = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            {/* VR Headset icon */}
            <div 
                className="w-24 h-24 flex items-center justify-center mb-6"
                style={{ 
                    border: `2px solid ${connectionState === CONNECTION_STATES.CONNECTED ? "#FF0000" : "rgba(255, 0, 0, 0.2)"}`,
                    borderRadius: "50%",
                }}
            >
                <Glasses 
                    className="w-12 h-12"
                    style={{ 
                        color: connectionState === CONNECTION_STATES.CONNECTED 
                            ? "#FF0000" 
                            : "rgba(255, 0, 0, 0.3)",
                    }}
                />
            </div>
            
            {/* Connection status */}
            <div className="text-center mb-8">
                <p 
                    className="text-xs tracking-[0.2em] mb-2"
                    style={{ 
                        color: connectionState === CONNECTION_STATES.CONNECTED 
                            ? "#FF0000" 
                            : "rgba(255, 0, 0, 0.5)",
                    }}
                >
                    {connectionState}
                </p>
                
                {connectionState === CONNECTION_STATES.SEARCHING && (
                    <p 
                        className="text-[9px] tracking-[0.1em] animate-pulse"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        Scanning for VR devices...
                    </p>
                )}
                
                {connectionState === CONNECTION_STATES.CONNECTING && (
                    <p 
                        className="text-[9px] tracking-[0.1em] animate-pulse"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        Establishing secure connection...
                    </p>
                )}
                
                {connectionState === CONNECTION_STATES.CONNECTED && (
                    <p 
                        className="text-[9px] tracking-[0.1em]"
                        style={{ color: "rgba(176, 176, 176, 0.5)" }}
                    >
                        FEAR METER VR HEADSET — READY
                    </p>
                )}
            </div>
            
            {/* Connection buttons */}
            {connectionState === CONNECTION_STATES.DISCONNECTED && (
                <button
                    onClick={connectVR}
                    className="flex items-center gap-2 px-6 py-3 text-[10px] tracking-[0.15em]"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 0, 0, 0.3)",
                        color: "#FF0000",
                    }}
                >
                    <Wifi className="w-4 h-4" />
                    CONNECT VR HEADSET
                </button>
            )}
            
            {connectionState === CONNECTION_STATES.CONNECTED && (
                <div className="flex flex-col gap-3">
                    <button
                        onClick={startSession}
                        className="flex items-center gap-2 px-8 py-3 text-[10px] tracking-[0.15em]"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.15)",
                            border: "1px solid rgba(255, 0, 0, 0.4)",
                            color: "#FF0000",
                        }}
                    >
                        <Play className="w-4 h-4" />
                        START VR EXPERIENCE
                    </button>
                    
                    <button
                        onClick={disconnectVR}
                        className="flex items-center gap-2 px-6 py-2 text-[9px] tracking-[0.1em]"
                        style={{ 
                            color: "rgba(255, 0, 0, 0.4)",
                        }}
                    >
                        <WifiOff className="w-3 h-3" />
                        DISCONNECT
                    </button>
                </div>
            )}
            
            {/* Supported devices */}
            <div className="mt-12 text-center">
                <p 
                    className="text-[8px] tracking-[0.1em] mb-2"
                    style={{ color: "rgba(255, 0, 0, 0.3)" }}
                >
                    COMPATIBLE DEVICES
                </p>
                <p 
                    className="text-[7px] tracking-[0.05em]"
                    style={{ color: "rgba(176, 176, 176, 0.3)" }}
                >
                    Meta Quest • HTC Vive • Valve Index • PlayStation VR
                </p>
            </div>
        </div>
    );

    // Render active VR session
    const renderActiveSession = () => (
        <div className="flex-1 flex flex-col">
            {/* VR Status bar */}
            <div 
                className="py-2 px-4 flex items-center justify-between"
                style={{ 
                    backgroundColor: `${VR_VIDEOS[currentCategory].color}10`,
                    borderBottom: `1px solid ${VR_VIDEOS[currentCategory].color}30`,
                }}
            >
                <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3" style={{ color: VR_VIDEOS[currentCategory].color }} />
                    <span 
                        className="text-[9px] tracking-[0.1em]"
                        style={{ color: VR_VIDEOS[currentCategory].color }}
                    >
                        {VR_VIDEOS[currentCategory].label} MODE
                    </span>
                </div>
                <span 
                    className="text-[8px] font-mono"
                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                >
                    {formatDuration(sessionDuration)}
                </span>
            </div>
            
            {/* Main VR view simulation */}
            <div 
                className="flex-1 flex flex-col items-center justify-center p-6 relative"
                style={{ 
                    background: currentCategory === "terror" 
                        ? "radial-gradient(circle, rgba(255,0,0,0.05) 0%, transparent 70%)"
                        : currentCategory === "tension"
                            ? "radial-gradient(circle, rgba(142,14,28,0.03) 0%, transparent 70%)"
                            : "transparent",
                }}
            >
                {/* Current scene display */}
                <div 
                    className="absolute top-8 left-4 right-4 py-3 px-4 text-center"
                    style={{ 
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: `1px solid ${VR_VIDEOS[currentCategory].color}30`,
                    }}
                >
                    <p 
                        className="text-[8px] tracking-[0.1em] mb-1"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        CURRENT SCENE
                    </p>
                    <p 
                        className="text-[10px] tracking-[0.05em]"
                        style={{ color: VR_VIDEOS[currentCategory].color }}
                    >
                        {currentScene}
                    </p>
                </div>
                
                {/* BPM Display */}
                <div 
                    className="text-7xl font-mono font-bold"
                    style={{ 
                        color: VR_VIDEOS[currentCategory].color,
                        textShadow: currentCategory === "terror" 
                            ? "0 0 30px rgba(255, 0, 0, 0.5)" 
                            : "none",
                        animation: currentCategory === "terror" ? "vr-pulse 0.3s ease-in-out infinite" : "none",
                    }}
                >
                    {currentBpm}
                </div>
                <span 
                    className="text-[10px] tracking-[0.2em] mt-2"
                    style={{ color: "rgba(176, 176, 176, 0.4)" }}
                >
                    BPM
                </span>
                
                {/* Adaptive message */}
                <div className="mt-8 text-center">
                    <p 
                        className="text-[9px] tracking-[0.15em]"
                        style={{ color: "rgba(176, 176, 176, 0.5)" }}
                    >
                        {currentCategory === "terror" 
                            ? "SYSTEM DETECTING HIGH FEAR — INTENSIFYING"
                            : currentCategory === "tension"
                                ? "BUILDING TENSION — MONITORING RESPONSE"
                                : "BASELINE ESTABLISHED — PREPARING STIMULUS"}
                    </p>
                </div>
                
                {/* Category indicators */}
                <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-4">
                    {Object.entries(VR_VIDEOS).map(([key, video]) => (
                        <div 
                            key={key}
                            className="text-center"
                            style={{ opacity: currentCategory === key ? 1 : 0.3 }}
                        >
                            <div 
                                className="w-3 h-3 mx-auto mb-1"
                                style={{ 
                                    backgroundColor: video.color,
                                    borderRadius: "50%",
                                    boxShadow: currentCategory === key 
                                        ? `0 0 10px ${video.color}` 
                                        : "none",
                                }}
                            />
                            <span 
                                className="text-[7px] tracking-[0.1em]"
                                style={{ color: video.color }}
                            >
                                {video.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Session stats */}
            <div 
                className="py-3 px-4 flex justify-around"
                style={{ borderTop: "1px solid rgba(255, 0, 0, 0.1)" }}
            >
                <div className="text-center">
                    <p className="text-[7px] tracking-[0.1em]" style={{ color: "rgba(255, 0, 0, 0.4)" }}>
                        PEAK BPM
                    </p>
                    <p className="text-sm font-mono" style={{ color: "#FF0000" }}>
                        {peakBpm}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-[7px] tracking-[0.1em]" style={{ color: "rgba(255, 0, 0, 0.4)" }}>
                        TERROR EVENTS
                    </p>
                    <p className="text-sm font-mono" style={{ color: terrorEvents > 0 ? "#FF0000" : "#FF0000" }}>
                        {terrorEvents}
                    </p>
                </div>
            </div>
            
            {/* Stop button */}
            <div 
                className="py-4 flex justify-center"
                style={{ borderTop: "1px solid rgba(255, 0, 0, 0.1)" }}
            >
                <button
                    onClick={stopSession}
                    className="flex items-center gap-2 px-6 py-3 text-[10px] tracking-[0.15em]"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 0, 0, 0.3)",
                        color: "#FF0000",
                    }}
                >
                    <Square className="w-4 h-4" />
                    END VR SESSION
                </button>
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
                style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.1)" }}
            >
                <button
                    onClick={() => navigate("/")}
                    className="p-1"
                    style={{ color: "rgba(255, 0, 0, 0.5)" }}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span 
                    className="text-[9px] tracking-[0.25em]"
                    style={{ color: "rgba(255, 0, 0, 0.4)" }}
                >
                    VR EXPERIENCE
                </span>
                
                <div 
                    className="flex items-center gap-1"
                    style={{ color: isSessionActive ? "#FF0000" : "rgba(255, 0, 0, 0.3)" }}
                >
                    <Glasses className="w-4 h-4" />
                </div>
            </div>
            
            {/* Content */}
            {isSessionActive ? renderActiveSession() : renderConnectionPanel()}
            
            {/* Footer */}
            <div 
                className="py-2 px-4 text-center"
                style={{ borderTop: "1px solid rgba(255, 0, 0, 0.05)" }}
            >
                <p 
                    className="text-[7px] tracking-[0.1em]"
                    style={{ color: "rgba(255, 0, 0, 0.25)" }}
                >
                    SIMULATED VR EXPERIENCE — WebXR DEMO MODE
                </p>
            </div>
            
            <style>{`
                @keyframes vr-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.02); opacity: 0.9; }
                }
            `}</style>
        </div>
    );
};

export default VRExperience;
