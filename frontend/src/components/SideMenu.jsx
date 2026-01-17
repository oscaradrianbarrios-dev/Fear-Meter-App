import { X, Activity, Watch, History, Globe, Info } from "lucide-react";
import { useEffect, useState } from "react";

export const SideMenu = ({
    isOpen,
    onClose,
    currentView,
    onViewChange,
    language,
    onLanguageChange,
    texts,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [itemsReady, setItemsReady] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Stagger item reveal
            const timer = setTimeout(() => setItemsReady(true), 150);
            return () => clearTimeout(timer);
        } else {
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

    return (
        <>
            {/* Overlay - fade from absolute black */}
            <div 
                className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
                onClick={onClose}
            />
            
            {/* Menu Panel - reveal with blur */}
            <div 
                className={`fixed top-0 right-0 h-full w-64 bg-fear-black z-50 ${
                    isOpen ? "menu-reveal" : "opacity-0"
                }`}
                style={{ 
                    backgroundColor: "#000000",
                    borderLeft: "1px solid rgba(255, 0, 0, 0.15)"
                }}
            >
                {/* Header */}
                <div 
                    className="flex items-center justify-between p-4"
                    style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.1)" }}
                >
                    <span 
                        className="text-[10px] tracking-[0.3em] uppercase menu-item-stagger"
                        style={{ 
                            color: "#B0B0B0",
                            animationDelay: itemsReady ? "0ms" : "9999ms"
                        }}
                    >
                        SYSTEM ACCESS
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1 transition-colors duration-300"
                        style={{ color: "#B0B0B0" }}
                        onMouseEnter={(e) => e.target.style.color = "#FF0000"}
                        onMouseLeave={(e) => e.target.style.color = "#B0B0B0"}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Navigation Items - staggered reveal */}
                <nav className="py-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-300 menu-item-stagger ${
                                currentView === item.id ? "" : ""
                            }`}
                            style={{ 
                                color: currentView === item.id ? "#FF0000" : "#B0B0B0",
                                backgroundColor: currentView === item.id ? "rgba(255, 0, 0, 0.05)" : "transparent",
                                borderRight: currentView === item.id ? "2px solid rgba(255, 0, 0, 0.6)" : "2px solid transparent",
                                animationDelay: itemsReady ? `${80 + index * 100}ms` : "9999ms"
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
                    className="px-4 py-3 menu-item-stagger"
                    style={{ animationDelay: itemsReady ? "380ms" : "9999ms" }}
                >
                    <div className="flex items-center gap-3 mb-3" style={{ color: "#B0B0B0" }}>
                        <Globe className="w-4 h-4" />
                        <span className="text-xs tracking-[0.15em]">{texts.language}</span>
                    </div>
                    <div className="flex gap-2 ml-7">
                        <button
                            onClick={() => onLanguageChange("EN")}
                            className="px-3 py-1.5 text-[10px] tracking-wider rounded transition-colors duration-300"
                            style={{
                                border: language === "EN" ? "1px solid rgba(255, 0, 0, 0.5)" : "1px solid rgba(176, 176, 176, 0.2)",
                                color: language === "EN" ? "#FF0000" : "#B0B0B0",
                                backgroundColor: language === "EN" ? "rgba(255, 0, 0, 0.05)" : "transparent"
                            }}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => onLanguageChange("ES")}
                            className="px-3 py-1.5 text-[10px] tracking-wider rounded transition-colors duration-300"
                            style={{
                                border: language === "ES" ? "1px solid rgba(255, 0, 0, 0.5)" : "1px solid rgba(176, 176, 176, 0.2)",
                                color: language === "ES" ? "#FF0000" : "#B0B0B0",
                                backgroundColor: language === "ES" ? "rgba(255, 0, 0, 0.05)" : "transparent"
                            }}
                        >
                            ES
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="mx-4 my-2" style={{ borderTop: "1px solid rgba(255, 0, 0, 0.08)" }} />

                {/* About */}
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-300 menu-item-stagger"
                    style={{ 
                        color: "#B0B0B0",
                        animationDelay: itemsReady ? "480ms" : "9999ms"
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

                {/* Footer */}
                <div 
                    className="absolute bottom-0 left-0 right-0 p-4 menu-item-stagger"
                    style={{ 
                        borderTop: "1px solid rgba(255, 0, 0, 0.08)",
                        animationDelay: itemsReady ? "580ms" : "9999ms"
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
