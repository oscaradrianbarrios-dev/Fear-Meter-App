import { useState, useRef, useCallback, useEffect } from "react";

export const useBiometricSimulation = ({ onPanicStart, onPanicEnd, isDemo = false }) => {
    const [bpm, setBpm] = useState(72);
    const [stress, setStress] = useState(0);
    const [signal, setSignal] = useState("ACTIVE");
    const [isActive, setIsActive] = useState(false);
    const [isPanic, setIsPanic] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    
    const intervalRef = useRef(null);
    const baseBpmRef = useRef(72);
    const targetBpmRef = useRef(72);
    const lastPanicRef = useRef(0);
    const panicActiveRef = useRef(false);
    const recoveryIntervalRef = useRef(null);

    // Calculate stress based on BPM
    const calculateStress = useCallback((currentBpm) => {
        const minBpm = 60;
        const maxBpm = 140;
        const normalized = (currentBpm - minBpm) / (maxBpm - minBpm);
        return Math.min(100, Math.max(0, Math.round(normalized * 100)));
    }, []);

    // Calculate signal status
    const calculateSignal = useCallback((currentBpm, currentStress) => {
        if (currentBpm > 110 && currentStress > 75) return "CRITICAL";
        if (currentBpm > 95 || currentStress > 50) return "UNSTABLE";
        return "ACTIVE";
    }, []);

    // Gradual BPM recovery after panic
    const startRecovery = useCallback(() => {
        setIsRecovering(true);
        
        // Gradually reduce target BPM over 3 seconds
        const recoveryDuration = 3000;
        const startTime = Date.now();
        const startBpm = targetBpmRef.current;
        const targetRecoveryBpm = 85; // Recover to slightly elevated, not baseline
        
        recoveryIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / recoveryDuration, 1);
            
            // Ease out - feels like relief
            const easeProgress = 1 - Math.pow(1 - progress, 2);
            targetBpmRef.current = startBpm - ((startBpm - targetRecoveryBpm) * easeProgress);
            
            if (progress >= 1) {
                clearInterval(recoveryIntervalRef.current);
                recoveryIntervalRef.current = null;
                setIsRecovering(false);
            }
        }, 50);
    }, []);

    // Simulate realistic BPM fluctuation
    const simulateBpm = useCallback(() => {
        const now = Date.now();
        
        // Gradually move towards target
        const diff = targetBpmRef.current - baseBpmRef.current;
        baseBpmRef.current += diff * 0.1;
        
        // Add natural variation - more erratic during panic
        const variationAmount = isPanic ? 6 : 4;
        const variation = (Math.random() - 0.5) * variationAmount;
        
        // Demo mode: MORE STABLE BPM (70-110), controlled behavior for investors
        if (isDemo && !isRecovering) {
            // Keep BPM in stable range 70-110
            if (targetBpmRef.current < 75) {
                targetBpmRef.current += 0.3;
            } else if (targetBpmRef.current > 105) {
                targetBpmRef.current -= 0.2;
            }
            
            // Occasional controlled spikes (less frequent)
            if (Math.random() < 0.04) {
                targetBpmRef.current = Math.min(115, targetBpmRef.current + 8);
            }
            
            // Natural fluctuation within stable range
            if (Math.random() < 0.1) {
                const fluctuation = (Math.random() - 0.5) * 6;
                targetBpmRef.current = Math.max(70, Math.min(110, targetBpmRef.current + fluctuation));
            }
        } else if (!isRecovering) {
            // Normal mode: more random behavior
            if (Math.random() < 0.03) {
                targetBpmRef.current = Math.min(135, baseBpmRef.current + Math.random() * 25);
            }
            
            if (targetBpmRef.current > 85 && Math.random() < 0.04 && !isPanic) {
                targetBpmRef.current -= 1.5;
            }
        }

        // Demo mode caps at 115, normal mode at 140
        const maxBpm = isDemo ? 118 : 140;
        const minBpm = isDemo ? 68 : 60;
        const newBpm = Math.round(Math.max(minBpm, Math.min(maxBpm, baseBpmRef.current + variation)));
        const newStress = calculateStress(newBpm);
        
        setBpm(newBpm);
        setStress(newStress);
        setSignal(calculateSignal(newBpm, newStress));

        // PANIC ACTIVATION: BPM > 110 AND STRESS > 75%
        const shouldPanic = newBpm > 110 && newStress > 75;
        
        if (shouldPanic && !panicActiveRef.current && now - lastPanicRef.current > 8000) {
            // Enter panic
            panicActiveRef.current = true;
            lastPanicRef.current = now;
            setIsPanic(true);
            onPanicStart?.();
        } else if (!shouldPanic && panicActiveRef.current) {
            // Exit panic - gradual recovery
            panicActiveRef.current = false;
            setIsPanic(false);
            onPanicEnd?.();
            startRecovery();
        }
    }, [calculateStress, calculateSignal, onPanicStart, onPanicEnd, isDemo, isPanic, isRecovering, startRecovery]);

    // Start simulation
    const startSimulation = useCallback(() => {
        setIsActive(true);
        setIsPanic(false);
        setIsRecovering(false);
        baseBpmRef.current = 72;
        targetBpmRef.current = 78;
        lastPanicRef.current = 0;
        panicActiveRef.current = false;
        
        intervalRef.current = setInterval(simulateBpm, 100);
    }, [simulateBpm]);

    // Stop simulation
    const stopSimulation = useCallback(() => {
        setIsActive(false);
        setIsPanic(false);
        setIsRecovering(false);
        setBpm(72);
        setStress(0);
        setSignal("ACTIVE");
        panicActiveRef.current = false;
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (recoveryIntervalRef.current) {
            clearInterval(recoveryIntervalRef.current);
            recoveryIntervalRef.current = null;
        }
    }, []);

    // Handle tap/click to increase stress
    const triggerTap = useCallback(() => {
        if (!isActive || isRecovering) return;
        
        const increase = isDemo ? 18 : 10;
        targetBpmRef.current = Math.min(140, targetBpmRef.current + increase);
        baseBpmRef.current = Math.min(140, baseBpmRef.current + (isDemo ? 6 : 4));
    }, [isActive, isDemo, isRecovering]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (recoveryIntervalRef.current) {
                clearInterval(recoveryIntervalRef.current);
            }
        };
    }, []);

    return {
        bpm,
        stress,
        signal,
        isActive,
        isPanic,
        isRecovering,
        startSimulation,
        stopSimulation,
        triggerTap,
    };
};

export default useBiometricSimulation;
