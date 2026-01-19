import { Volume2, VolumeX, Volume1 } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useState } from "react";

export const AudioControl = ({ showSlider = false }) => {
    const { soundEnabled, toggleSound } = useSettings();
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    
    return (
        <div className="relative">
            <button
                onClick={toggleSound}
                onMouseEnter={() => showSlider && setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="p-2 transition-all duration-200"
                style={{ 
                    color: soundEnabled ? "#FF0000" : "rgba(255, 0, 0, 0.3)",
                    textShadow: soundEnabled ? "0 0 8px rgba(255, 0, 0, 0.5)" : "none",
                }}
                data-testid="audio-control"
            >
                {soundEnabled ? (
                    <Volume2 className="w-5 h-5" />
                ) : (
                    <VolumeX className="w-5 h-5" />
                )}
            </button>
            
            {/* Volume indicator */}
            {soundEnabled && (
                <div 
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full animate-pulse"
                    style={{ 
                        backgroundColor: "#FF0000",
                        boxShadow: "0 0 5px #FF0000",
                    }}
                />
            )}
        </div>
    );
};

// Full sound toggle for menu
export const SoundToggle = ({ compact = false }) => {
    const { soundEnabled, toggleSound } = useSettings();
    
    if (compact) {
        return <AudioControl />;
    }
    
    return (
        <button
            onClick={toggleSound}
            className="w-full flex items-center justify-between px-4 py-3"
            style={{ 
                color: soundEnabled ? "#FF0000" : "rgba(255, 0, 0, 0.4)",
            }}
            data-testid="sound-toggle"
        >
            <div className="flex items-center gap-3">
                {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                ) : (
                    <VolumeX className="w-4 h-4" />
                )}
                <span 
                    className="text-[11px] tracking-[0.15em]"
                    style={{ textShadow: soundEnabled ? "0 0 5px rgba(255, 0, 0, 0.3)" : "none" }}
                >
                    CLINICAL AUDIO
                </span>
            </div>
            <span 
                className="text-[9px] tracking-wider px-2 py-0.5"
                style={{ 
                    backgroundColor: soundEnabled 
                        ? "rgba(255, 0, 0, 0.15)" 
                        : "transparent",
                    border: soundEnabled 
                        ? "1px solid rgba(255, 0, 0, 0.4)" 
                        : "1px solid rgba(255, 0, 0, 0.15)",
                    color: soundEnabled 
                        ? "#FF0000" 
                        : "rgba(255, 0, 0, 0.3)",
                    boxShadow: soundEnabled ? "0 0 8px rgba(255, 0, 0, 0.2)" : "none",
                }}
            >
                {soundEnabled ? "ON" : "OFF"}
            </span>
        </button>
    );
};

export default SoundToggle;
