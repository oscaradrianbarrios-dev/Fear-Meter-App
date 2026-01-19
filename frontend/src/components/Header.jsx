import { Menu } from "lucide-react";
import { useRef, useCallback, useState, useEffect } from "react";

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
            className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between fear-bg-unease"
            style={{
                backgroundColor: "#000000",
                borderBottom: "1px solid rgba(255, 0, 0, 0.08)",
                marginLeft: '1px', // Subtle asymmetry
            }}
        >
            {/* Menu button - LEFT side */}
            <button
                onClick={onMenuOpen}
                className="p-2 transition-colors duration-200"
                style={{ color: "rgba(255, 0, 0, 0.4)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255, 0, 0, 0.7)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 0, 0, 0.4)"}
                aria-label="Open menu"
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
                    className="w-1.5 h-1.5 rounded-full fear-watching"
                    style={{ backgroundColor: "rgba(255, 0, 0, 0.5)" }}
                />
                <h1 
                    className="font-bold text-xs tracking-[0.25em] uppercase"
                    style={{ color: "rgba(255, 0, 0, 0.65)" }}
                >
                    FEAR METER{" "}
                    <span 
                        className="font-normal"
                        style={{ color: "rgba(176, 176, 176, 0.3)" }}
                    >
                        v1.0
                    </span>
                </h1>
            </div>

            {/* Watching indicator - appears randomly */}
            <div 
                className="w-9 flex items-center justify-end transition-opacity duration-1000"
                style={{ opacity: showWatching ? 1 : 0 }}
            >
                <span 
                    className="text-[7px] tracking-[0.15em]"
                    style={{ color: "rgba(255, 0, 0, 0.25)" }}
                >
                    REC
                </span>
                <div 
                    className="w-1 h-1 rounded-full ml-1"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.4)",
                        animation: showWatching ? "watching-pulse 1s ease-in-out infinite" : "none",
                    }}
                />
            </div>
        </header>
    );
};

export default Header;
