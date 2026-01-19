import { useState, useRef, useCallback, useEffect } from "react";

// LocalStorage key for calibration persistence
const CALIBRATION_STORAGE_KEY = "fear_meter_calibration";

// Calibration states
export const CALIBRATION_STATE = {
    IDLE: "IDLE",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETE: "COMPLETE",
};

// Response classification types
export const RESPONSE_TYPE = {
    NONE: "NONE",
    EXERCISE: "EXERCISE",
    FEAR: "FEAR",
    STRESS: "STRESS",
    ANXIETY: "ANXIETY",
};

// Load calibration from localStorage
const loadCalibrationFromStorage = () => {
    try {
        const stored = localStorage.getItem(CALIBRATION_STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            // Check if calibration is still valid (expires after 24 hours)
            const expiresAt = data.expiresAt || 0;
            if (Date.now() < expiresAt) {
                return data;
            }
            // Expired, remove from storage
            localStorage.removeItem(CALIBRATION_STORAGE_KEY);
        }
    } catch (e) {
        console.warn("Failed to load calibration from storage:", e);
    }
    return null;
};

// Save calibration to localStorage
const saveCalibrationToStorage = (baselineBpm, baselineStress) => {
    try {
        const data = {
            baselineBpm,
            baselineStress,
            calibratedAt: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        };
        localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn("Failed to save calibration to storage:", e);
    }
};

// Clear calibration from localStorage
const clearCalibrationFromStorage = () => {
    try {
        localStorage.removeItem(CALIBRATION_STORAGE_KEY);
    } catch (e) {
        console.warn("Failed to clear calibration from storage:", e);
    }
};

export const useCalibration = () => {
    // Try to load persisted calibration on init
    const storedCalibration = loadCalibrationFromStorage();
    
    const [calibrationState, setCalibrationState] = useState(
        storedCalibration ? CALIBRATION_STATE.COMPLETE : CALIBRATION_STATE.IDLE
    );
    const [progress, setProgress] = useState(storedCalibration ? 100 : 0);
    const [baselineBpm, setBaselineBpm] = useState(storedCalibration?.baselineBpm || null);
    const [baselineStress, setBaselineStress] = useState(storedCalibration?.baselineStress || null);
    const [isMoving, setIsMoving] = useState(false);
    const [responseType, setResponseType] = useState(RESPONSE_TYPE.NONE);
    const [movementIntensity, setMovementIntensity] = useState(0);
    
    const calibrationIntervalRef = useRef(null);
    const bpmSamplesRef = useRef([]);
    const motionListenerRef = useRef(null);
    const movementHistoryRef = useRef([]);
    const lastMotionRef = useRef({ x: 0, y: 0, z: 0 });
    const bpmVarianceRef = useRef([]);
    
    // Calibration duration in seconds
    const CALIBRATION_DURATION = 45;
    
    // ===== IMPROVED MOVEMENT DETECTION THRESHOLDS =====
    // Lower threshold = more sensitive to movement
    const MOVEMENT_THRESHOLD_LOW = 1.5;      // Light movement (fidgeting)
    const MOVEMENT_THRESHOLD_MEDIUM = 3.5;   // Walking/moderate activity
    const MOVEMENT_THRESHOLD_HIGH = 7.0;     // Running/intense exercise
    
    // BPM thresholds relative to baseline
    const BPM_ELEVATED_DELTA = 15;           // Slightly elevated
    const BPM_HIGH_DELTA = 30;               // High elevation
    const BPM_CRITICAL_DELTA = 45;           // Critical elevation
    
    // Stress thresholds
    const STRESS_MODERATE = 50;
    const STRESS_HIGH = 70;
    const STRESS_CRITICAL = 85;
    
    // BPM variance threshold for anxiety detection
    const BPM_VARIANCE_THRESHOLD = 8;        // Irregular heartbeat pattern
    
    // Initialize motion detection with improved sensitivity
    const initMotionDetection = useCallback(() => {
        if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
            const handleMotion = (event) => {
                const { accelerationIncludingGravity, acceleration } = event;
                
                // Prefer pure acceleration if available (excludes gravity)
                const accel = acceleration?.x !== null ? acceleration : accelerationIncludingGravity;
                if (!accel) return;
                
                const { x, y, z } = accel;
                const lastMotion = lastMotionRef.current;
                
                // Calculate delta movement with weighted axes
                // Y-axis (up/down) is weighted more for running detection
                const deltaX = Math.abs((x || 0) - lastMotion.x);
                const deltaY = Math.abs((y || 0) - lastMotion.y) * 1.2; // Weight vertical movement
                const deltaZ = Math.abs((z || 0) - lastMotion.z);
                const totalDelta = deltaX + deltaY + deltaZ;
                
                // Update movement history (last 15 samples for smoother detection)
                movementHistoryRef.current.push(totalDelta);
                if (movementHistoryRef.current.length > 15) {
                    movementHistoryRef.current.shift();
                }
                
                // Calculate weighted moving average (recent samples weighted more)
                let weightedSum = 0;
                let weightTotal = 0;
                movementHistoryRef.current.forEach((val, idx) => {
                    const weight = idx + 1; // Later samples have higher weight
                    weightedSum += val * weight;
                    weightTotal += weight;
                });
                const avgMovement = weightTotal > 0 ? weightedSum / weightTotal : 0;
                
                setMovementIntensity(avgMovement);
                setIsMoving(avgMovement > MOVEMENT_THRESHOLD_LOW);
                
                lastMotionRef.current = { x: x || 0, y: y || 0, z: z || 0 };
            };
            
            window.addEventListener('devicemotion', handleMotion);
            motionListenerRef.current = handleMotion;
        } else {
            // Fallback: simulate no movement for desktop
            setIsMoving(false);
            setMovementIntensity(0);
        }
    }, []);
    
    // Clean up motion detection
    const cleanupMotionDetection = useCallback(() => {
        if (motionListenerRef.current) {
            window.removeEventListener('devicemotion', motionListenerRef.current);
            motionListenerRef.current = null;
        }
    }, []);
    
    // Complete calibration and calculate baselines
    const completeCalibration = useCallback(() => {
        clearInterval(calibrationIntervalRef.current);
        
        // Calculate baseline from samples
        let finalBpm = 72;
        let finalStress = 15;
        
        if (bpmSamplesRef.current.length > 0) {
            // Remove outliers (top and bottom 10%)
            const sorted = [...bpmSamplesRef.current].sort((a, b) => a - b);
            const trimStart = Math.floor(sorted.length * 0.1);
            const trimEnd = Math.ceil(sorted.length * 0.9);
            const trimmed = sorted.slice(trimStart, trimEnd);
            
            if (trimmed.length > 0) {
                finalBpm = Math.round(
                    trimmed.reduce((a, b) => a + b, 0) / trimmed.length
                );
            }
            finalStress = Math.round(((finalBpm - 60) / 80) * 100);
            finalStress = Math.max(0, Math.min(100, finalStress));
        }
        
        setBaselineBpm(finalBpm);
        setBaselineStress(finalStress);
        setCalibrationState(CALIBRATION_STATE.COMPLETE);
        setProgress(100);
        
        // Persist to localStorage
        saveCalibrationToStorage(finalBpm, finalStress);
    }, []);
    
    // Start calibration process
    const startCalibration = useCallback(() => {
        setCalibrationState(CALIBRATION_STATE.IN_PROGRESS);
        setProgress(0);
        bpmSamplesRef.current = [];
        movementHistoryRef.current = [];
        bpmVarianceRef.current = [];
        
        initMotionDetection();
        
        let elapsed = 0;
        calibrationIntervalRef.current = setInterval(() => {
            elapsed += 0.1;
            const progressPercent = Math.min((elapsed / CALIBRATION_DURATION) * 100, 100);
            setProgress(progressPercent);
            
            if (elapsed >= CALIBRATION_DURATION) {
                completeCalibration();
            }
        }, 100);
    }, [initMotionDetection, completeCalibration]);
    
    // Add BPM sample during calibration
    const addBpmSample = useCallback((bpm) => {
        if (calibrationState === CALIBRATION_STATE.IN_PROGRESS) {
            bpmSamplesRef.current.push(bpm);
        }
        
        // Track BPM variance for anxiety detection (always, not just during calibration)
        bpmVarianceRef.current.push(bpm);
        if (bpmVarianceRef.current.length > 20) {
            bpmVarianceRef.current.shift();
        }
    }, [calibrationState]);
    
    // Calculate BPM variance (for anxiety detection)
    const calculateBpmVariance = useCallback(() => {
        if (bpmVarianceRef.current.length < 5) return 0;
        
        const samples = bpmVarianceRef.current;
        const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
        const squaredDiffs = samples.map(val => Math.pow(val - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
        return Math.sqrt(avgSquaredDiff);
    }, []);
    
    // ===== IMPROVED CLASSIFICATION LOGIC =====
    const classifyResponse = useCallback((currentBpm, currentStress) => {
        if (calibrationState !== CALIBRATION_STATE.COMPLETE || !baselineBpm) {
            setResponseType(RESPONSE_TYPE.NONE);
            return RESPONSE_TYPE.NONE;
        }
        
        const bpmDelta = currentBpm - baselineBpm;
        const stressDelta = currentStress - baselineStress;
        const bpmVariance = calculateBpmVariance();
        
        // Determine elevation levels
        const isBpmElevated = bpmDelta > BPM_ELEVATED_DELTA;
        const isBpmHigh = bpmDelta > BPM_HIGH_DELTA;
        const isBpmCritical = bpmDelta > BPM_CRITICAL_DELTA;
        
        // Determine movement levels
        const isLightMovement = movementIntensity > MOVEMENT_THRESHOLD_LOW && movementIntensity <= MOVEMENT_THRESHOLD_MEDIUM;
        const isModerateMovement = movementIntensity > MOVEMENT_THRESHOLD_MEDIUM && movementIntensity <= MOVEMENT_THRESHOLD_HIGH;
        const isIntenseMovement = movementIntensity > MOVEMENT_THRESHOLD_HIGH;
        
        // Determine stress levels
        const isStressModerate = currentStress > STRESS_MODERATE;
        const isStressHigh = currentStress > STRESS_HIGH;
        const isStressCritical = currentStress > STRESS_CRITICAL;
        
        // Check for irregular heartbeat (anxiety indicator)
        const hasIrregularBpm = bpmVariance > BPM_VARIANCE_THRESHOLD;
        
        let newResponseType = RESPONSE_TYPE.NONE;
        
        // ===== CLASSIFICATION RULES =====
        
        // RULE 1: Intense exercise - High BPM + Intense movement
        if ((isBpmHigh || isBpmCritical) && (isModerateMovement || isIntenseMovement)) {
            newResponseType = RESPONSE_TYPE.EXERCISE;
        }
        // RULE 2: Light exercise - Elevated BPM + Light/Moderate movement
        else if (isBpmElevated && (isLightMovement || isModerateMovement)) {
            newResponseType = RESPONSE_TYPE.EXERCISE;
        }
        // RULE 3: FEAR - Critical BPM + High Stress + NO movement
        else if (isBpmCritical && isStressCritical && !isMoving) {
            newResponseType = RESPONSE_TYPE.FEAR;
        }
        // RULE 4: FEAR - High BPM + High Stress + NO movement
        else if (isBpmHigh && isStressHigh && !isMoving) {
            newResponseType = RESPONSE_TYPE.FEAR;
        }
        // RULE 5: STRESS - Elevated/High BPM + Moderate Stress + NO movement
        else if ((isBpmElevated || isBpmHigh) && isStressModerate && !isMoving) {
            newResponseType = RESPONSE_TYPE.STRESS;
        }
        // RULE 6: ANXIETY - Irregular BPM pattern + Elevated stress + NO movement
        else if (hasIrregularBpm && stressDelta > 15 && !isModerateMovement && !isIntenseMovement) {
            newResponseType = RESPONSE_TYPE.ANXIETY;
        }
        // RULE 7: ANXIETY - Moderate BPM elevation with high variance
        else if (isBpmElevated && hasIrregularBpm && !isMoving) {
            newResponseType = RESPONSE_TYPE.ANXIETY;
        }
        
        setResponseType(newResponseType);
        return newResponseType;
    }, [calibrationState, baselineBpm, baselineStress, isMoving, movementIntensity, calculateBpmVariance]);
    
    // Check if panic should be triggered (only for FEAR response)
    const shouldTriggerPanic = useCallback((currentBpm, currentStress) => {
        const response = classifyResponse(currentBpm, currentStress);
        
        // Only trigger panic for genuine FEAR response
        // NOT for exercise, stress, or anxiety
        if (response === RESPONSE_TYPE.FEAR) {
            return currentBpm > 110 && currentStress > 75;
        }
        
        // For uncalibrated state, use original logic
        if (calibrationState !== CALIBRATION_STATE.COMPLETE) {
            return currentBpm > 110 && currentStress > 75;
        }
        
        return false;
    }, [classifyResponse, calibrationState]);
    
    // Reset calibration (also clears localStorage)
    const resetCalibration = useCallback(() => {
        clearInterval(calibrationIntervalRef.current);
        cleanupMotionDetection();
        
        setCalibrationState(CALIBRATION_STATE.IDLE);
        setProgress(0);
        setBaselineBpm(null);
        setBaselineStress(null);
        setIsMoving(false);
        setResponseType(RESPONSE_TYPE.NONE);
        setMovementIntensity(0);
        bpmSamplesRef.current = [];
        movementHistoryRef.current = [];
        bpmVarianceRef.current = [];
        
        // Clear from localStorage
        clearCalibrationFromStorage();
    }, [cleanupMotionDetection]);
    
    // Initialize motion detection on mount if already calibrated
    useEffect(() => {
        if (calibrationState === CALIBRATION_STATE.COMPLETE) {
            initMotionDetection();
        }
        
        return () => {
            clearInterval(calibrationIntervalRef.current);
            cleanupMotionDetection();
        };
    }, [calibrationState, initMotionDetection, cleanupMotionDetection]);
    
    return {
        // State
        calibrationState,
        progress,
        baselineBpm,
        baselineStress,
        isMoving,
        responseType,
        movementIntensity,
        isCalibrated: calibrationState === CALIBRATION_STATE.COMPLETE,
        
        // Actions
        startCalibration,
        addBpmSample,
        classifyResponse,
        shouldTriggerPanic,
        resetCalibration,
    };
};

export default useCalibration;
