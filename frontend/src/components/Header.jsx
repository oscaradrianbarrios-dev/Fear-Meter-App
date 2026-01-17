import { Menu } from "lucide-react";

export const Header = ({ onMenuOpen }) => {
    return (
        <header 
            className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
            style={{
                backgroundColor: "#000000",
                borderBottom: "1px solid rgba(255, 0, 0, 0.1)"
            }}
        >
            <div className="flex items-center gap-2">
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
            
            <button
                onClick={onMenuOpen}
                className="p-2 transition-colors duration-300"
                style={{ color: "rgba(176, 176, 176, 0.5)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255, 0, 0, 0.7)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(176, 176, 176, 0.5)"}
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>
        </header>
    );
};

export default Header;
