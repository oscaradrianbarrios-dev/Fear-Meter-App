import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { TRANSLATIONS, getLanguageTexts } from "@/i18n/translations";

const LanguageContext = createContext(null);

const STORAGE_KEY = "fear_meter_language";
const DEFAULT_LANGUAGE = "EN";

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored && TRANSLATIONS[stored] ? stored : DEFAULT_LANGUAGE;
        } catch {
            return DEFAULT_LANGUAGE;
        }
    });

    const [texts, setTexts] = useState(() => getLanguageTexts(language));

    // Update texts when language changes
    useEffect(() => {
        setTexts(getLanguageTexts(language));
    }, [language]);

    const setLanguage = useCallback((newLang) => {
        if (TRANSLATIONS[newLang]) {
            setLanguageState(newLang);
            try {
                localStorage.setItem(STORAGE_KEY, newLang);
            } catch (e) {
                console.warn("Failed to persist language:", e);
            }
        }
    }, []);

    const value = {
        language,
        setLanguage,
        texts,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

export default LanguageContext;
