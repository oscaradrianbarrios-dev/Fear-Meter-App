import { Menu } from "lucide-react";

export const Header = ({ onMenuOpen }) => {
    return (
        <header className="sticky top-0 z-40 bg-fear-black border-b border-fear-red/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-fear-red animate-pulse-red" />
                <h1 className="text-fear-red font-bold text-sm tracking-[0.2em] uppercase">
                    FEAR METER <span className="text-fear-gray font-normal">v1.0</span>
                </h1>
            </div>
            
            <button
                onClick={onMenuOpen}
                className="p-2 text-fear-gray hover:text-fear-red transition-colors duration-200"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>
        </header>
    );
};

export default Header;
