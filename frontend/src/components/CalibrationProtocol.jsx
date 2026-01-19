import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { CALIBRATION_STATE } from "@/hooks/useCalibration";

export const CalibrationProtocol = ({
    calibrationState,
    progress,
    baselineBpm,
    baselineStress,
    onStartCalibration,
    onComplete,
    onCancel,
    language = "EN",
}) => {
    const [showData, setShowData] = useState(false);
    const [glitchText, setGlitchText] = useState(false);
    const showDataTimerRef = useRef(null);
    
    // Derive phase from calibrationState instead of using setState in effect
    const phase = useMemo(() => {
        if (calibrationState === CALIBRATION_STATE.IN_PROGRESS) return "calibrating";
        if (calibrationState === CALIBRATION_STATE.COMPLETE) return "complete";
        return "intro";
    }, [calibrationState]);
    
    const texts = {
        EN: {
            title: "CALIBRATION PROTOCOL",
            subtitle: "BIOMETRIC BASELINE ACQUISITION",
            warning: "WARNING: REMAIN ABSOLUTELY STILL",
            instruction1: "DO NOT MOVE",
            instruction2: "DO NOT SPEAK",
            instruction3: "REGULATE BREATHING",
            duration: "ESTIMATED DURATION: 30 SECONDS",
            initiate: "INITIATE CALIBRATION",
            cancel: "ABORT",
            acquiring: "ACQUIRING BASELINE DATA...",
            analyzing: "ANALYZING BIOMETRIC PATTERNS...",
            complete: "CALIBRATION COMPLETE",
            baselineEstablished: "BASELINE ESTABLISHED",
            baseBpm: "BASE BPM",
            baseStress: "BASE STRESS",
            systemReady: "SYSTEM READY FOR FEAR DETECTION",
            proceed: "PROCEED TO MONITOR",
            recalibrate: "RECALIBRATE",
            movementWarning: "MOVEMENT DETECTED — HOLD STILL",
            dataCorrupted: "DATA CORRUPTION RISK",
            validFor: "VALID FOR 24 HOURS",
        },
        ES: {
            title: "PROTOCOLO DE CALIBRACIÓN",
            subtitle: "ADQUISICIÓN DE LÍNEA BASE BIOMÉTRICA",
            warning: "ADVERTENCIA: PERMANEZCA ABSOLUTAMENTE QUIETO",
            instruction1: "NO SE MUEVA",
            instruction2: "NO HABLE",
            instruction3: "REGULE SU RESPIRACIÓN",
            duration: "DURACIÓN ESTIMADA: 30 SEGUNDOS",
            initiate: "INICIAR CALIBRACIÓN",
            cancel: "ABORTAR",
            acquiring: "ADQUIRIENDO DATOS BASE...",
            analyzing: "ANALIZANDO PATRONES BIOMÉTRICOS...",
            complete: "CALIBRACIÓN COMPLETA",
            baselineEstablished: "LÍNEA BASE ESTABLECIDA",
            baseBpm: "BPM BASE",
            baseStress: "ESTRÉS BASE",
            systemReady: "SISTEMA LISTO PARA DETECCIÓN DE MIEDO",
            proceed: "PROCEDER AL MONITOR",
            recalibrate: "RECALIBRAR",
            movementWarning: "MOVIMIENTO DETECTADO — QUIETO",
            dataCorrupted: "RIESGO DE CORRUPCIÓN DE DATOS",
        },
    };
    
    const t = texts[language];
    
    // Handle showData state based on phase
    useEffect(() => {
        // Clear any existing timer
        if (showDataTimerRef.current) {
            clearTimeout(showDataTimerRef.current);
            showDataTimerRef.current = null;
        }
        
        if (phase === "complete") {
            // Delay showing data after completion
            showDataTimerRef.current = setTimeout(() => {
                setShowData(true);
            }, 500);
        } else {
            // Reset immediately when not complete
            setShowData(false);
        }
        
        return () => {
            if (showDataTimerRef.current) {
                clearTimeout(showDataTimerRef.current);
            }
        };
    }, [phase]);
    
    // Glitch effect during calibration
    useEffect(() => {
        if (phase === "calibrating") {
            const glitchInterval = setInterval(() => {
                setGlitchText(true);
                setTimeout(() => setGlitchText(false), 100);
            }, 3000 + Math.random() * 2000);
            
            return () => clearInterval(glitchInterval);
        }
    }, [phase]);
    
    const handleInitiate = useCallback(() => {
        onStartCalibration();
    }, [onStartCalibration]);
    
    const renderIntroPhase = () => (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            {/* Title */}
            <div className="mb-8">
                <h1 
                    className="text-lg tracking-[0.4em] font-bold mb-2"
                    style={{ color: "#FF0000" }}
                >
                    {t.title}
                </h1>
                <p 
                    className="text-[10px] tracking-[0.3em]"
                    style={{ color: "rgba(255, 0, 0, 0.5)" }}
                >
                    {t.subtitle}
                </p>
            </div>
            
            {/* Warning */}
            <div 
                className="mb-8 py-3 px-6 border"
                style={{ 
                    borderColor: "rgba(255, 0, 0, 0.3)",
                    backgroundColor: "rgba(255, 0, 0, 0.03)"
                }}
            >
                <p 
                    className="text-[11px] tracking-[0.25em]"
                    style={{ color: "#FF0000" }}
                >
                    {t.warning}
                </p>
            </div>
            
            {/* Instructions */}
            <div className="mb-8 space-y-3">
                {[t.instruction1, t.instruction2, t.instruction3].map((instruction, i) => (
                    <p 
                        key={i}
                        className="text-[10px] tracking-[0.2em]"
                        style={{ 
                            color: "rgba(255, 0, 0, 0.6)",
                            animationDelay: `${i * 150}ms`,
                        }}
                    >
                        [{String(i + 1).padStart(2, '0')}] {instruction}
                    </p>
                ))}
            </div>
            
            {/* Duration */}
            <p 
                className="text-[9px] tracking-[0.2em] mb-10"
                style={{ color: "rgba(176, 176, 176, 0.4)" }}
            >
                {t.duration}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-[200px]">
                <button
                    onClick={handleInitiate}
                    className="py-3 px-6 border text-[10px] tracking-[0.25em] transition-all duration-300"
                    style={{ 
                        borderColor: "#FF0000",
                        color: "#FF0000",
                        backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 0, 0, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    {t.initiate}
                </button>
                
                <button
                    onClick={onCancel}
                    className="py-2 text-[9px] tracking-[0.2em] transition-colors duration-200"
                    style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255, 0, 0, 0.5)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(176, 176, 176, 0.4)"}
                >
                    {t.cancel}
                </button>
            </div>
        </div>
    );
    
    const renderCalibratingPhase = () => (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            {/* Progress Ring */}
            <div className="relative w-40 h-40 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="rgba(255, 0, 0, 0.1)"
                        strokeWidth="2"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#FF0000"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                        style={{ transition: "stroke-dashoffset 0.1s linear" }}
                    />
                </svg>
                
                {/* Center percentage */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span 
                        className="text-2xl tracking-[0.1em] font-mono"
                        style={{ 
                            color: "#FF0000",
                            textShadow: glitchText ? "2px 0 #00FFFF, -2px 0 #FF00FF" : "none",
                        }}
                    >
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>
            
            {/* Status text */}
            <div className="space-y-2">
                <p 
                    className="text-[11px] tracking-[0.25em]"
                    style={{ 
                        color: "#FF0000",
                        opacity: glitchText ? 0.5 : 1,
                    }}
                >
                    {progress < 50 ? t.acquiring : t.analyzing}
                </p>
                
                {/* Scanning line effect */}
                <div 
                    className="h-[1px] w-32 mx-auto"
                    style={{ 
                        background: "linear-gradient(90deg, transparent, #FF0000, transparent)",
                        animation: "scan 1.5s ease-in-out infinite",
                    }}
                />
            </div>
            
            {/* Warning pulse */}
            <div 
                className="mt-10 py-2 px-4"
                style={{ 
                    backgroundColor: "rgba(255, 0, 0, 0.05)",
                    animation: "pulse 2s ease-in-out infinite",
                }}
            >
                <p 
                    className="text-[9px] tracking-[0.2em]"
                    style={{ color: "rgba(255, 0, 0, 0.7)" }}
                >
                    {t.warning}
                </p>
            </div>
        </div>
    );
    
    const renderCompletePhase = () => (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            {/* Success indicator */}
            <div 
                className="w-20 h-20 border-2 rounded-full flex items-center justify-center mb-6"
                style={{ 
                    borderColor: "#FF0000",
                    boxShadow: "0 0 30px rgba(255, 0, 0, 0.2), inset 0 0 20px rgba(255, 0, 0, 0.05)",
                }}
            >
                <span 
                    className="text-2xl"
                    style={{ color: "#FF0000" }}
                >
                    ✓
                </span>
            </div>
            
            {/* Title */}
            <h2 
                className="text-sm tracking-[0.3em] mb-2"
                style={{ color: "#FF0000" }}
            >
                {t.complete}
            </h2>
            <p 
                className="text-[10px] tracking-[0.2em] mb-8"
                style={{ color: "rgba(255, 0, 0, 0.5)" }}
            >
                {t.baselineEstablished}
            </p>
            
            {/* Baseline Data */}
            {showData && (
                <div 
                    className="grid grid-cols-2 gap-6 mb-8 py-4 px-8 border"
                    style={{ 
                        borderColor: "rgba(255, 0, 0, 0.2)",
                        backgroundColor: "rgba(255, 0, 0, 0.02)",
                    }}
                >
                    <div>
                        <p 
                            className="text-[9px] tracking-[0.2em] mb-1"
                            style={{ color: "rgba(255, 0, 0, 0.5)" }}
                        >
                            {t.baseBpm}
                        </p>
                        <p 
                            className="text-xl font-mono"
                            style={{ color: "#FF0000" }}
                        >
                            {baselineBpm || "--"}
                        </p>
                    </div>
                    <div>
                        <p 
                            className="text-[9px] tracking-[0.2em] mb-1"
                            style={{ color: "rgba(255, 0, 0, 0.5)" }}
                        >
                            {t.baseStress}
                        </p>
                        <p 
                            className="text-xl font-mono"
                            style={{ color: "#FF0000" }}
                        >
                            {baselineStress || "--"}%
                        </p>
                    </div>
                </div>
            )}
            
            {/* System ready message */}
            <p 
                className="text-[9px] tracking-[0.15em] mb-8"
                style={{ color: "rgba(176, 176, 176, 0.5)" }}
            >
                {t.systemReady}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-[200px]">
                <button
                    onClick={onComplete}
                    className="py-3 px-6 border text-[10px] tracking-[0.25em] transition-all duration-300"
                    style={{ 
                        borderColor: "#FF0000",
                        color: "#000000",
                        backgroundColor: "#FF0000",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 25px rgba(255, 0, 0, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    {t.proceed}
                </button>
                
                <button
                    onClick={onStartCalibration}
                    className="py-2 text-[9px] tracking-[0.2em] transition-colors duration-200"
                    style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255, 0, 0, 0.5)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(176, 176, 176, 0.4)"}
                >
                    {t.recalibrate}
                </button>
            </div>
        </div>
    );
    
    return (
        <div 
            className="fixed inset-0 z-40 flex flex-col"
            style={{ backgroundColor: "#000000" }}
        >
            {/* Header */}
            <div 
                className="py-4 px-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.1)" }}
            >
                <span 
                    className="text-[9px] tracking-[0.3em]"
                    style={{ color: "rgba(255, 0, 0, 0.4)" }}
                >
                    PROTOCOL_CAL_01
                </span>
                <span 
                    className="text-[9px] tracking-[0.2em]"
                    style={{ color: "rgba(176, 176, 176, 0.3)" }}
                >
                    v1.0.0
                </span>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
                {phase === "intro" && renderIntroPhase()}
                {phase === "calibrating" && renderCalibratingPhase()}
                {phase === "complete" && renderCompletePhase()}
            </div>
            
            {/* Footer */}
            <div 
                className="py-3 text-center"
                style={{ borderTop: "1px solid rgba(255, 0, 0, 0.05)" }}
            >
                <p 
                    className="text-[8px] tracking-[0.2em]"
                    style={{ color: "rgba(176, 176, 176, 0.2)" }}
                >
                    FEAR METER — CALIBRATION SUBSYSTEM
                </p>
            </div>
            
            {/* CSS Animations */}
            <style>{`
                @keyframes scan {
                    0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
                    50% { opacity: 1; transform: scaleX(1); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default CalibrationProtocol;
