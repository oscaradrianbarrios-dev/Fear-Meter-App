import { X, Activity, Watch, History, Globe, Moon, BookOpen, Film, Glasses, Trophy, User, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SideMenu = ({ isOpen, onClose, currentView, onViewChange, language, onLanguageChange, texts }) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    if (!visible) return null;

    const menuItems = [
        { id: "monitor", icon: Activity, label: "Monitor", action: () => onViewChange("monitor") },
        { id: "watch", icon: Watch, label: "Watch Mode", action: () => onViewChange("watch") },
        { id: "history", icon: History, label: "History", action: () => onViewChange("history") },
        { id: "nightmare", icon: Moon, label: "Nightmare Protocol", action: () => { onClose(); navigate("/nightmare"); } },
        { id: "library", icon: BookOpen, label: "Fear Library", action: () => { onClose(); navigate("/library"); } },
        { id: "movie", icon: Film, label: "Movie Session", action: () => { onClose(); navigate("/movie-session"); } },
        { id: "vr", icon: Glasses, label: "VR EXPERIENCE", action: () => { onClose(); navigate("/vr"); } },
        { id: "challenge", icon: Trophy, label: "Fear Challenge", action: () => { onClose(); navigate("/challenge"); } },
        { id: "profile", icon: User, label: "Biometric Profile", action: () => { onClose(); navigate("/profile"); } },
        { id: "share", icon: Share2, label: "Fear Sharing", action: () => { onClose(); navigate("/share"); } },
    ];

    return (
        <>
            <div 
                onClick={onClose}
                style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", zIndex: 9998, opacity: isOpen ? 1 : 0, transition: "opacity 300ms" }}
            />
            <div style={{ 
                position: "fixed", top: 0, left: 0, height: "100%", width: "280px", backgroundColor: "#000000",
                borderRight: "2px solid #FF0000", zIndex: 9999, transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 300ms", overflowY: "auto"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #FF0000" }}>
                    <span style={{ color: "#FF0000", fontSize: "12px", letterSpacing: "0.2em" }}>MENU</span>
                    <button onClick={onClose} style={{ color: "#FF0000", background: "none", border: "none", cursor: "pointer" }}>
                        <X size={20} />
                    </button>
                </div>
                <nav style={{ padding: "8px 0" }}>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={item.action}
                            style={{
                                width: "100%", display: "flex", alignItems: "center", gap: "12px",
                                padding: "14px 16px", background: currentView === item.id ? "rgba(255,0,0,0.2)" : "transparent",
                                border: "none", borderLeft: currentView === item.id ? "3px solid #FF0000" : "3px solid transparent",
                                color: "#FF0000", cursor: "pointer", textAlign: "left"
                            }}
                        >
                            <item.icon size={18} />
                            <span style={{ fontSize: "12px", letterSpacing: "0.1em" }}>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div style={{ padding: "16px", borderTop: "1px solid #FF0000", marginTop: "auto" }}>
                    <button
                        onClick={() => onLanguageChange(language === "EN" ? "ES" : "EN")}
                        style={{ width: "100%", padding: "10px", background: "rgba(255,0,0,0.1)", border: "1px solid #FF0000", color: "#FF0000", cursor: "pointer", fontSize: "10px", letterSpacing: "0.1em" }}
                    >
                        <Globe size={14} style={{ marginRight: "8px", display: "inline" }} />
                        {language === "EN" ? "ESPAÑOL" : "ENGLISH"}
                    </button>
                </div>
                <div style={{ padding: "16px", textAlign: "center" }}>
                    <p style={{ color: "#666", fontSize: "8px" }}>© 2026 FEAR METER</p>
                </div>
            </div>
        </>
    );
};

export default SideMenu;
