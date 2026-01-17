import { X, Activity, Watch, History, Globe, Info, Play } from "lucide-react";
import { useEffect, useState, useRef } from "react";

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
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [itemsReady, setItemsReady] = useState(false);
    const [translateX, setTranslateX] = useState(-100);
    const menuRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Smooth slide in (200-250ms)
            requestAnimationFrame(() => {
                setTranslateX(0);
            });
            const timer = setTimeout(() => setItemsReady(true), 200);
            return () => clearTimeout(timer);
        } else {
            setTranslateX(-100);
            setItemsReady(false);
            const timer = setTimeout(() => setIsVisible(false), 250);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const menuItems = [
        { id: "monitor", icon: Activity, label: texts.monitor },
        { id: "watch", icon: Watch, label: texts.watchMode },
        { id: "history", icon: History, label: texts.history },
    ];

    const languageOptions = [
        { code: "EN", label: "English", flag: "🇺🇸" },
        { code: "ES", label: "Español", flag: "🇪🇸" },
    ];

    return (
        <>
            {/* Overlay - fade from absolute black */}
            <div 
                className={`fixed inset-0 z-50 transition-opacity duration-250`}
                style={{ 
                    backgroundColor: "rgba(0, 0, 0, 0.95)",
                    opacity: isOpen ? 1 : 0,
                }}
                onClick={onClose}
            />
            
            {/* Menu Panel - slide from LEFT */}
            <div 
                ref={menuRef}
                className="fixed top-0 left-0 h-full w-64 z-50"
                style={{ 
                    backgroundColor: "#000000",
                    borderRight: "1px solid rgba(255, 0, 0, 0.15)",
                    transform: `translateX(${translateX}%)`,
                    transition: "transform 220ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                {/* Header */}
                <div 
                    className="flex items-center justify-between p-4"
                    style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.1)" }}
                >
                    <span 
                        className="text-[10px] tracking-[0.3em] uppercase"
                        style={{ 
                            color: "#B0B0B0",
                            opacity: itemsReady ? 1 : 0,
                            transition: "opacity 150ms ease-out",
                        }}
                    >
                        SYSTEM ACCESS
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1 transition-colors duration-200"
                        style={{ color: "#B0B0B0" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#FF0000"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#B0B0B0"}
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
                            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                            style={{ 
                                color: currentView === item.id ? "#FF0000" : "#B0B0B0",
                                backgroundColor: currentView === item.id ? "rgba(255, 0, 0, 0.05)" : "transparent",
                                borderLeft: currentView === item.id ? "2px solid rgba(255, 0, 0, 0.6)" : "2px solid transparent",
                                opacity: itemsReady ? 1 : 0,
                                transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                                transition: `all 200ms ease-out ${index * 50}ms`,
                            }}
                            onMouseEnter={(e) => {
                                if (currentView !== item.id) {
                                    e.currentTarget.style.color = "#FF0000";
                                    e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.03)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentView !== item.id) {
                                    e.currentTarget.style.color = "#B0B0B0";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }
                            }}
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="text-xs tracking-[0.15em]">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.08)" }} />

                {/* Language Selection */}
                <div 
                    className="px-4 py-3"
                    style={{ 
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 200ms ease-out 200ms",
                    }}
                >
                    <div className="flex items-center gap-3 mb-3" style={{ color: "#B0B0B0" }}>
                        <Globe className="w-4 h-4" />
                        <span className="text-xs tracking-[0.15em]">{texts.language}</span>
                    </div>
                    <div className="ml-7 space-y-1">
                        {languageOptions.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => onLanguageChange(lang.code)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded transition-all duration-200 text-left"
                                style={{
                                    color: language === lang.code ? "#FF0000" : "rgba(176, 176, 176, 0.5)",
                                    backgroundColor: language === lang.code ? "rgba(255, 0, 0, 0.05)" : "transparent",
                                }}
                            >
                                <span className="text-[10px]">{lang.flag}</span>
                                <span className="text-[11px] tracking-wider">{lang.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.08)" }} />

                {/* About */}
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200"
                    style={{ 
                        color: "#B0B0B0",
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateX(0)" : "translateX(-10px)",
                        transition: "all 200ms ease-out 250ms",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#FF0000";
                        e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.03)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#B0B0B0";
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                >
                    <Info className="w-4 h-4" />
                    <span className="text-xs tracking-[0.15em]">{texts.about}</span>
                </button>

                {/* Demo Mode Option - Hidden by default */}
                {showDemoOption && (
                    <>
                        <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.08)" }} />
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
                        borderTop: "1px solid rgba(255, 0, 0, 0.08)",
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
        </>
    );
};

export default SideMenu;
