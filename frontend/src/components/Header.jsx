import { Menu } from "lucide-react";
import { useRef, useCallback } from "react";

export const Header = ({ onMenuOpen, onDemoActivate }) => {
    const longPressRef = useRef(null);
    const longPressStartRef = useRef(null);

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

    return (
        <header 
            className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
            style={{
                backgroundColor: "#000000",
                borderBottom: "1px solid rgba(255, 0, 0, 0.1)"
            }}
        >
            {/* Menu button - LEFT side */}
            <button
                onClick={onMenuOpen}
                className="p-2 transition-colors duration-200"
                style={{ color: "rgba(255, 0, 0, 0.5)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255, 0, 0, 0.8)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 0, 0, 0.5)"}
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
                    className="w-1.5 h-1.5 rounded-full animate-pulse-red"
                    style={{ backgroundColor: "rgba(255, 0, 0, 0.6)" }}
                />
                <h1 
                    className="font-bold text-xs tracking-[0.25em] uppercase"
                    style={{ color: "rgba(255, 0, 0, 0.75)" }}
                >
                    FEAR METER{" "}
                    <span 
                        className="font-normal"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        v1.0
                    </span>
                </h1>
            </div>

            {/* Spacer for symmetry */}
            <div className="w-9" />
        </header>
    );
};

export default Header;
