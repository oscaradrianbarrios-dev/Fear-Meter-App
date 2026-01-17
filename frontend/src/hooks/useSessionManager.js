import { useState, useCallback, useEffect, useRef } from "react";

const STORAGE_KEY = "fear_meter_sessions";

const generateSessionName = () => {
    const events = [
        "Night Terror",
        "Shadow Encounter",
        "Dark Vision",
        "Fear Response",
        "Stress Event",
        "Panic Episode",
        "Anxiety Spike",
        "Horror Moment",
        "Dread Instance",
        "Terror Wave",
    ];
    return events[Math.floor(Math.random() * events.length)];
};

const formatDate = (timestamp) => {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
        return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
};

const loadStoredSessions = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load sessions:", e);
    }
    return [];
};

export const useSessionManager = () => {
    const [sessions, setSessions] = useState(loadStoredSessions);
    const [currentSession, setCurrentSession] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    
    // Real-time tracking during session
    const bpmHistoryRef = useRef([]);
    const stressHistoryRef = useRef([]);
    const panicEventsRef = useRef([]);
    const peakBpmRef = useRef(0);
    const peakStressRef = useRef(0);
    const totalBpmRef = useRef(0);
    const sampleCountRef = useRef(0);

    // Save sessions to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        } catch (e) {
            console.error("Failed to save sessions:", e);
        }
    }, [sessions]);

    // Start a new session
    const startSession = useCallback(() => {
        const newSession = {
            id: Date.now(),
            startTime: Date.now(),
            name: generateSessionName(),
        };
        
        // Reset tracking refs
        bpmHistoryRef.current = [];
        stressHistoryRef.current = [];
        panicEventsRef.current = [];
        peakBpmRef.current = 0;
        peakStressRef.current = 0;
        totalBpmRef.current = 0;
        sampleCountRef.current = 0;
        
        setCurrentSession(newSession);
        setIsRecording(true);
    }, []);

    // Record data point during active session
    const recordDataPoint = useCallback((bpm, stress) => {
        if (!isRecording) return;
        
        const timestamp = Date.now();
        
        // Update BPM history (keep last 100 points for graph)
        bpmHistoryRef.current.push({ timestamp, value: bpm });
        if (bpmHistoryRef.current.length > 100) {
            bpmHistoryRef.current.shift();
        }
        
        // Update stress history
        stressHistoryRef.current.push({ timestamp, value: stress });
        if (stressHistoryRef.current.length > 100) {
            stressHistoryRef.current.shift();
        }
        
        // Update peaks
        if (bpm > peakBpmRef.current) peakBpmRef.current = bpm;
        if (stress > peakStressRef.current) peakStressRef.current = stress;
        
        // Update average calculation
        totalBpmRef.current += bpm;
        sampleCountRef.current += 1;
        
        // Check for PANIC EVENT (BPM > 120 AND Stress > 85%)
        if (bpm > 120 && stress > 85) {
            // Only record if not already in panic recently (cooldown 5 seconds)
            const lastPanic = panicEventsRef.current[panicEventsRef.current.length - 1];
            if (!lastPanic || timestamp - lastPanic.timestamp > 5000) {
                panicEventsRef.current.push({
                    timestamp,
                    bpm,
                    stress,
                });
                
                // Vibrate on panic event
                try {
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100]);
                    }
                } catch (e) {
                    // Silent fail
                }
            }
        }
    }, [isRecording]);

    // End current session and save it
    const endSession = useCallback(() => {
        if (!currentSession || !isRecording) return null;

        const endTime = Date.now();
        const duration = endTime - currentSession.startTime;
        const avgBpm = sampleCountRef.current > 0 
            ? Math.round(totalBpmRef.current / sampleCountRef.current) 
            : 0;

        const completedSession = {
            ...currentSession,
            endTime,
            date: formatDate(currentSession.startTime),
            duration,
            durationText: formatDuration(duration),
            avgBpm,
            maxBpm: peakBpmRef.current,
            maxStress: peakStressRef.current,
            bpmHistory: [...bpmHistoryRef.current],
            panicEvents: [...panicEventsRef.current],
            hasPanicEvent: panicEventsRef.current.length > 0,
            panicCount: panicEventsRef.current.length,
        };

        setSessions(prev => [completedSession, ...prev].slice(0, 50));
        setCurrentSession(null);
        setIsRecording(false);
        
        // Clear refs
        bpmHistoryRef.current = [];
        stressHistoryRef.current = [];
        panicEventsRef.current = [];
        peakBpmRef.current = 0;
        peakStressRef.current = 0;
        totalBpmRef.current = 0;
        sampleCountRef.current = 0;

        return completedSession;
    }, [currentSession, isRecording]);

    // Clear all history
    const clearHistory = useCallback(() => {
        setSessions([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // Delete single session
    const deleteSession = useCallback((sessionId) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
    }, []);

    return {
        sessions,
        currentSession,
        isRecording,
        startSession,
        endSession,
        recordDataPoint,
        clearHistory,
        deleteSession,
    };
};

export default useSessionManager;
