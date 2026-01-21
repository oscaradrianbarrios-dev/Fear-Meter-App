import { X, Activity, Watch, History, Globe, Info, Play, Target, Moon, BookOpen, Glasses, Trophy, User, Share2, Film, Settings, Vibrate } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import SoundToggle from "./SoundToggle";
import { LANGUAGES } from "@/i18n/translations";
import { useSettings } from "@/contexts/SettingsContext";

export const SideMenu = ({
    isOpen,
    onClose,
    currentView,
    onViewChange,
    language,
    onLanguageChange,
    texts,
    showDemoOption = false,
    onDemoActivate,
    isCalibrated = false,
    onCalibrationOpen,
    onAdvancedCalibrationOpen,
    advancedCalibrationData,
}) => {
    const navigate = useNavigate();
    const { hapticEnabled, toggleHaptic } = useSettings();
    const [isVisible, setIsVisible] = useState(false);
    const [itemsReady, setItemsReady] = useState(false);
    const [translateX, setTranslateX] = useState(-100);
    const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
    const menuRef = useRef(null);

    // Trigger haptic on menu interaction if supported
    const triggerHaptic = () => {
        if (hapticEnabled && navigator.vibrate) {
            navigator.vibrate(15);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Slow, deliberate slide in (300ms) - more unsettling
            requestAnimationFrame(() => {
                setTranslateX(0);
            });
            const timer = setTimeout(() => setItemsReady(true), 300);
            return () => clearTimeout(timer);
        } else {
            setTranslateX(-100);
            setItemsReady(false);
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const menuItems = [
        { id: "monitor", icon: Activity, label: texts.monitor },
        { id: "watch", icon: Watch, label: texts.watchMode },
        { id: "history", icon: History, label: texts.history },
    ];

    // Get current language native name
    const currentLangInfo = LANGUAGES[language] || LANGUAGES.EN;

    const handleLanguageSelectorOpen = () => {
        setLanguageSelectorOpen(true);
    };

    const handleLanguageSelectorClose = () => {
        setLanguageSelectorOpen(false);
    };

    const handleLanguageSelect = (langCode) => {
        onLanguageChange(langCode);
        setLanguageSelectorOpen(false);
    };

    return (
        <>
            {/* Overlay - fade from absolute black */}
            <div 
                className="fixed inset-0 z-50"
                style={{ 
                    backgroundColor: "rgba(0, 0, 0, 0.97)",
                    opacity: isOpen ? 1 : 0,
                    transition: "opacity 300ms ease-out",
                }}
                onClick={onClose}
            />
            
            {/* Menu Panel - slow slide from LEFT */}
            <div 
                ref={menuRef}
                className="fixed top-0 left-0 h-full w-64 z-50"
                style={{ 
                    backgroundColor: "#000000",
                    borderRight: "1px solid rgba(255, 0, 0, 0.4)",
                    boxShadow: "2px 0 20px rgba(255, 0, 0, 0.3)",
                    transform: `translateX(${translateX}%)`,
                    transition: "transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
            >
                {/* Header - minimal */}
                <div 
                    className="flex items-center justify-between p-4"
                    style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.3)" }}
                >
                    <span 
                        className="text-[9px] tracking-[0.3em] uppercase"
                        style={{ 
                            color: "rgba(255, 0, 0, 0.8)",
                            textShadow: "0 0 5px rgba(255, 0, 0, 0.5)",
                            opacity: itemsReady ? 1 : 0,
                            transition: "opacity 200ms ease-out",
                        }}
                    >
                        SYSTEM
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1"
                        style={{ 
                            color: "#FF0000",
                            textShadow: "0 0 8px rgba(255, 0, 0, 0.8)",
                        }}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="py-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left"
                            style={{ 
                                color: currentView === item.id ? "#FF0000" : "rgba(255, 0, 0, 0.9)",
                                backgroundColor: currentView === item.id ? "rgba(255, 0, 0, 0.15)" : "transparent",
                                borderLeft: currentView === item.id ? "1px solid rgba(255, 0, 0, 1)" : "1px solid transparent",
                                textShadow: currentView === item.id ? "0 0 8px rgba(255, 0, 0, 0.8)" : "none",
                                opacity: itemsReady ? 1 : 0,
                                transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                                transition: `all 250ms ease-out ${index * 60}ms`,
                            }}
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="text-[11px] tracking-[0.15em]">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.3)" }} />

                {/* Language Selection */}
                <button
                    onClick={handleLanguageSelectorOpen}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(255, 0, 0, 0.9)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 200ms",
                    }}
                    data-testid="language-menu-button"
                >
                    <Globe className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">{texts.language}</span>
                    <span 
                        className="ml-auto text-[9px] tracking-wider"
                        style={{ color: "rgba(255, 0, 0, 0.8)" }}
                    >
                        {currentLangInfo.nativeName}
                    </span>
                </button>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.3)" }} />

                {/* Calibration Option */}
                <button
                    onClick={() => { triggerHaptic(); onCalibrationOpen(); }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: isCalibrated ? "rgba(255, 0, 0, 0.8)" : "rgba(255, 0, 0, 0.9)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 240ms",
                    }}
                >
                    <Target className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">{texts.calibration || "Calibration"}</span>
                    {isCalibrated && (
                        <span 
                            className="ml-auto text-[7px] tracking-[0.1em] px-1.5 py-0.5"
                            style={{ 
                                backgroundColor: "rgba(255, 0, 0, 0.3)",
                                color: "#FF0000",
                                border: "1px solid rgba(255, 0, 0, 0.3)",
                                boxShadow: "0 0 8px rgba(255, 0, 0, 0.5)",
                            }}
                        >
                            ACTIVE
                        </span>
                    )}
                </button>

                {/* Advanced Calibration Option */}
                <button
                    onClick={() => { triggerHaptic(); onAdvancedCalibrationOpen && onAdvancedCalibrationOpen(); }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: advancedCalibrationData ? "rgba(255, 0, 0, 0.8)" : "rgba(255, 0, 0, 0.9)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 260ms",
                    }}
                >
                    <Settings className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">
                        {language === "ES" ? "Calibración Avanzada" : "Advanced Calibration"}
                    </span>
                    {advancedCalibrationData && (
                        <span 
                            className="ml-auto text-[7px] tracking-[0.1em] px-1.5 py-0.5"
                            style={{ 
                                backgroundColor: "rgba(255, 0, 0, 0.3)",
                                color: "#FF0000",
                                border: "1px solid rgba(255, 0, 0, 0.3)",
                                boxShadow: "0 0 8px rgba(255, 0, 0, 0.5)",
                            }}
                        >
                            {Object.keys(advancedCalibrationData.modes || {}).length}/4
                        </span>
                    )}
                </button>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.3)" }} />

                {/* Nightmare Protocol */}
                <button
                    onClick={() => {
                        onClose();
                        navigate("/nightmare");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(255, 0, 0, 0.9)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 280ms",
                    }}
                >
                    <Moon className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">{texts.nightmare || "Nightmare Protocol"}</span>
                </button>

                {/* Fear Library */}
                <button
                    onClick={() => {
                        onClose();
                        navigate("/library");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(255, 0, 0, 0.9)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 320ms",
                    }}
                >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">Fear Library</span>
                </button>

                {/* Movie Session */}
                <button
                    onClick={() => {
                        onClose();
                        navigate("/movie-session");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(255, 0, 0, 0.9)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 340ms",
                    }}
                >
                    <Film className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">Movie Session</span>
                </button>

                {/* VR Experience */}
                <button
                    onClick={() => {
                        onClose();
                        navigate("/vr");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(255, 0, 0, 0.9)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 360ms",
                    }}
                >
                    <Glasses className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">VR Experience</span>
                </button>

                {/* Fear Challenge */}
                <button
                    onClick={() => {
                        onClose();
                        navigate("/challenge");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(255, 0, 0, 0.9)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 380ms",
                    }}
                >
                    <Trophy className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">Fear Challenge</span>
                </button>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.3)" }} />

                {/* Biometric Profile */}
                <button
                    onClick={() => {
                        onClose();
                        navigate("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(255, 0, 0, 0.9)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 400ms",
                    }}
                >
                    <User className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">Biometric Profile</span>
                </button>

                {/* Share Fear */}
                <button
                    onClick={() => {
                        onClose();
                        navigate("/share");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(255, 0, 0, 0.9)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 420ms",
                    }}
                >
                    <Share2 className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">Share Fear</span>
                </button>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.3)" }} />

                {/* Sound Toggle */}
                <div
                    style={{ 
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 440ms",
                    }}
                >
                    <SoundToggle />
                </div>

                {/* Haptic Toggle */}
                <button
                    onClick={() => { triggerHaptic(); toggleHaptic(); }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: hapticEnabled ? "#FF0000" : "rgba(255, 0, 0, 0.8)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 460ms",
                    }}
                >
                    <Vibrate className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">
                        {language === "ES" ? "Vibración Háptica" : "Haptic Feedback"}
                    </span>
                    <span 
                        className="ml-auto text-[8px] tracking-[0.1em]"
                        style={{ 
                            color: hapticEnabled 
                                ? "#FF0000"
                                : "rgba(176, 176, 176, 0.4)",
                            textShadow: hapticEnabled 
                                ? "0 0 8px rgba(255, 0, 0, 0.8)"
                                : "none",
                        }}
                    >
                        {hapticEnabled ? "ON" : "OFF"}
                    </span>
                </button>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.3)" }} />

                {/* About */}
                <button
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(255, 0, 0, 0.8)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 460ms",
                    }}
                >
                    <Info className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">{texts.about}</span>
                </button>

                {/* Demo Mode Option - Hidden by default */}
                {showDemoOption && (
                    <>
                        <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.3)" }} />
                        <button
                            onClick={onDemoActivate}
                            className="w-full flex items-center gap-3 px-4 py-3"
                            style={{ 
                                color: "rgba(255, 0, 0, 0.8)",
                                opacity: itemsReady ? 1 : 0,
                                transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                                transition: "all 250ms ease-out 360ms",
                            }}
                        >
                            <Play className="w-4 h-4" />
                            <span className="text-[11px] tracking-[0.15em]">Demo Mode</span>
                        </button>
                    </>
                )}

                {/* Footer */}
                <div 
                    className="absolute bottom-0 left-0 right-0 p-4"
                    style={{ 
                        borderTop: "1px solid rgba(255, 0, 0, 0.08)",
                        opacity: itemsReady ? 1 : 0,
                        transition: "opacity 300ms ease-out 400ms",
                    }}
                >
                    <div className="text-center">
                        <div 
                            className="text-[8px] tracking-[0.2em]" 
                            style={{ 
                                color: "rgba(255, 0, 0, 0.3)",
                                textShadow: "0 0 5px rgba(255, 0, 0, 0.4)",
                            }}
                        >
                            FEAR METER v1.0
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Selector Modal */}
            <LanguageSelector
                isOpen={languageSelectorOpen}
                onClose={handleLanguageSelectorClose}
                currentLanguage={language}
                onLanguageChange={handleLanguageSelect}
            />
        </>
    );
};

export default SideMenu;
