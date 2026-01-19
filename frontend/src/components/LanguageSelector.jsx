import { useState, useEffect, useMemo } from "react";
import { LANGUAGES } from "@/i18n/translations";

export const LanguageSelector = ({
    isOpen,
    onClose,
    currentLanguage,
    onLanguageChange,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [itemsReady, setItemsReady] = useState(false);
    
    const languageList = useMemo(() => Object.values(LANGUAGES), []);
    
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            const timer = setTimeout(() => setItemsReady(true), 150);
            return () => clearTimeout(timer);
        } else {
            setItemsReady(false);
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);
    
    const handleSelect = (langCode) => {
        onLanguageChange(langCode);
        onClose();
    };
    
    if (!isVisible) return null;
    
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ 
                backgroundColor: "rgba(0, 0, 0, 0.95)",
                opacity: isOpen ? 1 : 0,
                transition: "opacity 200ms ease-out",
            }}
            onClick={onClose}
        >
            <div 
                className="w-full max-w-xs px-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div 
                    className="text-center mb-8"
                    style={{
                        opacity: itemsReady ? 1 : 0,
                        transform: itemsReady ? "translateY(0)" : "translateY(-10px)",
                        transition: "all 200ms ease-out",
                    }}
                >
                    <p 
                        className="text-[9px] tracking-[0.3em]"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        SELECT LANGUAGE
                    </p>
                </div>
                
                {/* Language List */}
                <div className="space-y-1">
                    {languageList.map((lang, index) => {
                        const isSelected = currentLanguage === lang.code;
                        
                        return (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className="w-full py-3 text-center transition-all duration-200 relative"
                                style={{
                                    opacity: itemsReady ? 1 : 0,
                                    transform: itemsReady ? "translateY(0)" : "translateY(10px)",
                                    transition: `all 200ms ease-out ${index * 40}ms`,
                                }}
                            >
                                <span 
                                    className="text-sm tracking-[0.15em]"
                                    style={{ 
                                        color: isSelected ? "#FF0000" : "#B0B0B0",
                                        textShadow: isSelected ? "0 0 15px rgba(255, 0, 0, 0.4)" : "none",
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.color = "rgba(255, 0, 0, 0.7)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.color = "#B0B0B0";
                                        }
                                    }}
                                >
                                    {lang.nativeName}
                                </span>
                                
                                {/* Underline for selected */}
                                {isSelected && (
                                    <div 
                                        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-px"
                                        style={{ 
                                            width: "40px",
                                            backgroundColor: "#FF0000",
                                            boxShadow: "0 0 8px rgba(255, 0, 0, 0.5)",
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
                
                {/* Close hint */}
                <div 
                    className="text-center mt-10"
                    style={{
                        opacity: itemsReady ? 0.4 : 0,
                        transition: "opacity 300ms ease-out 400ms",
                    }}
                >
                    <p 
                        className="text-[8px] tracking-[0.2em]"
                        style={{ color: "rgba(176, 176, 176, 0.3)" }}
                    >
                        TAP OUTSIDE TO CLOSE
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LanguageSelector;
