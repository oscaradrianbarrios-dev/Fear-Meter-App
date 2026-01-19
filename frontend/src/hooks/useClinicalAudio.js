import { useRef, useCallback, useEffect, useState } from "react";

// Clinical beep frequencies - hospital monitor style
const BEEP_CONFIG = {
    normal: {
        frequency: 880, // A5 note - classic cardiac monitor
        duration: 50, // Very short like hospital beep
        volume: 0.25,
    },
    elevated: {
        frequency: 950, // Slightly higher
        duration: 50,
        volume: 0.30,
    },
    critical: {
        frequency: 1000, // Higher pitch for urgency
        duration: 40,
        volume: 0.35,
        doubleBeep: true, // Double beep in critical
    },
};

// White noise generator for VHS horror texture
const createWhiteNoise = (audioContext, volume = 0.02) => {
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * volume;
    }
    
    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;
    
    // Low-pass filter for more analog feel
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2000;
    
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    
    whiteNoise.connect(filter);
    filter.connect(gainNode);
    
    return { source: whiteNoise, gain: gainNode };
};

export const useClinicalAudio = ({ bpm, isActive, soundEnabled }) => {
    const audioContextRef = useRef(null);
    const whiteNoiseRef = useRef(null);
    const lastBeepTimeRef = useRef(0);
    const beepScheduledRef = useRef(false);
    const [masterVolume, setMasterVolume] = useState(0.3); // Start at 30%
    
    // Get current state based on BPM
    const getState = useCallback(() => {
        if (!isActive || bpm <= 100) return "normal";
        if (bpm > 130) return "critical";
        if (bpm > 110) return "elevated";
        return "normal";
    }, [bpm, isActive]);
    
    // Initialize AudioContext lazily
    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn("Web Audio API not supported:", e);
                return null;
            }
        }
        
        // Resume if suspended
        if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
        }
        
        return audioContextRef.current;
    }, []);
    
    // Play a single clinical beep synchronized with heartbeat
    const playBeep = useCallback((config, isSecondBeep = false) => {
        const ctx = initAudio();
        if (!ctx || !soundEnabled) return;
        
        const now = ctx.currentTime;
        const delay = isSecondBeep ? 0.08 : 0; // Second beep comes 80ms after first
        
        // Create oscillator for the beep
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Configure oscillator - square wave for more clinical sound
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(config.frequency, now + delay);
        
        // Apply master volume
        const finalVolume = config.volume * masterVolume;
        
        // Sharp attack, quick decay (hospital monitor style)
        gainNode.gain.setValueAtTime(0, now + delay);
        gainNode.gain.linearRampToValueAtTime(finalVolume, now + delay + 0.005);
        gainNode.gain.setValueAtTime(finalVolume, now + delay + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + config.duration / 1000);
        
        // Start and stop
        oscillator.start(now + delay);
        oscillator.stop(now + delay + config.duration / 1000 + 0.05);
        
        lastBeepTimeRef.current = Date.now();
    }, [initAudio, soundEnabled, masterVolume]);
    
    // Start/stop white noise
    useEffect(() => {
        if (!soundEnabled || !isActive) {
            if (whiteNoiseRef.current) {
                try {
                    whiteNoiseRef.current.source.stop();
                } catch (e) {
                    // Already stopped
                }
                whiteNoiseRef.current = null;
            }
            return;
        }
        
        const ctx = initAudio();
        if (!ctx) return;
        
        // Create white noise for VHS texture
        const noise = createWhiteNoise(ctx, 0.015 * masterVolume);
        noise.gain.connect(ctx.destination);
        noise.source.start();
        whiteNoiseRef.current = noise;
        
        return () => {
            if (whiteNoiseRef.current) {
                try {
                    whiteNoiseRef.current.source.stop();
                } catch (e) {
                    // Already stopped
                }
            }
        };
    }, [soundEnabled, isActive, initAudio, masterVolume]);
    
    // Main heartbeat beep synchronized with BPM
    useEffect(() => {
        if (!soundEnabled || !isActive) {
            beepScheduledRef.current = false;
            return;
        }
        
        // Calculate interval based on BPM (ms between beats)
        const beatInterval = 60000 / bpm;
        
        const scheduleBeep = () => {
            const state = getState();
            const config = BEEP_CONFIG[state];
            
            // Play beep
            playBeep(config);
            
            // Double beep in critical state
            if (config.doubleBeep) {
                setTimeout(() => playBeep(config, true), 80);
            }
            
            // Trigger vibration on critical
            if (state === "critical" && navigator.vibrate) {
                navigator.vibrate(50);
            }
        };
        
        // Initial beep after short delay
        const initialTimeout = setTimeout(() => {
            scheduleBeep();
            beepScheduledRef.current = true;
        }, 200);
        
        // Schedule regular beeps at heartbeat interval
        const interval = setInterval(() => {
            scheduleBeep();
        }, beatInterval);
        
        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
            beepScheduledRef.current = false;
        };
    }, [soundEnabled, isActive, bpm, getState, playBeep]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (whiteNoiseRef.current) {
                try {
                    whiteNoiseRef.current.source.stop();
                } catch (e) {
                    // Already stopped
                }
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);
    
    return {
        initAudio,
        getState,
        masterVolume,
        setMasterVolume,
    };
};

export default useClinicalAudio;
