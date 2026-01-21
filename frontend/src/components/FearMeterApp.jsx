import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Monitor from "./Monitor";
import WatchMode from "./WatchMode";
import History from "./History";
import SideMenu from "./SideMenu";
import { useBiometricSimulation } from "@/hooks/useBiometricSimulation";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useLanguage } from "@/contexts/LanguageContext";

export const FearMeterApp = () => {
    const navigate = useNavigate();
    const { language, setLanguage, texts } = useLanguage();
    const [currentView, setCurrentView] = useState("monitor");
    const [menuOpen, setMenuOpen] = useState(false);

    const { bpm, stress, signal, isActive, isPanic, isRecovering, startSimulation, stopSimulation, triggerTap } = useBiometricSimulation({});
    const { sessions, startSession, endSession, clearHistory } = useSessionManager();

    const handleStartStop = useCallback(() => {
        if (isActive) { stopSimulation(); endSession(); }
        else { startSimulation(); startSession(); }
    }, [isActive, stopSimulation, startSimulation, endSession, startSession]);

    return (
        <div 
            style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", flexDirection: "column" }}
            onClick={isActive ? triggerTap : undefined}
        >
            <Header onMenuOpen={() => setMenuOpen(true)} />
            
            <main style={{ flex: 1, padding: "16px" }}>
                {currentView === "monitor" && (
                    <Monitor bpm={bpm} stress={stress} signal={signal} isActive={isActive} isPanic={isPanic} isRecovering={isRecovering} onStartStop={handleStartStop} texts={texts} />
                )}
                {currentView === "watch" && <WatchMode bpm={bpm} stress={stress} isActive={isActive} isPanic={isPanic} />}
                {currentView === "history" && <History sessions={sessions} texts={texts} onClear={clearHistory} />}
            </main>

            <footer style={{ padding: "16px", textAlign: "center", borderTop: "1px solid #333" }}>
                <p style={{ color: "#666", fontSize: "10px" }}>© 2026 FEAR METER — ALL RIGHTS RESERVED</p>
            </footer>

            <SideMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                currentView={currentView}
                onViewChange={(v) => { setCurrentView(v); setMenuOpen(false); }}
                language={language}
                onLanguageChange={setLanguage}
                texts={texts}
            />
        </div>
    );
};

export default FearMeterApp;
