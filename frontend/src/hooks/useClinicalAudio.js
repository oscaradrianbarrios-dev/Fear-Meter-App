import { useRef, useCallback, useEffect } from "react";

// Clinical beep frequencies and patterns
const BEEP_CONFIG = {
    normal: {
        frequency: 880, // A5 note - classic cardiac monitor
        duration: 80,
        volume: 0.08,
        interval: 0, // No beeps in normal state
    },
    elevated: {
        frequency: 880,
        duration: 80,
        volume: 0.12,
        interval: 2500, // Every 2.5 seconds
    },
    critical: {
        frequency: 932, // Slightly higher pitch for urgency
        duration: 100,
        volume: 0.18,
        interval: 800, // More frequent
    },
};

export const useClinicalAudio = ({ bpm, isActive, soundEnabled }) => {
    const audioContextRef = useRef(null);
    const intervalRef = useRef(null);
    const lastBeepRef = useRef(0);
    
    // Get current state based on BPM
    const getState = useCallback(() => {
        if (!isActive || bpm <= 100) return "normal";
        if (bpm > 120) return "critical";
        return "elevated";
    }, [bpm, isActive]);
    
    // Initialize AudioContext lazily (requires user interaction)
    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn("Web Audio API not supported:", e);
            }
        }
        return audioContextRef.current;
    }, []);
    
    // Play a single clinical beep
    const playBeep = useCallback((config) => {
        const ctx = initAudio();
        if (!ctx || !soundEnabled) return;
        
        // Resume context if suspended (mobile browsers)
        if (ctx.state === "suspended") {
            ctx.resume();
        }
        
        const now = ctx.currentTime;
        
        // Create oscillator for the beep
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Configure oscillator
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(config.frequency, now);
        
        // Configure envelope (attack-release)
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(config.volume, now + 0.01); // Fast attack
        gainNode.gain.linearRampToValueAtTime(config.volume * 0.7, now + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + config.duration / 1000);
        
        // Start and stop
        oscillator.start(now);
        oscillator.stop(now + config.duration / 1000 + 0.1);
        
        lastBeepRef.current = Date.now();
    }, [initAudio, soundEnabled]);
    
    // Main audio loop effect
    useEffect(() => {
        if (!soundEnabled || !isActive) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }
        
        const state = getState();
        const config = BEEP_CONFIG[state];
        
        // Clear existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        // No beeps in normal state
        if (config.interval <= 0) return;
        
        // Set up new interval
        const checkAndBeep = () => {
            const now = Date.now();
            const timeSinceLastBeep = now - lastBeepRef.current;
            
            if (timeSinceLastBeep >= config.interval) {
                playBeep(config);
            }
        };
        
        // Initial beep after a delay
        const initialTimeout = setTimeout(() => {
            playBeep(config);
            intervalRef.current = setInterval(checkAndBeep, 200);
        }, 500);
        
        return () => {
            clearTimeout(initialTimeout);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [soundEnabled, isActive, getState, playBeep]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);
    
    // Trigger vibration on critical (complementary to audio)
    useEffect(() => {
        if (!isActive) return;
        
        const state = getState();
        if (state === "critical" && navigator.vibrate) {
            navigator.vibrate(100);
        }
    }, [bpm, isActive, getState]);
    
    return {
        initAudio,
        playBeep: (config = BEEP_CONFIG.elevated) => playBeep(config),
        getState,
    };
};

export default useClinicalAudio;
