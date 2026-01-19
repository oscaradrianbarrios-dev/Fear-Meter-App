import { useState, useRef, useCallback, useEffect } from "react";

// LocalStorage key for nightmare events
const NIGHTMARE_STORAGE_KEY = "fear_meter_nightmare_log";

// Protocol states
export const NIGHTMARE_STATE = {
    INACTIVE: "INACTIVE",
    MONITORING: "MONITORING",
    NIGHTMARE_DETECTED: "NIGHTMARE_DETECTED",
};

// Load nightmare log from localStorage
const loadNightmareLog = () => {
    try {
        const stored = localStorage.getItem(NIGHTMARE_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn("Failed to load nightmare log:", e);
    }
    return [];
};

// Save nightmare log to localStorage
const saveNightmareLog = (events) => {
    try {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentEvents = events.filter(e => e.timestamp > thirtyDaysAgo);
        localStorage.setItem(NIGHTMARE_STORAGE_KEY, JSON.stringify(recentEvents));
    } catch (e) {
        console.warn("Failed to save nightmare log:", e);
    }
};

export const useNightmareProtocol = () => {
    const [protocolState, setProtocolState] = useState(NIGHTMARE_STATE.INACTIVE);
    const [isActive, setIsActive] = useState(false);
    const [currentBpm, setCurrentBpm] = useState(62);
    const [events, setEvents] = useState(loadNightmareLog());
    const [sessionEvents, setSessionEvents] = useState([]);
    const [peakBpm, setPeakBpm] = useState(0);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [showSummary, setShowSummary] = useState(false);
    const [nightmareFlash, setNightmareFlash] = useState(false);
    
    const monitoringIntervalRef = useRef(null);
    const elevatedBpmStartRef = useRef(null);
    const lastNightmareTimeRef = useRef(0);
    
    // Critical threshold: BPM > 120 for 8+ seconds
    const CRITICAL_BPM = 120;
    const CRITICAL_DURATION_MS = 8000;
    const COOLDOWN_MS = 30000; // 30 seconds between nightmare detections
    
    // Trigger device vibration
    const triggerVibration = useCallback(() => {
        if (navigator.vibrate) {
            navigator.vibrate([500, 100, 500]); // Long vibration pattern
        }
    }, []);
    
    // Trigger red flash
    const triggerFlash = useCallback(() => {
        setNightmareFlash(true);
        setTimeout(() => setNightmareFlash(false), 100); // 100ms flash
    }, []);
    
    // Record nightmare event
    const recordNightmare = useCallback((detectedBpm) => {
        const newEvent = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            peakBpm: detectedBpm,
        };
        
        setEvents(prev => {
            const updated = [newEvent, ...prev];
            saveNightmareLog(updated);
            return updated;
        });
        
        setSessionEvents(prev => [...prev, newEvent]);
        setPeakBpm(prev => Math.max(prev, detectedBpm));
        lastNightmareTimeRef.current = Date.now();
    }, []);
    
    // Simulate nocturnal BPM with slow fluctuation and micro spikes
    const simulateNocturnalBpm = useCallback(() => {
        const baselineBpm = 62;
        
        // Slow wave fluctuation (breathing rhythm simulation)
        const time = Date.now() / 1000;
        const slowWave = Math.sin(time * 0.05) * 3; // Very slow oscillation
        
        // Micro random variation
        const microVariation = (Math.random() - 0.5) * 2;
        
        // Occasional spike simulation (rare)
        const hasSpike = Math.random() < 0.015; // 1.5% chance per tick
        let spike = 0;
        if (hasSpike) {
            spike = 20 + Math.random() * 50; // 20-70 BPM spike
        }
        
        let newBpm = baselineBpm + slowWave + microVariation + spike;
        return Math.round(Math.max(55, Math.min(145, newBpm)));
    }, []);
    
    // Start nightmare protocol
    const startProtocol = useCallback(() => {
        setIsActive(true);
        setProtocolState(NIGHTMARE_STATE.MONITORING);
        setSessionStartTime(Date.now());
        setSessionEvents([]);
        setPeakBpm(0);
        setShowSummary(false);
        elevatedBpmStartRef.current = null;
        lastNightmareTimeRef.current = 0;
    }, []);
    
    // Stop nightmare protocol and show summary
    const stopProtocol = useCallback(() => {
        setIsActive(false);
        setProtocolState(NIGHTMARE_STATE.INACTIVE);
        setShowSummary(true);
        
        if (monitoringIntervalRef.current) {
            clearInterval(monitoringIntervalRef.current);
            monitoringIntervalRef.current = null;
        }
    }, []);
    
    // Dismiss summary
    const dismissSummary = useCallback(() => {
        setShowSummary(false);
        setSessionStartTime(null);
        setSessionEvents([]);
    }, []);
    
    // Clear all nightmare log
    const clearLog = useCallback(() => {
        setEvents([]);
        localStorage.removeItem(NIGHTMARE_STORAGE_KEY);
    }, []);
    
    // Calculate session duration
    const getSessionDuration = useCallback(() => {
        if (!sessionStartTime) return "0:00";
        const durationMs = Date.now() - sessionStartTime;
        const hours = Math.floor(durationMs / 3600000);
        const minutes = Math.floor((durationMs % 3600000) / 60000);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }, [sessionStartTime]);
    
    // Main monitoring effect
    useEffect(() => {
        if (!isActive) return;
        
        const monitor = () => {
            const newBpm = simulateNocturnalBpm();
            setCurrentBpm(newBpm);
            
            // Track peak BPM
            setPeakBpm(prev => Math.max(prev, newBpm));
            
            // Check for critical BPM (> 120)
            if (newBpm > CRITICAL_BPM) {
                if (!elevatedBpmStartRef.current) {
                    elevatedBpmStartRef.current = Date.now();
                } else {
                    const elevatedDuration = Date.now() - elevatedBpmStartRef.current;
                    const timeSinceLastNightmare = Date.now() - lastNightmareTimeRef.current;
                    
                    // Nightmare detected: BPM > 120 for 8+ seconds
                    if (elevatedDuration >= CRITICAL_DURATION_MS && timeSinceLastNightmare > COOLDOWN_MS) {
                        setProtocolState(NIGHTMARE_STATE.NIGHTMARE_DETECTED);
                        triggerVibration();
                        triggerFlash();
                        recordNightmare(newBpm);
                        
                        // Return to monitoring after 3 seconds
                        setTimeout(() => {
                            setProtocolState(NIGHTMARE_STATE.MONITORING);
                        }, 3000);
                        
                        elevatedBpmStartRef.current = null;
                    }
                }
            } else {
                elevatedBpmStartRef.current = null;
            }
        };
        
        monitoringIntervalRef.current = setInterval(monitor, 500);
        
        return () => {
            if (monitoringIntervalRef.current) {
                clearInterval(monitoringIntervalRef.current);
            }
        };
    }, [isActive, simulateNocturnalBpm, triggerVibration, triggerFlash, recordNightmare]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (monitoringIntervalRef.current) {
                clearInterval(monitoringIntervalRef.current);
            }
        };
    }, []);
    
    return {
        // State
        protocolState,
        isActive,
        currentBpm,
        events,
        sessionEvents,
        peakBpm,
        sessionStartTime,
        showSummary,
        nightmareFlash,
        
        // Computed
        sessionDuration: getSessionDuration(),
        totalSessionEvents: sessionEvents.length,
        
        // Actions
        startProtocol,
        stopProtocol,
        dismissSummary,
        clearLog,
    };
};

export default useNightmareProtocol;
