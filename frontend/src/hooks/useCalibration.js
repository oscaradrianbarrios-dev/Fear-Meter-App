import { useState, useRef, useCallback, useEffect } from "react";

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

export const useCalibration = () => {
    const [calibrationState, setCalibrationState] = useState(CALIBRATION_STATE.IDLE);
    const [progress, setProgress] = useState(0);
    const [baselineBpm, setBaselineBpm] = useState(null);
    const [baselineStress, setBaselineStress] = useState(null);
    const [isMoving, setIsMoving] = useState(false);
    const [responseType, setResponseType] = useState(RESPONSE_TYPE.NONE);
    const [movementIntensity, setMovementIntensity] = useState(0);
    
    const calibrationIntervalRef = useRef(null);
    const bpmSamplesRef = useRef([]);
    const motionListenerRef = useRef(null);
    const movementHistoryRef = useRef([]);
    const lastMotionRef = useRef({ x: 0, y: 0, z: 0 });
    
    // Calibration duration in seconds
    const CALIBRATION_DURATION = 45;
    
    // Movement detection thresholds
    const MOVEMENT_THRESHOLD = 2.5; // Acceleration threshold for "moving"
    const HIGH_MOVEMENT_THRESHOLD = 8; // High activity threshold
    
    // Initialize motion detection
    const initMotionDetection = useCallback(() => {
        if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
            const handleMotion = (event) => {
                const { accelerationIncludingGravity } = event;
                if (!accelerationIncludingGravity) return;
                
                const { x, y, z } = accelerationIncludingGravity;
                const lastMotion = lastMotionRef.current;
                
                // Calculate delta movement
                const deltaX = Math.abs((x || 0) - lastMotion.x);
                const deltaY = Math.abs((y || 0) - lastMotion.y);
                const deltaZ = Math.abs((z || 0) - lastMotion.z);
                const totalDelta = deltaX + deltaY + deltaZ;
                
                // Update movement history (last 10 samples)
                movementHistoryRef.current.push(totalDelta);
                if (movementHistoryRef.current.length > 10) {
                    movementHistoryRef.current.shift();
                }
                
                // Calculate average movement
                const avgMovement = movementHistoryRef.current.reduce((a, b) => a + b, 0) / 
                                   movementHistoryRef.current.length;
                
                setMovementIntensity(avgMovement);
                setIsMoving(avgMovement > MOVEMENT_THRESHOLD);
                
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
        if (bpmSamplesRef.current.length > 0) {
            const avgBpm = Math.round(
                bpmSamplesRef.current.reduce((a, b) => a + b, 0) / bpmSamplesRef.current.length
            );
            const avgStress = Math.round(((avgBpm - 60) / 80) * 100);
            
            setBaselineBpm(avgBpm);
            setBaselineStress(Math.max(0, Math.min(100, avgStress)));
        } else {
            // Default baseline if no samples
            setBaselineBpm(72);
            setBaselineStress(15);
        }
        
        setCalibrationState(CALIBRATION_STATE.COMPLETE);
        setProgress(100);
    }, []);
    
    // Start calibration process
    const startCalibration = useCallback(() => {
        setCalibrationState(CALIBRATION_STATE.IN_PROGRESS);
        setProgress(0);
        bpmSamplesRef.current = [];
        movementHistoryRef.current = [];
        
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
    }, [calibrationState]);
    
    // Classify response based on current readings vs baseline
    const classifyResponse = useCallback((currentBpm, currentStress) => {
        if (calibrationState !== CALIBRATION_STATE.COMPLETE || !baselineBpm) {
            setResponseType(RESPONSE_TYPE.NONE);
            return RESPONSE_TYPE.NONE;
        }
        
        const bpmDelta = currentBpm - baselineBpm;
        const stressDelta = currentStress - baselineStress;
        const isHighBpm = currentBpm > 100 || bpmDelta > 25;
        const isMediumBpm = currentBpm > 85 || bpmDelta > 15;
        
        let newResponseType = RESPONSE_TYPE.NONE;
        
        // Classification logic:
        // HIGH BPM + HIGH MOVEMENT = EXERCISE
        // HIGH BPM + LOW MOVEMENT = FEAR/STRESS
        // MEDIUM BPM + IRREGULAR PATTERNS = ANXIETY
        
        if (isHighBpm && isMoving && movementIntensity > HIGH_MOVEMENT_THRESHOLD) {
            newResponseType = RESPONSE_TYPE.EXERCISE;
        } else if (isHighBpm && !isMoving) {
            // High BPM without movement = FEAR
            if (currentStress > 70) {
                newResponseType = RESPONSE_TYPE.FEAR;
            } else {
                newResponseType = RESPONSE_TYPE.STRESS;
            }
        } else if (isMediumBpm && !isMoving && stressDelta > 20) {
            // Medium BPM with stress spikes = ANXIETY
            newResponseType = RESPONSE_TYPE.ANXIETY;
        } else if (isMediumBpm && isMoving) {
            // Medium BPM with movement = light exercise
            newResponseType = RESPONSE_TYPE.EXERCISE;
        }
        
        setResponseType(newResponseType);
        return newResponseType;
    }, [calibrationState, baselineBpm, baselineStress, isMoving, movementIntensity]);
    
    // Check if panic should be triggered (only for FEAR response)
    const shouldTriggerPanic = useCallback((currentBpm, currentStress) => {
        const response = classifyResponse(currentBpm, currentStress);
        
        // Only trigger panic for genuine FEAR response
        // NOT for exercise or general stress
        if (response === RESPONSE_TYPE.FEAR) {
            return currentBpm > 110 && currentStress > 75;
        }
        
        // For uncalibrated state, use original logic
        if (calibrationState !== CALIBRATION_STATE.COMPLETE) {
            return currentBpm > 110 && currentStress > 75;
        }
        
        return false;
    }, [classifyResponse, calibrationState]);
    
    // Reset calibration
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
    }, [cleanupMotionDetection]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearInterval(calibrationIntervalRef.current);
            cleanupMotionDetection();
        };
    }, [cleanupMotionDetection]);
    
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
