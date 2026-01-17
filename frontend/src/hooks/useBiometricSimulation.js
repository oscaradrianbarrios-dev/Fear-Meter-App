import { useState, useRef, useCallback, useEffect } from "react";

export const useBiometricSimulation = ({ onPanic, isDemo = false }) => {
    const [bpm, setBpm] = useState(72);
    const [stress, setStress] = useState(0);
    const [signal, setSignal] = useState("ACTIVE");
    const [isActive, setIsActive] = useState(false);
    const [isPanic, setIsPanic] = useState(false);
    
    const intervalRef = useRef(null);
    const baseBpmRef = useRef(72);
    const targetBpmRef = useRef(72);
    const lastPanicRef = useRef(0);

    // Calculate stress based on BPM
    const calculateStress = useCallback((currentBpm) => {
        // Map BPM 60-140 to stress 0-100
        const minBpm = 60;
        const maxBpm = 140;
        const normalized = (currentBpm - minBpm) / (maxBpm - minBpm);
        return Math.min(100, Math.max(0, Math.round(normalized * 100)));
    }, []);

    // Calculate signal status
    const calculateSignal = useCallback((currentBpm) => {
        if (currentBpm > 120) return "CRITICAL";
        if (currentBpm > 95) return "UNSTABLE";
        return "ACTIVE";
    }, []);

    // Simulate realistic BPM fluctuation
    const simulateBpm = useCallback(() => {
        const now = Date.now();
        
        // Gradually move towards target
        const diff = targetBpmRef.current - baseBpmRef.current;
        baseBpmRef.current += diff * 0.1;
        
        // Add natural variation
        const variation = (Math.random() - 0.5) * 4;
        
        // Demo mode: more aggressive changes
        if (isDemo) {
            // Randomly spike more often
            if (Math.random() < 0.1) {
                targetBpmRef.current = Math.min(135, targetBpmRef.current + 15);
            }
            // Stress builds faster
            if (targetBpmRef.current < 100) {
                targetBpmRef.current += 0.5;
            }
        } else {
            // Normal mode: occasional random events
            if (Math.random() < 0.02) {
                // Random spike
                targetBpmRef.current = Math.min(130, baseBpmRef.current + Math.random() * 20);
            }
            
            // Gradual return to baseline
            if (targetBpmRef.current > 80 && Math.random() < 0.05) {
                targetBpmRef.current -= 2;
            }
        }

        const newBpm = Math.round(Math.max(60, Math.min(140, baseBpmRef.current + variation)));
        
        setBpm(newBpm);
        setStress(calculateStress(newBpm));
        setSignal(calculateSignal(newBpm));

        // Check for panic state
        const newIsPanic = newBpm > 110;
        setIsPanic(newIsPanic);

        // Trigger panic callback (with cooldown)
        if (newIsPanic && now - lastPanicRef.current > 3000) {
            lastPanicRef.current = now;
            onPanic?.();
        }
    }, [calculateStress, calculateSignal, onPanic, isDemo]);

    // Start simulation
    const startSimulation = useCallback(() => {
        setIsActive(true);
        baseBpmRef.current = 72;
        targetBpmRef.current = 75;
        lastPanicRef.current = 0;
        
        // Run simulation at 100ms intervals
        intervalRef.current = setInterval(simulateBpm, 100);
    }, [simulateBpm]);

    // Stop simulation
    const stopSimulation = useCallback(() => {
        setIsActive(false);
        setIsPanic(false);
        setBpm(72);
        setStress(0);
        setSignal("ACTIVE");
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Handle tap/click to increase stress
    const triggerTap = useCallback(() => {
        if (!isActive) return;
        
        // Increase target BPM on tap
        const increase = isDemo ? 15 : 8;
        targetBpmRef.current = Math.min(140, targetBpmRef.current + increase);
        
        // Immediate small bump
        baseBpmRef.current = Math.min(140, baseBpmRef.current + (isDemo ? 5 : 3));
    }, [isActive, isDemo]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        bpm,
        stress,
        signal,
        isActive,
        isPanic,
        startSimulation,
        stopSimulation,
        triggerTap,
    };
};

export default useBiometricSimulation;
