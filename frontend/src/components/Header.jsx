import { Menu, Volume2, VolumeX } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export const Header = ({ onMenuOpen }) => {
    const { soundEnabled, toggleSound } = useSettings();

    return (
        <header style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 16px", backgroundColor: "#000000", borderBottom: "1px solid #FF0000"
        }}>
            <button onClick={onMenuOpen} style={{ color: "#FFFFFF", background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
                <Menu size={20} />
            </button>
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "bold", letterSpacing: "0.2em" }}>FEAR METER</span>
                <span style={{ color: "#FF0000", fontSize: "10px" }}>v1.0</span>
            </div>
            
            <button 
                onClick={toggleSound} 
                style={{ 
                    color: soundEnabled ? "#FF0000" : "#666666", 
                    background: "none", border: "none", cursor: "pointer", padding: "8px",
                    boxShadow: soundEnabled ? "0 0 10px rgba(255,0,0,0.5)" : "none"
                }}
            >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
        </header>
    );
};

export default Header;
