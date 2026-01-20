import { useCallback, useRef, useEffect } from "react";

// Haptic patterns for different states
export const HAPTIC_PATTERNS = {
    // UI Interactions
    TAP: [15],
    BUTTON_PRESS: [30],
    SUCCESS: [50, 30, 100],
    ERROR: [100, 50, 100, 50, 100],
    WARNING: [80, 40, 80],
    
    // Fear states
    HEARTBEAT_NORMAL: [20, 100, 20],
    HEARTBEAT_ELEVATED: [30, 80, 30],
    HEARTBEAT_PANIC: [50, 50, 50, 50, 50],
    
    // Critical events
    FEAR_SPIKE: [100, 30, 200, 30, 100],
    NIGHTMARE_DETECTED: [200, 100, 200, 100, 300],
    PANIC_ALERT: [100, 50, 100, 50, 100, 50, 200],
    
    // Calibration
    CALIBRATION_START: [30, 20, 30],
    CALIBRATION_PROGRESS: [20],
    CALIBRATION_COMPLETE: [50, 50, 100],
    
    // Continuous patterns (for loops)
    TENSION_LOOP: [30, 150],
    TERROR_LOOP: [50, 100],
};

// BPM-based haptic intensity thresholds
const BPM_THRESHOLDS = {
    NORMAL: 90,
    ELEVATED: 110,
    HIGH: 130,
    CRITICAL: 150,
};

export const useHapticFeedback = (isEnabled = true) => {
    const isSupported = typeof navigator !== "undefined" && "vibrate" in navigator;
    const intervalRef = useRef(null);
    const lastBpmRef = useRef(72);
    const isActiveRef = useRef(false);

    // Basic vibration trigger
    const vibrate = useCallback((pattern = [50]) => {
        if (!isEnabled || !isSupported) return false;
        
        try {
            return navigator.vibrate(pattern);
        } catch (e) {
            console.warn("Haptic feedback failed:", e);
            return false;
        }
    }, [isEnabled, isSupported]);

    // Stop all vibrations
    const stop = useCallback(() => {
        if (!isSupported) return;
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        isActiveRef.current = false;
        navigator.vibrate(0);
    }, [isSupported]);

    // Trigger pattern by name
    const triggerPattern = useCallback((patternName) => {
        const pattern = HAPTIC_PATTERNS[patternName];
        if (pattern) {
            return vibrate(pattern);
        }
        return false;
    }, [vibrate]);

    // BPM-synchronized heartbeat haptic
    const syncWithBpm = useCallback((bpm) => {
        if (!isEnabled || !isSupported) return;
        
        lastBpmRef.current = bpm;
        
        // Calculate interval based on BPM (ms between beats)
        const beatInterval = Math.round(60000 / bpm);
        
        // Determine intensity based on BPM
        let pattern;
        let shouldPulse = true;
        
        if (bpm < BPM_THRESHOLDS.NORMAL) {
            // Normal - subtle haptic every other beat
            shouldPulse = Math.random() > 0.5;
            pattern = [15];
        } else if (bpm < BPM_THRESHOLDS.ELEVATED) {
            // Elevated - every beat
            pattern = [25];
        } else if (bpm < BPM_THRESHOLDS.HIGH) {
            // High - stronger beat
            pattern = [40, 30];
        } else if (bpm < BPM_THRESHOLDS.CRITICAL) {
            // Critical - double beat
            pattern = [50, 50, 50];
        } else {
            // Extreme - intense pattern
            pattern = [60, 30, 60, 30];
        }
        
        if (shouldPulse) {
            vibrate(pattern);
        }
        
        return beatInterval;
    }, [isEnabled, isSupported, vibrate]);

    // Start continuous BPM sync
    const startBpmSync = useCallback((getBpm) => {
        if (!isEnabled || !isSupported || isActiveRef.current) return;
        
        isActiveRef.current = true;
        
        const tick = () => {
            if (!isActiveRef.current) return;
            
            const currentBpm = typeof getBpm === "function" ? getBpm() : getBpm;
            const nextInterval = syncWithBpm(currentBpm);
            
            intervalRef.current = setTimeout(tick, nextInterval);
        };
        
        tick();
    }, [isEnabled, isSupported, syncWithBpm]);

    // Stop BPM sync
    const stopBpmSync = useCallback(() => {
        stop();
    }, [stop]);

    // Fear level haptic (0-100)
    const triggerFearLevel = useCallback((fearLevel) => {
        if (!isEnabled || !isSupported) return;
        
        if (fearLevel < 30) {
            // Low fear - subtle
            vibrate([15]);
        } else if (fearLevel < 50) {
            // Moderate fear
            vibrate([30, 20, 30]);
        } else if (fearLevel < 70) {
            // High fear
            vibrate([50, 30, 50, 30]);
        } else if (fearLevel < 90) {
            // Very high fear
            vibrate([80, 40, 80, 40, 80]);
        } else {
            // Extreme fear
            vibrate(HAPTIC_PATTERNS.PANIC_ALERT);
        }
    }, [isEnabled, isSupported, vibrate]);

    // Jump scare haptic
    const triggerJumpScare = useCallback(() => {
        if (!isEnabled || !isSupported) return;
        
        // Intense pattern for jump scares
        vibrate([150, 50, 200, 100, 150, 50, 100]);
    }, [isEnabled, isSupported, vibrate]);

    // Tension build haptic (continuous)
    const startTension = useCallback((intensity = 1) => {
        if (!isEnabled || !isSupported || isActiveRef.current) return;
        
        isActiveRef.current = true;
        
        const baseInterval = 300;
        const vibeDuration = Math.round(30 * intensity);
        
        const tick = () => {
            if (!isActiveRef.current) return;
            
            vibrate([vibeDuration]);
            intervalRef.current = setTimeout(tick, baseInterval / intensity);
        };
        
        tick();
    }, [isEnabled, isSupported, vibrate]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stop();
        };
    }, [stop]);

    return {
        isSupported,
        isEnabled,
        vibrate,
        stop,
        triggerPattern,
        syncWithBpm,
        startBpmSync,
        stopBpmSync,
        triggerFearLevel,
        triggerJumpScare,
        startTension,
        
        // Quick access to common patterns
        tap: () => triggerPattern("TAP"),
        success: () => triggerPattern("SUCCESS"),
        error: () => triggerPattern("ERROR"),
        warning: () => triggerPattern("WARNING"),
        heartbeat: (bpm) => syncWithBpm(bpm || lastBpmRef.current),
    };
};

export default useHapticFeedback;
