import { Volume2, VolumeX } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export const SoundToggle = ({ compact = false }) => {
    const { soundEnabled, toggleSound } = useSettings();
    
    if (compact) {
        return (
            <button
                onClick={toggleSound}
                className="p-2 transition-colors duration-200"
                style={{ 
                    color: soundEnabled 
                        ? "var(--fear-red-clinical, #8E0E1C)" 
                        : "rgba(142, 14, 28, 0.3)",
                }}
                data-testid="sound-toggle-compact"
            >
                {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                ) : (
                    <VolumeX className="w-4 h-4" />
                )}
            </button>
        );
    }
    
    return (
        <button
            onClick={toggleSound}
            className="w-full flex items-center justify-between px-4 py-3"
            style={{ 
                color: soundEnabled 
                    ? "var(--fear-red-clinical, #8E0E1C)" 
                    : "rgba(142, 14, 28, 0.4)",
            }}
            data-testid="sound-toggle"
        >
            <div className="flex items-center gap-3">
                {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                ) : (
                    <VolumeX className="w-4 h-4" />
                )}
                <span className="text-[11px] tracking-[0.15em]">
                    CLINICAL AUDIO
                </span>
            </div>
            <span 
                className="text-[9px] tracking-wider px-2 py-0.5"
                style={{ 
                    backgroundColor: soundEnabled 
                        ? "rgba(142, 14, 28, 0.1)" 
                        : "transparent",
                    border: soundEnabled 
                        ? "1px solid rgba(142, 14, 28, 0.2)" 
                        : "1px solid rgba(142, 14, 28, 0.1)",
                    color: soundEnabled 
                        ? "var(--fear-red-clinical, #8E0E1C)" 
                        : "rgba(142, 14, 28, 0.3)",
                }}
            >
                {soundEnabled ? "ON" : "OFF"}
            </span>
        </button>
    );
};

export default SoundToggle;
