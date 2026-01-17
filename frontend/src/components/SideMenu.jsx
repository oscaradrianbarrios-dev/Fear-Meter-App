import { X, Activity, Watch, History, Globe, Info } from "lucide-react";

export const SideMenu = ({
    isOpen,
    onClose,
    currentView,
    onViewChange,
    language,
    onLanguageChange,
    texts,
}) => {
    if (!isOpen) return null;

    const menuItems = [
        { id: "monitor", icon: Activity, label: texts.monitor },
        { id: "watch", icon: Watch, label: texts.watchMode },
        { id: "history", icon: History, label: texts.history },
    ];

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-fear-black/80 z-50"
                onClick={onClose}
            />
            
            {/* Menu Panel */}
            <div className="fixed top-0 right-0 h-full w-64 bg-fear-black border-l border-fear-red/30 z-50 slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-fear-red/20">
                    <span className="text-fear-gray text-xs tracking-[0.2em] uppercase">
                        MENU
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1 text-fear-gray hover:text-fear-red transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="py-2">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                currentView === item.id
                                    ? "text-fear-red bg-fear-red/10 border-r-2 border-fear-red"
                                    : "text-fear-gray hover:text-fear-red hover:bg-fear-red/5"
                            }`}
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm tracking-wider">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Divider */}
                <div className="mx-4 my-2 border-t border-fear-red/10" />

                {/* Language Selection */}
                <div className="px-4 py-3">
                    <div className="flex items-center gap-3 text-fear-gray mb-3">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm tracking-wider">{texts.language}</span>
                    </div>
                    <div className="flex gap-2 ml-7">
                        <button
                            onClick={() => onLanguageChange("EN")}
                            className={`px-3 py-1.5 text-[10px] tracking-wider border rounded transition-colors ${
                                language === "EN"
                                    ? "border-fear-red text-fear-red bg-fear-red/10"
                                    : "border-fear-gray/30 text-fear-gray hover:border-fear-red/50"
                            }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => onLanguageChange("ES")}
                            className={`px-3 py-1.5 text-[10px] tracking-wider border rounded transition-colors ${
                                language === "ES"
                                    ? "border-fear-red text-fear-red bg-fear-red/10"
                                    : "border-fear-gray/30 text-fear-gray hover:border-fear-red/50"
                            }`}
                        >
                            ES
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="mx-4 my-2 border-t border-fear-red/10" />

                {/* About */}
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-fear-gray hover:text-fear-red hover:bg-fear-red/5 transition-colors"
                >
                    <Info className="w-4 h-4" />
                    <span className="text-sm tracking-wider">{texts.about}</span>
                </button>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-fear-red/10">
                    <div className="text-center">
                        <div className="text-fear-gray/40 text-[9px] tracking-widest">
                            FEAR METER v1.0
                        </div>
                        <div className="text-fear-gray/30 text-[8px] mt-1">
                            BIOMETRIC HORROR SYSTEM
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideMenu;
