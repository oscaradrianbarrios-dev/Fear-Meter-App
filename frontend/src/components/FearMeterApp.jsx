import { useState, useCallback } from "react";
import Header from "./Header";
import Monitor from "./Monitor";
import WatchMode from "./WatchMode";
import History from "./History";
import SideMenu from "./SideMenu";
import CriticalAlert from "./CriticalAlert";
import { useBiometricSimulation } from "@/hooks/useBiometricSimulation";
import { useSessionManager } from "@/hooks/useSessionManager";

export const FearMeterApp = () => {
    const [currentView, setCurrentView] = useState("monitor");
    const [menuOpen, setMenuOpen] = useState(false);
    const [language, setLanguage] = useState("EN");
    const [showCriticalAlert, setShowCriticalAlert] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);

    const {
        bpm,
        stress,
        signal,
        isActive,
        isPanic,
        startSimulation,
        stopSimulation,
        triggerTap,
    } = useBiometricSimulation({
        onPanic: () => {
            if (!isBlocked) {
                setShowCriticalAlert(true);
                setIsBlocked(true);
                
                // Vibrate if supported
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200]);
                }
                
                // Block UI for 1 second
                setTimeout(() => {
                    setShowCriticalAlert(false);
                    setIsBlocked(false);
                }, 1000);
            }
        },
    });

    const {
        sessions,
        currentSession,
        startSession,
        endSession,
        clearHistory,
    } = useSessionManager();

    const handleStartStop = useCallback(() => {
        if (isActive) {
            stopSimulation();
            endSession(bpm, stress);
        } else {
            startSimulation();
            startSession();
        }
    }, [isActive, stopSimulation, startSimulation, endSession, startSession, bpm, stress]);

    const handleViewChange = useCallback((view) => {
        setCurrentView(view);
        setMenuOpen(false);
    }, []);

    const handleLanguageChange = useCallback((lang) => {
        setLanguage(lang);
    }, []);

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
            className="min-h-screen bg-fear-black font-fear flex flex-col relative overflow-hidden"
            onClick={isActive && !isBlocked ? triggerTap : undefined}
        >
            {showCriticalAlert && <CriticalAlert text={t.criticalAlert} />}
            
            <Header 
                onMenuOpen={() => setMenuOpen(true)} 
            />

            <main className="flex-1 flex flex-col px-4 pb-4">
                {currentView === "monitor" && (
                    <Monitor
                        bpm={bpm}
                        stress={stress}
                        signal={signal}
                        isActive={isActive}
                        isPanic={isPanic}
                        onStartStop={handleStartStop}
                        texts={t}
                        isBlocked={isBlocked}
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
                        texts={t}
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
                    {t.footer}
                </p>
                <p 
                    className="text-[9px] mt-1"
                    style={{ color: "rgba(176, 176, 176, 0.2)" }}
                >
                    {t.footerSub}
                </p>
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

export default FearMeterApp;
