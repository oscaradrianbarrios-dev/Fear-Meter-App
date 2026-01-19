import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Demo sequence phases
const PHASE = {
    BLACK: "BLACK",
    INIT_TEXT: "INIT_TEXT",
    SUBJECT_DETECTED: "SUBJECT_DETECTED",
    MONITORING_START: "MONITORING_START",
    RISING_TENSION: "RISING_TENSION",
    CRITICAL_BUILDUP: "CRITICAL_BUILDUP",
    WOW_MOMENT: "WOW_MOMENT",
    RECOVERY: "RECOVERY",
    FINAL_MESSAGE: "FINAL_MESSAGE",
};

export const InvestorDemo = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState(PHASE.BLACK);
    const [bpm, setBpm] = useState(0);
    const [stress, setStress] = useState(0);
    const [textOpacity, setTextOpacity] = useState(0);
    const [showOscilloscope, setShowOscilloscope] = useState(false);
    const [oscilloscopeIntensity, setOscilloscopeIntensity] = useState(0);
    const [flashActive, setFlashActive] = useState(false);
    const [wowOverlay, setWowOverlay] = useState(false);
    const [finalMessage, setFinalMessage] = useState(false);
    const [ecgPoints, setEcgPoints] = useState([]);
    
    const animationRef = useRef(null);
    const ecgIntervalRef = useRef(null);
    const sequenceTimeoutRefs = useRef([]);
    
    // Clear all timeouts on unmount
    useEffect(() => {
        return () => {
            sequenceTimeoutRefs.current.forEach(clearTimeout);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (ecgIntervalRef.current) clearInterval(ecgIntervalRef.current);
        };
    }, []);
    
    // Add timeout helper that tracks refs
    const addTimeout = (callback, delay) => {
        const id = setTimeout(callback, delay);
        sequenceTimeoutRefs.current.push(id);
        return id;
    };
    
    // Vibrate device if supported
    const vibrate = (pattern) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };
    
    // Generate ECG points for oscilloscope
    const generateEcgPoints = (intensity = 1, isPanic = false) => {
        const points = [];
        const width = 350;
        const height = 100;
        const midY = height / 2;
        
        for (let x = 0; x < width; x += 2) {
            let y = midY;
            const normalizedX = (x % 60) / 60;
            
            // QRS complex pattern
            if (normalizedX > 0.35 && normalizedX < 0.65) {
                if (normalizedX < 0.42) {
                    y = midY + (normalizedX - 0.35) * 150 * intensity;
                } else if (normalizedX < 0.5) {
                    y = midY - (0.5 - normalizedX) * 400 * intensity;
                } else if (normalizedX < 0.58) {
                    y = midY + (normalizedX - 0.5) * 200 * intensity;
                } else {
                    y = midY - (0.65 - normalizedX) * 100 * intensity;
                }
            }
            
            // Add noise for panic state
            if (isPanic) {
                y += (Math.random() - 0.5) * 15;
            }
            
            y = Math.max(5, Math.min(height - 5, y));
            points.push({ x, y });
        }
        
        return points;
    };
    
    // Main demo sequence
    useEffect(() => {
        // Phase 0: Black screen (2 seconds)
        addTimeout(() => {
            setPhase(PHASE.INIT_TEXT);
            setTextOpacity(0);
            // Fade in text
            addTimeout(() => setTextOpacity(1), 100);
        }, 2000);
        
        // Phase 1: "INITIALIZING..." (3 seconds)
        addTimeout(() => {
            setTextOpacity(0);
            addTimeout(() => {
                setPhase(PHASE.SUBJECT_DETECTED);
                setTextOpacity(0);
                addTimeout(() => setTextOpacity(1), 100);
            }, 500);
        }, 5000);
        
        // Phase 2: "SUBJECT DETECTED" (2.5 seconds)
        addTimeout(() => {
            setTextOpacity(0);
            addTimeout(() => {
                setPhase(PHASE.MONITORING_START);
                setShowOscilloscope(true);
                setBpm(68);
                setStress(12);
                setOscilloscopeIntensity(0.5);
            }, 500);
        }, 8000);
        
        // Phase 3: Start monitoring, BPM rises slowly (8 seconds)
        addTimeout(() => {
            setPhase(PHASE.RISING_TENSION);
        }, 10000);
        
        // Phase 4: Critical buildup (6 seconds)
        addTimeout(() => {
            setPhase(PHASE.CRITICAL_BUILDUP);
            // Flash effects during buildup
            addTimeout(() => { setFlashActive(true); addTimeout(() => setFlashActive(false), 80); }, 500);
            addTimeout(() => { setFlashActive(true); addTimeout(() => setFlashActive(false), 80); }, 2000);
            addTimeout(() => { setFlashActive(true); addTimeout(() => setFlashActive(false), 100); }, 4000);
        }, 18000);
        
        // Phase 5: WOW MOMENT (3 seconds)
        addTimeout(() => {
            setPhase(PHASE.WOW_MOMENT);
            setWowOverlay(true);
            vibrate([100, 50, 100, 50, 200]);
            
            addTimeout(() => {
                setWowOverlay(false);
                setPhase(PHASE.RECOVERY);
            }, 2500);
        }, 24000);
        
        // Phase 6: Recovery + Final message (after 5 seconds)
        addTimeout(() => {
            setPhase(PHASE.FINAL_MESSAGE);
            setFinalMessage(true);
            setShowOscilloscope(false);
        }, 30000);
        
    }, []);
    
    // BPM animation based on phase
    useEffect(() => {
        if (phase === PHASE.MONITORING_START) {
            // Initial stable monitoring
            const interval = setInterval(() => {
                setBpm(prev => {
                    const variation = (Math.random() - 0.5) * 4;
                    return Math.round(Math.max(65, Math.min(75, prev + variation)));
                });
                setStress(prev => Math.round(Math.max(10, Math.min(20, prev + (Math.random() - 0.5) * 3))));
            }, 500);
            return () => clearInterval(interval);
        }
        
        if (phase === PHASE.RISING_TENSION) {
            // BPM rises from 70 to 110
            let targetBpm = 110;
            const interval = setInterval(() => {
                setBpm(prev => {
                    if (prev < targetBpm) {
                        return Math.round(prev + 3 + Math.random() * 2);
                    }
                    return prev + Math.round((Math.random() - 0.5) * 4);
                });
                setStress(prev => Math.round(Math.min(65, prev + 4 + Math.random() * 2)));
                setOscilloscopeIntensity(prev => Math.min(1.2, prev + 0.05));
            }, 400);
            return () => clearInterval(interval);
        }
        
        if (phase === PHASE.CRITICAL_BUILDUP) {
            // BPM rises to critical (135)
            const interval = setInterval(() => {
                setBpm(prev => {
                    if (prev < 135) {
                        return Math.round(prev + 4 + Math.random() * 3);
                    }
                    return prev + Math.round((Math.random() - 0.5) * 6);
                });
                setStress(prev => Math.round(Math.min(95, prev + 5)));
                setOscilloscopeIntensity(prev => Math.min(2, prev + 0.1));
            }, 350);
            return () => clearInterval(interval);
        }
        
        if (phase === PHASE.RECOVERY) {
            // BPM drops back down
            const interval = setInterval(() => {
                setBpm(prev => Math.round(Math.max(85, prev - 5)));
                setStress(prev => Math.round(Math.max(40, prev - 8)));
                setOscilloscopeIntensity(prev => Math.max(0.8, prev - 0.1));
            }, 500);
            return () => clearInterval(interval);
        }
    }, [phase]);
    
    // ECG animation
    useEffect(() => {
        if (!showOscilloscope) return;
        
        const updateEcg = () => {
            const isPanic = phase === PHASE.CRITICAL_BUILDUP || phase === PHASE.WOW_MOMENT;
            setEcgPoints(generateEcgPoints(oscilloscopeIntensity, isPanic));
        };
        
        ecgIntervalRef.current = setInterval(updateEcg, 100);
        return () => clearInterval(ecgIntervalRef.current);
    }, [showOscilloscope, oscilloscopeIntensity, phase]);
    
    // Render oscilloscope
    const renderOscilloscope = () => {
        if (!showOscilloscope) return null;
        
        const isPanic = phase === PHASE.CRITICAL_BUILDUP || phase === PHASE.WOW_MOMENT;
        const isCritical = bpm > 120;
        
        return (
            <div 
                className="relative w-full h-32 overflow-hidden"
                style={{ 
                    backgroundColor: "rgba(255, 0, 0, 0.02)",
                    border: `1px solid rgba(255, 0, 0, ${isCritical ? 0.4 : 0.15})`,
                }}
            >
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-10">
                    {[...Array(5)].map((_, i) => (
                        <div 
                            key={`h-${i}`}
                            className="absolute w-full h-px"
                            style={{ 
                                top: `${(i + 1) * 20}%`,
                                backgroundColor: "#FF0000",
                            }}
                        />
                    ))}
                </div>
                
                {/* ECG Line */}
                <svg 
                    className="absolute inset-0 w-full h-full"
                    style={{ 
                        filter: isCritical 
                            ? `drop-shadow(0 0 8px rgba(255, 0, 0, 0.8))` 
                            : `drop-shadow(0 0 3px rgba(255, 0, 0, 0.5))`,
                    }}
                >
                    <polyline
                        points={ecgPoints.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke="#FF0000"
                        strokeWidth={isCritical ? "2.5" : "2"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            animation: isPanic ? "ecg-shake 0.1s infinite" : "none",
                        }}
                    />
                </svg>
                
                {/* Critical indicator */}
                {isCritical && (
                    <div 
                        className="absolute top-2 right-2 px-2 py-1 text-[8px] tracking-[0.2em]"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                            color: "#FF0000",
                            animation: "blink 0.3s infinite",
                        }}
                    >
                        CRITICAL
                    </div>
                )}
            </div>
        );
    };
    
    // Render data display
    const renderDataDisplay = () => {
        if (!showOscilloscope) return null;
        
        const isCritical = bpm > 120;
        
        return (
            <div 
                className="grid grid-cols-3 gap-4 mt-6"
                style={{ marginLeft: "2px" }}
            >
                <div className="text-center">
                    <p 
                        className="text-[9px] tracking-[0.2em] mb-1"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        BPM
                    </p>
                    <p 
                        className={`text-3xl font-mono ${isCritical ? 'fear-micro-shake' : ''}`}
                        style={{ 
                            color: isCritical ? "#FF0000" : "rgba(255, 0, 0, 0.9)",
                            textShadow: isCritical ? "0 0 20px rgba(255, 0, 0, 0.5)" : "0 0 10px rgba(255, 0, 0, 0.2)",
                        }}
                    >
                        {bpm}
                    </p>
                </div>
                <div className="text-center">
                    <p 
                        className="text-[9px] tracking-[0.2em] mb-1"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        STRESS
                    </p>
                    <p 
                        className={`text-3xl font-mono ${isCritical ? 'fear-micro-shake' : ''}`}
                        style={{ 
                            color: isCritical ? "#FF0000" : "rgba(255, 0, 0, 0.9)",
                            textShadow: isCritical ? "0 0 20px rgba(255, 0, 0, 0.5)" : "0 0 10px rgba(255, 0, 0, 0.2)",
                        }}
                    >
                        {stress}%
                    </p>
                </div>
                <div className="text-center">
                    <p 
                        className="text-[9px] tracking-[0.2em] mb-1"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        SIGNAL
                    </p>
                    <p 
                        className="text-sm font-mono tracking-wider"
                        style={{ 
                            color: isCritical ? "#FF0000" : "rgba(255, 0, 0, 0.8)",
                        }}
                    >
                        {isCritical ? "CRITICAL" : bpm > 100 ? "UNSTABLE" : "ACTIVE"}
                    </p>
                </div>
            </div>
        );
    };
    
    return (
        <div 
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
            style={{ 
                backgroundColor: "#000000",
                fontFamily: "'JetBrains Mono', monospace",
            }}
        >
            {/* Red flash overlay */}
            {flashActive && (
                <div 
                    className="fixed inset-0 z-50 pointer-events-none"
                    style={{ backgroundColor: "rgba(255, 0, 0, 0.15)" }}
                />
            )}
            
            {/* WOW moment overlay */}
            {wowOverlay && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
                >
                    <div className="text-center">
                        <p 
                            className="text-lg tracking-[0.4em] font-bold"
                            style={{ 
                                color: "#FF0000",
                                textShadow: "0 0 40px rgba(255, 0, 0, 0.8), 0 0 80px rgba(255, 0, 0, 0.4)",
                                animation: "pulse-text 0.5s ease-in-out infinite",
                            }}
                        >
                            CRITICAL FEAR EVENT
                        </p>
                        <p 
                            className="text-[10px] tracking-[0.25em] mt-4"
                            style={{ color: "rgba(255, 0, 0, 0.6)" }}
                        >
                            NO ESCAPE DETECTED
                        </p>
                    </div>
                </div>
            )}
            
            {/* Initial text phases */}
            {(phase === PHASE.BLACK) && (
                <div className="absolute inset-0" style={{ backgroundColor: "#000000" }} />
            )}
            
            {(phase === PHASE.INIT_TEXT) && (
                <div 
                    className="text-center transition-opacity duration-1000"
                    style={{ opacity: textOpacity }}
                >
                    <p 
                        className="text-sm tracking-[0.3em]"
                        style={{ color: "#FF0000" }}
                    >
                        INITIALIZING FEAR METER PROTOCOL
                    </p>
                    <div 
                        className="mt-4 flex items-center justify-center gap-1"
                    >
                        {[0, 1, 2].map(i => (
                            <div 
                                key={i}
                                className="w-1 h-1 rounded-full"
                                style={{ 
                                    backgroundColor: "#FF0000",
                                    animation: `loading-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            {(phase === PHASE.SUBJECT_DETECTED) && (
                <div 
                    className="text-center transition-opacity duration-700"
                    style={{ opacity: textOpacity }}
                >
                    <p 
                        className="text-sm tracking-[0.3em]"
                        style={{ color: "#FF0000" }}
                    >
                        SUBJECT DETECTED
                    </p>
                    <div 
                        className="mt-3 w-2 h-2 rounded-full mx-auto"
                        style={{ 
                            backgroundColor: "#FF0000",
                            animation: "pulse-dot 1s ease-in-out infinite",
                        }}
                    />
                </div>
            )}
            
            {/* Monitoring view */}
            {(phase === PHASE.MONITORING_START || 
              phase === PHASE.RISING_TENSION || 
              phase === PHASE.CRITICAL_BUILDUP ||
              phase === PHASE.RECOVERY) && !wowOverlay && (
                <div className="w-full max-w-md px-6">
                    {/* Header */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ 
                                backgroundColor: "#FF0000",
                                animation: "pulse-dot 2s ease-in-out infinite",
                            }}
                        />
                        <p 
                            className="text-xs tracking-[0.25em]"
                            style={{ color: "rgba(255, 0, 0, 0.7)" }}
                        >
                            FEAR METER
                        </p>
                    </div>
                    
                    {/* Status */}
                    <div className="text-center mb-6">
                        <p 
                            className="text-[9px] tracking-[0.2em]"
                            style={{ color: "rgba(255, 0, 0, 0.5)" }}
                        >
                            {bpm > 120 ? "FEAR PATTERN IDENTIFIED" : "MONITORING SUBJECT"}
                        </p>
                    </div>
                    
                    {/* Oscilloscope */}
                    {renderOscilloscope()}
                    
                    {/* Data */}
                    {renderDataDisplay()}
                </div>
            )}
            
            {/* Final message */}
            {finalMessage && (
                <div 
                    className="text-center px-8"
                    style={{ animation: "fade-in 2s ease-out forwards" }}
                >
                    <p 
                        className="text-sm tracking-[0.15em] leading-loose"
                        style={{ color: "#FF0000" }}
                    >
                        THIS DATA IS REAL.
                    </p>
                    <p 
                        className="text-sm tracking-[0.15em] leading-loose mt-2"
                        style={{ color: "#FF0000" }}
                    >
                        THE FEAR IS NOT SIMULATED.
                    </p>
                    <p 
                        className="text-sm tracking-[0.15em] leading-loose mt-2"
                        style={{ color: "#FF0000" }}
                    >
                        ONLY THE SUBJECT IS.
                    </p>
                    
                    {/* Restart hint */}
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-12 text-[8px] tracking-[0.2em] transition-opacity duration-300"
                        style={{ 
                            color: "rgba(176, 176, 176, 0.3)",
                            opacity: 0,
                            animation: "fade-in 1s ease-out 3s forwards",
                        }}
                    >
                        TAP TO RESTART DEMO
                    </button>
                </div>
            )}
            
            {/* Exit button (subtle) */}
            <button
                onClick={() => navigate("/")}
                className="fixed bottom-4 right-4 text-[8px] tracking-[0.15em] py-1 px-2 transition-opacity duration-300"
                style={{ 
                    color: "rgba(176, 176, 176, 0.2)",
                    border: "1px solid rgba(176, 176, 176, 0.1)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255, 0, 0, 0.4)";
                    e.currentTarget.style.borderColor = "rgba(255, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(176, 176, 176, 0.2)";
                    e.currentTarget.style.borderColor = "rgba(176, 176, 176, 0.1)";
                }}
            >
                EXIT
            </button>
            
            {/* CSS Animations */}
            <style>{`
                @keyframes loading-dot {
                    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                    40% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.3); }
                }
                @keyframes pulse-text {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes ecg-shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-1px); }
                    75% { transform: translateX(1px); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
};

export default InvestorDemo;
