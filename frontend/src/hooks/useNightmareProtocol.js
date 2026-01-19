import { useState, useRef, useCallback, useEffect } from "react";

// LocalStorage key for nightmare events
const NIGHTMARE_STORAGE_KEY = "fear_meter_nightmare_log";

// Protocol states
export const NIGHTMARE_STATE = {
    INACTIVE: "INACTIVE",
    STANDBY: "STANDBY",      // Waiting for nighttime
    MONITORING: "MONITORING", // Active nocturnal monitoring
    EVENT_DETECTED: "EVENT_DETECTED",
};

// Event severity levels
export const EVENT_SEVERITY = {
    MINOR: "MINOR",           // Small BPM spike
    MODERATE: "MODERATE",     // Significant spike
    SEVERE: "SEVERE",         // Major nightmare event
    CRITICAL: "CRITICAL",     // Extreme fear response
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
        // Keep only last 30 days of events
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentEvents = events.filter(e => e.timestamp > thirtyDaysAgo);
        localStorage.setItem(NIGHTMARE_STORAGE_KEY, JSON.stringify(recentEvents));
    } catch (e) {
        console.warn("Failed to save nightmare log:", e);
    }
};

// Check if current time is within nighttime hours
// Can be overridden for testing
const isNighttime = (forceNightMode = false) => {
    if (forceNightMode) return true;
    const hour = new Date().getHours();
    // Nighttime: 22:00 - 07:00
    return hour >= 22 || hour < 7;
};

export const useNightmareProtocol = () => {
    const [protocolState, setProtocolState] = useState(NIGHTMARE_STATE.INACTIVE);
    const [isActive, setIsActive] = useState(false);
    const [currentBpm, setCurrentBpm] = useState(65);
    const [baselineBpm, setBaselineBpm] = useState(65);
    const [events, setEvents] = useState(loadNightmareLog());
    const [currentEvent, setCurrentEvent] = useState(null);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const [totalEventsTonight, setTotalEventsTonight] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [forceNightMode, setForceNightMode] = useState(false);
    const [statistics, setStatistics] = useState(null);
    
    const monitoringIntervalRef = useRef(null);
    const bpmHistoryRef = useRef([]);
    const eventStartTimeRef = useRef(null);
    const motionListenerRef = useRef(null);
    const movementHistoryRef = useRef([]);
    const lastMotionRef = useRef({ x: 0, y: 0, z: 0 });
    
    // Configurable thresholds for nightmare detection
    const [thresholds, setThresholds] = useState({
        spike: 20,      // BPM increase to trigger event
        severe: 35,     // BPM increase for severe event
        critical: 50,   // BPM increase for critical event
        minDuration: 5000, // Minimum event duration in ms
    });
    
    const BPM_SPIKE_THRESHOLD = thresholds.spike;
    const BPM_SEVERE_THRESHOLD = thresholds.severe;
    const BPM_CRITICAL_THRESHOLD = thresholds.critical;
    const MIN_EVENT_DURATION = thresholds.minDuration;
    const MOVEMENT_THRESHOLD = 1.0;      // Very low threshold for sleep
    
    // Calculate statistics from events
    const calculateStatistics = useCallback((eventList) => {
        if (!eventList || eventList.length === 0) {
            return null;
        }
        
        const totalEvents = eventList.length;
        const avgIntensity = Math.round(eventList.reduce((sum, e) => sum + e.intensity, 0) / totalEvents);
        const avgDuration = Math.round(eventList.reduce((sum, e) => sum + e.duration, 0) / totalEvents);
        const maxPeakBpm = Math.max(...eventList.map(e => e.peakBpm));
        const avgPeakBpm = Math.round(eventList.reduce((sum, e) => sum + e.peakBpm, 0) / totalEvents);
        
        // Count by severity
        const severityCounts = {
            [EVENT_SEVERITY.MINOR]: eventList.filter(e => e.severity === EVENT_SEVERITY.MINOR).length,
            [EVENT_SEVERITY.MODERATE]: eventList.filter(e => e.severity === EVENT_SEVERITY.MODERATE).length,
            [EVENT_SEVERITY.SEVERE]: eventList.filter(e => e.severity === EVENT_SEVERITY.SEVERE).length,
            [EVENT_SEVERITY.CRITICAL]: eventList.filter(e => e.severity === EVENT_SEVERITY.CRITICAL).length,
        };
        
        // Get events by day for trend
        const eventsByDay = {};
        eventList.forEach(e => {
            const day = new Date(e.timestamp).toLocaleDateString();
            eventsByDay[day] = (eventsByDay[day] || 0) + 1;
        });
        
        // Most active hours
        const eventsByHour = {};
        eventList.forEach(e => {
            const hour = new Date(e.timestamp).getHours();
            eventsByHour[hour] = (eventsByHour[hour] || 0) + 1;
        });
        const peakHour = Object.entries(eventsByHour).sort((a, b) => b[1] - a[1])[0];
        
        return {
            totalEvents,
            avgIntensity,
            avgDuration,
            maxPeakBpm,
            avgPeakBpm,
            severityCounts,
            eventsByDay,
            peakHour: peakHour ? parseInt(peakHour[0]) : null,
            peakHourCount: peakHour ? peakHour[1] : 0,
        };
    }, []);
    
    // Update statistics when events change
    useEffect(() => {
        setStatistics(calculateStatistics(events));
    }, [events, calculateStatistics]);
    
    // Initialize motion detection for sleep monitoring
    const initMotionDetection = useCallback(() => {
        if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
            const handleMotion = (event) => {
                const { accelerationIncludingGravity } = event;
                if (!accelerationIncludingGravity) return;
                
                const { x, y, z } = accelerationIncludingGravity;
                const lastMotion = lastMotionRef.current;
                
                const deltaX = Math.abs((x || 0) - lastMotion.x);
                const deltaY = Math.abs((y || 0) - lastMotion.y);
                const deltaZ = Math.abs((z || 0) - lastMotion.z);
                const totalDelta = deltaX + deltaY + deltaZ;
                
                movementHistoryRef.current.push(totalDelta);
                if (movementHistoryRef.current.length > 20) {
                    movementHistoryRef.current.shift();
                }
                
                const avgMovement = movementHistoryRef.current.reduce((a, b) => a + b, 0) / 
                                   movementHistoryRef.current.length;
                
                setIsMoving(avgMovement > MOVEMENT_THRESHOLD);
                lastMotionRef.current = { x: x || 0, y: y || 0, z: z || 0 };
            };
            
            window.addEventListener('devicemotion', handleMotion);
            motionListenerRef.current = handleMotion;
        } else {
            // Desktop fallback - simulate sleep state (no movement)
            setIsMoving(false);
        }
    }, []);
    
    const cleanupMotionDetection = useCallback(() => {
        if (motionListenerRef.current) {
            window.removeEventListener('devicemotion', motionListenerRef.current);
            motionListenerRef.current = null;
        }
    }, []);
    
    // Calculate event severity based on BPM spike
    const calculateSeverity = useCallback((bpmSpike) => {
        if (bpmSpike >= BPM_CRITICAL_THRESHOLD) return EVENT_SEVERITY.CRITICAL;
        if (bpmSpike >= BPM_SEVERE_THRESHOLD) return EVENT_SEVERITY.SEVERE;
        if (bpmSpike >= BPM_SPIKE_THRESHOLD) return EVENT_SEVERITY.MODERATE;
        return EVENT_SEVERITY.MINOR;
    }, []);
    
    // Record a nightmare event
    const recordEvent = useCallback((severity, peakBpm, duration) => {
        const newEvent = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            severity,
            peakBpm,
            baselineBpm: baselineBpm,
            bpmSpike: peakBpm - baselineBpm,
            duration: Math.round(duration / 1000), // Convert to seconds
            intensity: Math.min(100, Math.round(((peakBpm - baselineBpm) / 50) * 100)),
        };
        
        setEvents(prev => {
            const updated = [newEvent, ...prev];
            saveNightmareLog(updated);
            return updated;
        });
        
        setTotalEventsTonight(prev => prev + 1);
        setCurrentEvent(newEvent);
        
        // Clear current event display after 10 seconds
        setTimeout(() => setCurrentEvent(null), 10000);
        
        return newEvent;
    }, [baselineBpm]);
    
    // Simulate nocturnal BPM monitoring
    const simulateNocturnalBpm = useCallback(() => {
        // Base sleeping BPM (lower than awake)
        const sleepingBaseBpm = 58 + Math.random() * 8; // 58-66
        
        // Occasionally simulate nightmare spikes (rare)
        const hasNightmareSpike = Math.random() < 0.008; // ~0.8% chance per tick
        
        let newBpm;
        if (hasNightmareSpike && !isMoving) {
            // Nightmare spike - sudden increase
            const spikeIntensity = 20 + Math.random() * 45; // 20-65 BPM spike
            newBpm = sleepingBaseBpm + spikeIntensity;
        } else {
            // Normal sleeping variation
            const variation = (Math.random() - 0.5) * 4;
            newBpm = baselineBpm + (sleepingBaseBpm - baselineBpm) * 0.1 + variation;
        }
        
        return Math.round(Math.max(50, Math.min(140, newBpm)));
    }, [baselineBpm, isMoving]);
    
    // Start nightmare protocol monitoring
    const startProtocol = useCallback((forceNight = false) => {
        setIsActive(true);
        setForceNightMode(forceNight);
        setSessionStartTime(Date.now());
        setTotalEventsTonight(0);
        setBaselineBpm(62); // Sleeping baseline
        bpmHistoryRef.current = [];
        movementHistoryRef.current = [];
        
        initMotionDetection();
        
        // Check if it's nighttime or forced
        if (isNighttime(forceNight)) {
            setProtocolState(NIGHTMARE_STATE.MONITORING);
        } else {
            setProtocolState(NIGHTMARE_STATE.STANDBY);
        }
    }, [initMotionDetection]);
    
    // Stop nightmare protocol
    const stopProtocol = useCallback(() => {
        setIsActive(false);
        setForceNightMode(false);
        setProtocolState(NIGHTMARE_STATE.INACTIVE);
        setCurrentEvent(null);
        setSessionStartTime(null);
        
        if (monitoringIntervalRef.current) {
            clearInterval(monitoringIntervalRef.current);
            monitoringIntervalRef.current = null;
        }
        
        cleanupMotionDetection();
    }, [cleanupMotionDetection]);
    
    // Update thresholds
    const updateThresholds = useCallback((newThresholds) => {
        setThresholds(prev => ({ ...prev, ...newThresholds }));
    }, []);
    
    // Clear nightmare log
    const clearLog = useCallback(() => {
        setEvents([]);
        localStorage.removeItem(NIGHTMARE_STORAGE_KEY);
    }, []);
    
    // Main monitoring effect
    useEffect(() => {
        if (!isActive) return;
        
        let peakBpmDuringEvent = 0;
        
        const monitor = () => {
            // Check nighttime status (respect forceNightMode)
            const nighttime = isNighttime(forceNightMode);
            if (nighttime && protocolState === NIGHTMARE_STATE.STANDBY) {
                setProtocolState(NIGHTMARE_STATE.MONITORING);
            } else if (!nighttime && protocolState === NIGHTMARE_STATE.MONITORING && !forceNightMode) {
                setProtocolState(NIGHTMARE_STATE.STANDBY);
            }
            
            // Only monitor during nighttime and when not moving
            if (protocolState !== NIGHTMARE_STATE.MONITORING) return;
            
            const newBpm = simulateNocturnalBpm();
            setCurrentBpm(newBpm);
            
            // Track BPM history
            bpmHistoryRef.current.push(newBpm);
            if (bpmHistoryRef.current.length > 60) {
                bpmHistoryRef.current.shift();
            }
            
            // Update baseline from recent calm readings
            if (!isMoving && newBpm < baselineBpm + 10) {
                const recentCalm = bpmHistoryRef.current.filter(b => b < 75);
                if (recentCalm.length > 10) {
                    const avgCalm = recentCalm.reduce((a, b) => a + b, 0) / recentCalm.length;
                    setBaselineBpm(prev => prev + (avgCalm - prev) * 0.05);
                }
            }
            
            // Detect nightmare event
            const bpmSpike = newBpm - baselineBpm;
            
            if (bpmSpike >= BPM_SPIKE_THRESHOLD && !isMoving) {
                // Potential nightmare event
                if (!eventStartTimeRef.current) {
                    eventStartTimeRef.current = Date.now();
                    peakBpmDuringEvent = newBpm;
                    setProtocolState(NIGHTMARE_STATE.EVENT_DETECTED);
                } else {
                    peakBpmDuringEvent = Math.max(peakBpmDuringEvent, newBpm);
                }
            } else if (eventStartTimeRef.current) {
                // Event ending
                const eventDuration = Date.now() - eventStartTimeRef.current;
                
                if (eventDuration >= MIN_EVENT_DURATION) {
                    const severity = calculateSeverity(peakBpmDuringEvent - baselineBpm);
                    recordEvent(severity, peakBpmDuringEvent, eventDuration);
                }
                
                eventStartTimeRef.current = null;
                peakBpmDuringEvent = 0;
                setProtocolState(NIGHTMARE_STATE.MONITORING);
            }
        };
        
        monitoringIntervalRef.current = setInterval(monitor, 500);
        
        return () => {
            if (monitoringIntervalRef.current) {
                clearInterval(monitoringIntervalRef.current);
            }
        };
    }, [isActive, protocolState, isMoving, baselineBpm, simulateNocturnalBpm, calculateSeverity, recordEvent]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (monitoringIntervalRef.current) {
                clearInterval(monitoringIntervalRef.current);
            }
            cleanupMotionDetection();
        };
    }, [cleanupMotionDetection]);
    
    // Get tonight's events
    const getTonightEvents = useCallback(() => {
        const tonight = new Date();
        tonight.setHours(22, 0, 0, 0);
        if (new Date().getHours() < 7) {
            tonight.setDate(tonight.getDate() - 1);
        }
        return events.filter(e => e.timestamp >= tonight.getTime());
    }, [events]);
    
    return {
        // State
        protocolState,
        isActive,
        currentBpm,
        baselineBpm,
        events,
        currentEvent,
        sessionStartTime,
        totalEventsTonight,
        isMoving,
        isNighttime: isNighttime(),
        
        // Computed
        tonightEvents: getTonightEvents(),
        
        // Actions
        startProtocol,
        stopProtocol,
        clearLog,
    };
};

export default useNightmareProtocol;
