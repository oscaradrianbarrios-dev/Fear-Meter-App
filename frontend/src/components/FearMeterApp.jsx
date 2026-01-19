import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Monitor from "./Monitor";
import WatchMode from "./WatchMode";
import History from "./History";
import SideMenu from "./SideMenu";
import CriticalAlert from "./CriticalAlert";
import PanicOverlay from "./PanicOverlay";
import CalibrationProtocol from "./CalibrationProtocol";
import ResponseIndicator from "./ResponseIndicator";
import ExpirationWarning from "./ExpirationWarning";
import { useBiometricSimulation } from "@/hooks/useBiometricSimulation";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useCalibration, CALIBRATION_STATE } from "@/hooks/useCalibration";
import { useLanguage } from "@/contexts/LanguageContext";

export const FearMeterApp = () => {
    const navigate = useNavigate();
    const { language, setLanguage, texts } = useLanguage();
    const [currentView, setCurrentView] = useState("monitor");
    const [menuOpen, setMenuOpen] = useState(false);
    const [showCriticalMessage, setShowCriticalMessage] = useState(false);
    const [panicActive, setPanicActive] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [showDemoOption, setShowDemoOption] = useState(false);
    const [showCalibration, setShowCalibration] = useState(false);
    const panicTimeoutRef = useRef(null);
    const containerRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });

    // Calibration hook
    const {
        calibrationState,
        progress: calibrationProgress,
        baselineBpm,
        baselineStress,
        responseType,
        isCalibrated,
        movementIntensity,
        expirationWarning,
        hoursUntilExpiration,
        startCalibration,
        addBpmSample,
        classifyResponse,
        shouldTriggerPanic,
        resetCalibration,
    } = useCalibration();

    const {
        bpm,
        stress,
        signal,
        isActive,
        isPanic,
        isRecovering,
        startSimulation,
        stopSimulation,
        triggerTap,
    } = useBiometricSimulation({
        onPanicStart: () => {
            setIsBlocked(true);
            setPanicActive(true);
            
            panicTimeoutRef.current = setTimeout(() => {
                setShowCriticalMessage(true);
            }, 520);
        },
        onPanicEnd: () => {},
        // Use calibration-aware panic check
        shouldTriggerPanic: isCalibrated ? shouldTriggerPanic : null,
        // Feed BPM samples to calibration during calibration phase
        onBpmUpdate: (newBpm) => {
            if (calibrationState === CALIBRATION_STATE.IN_PROGRESS) {
                addBpmSample(newBpm);
            }
            // Classify response when active
            if (isCalibrated && isActive) {
                const currentStress = Math.round(((newBpm - 60) / 80) * 100);
                classifyResponse(newBpm, Math.max(0, Math.min(100, currentStress)));
            }
        },
    });

    const handlePanicSequenceComplete = useCallback(() => {
        setTimeout(() => {
            setPanicActive(false);
            setShowCriticalMessage(false);
            setIsBlocked(false);
        }, 300);
    }, []);

    const {
        sessions,
        isRecording,
        startSession,
        endSession,
        recordDataPoint,
        clearHistory,
    } = useSessionManager();

    // Record data points during active session
    useEffect(() => {
        if (isActive && isRecording) {
            recordDataPoint(bpm, stress);
        }
    }, [bpm, stress, isActive, isRecording, recordDataPoint]);

    const handleStartStop = useCallback(() => {
        if (isActive) {
            stopSimulation();
            endSession();
        } else {
            startSimulation();
            startSession();
        }
    }, [isActive, stopSimulation, startSimulation, endSession, startSession]);

    const handleViewChange = useCallback((view) => {
        setCurrentView(view);
        setMenuOpen(false);
    }, []);

    // Long press on logo activates demo option visibility
    const handleDemoActivate = useCallback(() => {
        setShowDemoOption(true);
        setMenuOpen(true);
    }, []);

    // Navigate to demo mode
    const handleGoToDemo = useCallback(() => {
        navigate("/demo");
    }, [navigate]);

    // Open calibration protocol
    const handleOpenCalibration = useCallback(() => {
        setMenuOpen(false);
        setShowCalibration(true);
    }, []);

    // Complete calibration and return to monitor
    const handleCalibrationComplete = useCallback(() => {
        setShowCalibration(false);
        setCurrentView("monitor");
    }, []);

    // Cancel calibration
    const handleCalibrationCancel = useCallback(() => {
        resetCalibration();
        setShowCalibration(false);
    }, [resetCalibration]);

    // Swipe detection for menu
    const handleTouchStart = useCallback((e) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
    }, []);

    const handleTouchEnd = useCallback((e) => {
        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
        };
        
        const deltaX = touchEnd.x - touchStartRef.current.x;
        const deltaY = Math.abs(touchEnd.y - touchStartRef.current.y);
        
        // Swipe from left edge to open menu
        if (touchStartRef.current.x < 30 && deltaX > 50 && deltaY < 50 && !isBlocked) {
            setMenuOpen(true);
        }
    }, [isBlocked]);

    return (
        <div 
            ref={containerRef}
            className="min-h-screen bg-fear-black font-fear flex flex-col relative overflow-hidden"
            onClick={isActive && !isBlocked ? triggerTap : undefined}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
                transition: isRecovering ? "filter 300ms ease-out" : "none",
                filter: isRecovering ? "brightness(0.9)" : "brightness(0.85)",
            }}
        >
            {/* Calibration Protocol Overlay */}
            {showCalibration && (
                <CalibrationProtocol
                    calibrationState={calibrationState}
                    progress={calibrationProgress}
                    baselineBpm={baselineBpm}
                    baselineStress={baselineStress}
                    onStartCalibration={startCalibration}
                    onComplete={handleCalibrationComplete}
                    onCancel={handleCalibrationCancel}
                    language={language}
                />
            )}
            
            <PanicOverlay 
                active={panicActive} 
                onSequenceComplete={handlePanicSequenceComplete}
            />
            
            <CriticalAlert 
                visible={showCriticalMessage} 
                language={language}
            />
            
            <Header 
                onMenuOpen={() => !isBlocked && setMenuOpen(true)}
                onDemoActivate={handleDemoActivate}
                isCalibrated={isCalibrated}
            />

            {/* Expiration Warning */}
            <ExpirationWarning
                visible={expirationWarning && !showCalibration}
                hoursLeft={hoursUntilExpiration}
                onRecalibrate={handleOpenCalibration}
                language={language}
            />

            {/* Response Type Indicator */}
            {isActive && (
                <ResponseIndicator
                    responseType={responseType}
                    isCalibrated={isCalibrated}
                    isActive={isActive}
                    language={language}
                    movementIntensity={movementIntensity}
                />
            )}

            <main className="flex-1 flex flex-col px-4 pb-4">
                {currentView === "monitor" && (
                    <Monitor
                        bpm={bpm}
                        stress={stress}
                        signal={signal}
                        isActive={isActive}
                        isPanic={isPanic}
                        isRecovering={isRecovering}
                        onStartStop={handleStartStop}
                        texts={texts}
                        isBlocked={isBlocked}
                        isCalibrated={isCalibrated}
                        responseType={responseType}
                    />
                )}

                {currentView === "watch" && (
                    <WatchMode
                        bpm={bpm}
                        stress={stress}
                        isActive={isActive}
                        isPanic={isPanic}
                    />
                )}

                {currentView === "history" && (
                    <History
                        sessions={sessions}
                        texts={texts}
                        onClear={clearHistory}
                    />
                )}
            </main>

            <footer 
                className="py-4 text-center"
                style={{ borderTop: "1px solid rgba(255, 0, 0, 0.08)" }}
            >
                <p 
                    className="text-[10px] tracking-[0.25em]"
                    style={{ color: "rgba(176, 176, 176, 0.35)" }}
                >
                    {texts.footer}
                </p>
                <p 
                    className="text-[9px] mt-1"
                    style={{ color: "rgba(176, 176, 176, 0.2)" }}
                >
                    {texts.footerSub}
                </p>
            </footer>

            <SideMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                currentView={currentView}
                onViewChange={handleViewChange}
                language={language}
                onLanguageChange={setLanguage}
                texts={texts}
                showDemoOption={showDemoOption}
                onDemoActivate={handleGoToDemo}
                isCalibrated={isCalibrated}
                onCalibrationOpen={handleOpenCalibration}
            />
        </div>
    );
};

export default FearMeterApp;
