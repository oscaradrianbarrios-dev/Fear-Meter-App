import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Pause, SkipForward, AlertTriangle } from "lucide-react";

// Movie data with fear timeline
const MOVIES_WITH_TIMELINE = {
    hereditary: {
        title: "Hereditary",
        duration: 127, // minutes
        avgBpmSpike: 28,
        fearLevel: "EXTREME",
        timeline: [
            { time: 12, event: "Funeral scene", intensity: 40, type: "tension" },
            { time: 28, event: "Tree house discovery", intensity: 65, type: "shock" },
            { time: 45, event: "Car accident", intensity: 85, type: "trauma" },
            { time: 67, event: "Classroom hallucination", intensity: 55, type: "tension" },
            { time: 89, event: "Seance scene", intensity: 70, type: "supernatural" },
            { time: 102, event: "Head click scene", intensity: 95, type: "terror" },
            { time: 115, event: "Attic chase", intensity: 90, type: "chase" },
            { time: 124, event: "Final ritual", intensity: 100, type: "climax" },
        ],
    },
    theConjuring: {
        title: "The Conjuring",
        duration: 112,
        avgBpmSpike: 22,
        fearLevel: "HIGH",
        timeline: [
            { time: 8, event: "Annabelle intro", intensity: 50, type: "tension" },
            { time: 25, event: "Hide and clap", intensity: 70, type: "tension" },
            { time: 42, event: "Clapping hands", intensity: 85, type: "jumpscare" },
            { time: 58, event: "Wardrobe entity", intensity: 75, type: "supernatural" },
            { time: 75, event: "Basement possession", intensity: 80, type: "possession" },
            { time: 95, event: "Exorcism begins", intensity: 90, type: "climax" },
            { time: 108, event: "Final confrontation", intensity: 95, type: "terror" },
        ],
    },
    sinister: {
        title: "Sinister",
        duration: 110,
        avgBpmSpike: 25,
        fearLevel: "EXTREME",
        timeline: [
            { time: 5, event: "Opening footage", intensity: 80, type: "shock" },
            { time: 22, event: "First film discovery", intensity: 60, type: "tension" },
            { time: 38, event: "Pool party tape", intensity: 75, type: "disturbing" },
            { time: 55, event: "Lawn mower tape", intensity: 95, type: "terror" },
            { time: 72, event: "Bughuul appearance", intensity: 85, type: "supernatural" },
            { time: 88, event: "Children in footage", intensity: 90, type: "revelation" },
            { time: 105, event: "Final twist", intensity: 100, type: "climax" },
        ],
    },
    insidious: {
        title: "Insidious",
        duration: 103,
        avgBpmSpike: 20,
        fearLevel: "HIGH",
        timeline: [
            { time: 15, event: "Attic fall", intensity: 45, type: "tension" },
            { time: 32, event: "Baby monitor voice", intensity: 60, type: "supernatural" },
            { time: 48, event: "Red face demon", intensity: 95, type: "jumpscare" },
            { time: 65, event: "Seance session", intensity: 70, type: "tension" },
            { time: 78, event: "The Further entry", intensity: 80, type: "supernatural" },
            { time: 92, event: "Demon lair", intensity: 90, type: "terror" },
            { time: 100, event: "Final possession", intensity: 85, type: "climax" },
        ],
    },
};

// Get intensity color
const getIntensityColor = (intensity) => {
    if (intensity >= 90) return "#FF0000";
    if (intensity >= 70) return "#FF0000";
    if (intensity >= 50) return "#FF0000";
    return "rgba(255, 0, 0, 0.5)";
};

// Get event type label
const getEventTypeLabel = (type) => {
    const labels = {
        tension: "TENSION BUILDING",
        shock: "SHOCK MOMENT",
        trauma: "TRAUMATIC EVENT",
        supernatural: "SUPERNATURAL",
        jumpscare: "⚠ JUMP SCARE",
        terror: "EXTREME TERROR",
        chase: "CHASE SEQUENCE",
        climax: "CLIMAX",
        possession: "POSSESSION",
        disturbing: "DISTURBING CONTENT",
        revelation: "DARK REVELATION",
    };
    return labels[type] || type.toUpperCase();
};

export const MovieSession = () => {
    const navigate = useNavigate();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentBpm, setCurrentBpm] = useState(72);
    const [peakBpm, setPeakBpm] = useState(72);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [upcomingAlert, setUpcomingAlert] = useState(null);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [fearScore, setFearScore] = useState(0);
    const intervalRef = useRef(null);
    const baseBpm = 72;

    // Start movie session
    const startSession = useCallback((movieKey) => {
        setSelectedMovie(MOVIES_WITH_TIMELINE[movieKey]);
        setCurrentTime(0);
        setCurrentBpm(baseBpm);
        setPeakBpm(baseBpm);
        setFearScore(0);
        setSessionComplete(false);
        setIsPlaying(true);
    }, []);

    // Simulate BPM based on timeline events
    useEffect(() => {
        if (!isPlaying || !selectedMovie) return;

        intervalRef.current = setInterval(() => {
            setCurrentTime(prev => {
                const newTime = prev + 0.1; // 0.1 minute increments (6 seconds real time = 1 movie minute)
                
                if (newTime >= selectedMovie.duration) {
                    setIsPlaying(false);
                    setSessionComplete(true);
                    return selectedMovie.duration;
                }
                
                // Find current event
                const activeEvent = selectedMovie.timeline.find(
                    e => Math.abs(e.time - newTime) < 2
                );
                
                // Find upcoming event (within 5 minutes)
                const upcoming = selectedMovie.timeline.find(
                    e => e.time > newTime && e.time - newTime < 5
                );
                
                if (activeEvent) {
                    setCurrentEvent(activeEvent);
                    // Calculate BPM spike based on intensity
                    const targetBpm = baseBpm + (activeEvent.intensity * 0.8);
                    setCurrentBpm(prev => {
                        const newBpm = Math.round(prev + (targetBpm - prev) * 0.3);
                        setPeakBpm(p => Math.max(p, newBpm));
                        return newBpm;
                    });
                } else {
                    setCurrentEvent(null);
                    // Gradually return to baseline
                    setCurrentBpm(prev => Math.round(prev + (baseBpm - prev) * 0.05));
                }
                
                // Set upcoming alert
                if (upcoming && upcoming.time - newTime < 3) {
                    setUpcomingAlert(upcoming);
                } else {
                    setUpcomingAlert(null);
                }
                
                // Calculate fear score
                setFearScore(prev => {
                    if (activeEvent) {
                        return Math.min(100, prev + activeEvent.intensity * 0.01);
                    }
                    return prev;
                });
                
                return newTime;
            });
        }, 600); // 600ms = 1 movie minute (accelerated for demo)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, selectedMovie]);

    // Render movie selection
    const renderMovieSelection = () => (
        <div className="flex-1 p-4">
            <h2 
                className="text-xs tracking-[0.2em] mb-6 text-center"
                style={{ color: "rgba(255, 0, 0, 0.5)" }}
            >
                SELECT MOVIE EXPERIENCE
            </h2>
            
            <div className="space-y-3">
                {Object.entries(MOVIES_WITH_TIMELINE).map(([key, movie]) => (
                    <button
                        key={key}
                        onClick={() => startSession(key)}
                        className="w-full p-4 text-left transition-all duration-200"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.03)",
                            border: "1px solid rgba(255, 0, 0, 0.15)",
                        }}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 
                                    className="text-sm tracking-[0.1em]"
                                    style={{ color: "#FF0000" }}
                                >
                                    {movie.title}
                                </h3>
                                <p 
                                    className="text-[9px] tracking-[0.05em] mt-1"
                                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                                >
                                    {movie.duration} MIN • {movie.timeline.length} FEAR EVENTS
                                </p>
                            </div>
                            <span 
                                className="text-[8px] tracking-[0.1em] px-2 py-1"
                                style={{ 
                                    backgroundColor: movie.fearLevel === "EXTREME" 
                                        ? "rgba(255, 0, 0, 0.15)" 
                                        : "rgba(255, 0, 0, 0.1)",
                                    color: movie.fearLevel === "EXTREME" ? "#FF0000" : "#FF0000",
                                    border: `1px solid ${movie.fearLevel === "EXTREME" ? "rgba(255,0,0,0.3)" : "rgba(177,18,38,0.2)"}`,
                                }}
                            >
                                {movie.fearLevel}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <Play className="w-3 h-3" style={{ color: "#FF0000" }} />
                            <span 
                                className="text-[8px] tracking-[0.1em]"
                                style={{ color: "rgba(255, 0, 0, 0.5)" }}
                            >
                                START EXPERIENCE
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    // Render active session
    const renderActiveSession = () => (
        <div className="flex-1 flex flex-col">
            {/* Movie title */}
            <div 
                className="py-3 px-4 text-center"
                style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.1)" }}
            >
                <h2 
                    className="text-xs tracking-[0.2em]"
                    style={{ color: "#FF0000" }}
                >
                    {selectedMovie.title.toUpperCase()}
                </h2>
            </div>
            
            {/* BPM Display */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                {/* Upcoming alert */}
                {upcomingAlert && (
                    <div 
                        className="absolute top-20 left-0 right-0 py-2 px-4 text-center animate-pulse"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <AlertTriangle className="w-3 h-3" style={{ color: "#FF0000" }} />
                            <span 
                                className="text-[9px] tracking-[0.15em]"
                                style={{ color: "#FF0000" }}
                            >
                                {getEventTypeLabel(upcomingAlert.type)} INCOMING
                            </span>
                        </div>
                    </div>
                )}
                
                {/* Current BPM */}
                <div 
                    className="text-6xl font-mono font-bold mb-2"
                    style={{ 
                        color: currentBpm > 120 ? "#FF0000" : currentBpm > 100 ? "#FF0000" : "#FF0000",
                        textShadow: currentBpm > 120 ? "0 0 20px rgba(255, 0, 0, 0.5)" : "none",
                        animation: currentEvent ? "pulse 0.5s ease-in-out infinite" : "none",
                    }}
                >
                    {currentBpm}
                </div>
                <span 
                    className="text-[10px] tracking-[0.2em]"
                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                >
                    BPM
                </span>
                
                {/* Current event */}
                {currentEvent && (
                    <div 
                        className="mt-6 py-3 px-6 text-center"
                        style={{ 
                            backgroundColor: `${getIntensityColor(currentEvent.intensity)}15`,
                            border: `1px solid ${getIntensityColor(currentEvent.intensity)}40`,
                        }}
                    >
                        <p 
                            className="text-[8px] tracking-[0.15em] mb-1"
                            style={{ color: getIntensityColor(currentEvent.intensity) }}
                        >
                            {getEventTypeLabel(currentEvent.type)}
                        </p>
                        <p 
                            className="text-[10px] tracking-[0.1em]"
                            style={{ color: "rgba(176, 176, 176, 0.7)" }}
                        >
                            {currentEvent.event}
                        </p>
                    </div>
                )}
                
                {/* Fear Score */}
                <div className="mt-8">
                    <p 
                        className="text-[8px] tracking-[0.15em] text-center mb-2"
                        style={{ color: "rgba(255, 0, 0, 0.4)" }}
                    >
                        FEAR SCORE
                    </p>
                    <div 
                        className="w-48 h-2"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                    >
                        <div 
                            className="h-full transition-all duration-300"
                            style={{ 
                                width: `${fearScore}%`,
                                backgroundColor: fearScore > 80 ? "#FF0000" : fearScore > 50 ? "#FF0000" : "#FF0000",
                            }}
                        />
                    </div>
                    <p 
                        className="text-lg font-mono text-center mt-1"
                        style={{ color: "#FF0000" }}
                    >
                        {Math.round(fearScore)}
                    </p>
                </div>
            </div>
            
            {/* Timeline */}
            <div className="px-4 pb-4">
                <div 
                    className="h-1 w-full relative"
                    style={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                >
                    {/* Progress */}
                    <div 
                        className="h-full absolute left-0 top-0"
                        style={{ 
                            width: `${(currentTime / selectedMovie.duration) * 100}%`,
                            backgroundColor: "#FF0000",
                        }}
                    />
                    {/* Event markers */}
                    {selectedMovie.timeline.map((event, idx) => (
                        <div
                            key={idx}
                            className="absolute top-0 w-1 h-2 -mt-0.5"
                            style={{ 
                                left: `${(event.time / selectedMovie.duration) * 100}%`,
                                backgroundColor: getIntensityColor(event.intensity),
                            }}
                        />
                    ))}
                </div>
                <div className="flex justify-between mt-2">
                    <span 
                        className="text-[8px] font-mono"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        {Math.floor(currentTime)}:00
                    </span>
                    <span 
                        className="text-[8px] font-mono"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        {selectedMovie.duration}:00
                    </span>
                </div>
            </div>
            
            {/* Controls */}
            <div 
                className="flex justify-center gap-4 py-4"
                style={{ borderTop: "1px solid rgba(255, 0, 0, 0.1)" }}
            >
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 0, 0, 0.2)",
                        color: "#FF0000",
                    }}
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                    onClick={() => {
                        setSelectedMovie(null);
                        setIsPlaying(false);
                    }}
                    className="p-3"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.05)",
                        border: "1px solid rgba(255, 0, 0, 0.1)",
                        color: "rgba(255, 0, 0, 0.5)",
                    }}
                >
                    <SkipForward className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    // Render session complete
    const renderSessionComplete = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <h2 
                className="text-sm tracking-[0.3em] mb-8"
                style={{ color: "#FF0000" }}
            >
                SESSION COMPLETE
            </h2>
            
            <div className="space-y-6 text-center">
                <div>
                    <p 
                        className="text-[8px] tracking-[0.15em] mb-1"
                        style={{ color: "rgba(255, 0, 0, 0.4)" }}
                    >
                        PEAK BPM
                    </p>
                    <p 
                        className="text-4xl font-mono"
                        style={{ color: peakBpm > 120 ? "#FF0000" : "#FF0000" }}
                    >
                        {peakBpm}
                    </p>
                </div>
                
                <div>
                    <p 
                        className="text-[8px] tracking-[0.15em] mb-1"
                        style={{ color: "rgba(255, 0, 0, 0.4)" }}
                    >
                        FEAR SCORE
                    </p>
                    <p 
                        className="text-3xl font-mono"
                        style={{ color: "#FF0000" }}
                    >
                        {Math.round(fearScore)}/100
                    </p>
                </div>
                
                <div>
                    <p 
                        className="text-[8px] tracking-[0.15em] mb-1"
                        style={{ color: "rgba(255, 0, 0, 0.4)" }}
                    >
                        VS GLOBAL AVERAGE
                    </p>
                    <p 
                        className="text-lg font-mono"
                        style={{ color: fearScore > 65 ? "#FF0000" : "#FF0000" }}
                    >
                        {fearScore > 65 ? "ABOVE" : fearScore > 45 ? "AVERAGE" : "BELOW"} AVERAGE
                    </p>
                </div>
            </div>
            
            <button
                onClick={() => {
                    setSelectedMovie(null);
                    setSessionComplete(false);
                }}
                className="mt-8 px-6 py-3 text-[10px] tracking-[0.15em]"
                style={{ 
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    border: "1px solid rgba(255, 0, 0, 0.3)",
                    color: "#FF0000",
                }}
            >
                NEW SESSION
            </button>
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
                    onClick={() => navigate("/library")}
                    className="p-1"
                    style={{ color: "rgba(255, 0, 0, 0.5)" }}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span 
                    className="text-[9px] tracking-[0.25em]"
                    style={{ color: "rgba(255, 0, 0, 0.4)" }}
                >
                    MOVIE SESSION
                </span>
                
                <div className="w-4" />
            </div>
            
            {/* Content */}
            {sessionComplete ? (
                renderSessionComplete()
            ) : selectedMovie ? (
                renderActiveSession()
            ) : (
                renderMovieSelection()
            )}
            
            {/* Footer */}
            <div 
                className="py-2 px-4 text-center"
                style={{ borderTop: "1px solid rgba(255, 0, 0, 0.05)" }}
            >
                <p 
                    className="text-[7px] tracking-[0.1em]"
                    style={{ color: "rgba(255, 0, 0, 0.25)" }}
                >
                    SIMULATED EXPERIENCE — NOT REAL BIOMETRIC DATA
                </p>
            </div>
            
            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
            `}</style>
        </div>
    );
};

export default MovieSession;
