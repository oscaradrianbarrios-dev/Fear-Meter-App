import { X, Activity, Watch, History, Globe, Moon, BookOpen, Film, Glasses, Trophy, User, Share2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LANGUAGES } from "@/i18n/translations";

export const SideMenu = ({ isOpen, onClose, currentView, onViewChange, language, onLanguageChange, texts }) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);

    useEffect(() => {
        if (isOpen) setVisible(true);
        else {
            setShowLangMenu(false);
            setTimeout(() => setVisible(false), 300);
        }
    }, [isOpen]);

    if (!visible) return null;

    const menuItems = [
        { id: "monitor", icon: Activity, label: texts.monitor || "Monitor", action: () => onViewChange("monitor") },
        { id: "watch", icon: Watch, label: texts.watchMode || "Watch Mode", action: () => onViewChange("watch") },
        { id: "history", icon: History, label: texts.history || "History", action: () => onViewChange("history") },
        { id: "nightmare", icon: Moon, label: texts.nightmare || "Nightmare Protocol", action: () => { onClose(); navigate("/nightmare"); } },
        { id: "library", icon: BookOpen, label: texts.fearLibrary || "Fear Library", action: () => { onClose(); navigate("/library"); } },
        { id: "movie", icon: Film, label: texts.movieSession || "Movie Session", action: () => { onClose(); navigate("/movie-session"); } },
        { id: "vr", icon: Glasses, label: texts.vrExperience || "VR EXPERIENCE", action: () => { onClose(); navigate("/vr"); } },
        { id: "challenge", icon: Trophy, label: texts.fearChallenge || "Fear Challenge", action: () => { onClose(); navigate("/challenge"); } },
        { id: "profile", icon: User, label: texts.biometricProfile || "Biometric Profile", action: () => { onClose(); navigate("/profile"); } },
        { id: "share", icon: Share2, label: texts.fearSharing || "Fear Sharing", action: () => { onClose(); navigate("/share"); } },
    ];

    const languages = Object.values(LANGUAGES);

    return (
        <>
            {/* Overlay */}
            <div 
                onClick={onClose}
                style={{ 
                    position: "fixed", inset: 0, 
                    backgroundColor: "rgba(0,0,0,0.9)", 
                    zIndex: 9998, 
                    opacity: isOpen ? 1 : 0, 
                    transition: "opacity 300ms" 
                }}
            />
            
            {/* Menu */}
            <div style={{ 
                position: "fixed", top: 0, left: 0, height: "100%", width: "300px", 
                backgroundColor: "#000000", borderRight: "2px solid #FF0000", 
                zIndex: 9999, transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 300ms", overflowY: "auto"
            }}>
                {/* Header */}
                <div style={{ 
                    display: "flex", justifyContent: "space-between", alignItems: "center", 
                    padding: "16px", borderBottom: "1px solid #FF0000" 
                }}>
                    <span style={{ color: "#FF0000", fontSize: "14px", letterSpacing: "0.3em", fontWeight: "bold" }}>MENU</span>
                    <button onClick={onClose} style={{ color: "#FF0000", background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
                        <X size={24} />
                    </button>
                </div>
                
                {/* Navigation */}
                <nav style={{ padding: "8px 0" }}>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={item.action}
                            style={{
                                width: "100%", display: "flex", alignItems: "center", gap: "14px",
                                padding: "16px 20px", 
                                background: currentView === item.id ? "rgba(255,0,0,0.2)" : "transparent",
                                border: "none", 
                                borderLeft: currentView === item.id ? "4px solid #FF0000" : "4px solid transparent",
                                color: "#FF0000", cursor: "pointer", textAlign: "left"
                            }}
                        >
                            <item.icon size={20} />
                            <span style={{ fontSize: "13px", letterSpacing: "0.15em", fontWeight: "500" }}>{item.label}</span>
                        </button>
                    ))}
                </nav>
                
                {/* Language Selector */}
                <div style={{ padding: "16px", borderTop: "1px solid #FF0000" }}>
                    <button
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        style={{ 
                            width: "100%", padding: "14px 16px", 
                            background: "rgba(255,0,0,0.1)", 
                            border: "2px solid #FF0000", 
                            color: "#FF0000", cursor: "pointer", 
                            fontSize: "12px", letterSpacing: "0.15em",
                            display: "flex", alignItems: "center", justifyContent: "space-between"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Globe size={18} />
                            <span>{texts.language || "LANGUAGE"}: {LANGUAGES[language]?.nativeName || language}</span>
                        </div>
                        <ChevronDown size={18} style={{ transform: showLangMenu ? "rotate(180deg)" : "rotate(0)", transition: "transform 200ms" }} />
                    </button>
                    
                    {/* Language Options */}
                    {showLangMenu && (
                        <div style={{ 
                            marginTop: "8px", 
                            border: "1px solid #FF0000", 
                            backgroundColor: "#000000",
                            maxHeight: "250px",
                            overflowY: "auto"
                        }}>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        onLanguageChange(lang.code);
                                        setShowLangMenu(false);
                                    }}
                                    style={{
                                        width: "100%", padding: "12px 16px",
                                        background: language === lang.code ? "rgba(255,0,0,0.3)" : "transparent",
                                        border: "none", borderBottom: "1px solid rgba(255,0,0,0.2)",
                                        color: language === lang.code ? "#FFFFFF" : "#FF0000",
                                        cursor: "pointer", textAlign: "left",
                                        fontSize: "12px", letterSpacing: "0.1em"
                                    }}
                                >
                                    {lang.nativeName} ({lang.name})
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div style={{ padding: "16px", textAlign: "center", borderTop: "1px solid #333" }}>
                    <p style={{ color: "#888", fontSize: "10px", letterSpacing: "0.1em" }}>© 2026 FEAR METER</p>
                    <p style={{ color: "#666", fontSize: "8px", marginTop: "4px" }}>ALL RIGHTS RESERVED</p>
                </div>
            </div>
        </>
    );
};

export default SideMenu;
