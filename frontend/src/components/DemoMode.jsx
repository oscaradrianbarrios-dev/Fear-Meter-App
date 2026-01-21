import { useState, useCallback, useRef, useEffect } from "react";
import Header from "./Header";
import Monitor from "./Monitor";
import WatchMode from "./WatchMode";
import History from "./History";
import SideMenu from "./SideMenu";
import CriticalAlert from "./CriticalAlert";
import PanicOverlay from "./PanicOverlay";
import { useBiometricSimulation } from "@/hooks/useBiometricSimulation";
import { useSessionManager } from "@/hooks/useSessionManager";

// Preloaded demo sessions for investors
const DEMO_SESSIONS = [
    {
        id: 1,
        name: "Night Terror",
        date: "Jan 15, 2026, 11:45 PM",
        maxBpm: 128,
        maxStress: 85,
    },
    {
        id: 2,
        name: "Shadow Encounter",
        date: "Jan 14, 2026, 10:30 PM",
        maxBpm: 115,
        maxStress: 69,
    },
    {
        id: 3,
        name: "Dark Vision",
        date: "Jan 13, 2026, 9:15 PM",
        maxBpm: 122,
        maxStress: 78,
    },
    {
        id: 4,
        name: "Fear Response",
        date: "Jan 12, 2026, 11:00 PM",
        maxBpm: 108,
        maxStress: 60,
    },
    {
        id: 5,
        name: "Panic Episode",
        date: "Jan 11, 2026, 10:00 PM",
        maxBpm: 135,
        maxStress: 94,
    },
];

export const DemoMode = () => {
    const [currentView, setCurrentView] = useState("monitor");
    const [menuOpen, setMenuOpen] = useState(false);
    const [language, setLanguage] = useState("EN");
    const [showCriticalMessage, setShowCriticalMessage] = useState(false);
    const [panicActive, setPanicActive] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [demoSessions, setDemoSessions] = useState(DEMO_SESSIONS);
    const panicTimeoutRef = useRef(null);
    const containerRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });

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
        isDemo: true, // More stable BPM (70-110), controlled panic
        onPanicStart: () => {
            setIsBlocked(true);
            setPanicActive(true);
            
            panicTimeoutRef.current = setTimeout(() => {
                setShowCriticalMessage(true);
            }, 520);
        },
        onPanicEnd: () => {},
    });

    const handlePanicSequenceComplete = useCallback(() => {
        setTimeout(() => {
            setPanicActive(false);
            setShowCriticalMessage(false);
            setIsBlocked(false);
        }, 300);
    }, []);

    const handleStartStop = useCallback(() => {
        if (isActive) {
            stopSimulation();
            // Add session to demo history
            const newSession = {
                id: Date.now(),
                name: ["Night Terror", "Shadow Encounter", "Dark Vision", "Fear Response"][Math.floor(Math.random() * 4)],
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                maxBpm: Math.max(bpm, 95),
                maxStress: Math.max(stress, 45),
            };
            setDemoSessions(prev => [newSession, ...prev].slice(0, 10));
        } else {
            startSimulation();
        }
    }, [isActive, stopSimulation, startSimulation, bpm, stress]);

    const handleViewChange = useCallback((view) => {
        setCurrentView(view);
        setMenuOpen(false);
    }, []);

    const handleLanguageChange = useCallback((lang) => {
        setLanguage(lang);
    }, []);

    const handleClearHistory = useCallback(() => {
        setDemoSessions([]);
    }, []);

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
        
        if (touchStartRef.current.x < 30 && deltaX > 50 && deltaY < 50 && !isBlocked) {
            setMenuOpen(true);
        }
    }, [isBlocked]);

    const texts = {
        EN: {
            monitor: "Monitor",
            watchMode: "Watch Mode",
            history: "History",
            language: "Language",
            about: "About / Legal",
            startSession: "START SESSION",
            stopSession: "STOP SESSION",
            bpm: "BPM",
            stress: "STRESS",
            signal: "SIGNAL",
            active: "ACTIVE",
            unstable: "UNSTABLE",
            critical: "CRITICAL",
            criticalAlert: "CRITICAL STRESS DETECTED",
            noSessions: "NO SESSIONS RECORDED",
            maxBpm: "MAX BPM",
            maxStress: "MAX STRESS",
            footer: "© 2026 FEAR METER",
            footerSub: "Experimental Biometric Horror System",
        },
        ES: {
            monitor: "Monitor",
            watchMode: "Modo Reloj",
            history: "Historial",
            language: "Idioma",
            about: "Acerca de / Legal",
            startSession: "INICIAR SESIÓN",
            stopSession: "DETENER SESIÓN",
            bpm: "BPM",
            stress: "ESTRÉS",
            signal: "SEÑAL",
            active: "ACTIVO",
            unstable: "INESTABLE",
            critical: "CRÍTICO",
            criticalAlert: "ESTRÉS CRÍTICO DETECTADO",
            noSessions: "SIN SESIONES REGISTRADAS",
            maxBpm: "BPM MÁX",
            maxStress: "ESTRÉS MÁX",
            footer: "© 2026 FEAR METER",
            footerSub: "Sistema Biométrico de Horror Experimental",
        },
    };

    const t = texts[language];

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
            />

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
                        texts={t}
                        isBlocked={isBlocked}
                        isDemo={true}
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
                        sessions={demoSessions}
                        texts={t}
                        onClear={handleClearHistory}
                    />
                )}
            </main>

            <footer 
                className="py-4 text-center relative"
                style={{ borderTop: "1px solid rgba(255, 85, 85, 0.08)" }}
            >
                <p 
                    className="text-[10px] tracking-[0.25em]"
                    style={{ color: "rgba(176, 176, 176, 0.35)" }}
                >
                    {t.footer}
                </p>
                <p 
                    className="text-[9px] mt-1"
                    style={{ color: "rgba(176, 176, 176, 0.2)" }}
                >
                    {t.footerSub}
                </p>
                
                {/* Discrete Demo Mode indicator - bottom right corner */}
                <div 
                    className="absolute bottom-2 right-3"
                    style={{ 
                        color: "rgba(255, 85, 85, 0.4)",
                        fontSize: "8px",
                        letterSpacing: "0.15em",
                    }}
                >
                    DEMO MODE
                </div>
            </footer>

            <SideMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                currentView={currentView}
                onViewChange={handleViewChange}
                language={language}
                onLanguageChange={handleLanguageChange}
                texts={t}
            />
        </div>
    );
};

export default DemoMode;
