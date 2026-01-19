import { X, Activity, Watch, History, Globe, Info, Play, Target, Moon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGES } from "@/i18n/translations";

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
}) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [itemsReady, setItemsReady] = useState(false);
    const [translateX, setTranslateX] = useState(-100);
    const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
    const menuRef = useRef(null);

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
                    borderRight: "1px solid rgba(139, 0, 0, 0.1)",
                    transform: `translateX(${translateX}%)`,
                    transition: "transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
            >
                {/* Header - minimal */}
                <div 
                    className="flex items-center justify-between p-4"
                    style={{ borderBottom: "1px solid rgba(139, 0, 0, 0.05)" }}
                >
                    <span 
                        className="text-[9px] tracking-[0.3em] uppercase"
                        style={{ 
                            color: "rgba(139, 0, 0, 0.4)",
                            opacity: itemsReady ? 1 : 0,
                            transition: "opacity 200ms ease-out",
                        }}
                    >
                        SYSTEM
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1"
                        style={{ color: "rgba(139, 0, 0, 0.4)" }}
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
                                color: currentView === item.id ? "#8B0000" : "rgba(139, 0, 0, 0.5)",
                                backgroundColor: currentView === item.id ? "rgba(139, 0, 0, 0.03)" : "transparent",
                                borderLeft: currentView === item.id ? "1px solid rgba(139, 0, 0, 0.4)" : "1px solid transparent",
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
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(139, 0, 0, 0.05)" }} />

                {/* Language Selection */}
                <button
                    onClick={handleLanguageSelectorOpen}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(139, 0, 0, 0.5)",
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
                        style={{ color: "rgba(139, 0, 0, 0.4)" }}
                    >
                        {currentLangInfo.nativeName}
                    </span>
                </button>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(139, 0, 0, 0.05)" }} />

                {/* Calibration Option */}
                <button
                    onClick={onCalibrationOpen}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: isCalibrated ? "rgba(139, 0, 0, 0.4)" : "rgba(139, 0, 0, 0.5)",
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
                                backgroundColor: "rgba(139, 0, 0, 0.05)",
                                color: "rgba(139, 0, 0, 0.4)",
                                border: "1px solid rgba(139, 0, 0, 0.1)",
                            }}
                        >
                            ACTIVE
                        </span>
                    )}
                </button>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(139, 0, 0, 0.05)" }} />

                {/* Nightmare Protocol */}
                <button
                    onClick={() => {
                        onClose();
                        navigate("/nightmare");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(139, 0, 0, 0.5)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 280ms",
                    }}
                >
                    <Moon className="w-4 h-4" />
                    <span className="text-[11px] tracking-[0.15em]">{texts.nightmare || "Nightmare Protocol"}</span>
                </button>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(139, 0, 0, 0.05)" }} />

                {/* About */}
                <button
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ 
                        color: "rgba(139, 0, 0, 0.4)",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 250ms ease-out 320ms",
                    }}
                >
                    <Info className="w-4 h-4" />
                    <span className="text-xs tracking-[0.15em]">{texts.about}</span>
                </button>

                {/* Demo Mode Option - Hidden by default */}
                {showDemoOption && (
                    <>
                        <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(139, 0, 0, 0.05)" }} />
                        <button
                            onClick={onDemoActivate}
                            className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200"
                            style={{ 
                                color: "rgba(139, 0, 0, 0.7)",
                                opacity: itemsReady ? 1 : 0,
                                transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                                transition: "all 200ms ease-out 300ms",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#8B0000";
                                e.currentTarget.style.backgroundColor = "rgba(139, 0, 0, 0.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "rgba(139, 0, 0, 0.7)";
                                e.currentTarget.style.backgroundColor = "transparent";
                            }}
                        >
                            <Play className="w-4 h-4" />
                            <span className="text-xs tracking-[0.15em]">Demo Mode</span>
                        </button>
                    </>
                )}

                {/* Footer */}
                <div 
                    className="absolute bottom-0 left-0 right-0 p-4"
                    style={{ 
                        borderTop: "1px solid rgba(139, 0, 0, 0.05)",
                        opacity: itemsReady ? 1 : 0,
                        transition: "opacity 200ms ease-out 350ms",
                    }}
                >
                    <div className="text-center">
                        <div className="text-[9px] tracking-[0.2em]" style={{ color: "rgba(176, 176, 176, 0.3)" }}>
                            FEAR METER v1.0
                        </div>
                        <div className="text-[8px] mt-1" style={{ color: "rgba(176, 176, 176, 0.2)" }}>
                            RESTRICTED ACCESS
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
