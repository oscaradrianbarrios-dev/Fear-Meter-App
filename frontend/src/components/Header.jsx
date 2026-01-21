import { Menu } from "lucide-react";
import { useRef, useCallback, useState, useEffect } from "react";
import { AudioControl } from "./SoundToggle";

export const Header = ({ onMenuOpen, onDemoActivate, isCalibrated = false }) => {
    const longPressRef = useRef(null);
    const longPressStartRef = useRef(null);
    const [showWatching, setShowWatching] = useState(false);

    // Long press on logo (5 seconds) to activate demo mode
    const handleLogoTouchStart = useCallback(() => {
        longPressStartRef.current = Date.now();
        longPressRef.current = setTimeout(() => {
            onDemoActivate?.();
        }, 5000);
    }, [onDemoActivate]);

    const handleLogoTouchEnd = useCallback(() => {
        if (longPressRef.current) {
            clearTimeout(longPressRef.current);
            longPressRef.current = null;
        }
    }, []);

    // Randomly show "watching" indicator for psychological effect
    useEffect(() => {
        const showRandomly = () => {
            if (Math.random() < 0.15) { // 15% chance
                setShowWatching(true);
                setTimeout(() => setShowWatching(false), 2000 + Math.random() * 3000);
            }
        };
        
        const interval = setInterval(showRandomly, 8000 + Math.random() * 12000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header 
            className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
            style={{
                backgroundColor: "#000000",
                borderBottom: "1px solid rgba(255, 85, 85, 0.25)",
                boxShadow: "0 2px 10px rgba(255, 85, 85, 0.1)",
            }}
        >
            {/* Menu button - LEFT side */}
            <button
                onClick={onMenuOpen}
                className="p-2 transition-all duration-200"
                style={{ 
                    color: "#FF5555",
                    textShadow: "0 0 8px rgba(255, 85, 85, 0.4)",
                }}
                aria-label="Open menu"
                data-testid="menu-button"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Logo - Center, with long press detection */}
            <div 
                className="flex items-center gap-2 select-none cursor-default"
                onMouseDown={handleLogoTouchStart}
                onMouseUp={handleLogoTouchEnd}
                onMouseLeave={handleLogoTouchEnd}
                onTouchStart={handleLogoTouchStart}
                onTouchEnd={handleLogoTouchEnd}
            >
                <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ 
                        backgroundColor: "#FF5555",
                        boxShadow: "0 0 10px #FF5555, 0 0 20px rgba(255, 85, 85, 0.5)",
                    }}
                />
                <h1 
                    className="font-bold text-sm tracking-[0.25em] uppercase"
                    style={{ 
                        color: "#FF5555",
                        textShadow: "0 0 10px rgba(255, 85, 85, 0.5)",
                    }}
                >
                    FEAR METER
                </h1>
            </div>

            {/* Audio control - RIGHT side */}
            <div className="flex items-center gap-2">
                {/* Watching indicator - appears randomly */}
                <div 
                    className="flex items-center transition-opacity duration-1000 mr-1"
                    style={{ opacity: showWatching ? 1 : 0 }}
                >
                    <span 
                        className="text-[8px] tracking-[0.15em]"
                        style={{ 
                            color: "#FF5555",
                            textShadow: "0 0 5px rgba(255, 85, 85, 0.5)",
                        }}
                    >
                        REC
                    </span>
                    <div 
                        className="w-1.5 h-1.5 rounded-full ml-1"
                        style={{ 
                            backgroundColor: "#FF5555",
                            boxShadow: "0 0 8px #FF5555",
                            animation: showWatching ? "pulse 1s ease-in-out infinite" : "none",
                        }}
                    />
                </div>
                
                {/* Audio control button */}
                <AudioControl />
            </div>
        </header>
    );
};

export default Header;
