import { createContext, useContext, useState, useCallback, useEffect } from "react";

const SettingsContext = createContext(null);

const STORAGE_KEY = "fear_meter_settings";

// Default settings
const DEFAULT_SETTINGS = {
    soundEnabled: false, // Sound OFF by default
    hapticEnabled: true, // Haptic feedback ON by default
    showDisclaimer: true,
};

// Load settings from localStorage
const loadSettings = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.warn("Failed to load settings:", e);
    }
    return DEFAULT_SETTINGS;
};

// Save settings to localStorage
const saveSettings = (settings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        console.warn("Failed to save settings:", e);
    }
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(loadSettings);
    
    // Save whenever settings change
    useEffect(() => {
        saveSettings(settings);
    }, [settings]);
    
    const updateSetting = useCallback((key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value,
        }));
    }, []);
    
    const toggleSound = useCallback(() => {
        setSettings(prev => ({
            ...prev,
            soundEnabled: !prev.soundEnabled,
        }));
    }, []);
    
    const toggleVibrate = useCallback(() => {
        setSettings(prev => ({
            ...prev,
            hapticEnabled: !prev.hapticEnabled,
        }));
    }, []);

    const toggleHaptic = useCallback(() => {
        setSettings(prev => ({
            ...prev,
            hapticEnabled: !prev.hapticEnabled,
        }));
    }, []);
    
    const dismissDisclaimer = useCallback(() => {
        setSettings(prev => ({
            ...prev,
            showDisclaimer: false,
        }));
    }, []);
    
    const value = {
        ...settings,
        updateSetting,
        toggleSound,
        toggleVibrate,
        toggleHaptic,
        dismissDisclaimer,
    };
    
    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};

export default SettingsContext;
