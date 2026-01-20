import { useState, useEffect, useCallback, useRef } from "react";
import { Activity, Moon, Zap, Heart, AlertTriangle, Check, X, Footprints } from "lucide-react";

// Calibration modes
export const CALIBRATION_MODES = {
    REST: "REST",
    EXERCISE: "EXERCISE", 
    STRESS: "STRESS",
    FEAR: "FEAR",
};

// Mode configurations
const MODE_CONFIG = {
    [CALIBRATION_MODES.REST]: {
        icon: Moon,
        title: "REST MODE",
        titleES: "MODO REPOSO",
        description: "Calibrate your resting baseline",
        descriptionES: "Calibra tu línea base en reposo",
        instruction: "Sit still, breathe normally",
        instructionES: "Siéntate quieto, respira normalmente",
        duration: 30,
        expectedBpmRange: [60, 80],
        color: "rgba(255, 0, 0, 0.4)",
    },
    [CALIBRATION_MODES.EXERCISE]: {
        icon: Footprints,
        title: "EXERCISE MODE",
        titleES: "MODO EJERCICIO",
        description: "Calibrate during physical activity",
        descriptionES: "Calibra durante actividad física",
        instruction: "Walk or move normally for 30 seconds",
        instructionES: "Camina o muévete normalmente por 30 segundos",
        duration: 30,
        expectedBpmRange: [90, 130],
        color: "rgba(255, 0, 0, 0.6)",
    },
    [CALIBRATION_MODES.STRESS]: {
        icon: Zap,
        title: "STRESS MODE",
        titleES: "MODO ESTRÉS",
        description: "Calibrate your stress response",
        descriptionES: "Calibra tu respuesta al estrés",
        instruction: "Think of something stressful",
        instructionES: "Piensa en algo estresante",
        duration: 20,
        expectedBpmRange: [75, 100],
        color: "rgba(255, 0, 0, 0.7)",
    },
    [CALIBRATION_MODES.FEAR]: {
        icon: Heart,
        title: "FEAR MODE",
        titleES: "MODO MIEDO",
        description: "Calibrate your fear response",
        descriptionES: "Calibra tu respuesta al miedo",
        instruction: "We'll show you something scary...",
        instructionES: "Te mostraremos algo aterrador...",
        duration: 15,
        expectedBpmRange: [100, 140],
        color: "#FF0000",
    },
};

export const AdvancedCalibration = ({
    isOpen,
    onClose,
    onCalibrationComplete,
    currentCalibrationData,
    language = "EN",
}) => {
    const [selectedMode, setSelectedMode] = useState(null);
    const [phase, setPhase] = useState("select"); // select, calibrating, complete
    const [progress, setProgress] = useState(0);
    const [calibratedModes, setCalibratedModes] = useState({});
    const [currentBpm, setCurrentBpm] = useState(72);
    const [glitchActive, setGlitchActive] = useState(false);
    const [showScaryImage, setShowScaryImage] = useState(false);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);
    const bpmSamplesRef = useRef([]);

    const texts = {
        EN: {
            title: "ADVANCED CALIBRATION",
            subtitle: "Multi-mode biometric baseline acquisition",
            selectMode: "SELECT CALIBRATION MODE",
            allModesComplete: "All modes calibrated",
            startCalibration: "START",
            back: "BACK",
            cancel: "CANCEL",
            calibrating: "CALIBRATING...",
            hold: "HOLD POSITION",
            modeComplete: "MODE CALIBRATED",
            avgBpm: "AVG BPM",
            save: "SAVE & CONTINUE",
            reset: "RESET MODE",
            completeAll: "COMPLETE CALIBRATION",
            calibratedModes: "CALIBRATED MODES",
            restRequired: "Rest mode required first",
            hapticEnabled: "HAPTIC FEEDBACK ENABLED",
        },
        ES: {
            title: "CALIBRACIÓN AVANZADA",
            subtitle: "Adquisición de línea base biométrica multi-modo",
            selectMode: "SELECCIONA MODO DE CALIBRACIÓN",
            allModesComplete: "Todos los modos calibrados",
            startCalibration: "INICIAR",
            back: "VOLVER",
            cancel: "CANCELAR",
            calibrating: "CALIBRANDO...",
            hold: "MANTÉN LA POSICIÓN",
            modeComplete: "MODO CALIBRADO",
            avgBpm: "BPM PROMEDIO",
            save: "GUARDAR Y CONTINUAR",
            reset: "REINICIAR MODO",
            completeAll: "COMPLETAR CALIBRACIÓN",
            calibratedModes: "MODOS CALIBRADOS",
            restRequired: "Modo reposo requerido primero",
            hapticEnabled: "VIBRACIÓN HÁPTICA ACTIVADA",
        },
    };

    const t = texts[language];
    const isES = language === "ES";

    // Trigger haptic feedback
    const triggerHaptic = useCallback((pattern = [50]) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }, []);

    // Start calibration for selected mode
    const startModeCalibration = useCallback(() => {
        if (!selectedMode) return;
        
        // Require REST mode first
        if (selectedMode !== CALIBRATION_MODES.REST && !calibratedModes[CALIBRATION_MODES.REST]) {
            triggerHaptic([100, 50, 100]);
            return;
        }

        setPhase("calibrating");
        setProgress(0);
        bpmSamplesRef.current = [];
        startTimeRef.current = Date.now();
        triggerHaptic([30, 20, 30]);

        const config = MODE_CONFIG[selectedMode];
        const duration = config.duration * 1000;
        const [minBpm, maxBpm] = config.expectedBpmRange;

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const progressPercent = Math.min((elapsed / duration) * 100, 100);
            setProgress(progressPercent);

            // Simulate BPM based on mode
            const baseBpm = (minBpm + maxBpm) / 2;
            const variation = (Math.random() - 0.5) * 10;
            const newBpm = Math.round(Math.max(minBpm, Math.min(maxBpm, baseBpm + variation)));
            setCurrentBpm(newBpm);
            bpmSamplesRef.current.push(newBpm);

            // Show scary image for FEAR mode at 50%
            if (selectedMode === CALIBRATION_MODES.FEAR && progressPercent > 40 && progressPercent < 80) {
                if (!showScaryImage && Math.random() < 0.1) {
                    setShowScaryImage(true);
                    triggerHaptic([200, 100, 200, 100, 300]); // Intense vibration
                    setTimeout(() => setShowScaryImage(false), 300);
                }
            }

            // Glitch effect periodically
            if (Math.random() < 0.05) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 100);
            }

            // Periodic haptic during exercise mode
            if (selectedMode === CALIBRATION_MODES.EXERCISE && progressPercent % 20 < 1) {
                triggerHaptic([20]);
            }

            if (elapsed >= duration) {
                clearInterval(intervalRef.current);
                completeMode();
            }
        }, 100);
    }, [selectedMode, calibratedModes, triggerHaptic, showScaryImage]);

    // Complete current mode calibration
    const completeMode = useCallback(() => {
        if (!selectedMode || bpmSamplesRef.current.length === 0) return;

        const samples = bpmSamplesRef.current;
        const avgBpm = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
        const minBpm = Math.min(...samples);
        const maxBpm = Math.max(...samples);

        setCalibratedModes(prev => ({
            ...prev,
            [selectedMode]: {
                avgBpm,
                minBpm,
                maxBpm,
                samples: samples.length,
                timestamp: Date.now(),
            },
        }));

        setPhase("complete");
        triggerHaptic([50, 50, 100]); // Success pattern
    }, [selectedMode, triggerHaptic]);

    // Save and continue
    const handleSaveMode = useCallback(() => {
        setSelectedMode(null);
        setPhase("select");
        setProgress(0);
        triggerHaptic([30]);
    }, [triggerHaptic]);

    // Reset current mode
    const handleResetMode = useCallback(() => {
        setCalibratedModes(prev => {
            const updated = { ...prev };
            delete updated[selectedMode];
            return updated;
        });
        setPhase("select");
        setSelectedMode(null);
        setProgress(0);
        triggerHaptic([50, 30, 50]);
    }, [selectedMode, triggerHaptic]);

    // Complete all calibration
    const handleCompleteCalibration = useCallback(() => {
        const calibrationData = {
            modes: calibratedModes,
            restBaseline: calibratedModes[CALIBRATION_MODES.REST]?.avgBpm || 72,
            exerciseBaseline: calibratedModes[CALIBRATION_MODES.EXERCISE]?.avgBpm || null,
            stressBaseline: calibratedModes[CALIBRATION_MODES.STRESS]?.avgBpm || null,
            fearBaseline: calibratedModes[CALIBRATION_MODES.FEAR]?.avgBpm || null,
            timestamp: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000),
        };

        // Save to localStorage
        try {
            localStorage.setItem("fear_meter_advanced_calibration", JSON.stringify(calibrationData));
        } catch (e) {
            console.warn("Failed to save advanced calibration:", e);
        }

        triggerHaptic([100, 50, 100, 50, 200]); // Completion pattern
        onCalibrationComplete(calibrationData);
        onClose();
    }, [calibratedModes, onCalibrationComplete, onClose, triggerHaptic]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Handle mode selection
    const handleModeSelect = useCallback((mode) => {
        setSelectedMode(mode);
        triggerHaptic([20]);
    }, [triggerHaptic]);

    if (!isOpen) return null;

    const calibratedCount = Object.keys(calibratedModes).length;
    const hasRestCalibrated = !!calibratedModes[CALIBRATION_MODES.REST];

    // Render mode selection
    const renderModeSelection = () => (
        <div className="flex-1 overflow-y-auto p-4">
            <h2 
                className="text-sm tracking-[0.2em] mb-2 text-center"
                style={{ 
                    color: "#FF0000",
                    textShadow: "0 0 10px rgba(255, 0, 0, 0.4)",
                }}
            >
                {t.selectMode}
            </h2>
            
            {calibratedCount > 0 && (
                <div className="mb-4 text-center">
                    <span 
                        className="text-[8px] tracking-[0.15em] px-3 py-1"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.1)",
                            color: "rgba(255, 0, 0, 0.6)",
                            border: "1px solid rgba(255, 0, 0, 0.2)",
                        }}
                    >
                        {t.calibratedModes}: {calibratedCount}/4
                    </span>
                </div>
            )}

            <div className="space-y-3 mb-6">
                {Object.entries(MODE_CONFIG).map(([mode, config]) => {
                    const Icon = config.icon;
                    const isCalibrated = !!calibratedModes[mode];
                    const isDisabled = mode !== CALIBRATION_MODES.REST && !hasRestCalibrated;
                    const isSelected = selectedMode === mode;

                    return (
                        <button
                            key={mode}
                            onClick={() => !isDisabled && handleModeSelect(mode)}
                            disabled={isDisabled}
                            className={`w-full p-4 text-left transition-all duration-200 relative ${isDisabled ? 'opacity-40' : ''}`}
                            style={{ 
                                backgroundColor: isSelected 
                                    ? "rgba(255, 0, 0, 0.1)" 
                                    : "rgba(255, 0, 0, 0.02)",
                                border: `1px solid ${isSelected 
                                    ? "rgba(255, 0, 0, 0.5)" 
                                    : isCalibrated 
                                        ? "rgba(255, 0, 0, 0.3)"
                                        : "rgba(255, 0, 0, 0.15)"}`,
                                boxShadow: isSelected 
                                    ? "0 0 15px rgba(255, 0, 0, 0.2)" 
                                    : "none",
                            }}
                        >
                            {isCalibrated && (
                                <div 
                                    className="absolute top-2 right-2"
                                    style={{ color: "#FF0000" }}
                                >
                                    <Check className="w-4 h-4" />
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <Icon 
                                    className="w-5 h-5 mt-0.5" 
                                    style={{ color: config.color }}
                                />
                                <div className="flex-1">
                                    <h3 
                                        className="text-xs tracking-[0.15em]"
                                        style={{ color: config.color }}
                                    >
                                        {isES ? config.titleES : config.title}
                                    </h3>
                                    <p 
                                        className="text-[9px] tracking-[0.05em] mt-1"
                                        style={{ color: "rgba(176, 176, 176, 0.5)" }}
                                    >
                                        {isES ? config.descriptionES : config.description}
                                    </p>
                                    {isCalibrated && (
                                        <p 
                                            className="text-[8px] tracking-[0.1em] mt-2"
                                            style={{ color: "rgba(255, 0, 0, 0.5)" }}
                                        >
                                            {t.avgBpm}: {calibratedModes[mode].avgBpm}
                                        </p>
                                    )}
                                    {isDisabled && (
                                        <p 
                                            className="text-[8px] tracking-[0.1em] mt-2"
                                            style={{ color: "rgba(255, 0, 0, 0.4)" }}
                                        >
                                            ⚠ {t.restRequired}
                                        </p>
                                    )}
                                </div>
                                <span 
                                    className="text-[8px] tracking-[0.1em]"
                                    style={{ color: "rgba(176, 176, 176, 0.4)" }}
                                >
                                    {config.duration}s
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Haptic status */}
            {navigator.vibrate && (
                <div className="text-center mb-4">
                    <span 
                        className="text-[7px] tracking-[0.15em]"
                        style={{ color: "rgba(255, 0, 0, 0.3)" }}
                    >
                        📳 {t.hapticEnabled}
                    </span>
                </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
                {selectedMode && (
                    <button
                        onClick={startModeCalibration}
                        className="w-full py-3 text-[10px] tracking-[0.2em]"
                        style={{ 
                            backgroundColor: "#FF0000",
                            color: "#000000",
                            boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)",
                        }}
                    >
                        {t.startCalibration}
                    </button>
                )}

                {calibratedCount >= 1 && (
                    <button
                        onClick={handleCompleteCalibration}
                        className="w-full py-3 text-[10px] tracking-[0.2em]"
                        style={{ 
                            backgroundColor: "transparent",
                            color: "#FF0000",
                            border: "1px solid rgba(255, 0, 0, 0.5)",
                        }}
                    >
                        {t.completeAll} ({calibratedCount}/4)
                    </button>
                )}

                <button
                    onClick={onClose}
                    className="w-full py-2 text-[9px] tracking-[0.15em]"
                    style={{ color: "rgba(176, 176, 176, 0.4)" }}
                >
                    {t.cancel}
                </button>
            </div>
        </div>
    );

    // Render calibrating phase
    const renderCalibrating = () => {
        const config = MODE_CONFIG[selectedMode];
        const Icon = config.icon;

        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                {/* Scary flash for FEAR mode */}
                {showScaryImage && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        style={{ 
                            backgroundColor: "#FF0000",
                            animation: "flash 0.3s ease-out",
                        }}
                    >
                        <AlertTriangle className="w-32 h-32 text-black" />
                    </div>
                )}

                {/* Progress ring */}
                <div className="relative w-40 h-40 mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="rgba(255, 0, 0, 0.1)"
                            strokeWidth="3"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke={config.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 70}`}
                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                            style={{ 
                                transition: "stroke-dashoffset 0.1s linear",
                                filter: `drop-shadow(0 0 8px ${config.color})`,
                            }}
                        />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Icon 
                            className="w-8 h-8 mb-2"
                            style={{ 
                                color: config.color,
                                filter: glitchActive ? "blur(2px)" : "none",
                            }}
                        />
                        <span 
                            className="text-3xl font-mono"
                            style={{ 
                                color: config.color,
                                textShadow: `0 0 15px ${config.color}`,
                                transform: glitchActive ? "translateX(2px)" : "none",
                            }}
                        >
                            {currentBpm}
                        </span>
                        <span 
                            className="text-[8px] tracking-[0.15em]"
                            style={{ color: "rgba(176, 176, 176, 0.5)" }}
                        >
                            BPM
                        </span>
                    </div>
                </div>

                {/* Mode title */}
                <h3 
                    className="text-sm tracking-[0.2em] mb-2"
                    style={{ color: config.color }}
                >
                    {isES ? config.titleES : config.title}
                </h3>

                {/* Instruction */}
                <p 
                    className="text-[10px] tracking-[0.1em] text-center max-w-xs mb-4"
                    style={{ color: "rgba(176, 176, 176, 0.6)" }}
                >
                    {isES ? config.instructionES : config.instruction}
                </p>

                {/* Progress percentage */}
                <p 
                    className="text-[9px] tracking-[0.15em]"
                    style={{ color: "rgba(255, 0, 0, 0.5)" }}
                >
                    {Math.round(progress)}% — {t.hold}
                </p>
            </div>
        );
    };

    // Render complete phase
    const renderComplete = () => {
        const config = MODE_CONFIG[selectedMode];
        const modeData = calibratedModes[selectedMode];
        const Icon = config.icon;

        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                {/* Success icon */}
                <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ 
                        border: `2px solid ${config.color}`,
                        boxShadow: `0 0 25px ${config.color}40`,
                    }}
                >
                    <Check 
                        className="w-10 h-10"
                        style={{ color: config.color }}
                    />
                </div>

                <h3 
                    className="text-sm tracking-[0.25em] mb-2"
                    style={{ color: config.color }}
                >
                    {t.modeComplete}
                </h3>

                <p 
                    className="text-xs tracking-[0.15em] mb-6"
                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                >
                    {isES ? config.titleES : config.title}
                </p>

                {/* Results */}
                {modeData && (
                    <div 
                        className="py-4 px-8 mb-6"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.05)",
                            border: "1px solid rgba(255, 0, 0, 0.2)",
                        }}
                    >
                        <div className="text-center">
                            <p 
                                className="text-[8px] tracking-[0.15em] mb-1"
                                style={{ color: "rgba(255, 0, 0, 0.5)" }}
                            >
                                {t.avgBpm}
                            </p>
                            <p 
                                className="text-3xl font-mono"
                                style={{ 
                                    color: "#FF0000",
                                    textShadow: "0 0 15px rgba(255, 0, 0, 0.5)",
                                }}
                            >
                                {modeData.avgBpm}
                            </p>
                            <p 
                                className="text-[7px] tracking-[0.1em] mt-1"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                MIN: {modeData.minBpm} / MAX: {modeData.maxBpm}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="space-y-3 w-full max-w-[200px]">
                    <button
                        onClick={handleSaveMode}
                        className="w-full py-3 text-[10px] tracking-[0.2em]"
                        style={{ 
                            backgroundColor: "#FF0000",
                            color: "#000000",
                        }}
                    >
                        {t.save}
                    </button>

                    <button
                        onClick={handleResetMode}
                        className="w-full py-2 text-[9px] tracking-[0.15em]"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        {t.reset}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex flex-col"
            style={{ backgroundColor: "#000000" }}
        >
            {/* Header */}
            <div 
                className="py-4 px-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.15)" }}
            >
                <button
                    onClick={phase === "select" ? onClose : () => { setPhase("select"); setSelectedMode(null); }}
                    style={{ color: "rgba(255, 0, 0, 0.5)" }}
                >
                    {phase === "select" ? <X className="w-5 h-5" /> : <span className="text-[9px] tracking-[0.15em]">{t.back}</span>}
                </button>

                <div className="text-center">
                    <h1 
                        className="text-xs tracking-[0.25em]"
                        style={{ 
                            color: "#FF0000",
                            textShadow: "0 0 8px rgba(255, 0, 0, 0.4)",
                        }}
                    >
                        {t.title}
                    </h1>
                    <p 
                        className="text-[7px] tracking-[0.15em] mt-0.5"
                        style={{ color: "rgba(255, 0, 0, 0.4)" }}
                    >
                        {t.subtitle}
                    </p>
                </div>

                <div className="w-5" />
            </div>

            {/* Content */}
            {phase === "select" && renderModeSelection()}
            {phase === "calibrating" && renderCalibrating()}
            {phase === "complete" && renderComplete()}

            {/* Footer */}
            <div 
                className="py-2 text-center"
                style={{ borderTop: "1px solid rgba(255, 0, 0, 0.08)" }}
            >
                <p 
                    className="text-[7px] tracking-[0.15em]"
                    style={{ color: "rgba(176, 176, 176, 0.25)" }}
                >
                    FEAR METER — ADVANCED CALIBRATION SYSTEM
                </p>
            </div>

            <style>{`
                @keyframes flash {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default AdvancedCalibration;
