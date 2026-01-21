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
                borderBottom: "1px solid #333333",
            }}
        >
            {/* Menu button - LEFT side */}
            <button
                onClick={onMenuOpen}
                className="p-2 transition-all duration-200"
                style={{ color: "#FFFFFF" }}
                aria-label="Open menu"
                data-testid="menu-button"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Logo - Center */}
            <div 
                className="flex items-center gap-2 select-none cursor-default"
                onMouseDown={handleLogoTouchStart}
                onMouseUp={handleLogoTouchEnd}
                onMouseLeave={handleLogoTouchEnd}
                onTouchStart={handleLogoTouchStart}
                onTouchEnd={handleLogoTouchEnd}
            >
                <h1 
                    className="font-bold text-sm tracking-[0.25em] uppercase"
                    style={{ color: "#FFFFFF" }}
                >
                    FEAR METER
                </h1>
                <span 
                    className="text-[10px] tracking-[0.15em]"
                    style={{ color: "#DC2F2F" }}
                >
                    v1.0
                </span>
            </div>

            {/* Right side - REC indicator */}
            <div className="flex items-center gap-2">
                <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                        backgroundColor: "#FF0000",
                        boxShadow: "0 0 10px #FF0000",
                    }}
                />
            </div>
        </header>
    );
};

export default Header;
