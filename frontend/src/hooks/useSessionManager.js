import { useState, useCallback, useEffect } from "react";

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

const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const useSessionManager = () => {
    const [sessions, setSessions] = useState([]);
    const [currentSession, setCurrentSession] = useState(null);
    const [peakBpm, setPeakBpm] = useState(0);
    const [peakStress, setPeakStress] = useState(0);

    // Load sessions from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setSessions(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load sessions:", e);
        }
    }, []);

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
            date: formatDate(),
            maxBpm: 0,
            maxStress: 0,
        };
        setCurrentSession(newSession);
        setPeakBpm(0);
        setPeakStress(0);
    }, []);

    // Update peak values during session
    const updatePeaks = useCallback((bpm, stress) => {
        if (bpm > peakBpm) setPeakBpm(bpm);
        if (stress > peakStress) setPeakStress(stress);
    }, [peakBpm, peakStress]);

    // End current session and save it
    const endSession = useCallback((finalBpm, finalStress) => {
        if (!currentSession) return;

        const completedSession = {
            ...currentSession,
            endTime: Date.now(),
            maxBpm: Math.max(peakBpm, finalBpm),
            maxStress: Math.max(peakStress, finalStress),
        };

        setSessions(prev => [completedSession, ...prev].slice(0, 50)); // Keep last 50 sessions
        setCurrentSession(null);
        setPeakBpm(0);
        setPeakStress(0);
    }, [currentSession, peakBpm, peakStress]);

    // Clear all history
    const clearHistory = useCallback(() => {
        setSessions([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        sessions,
        currentSession,
        startSession,
        endSession,
        updatePeaks,
        clearHistory,
    };
};

export default useSessionManager;
