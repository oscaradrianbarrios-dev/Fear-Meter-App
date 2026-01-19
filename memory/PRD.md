# FEAR METER - Product Requirements Document

## Original Problem Statement
Crear una aplicación llamada "FEAR METER" con estética de "horror biométrico clínico". La interfaz debe ser seria, fría, clínica e incómoda - no amigable ni divertida.

> **FINAL RULE**: The app must feel like "Something you shouldn't be using alone at night."

---

## Design Language (Clinical Horror)

### Color Palette (Updated December 2025)
- **Background**: Absolute black (#000000)
- **Clinical Red**: #8E0E1C (primary UI elements)
- **Clinical Red Accent**: #B11226 (highlights)
- **Critical Red**: #FF0000 (ONLY for critical states)
- **Text**: Gray (#B0B0B0) and muted variations

### Typography
- Font: JetBrains Mono
- Letter-spacing: 0.15em - 0.35em
- Minimal, medical, modern

---

## Core Features

### ✅ 1. Monitor Principal
- Biological ECG oscilloscope with imperfections
- Clinical messages: "Signal unstable", "Biometric pattern altered"
- Sharp-edged data blocks
- BPM pulses with heartbeat rhythm

### ✅ 2. Clinical Audio System (NEW)
- Hospital monitor-style beep sounds
- Progressive activation based on BPM:
  - Normal (≤100): Silence
  - Elevated (100-120): Beep every 2.5s
  - Critical (>120): Frequent beeps + vibration
- Toggle: Sound ON/OFF in menu
- Low volume, no jumpscares

### ✅ 3. Calibration Mode
- Biometric baseline acquisition
- Options: Rest, Physical activity, Emotional stress, Real fear
- Movement detection → excludes from Fear Score
- Messages: "Running detected — Fear not counted"

### ✅ 4. Nightmare Protocol
- "Nighttime Fear Analysis (Passive)"
- BPM > 120 for 8+ seconds triggers detection
- Events: "Possible Nightmare Event — 03:12 AM"
- Disclaimer: "Passive analysis — not medical diagnosis"

### ✅ 5. Fear Library (NEW)
- **Movies**: Horror films with Avg BPM Spike, Fear Level (LOW/MODERATE/HIGH/EXTREME)
- **Games**: Peak BPM, Session duration, Peak Fear Moment
- **Attractions**: Haunted houses with Fear Intensity bars
- **Ranking**: Global Fear Index
- Disclaimer: "Community-based simulated data for demo & testing purposes"

### ✅ 6. Legal Disclaimer (NEW)
- Modal on first visit
- "NOT a medical device"
- "For entertainment & experimental analysis only"
- "All biometric data is simulated"
- Persists to localStorage after acceptance

### ✅ 7. Language Selector
- 9 languages supported
- Persists to localStorage

### ✅ 8. Smartwatch Mode
- Circular display with biometric ring
- STABLE/ELEVATED/CRITICAL states

### ✅ 9. Demo/Simulation Mode
- Hidden in menu for investors
- Simulates: Movie, Game, Nightmare scenarios

---

## Technical Stack
- React 18 with Vite
- Tailwind CSS
- React Router DOM
- Web Audio API (clinical beeps)
- localStorage for persistence

---

## File Structure

```
/app/frontend/src/
├── components/
│   ├── CalibrationProtocol.jsx
│   ├── CriticalAlert.jsx
│   ├── Disclaimer.jsx (NEW)
│   ├── FearLibrary.jsx (NEW)
│   ├── FearMeterApp.jsx
│   ├── Header.jsx
│   ├── History.jsx
│   ├── InvestorDemo.jsx
│   ├── LanguageSelector.jsx
│   ├── Monitor.jsx
│   ├── NightmareProtocol.jsx
│   ├── Oscilloscope.jsx
│   ├── PanicOverlay.jsx
│   ├── ResponseIndicator.jsx
│   ├── SideMenu.jsx
│   ├── SoundToggle.jsx (NEW)
│   └── WatchMode.jsx
├── contexts/
│   ├── LanguageContext.jsx
│   └── SettingsContext.jsx (NEW)
├── hooks/
│   ├── useCalibration.js
│   ├── useBiometricSimulation.js
│   ├── useClinicalAudio.js (NEW)
│   ├── useSessionManager.js
│   └── useNightmareProtocol.js
├── i18n/
│   └── translations.js
├── styles/
│   └── horror-ux.css (updated with CSS variables)
└── App.js
```

---

## Routes
- `/` - Main Fear Meter app
- `/demo` - Demo mode
- `/nightmare` - Nightmare Protocol
- `/investor` or `/investor-demo` - Investor Demo
- `/library` - Fear Library (NEW)

---

## Completed Work (December 2025)

### FASE 1: Estética + Audio ✅
1. Nueva paleta de colores clínicos (#8E0E1C, #B11226)
2. Sistema de audio clínico (beeps de monitor hospitalario)
3. Toggle Sound ON/OFF en menú

### FASE 2: Fear Library + Disclaimer ✅
4. Fear Library con Movies/Games/Attractions/Ranking
5. Legal Disclaimer modal en primera visita
6. Todos los datos marcados como SIMULADOS

### Previously Completed
- Language Selector (9 languages)
- Nightmare Protocol improvements
- Smartwatch Mode
- Calibration System V2
- Psychological Horror UX

---

## Testing Status
- **All features tested**: 100% pass rate
- **Test reports**: `/app/test_reports/iteration_3.json`

---

## Notes

- **ALL DATA IS SIMULATED** - No real biometric measurements
- **NOT A MEDICAL DEVICE** - Entertainment only
- User's preferred language: Spanish

---

## Future/Backlog Tasks

### P1
- [ ] Traducir textos de Fear Library a todos los idiomas
- [ ] Mejorar Demo Mode para inversores

### P2
- [ ] About / Legal page completa
- [ ] Más películas/juegos en la biblioteca

### Future
- [ ] Real device integration (Web Bluetooth)
- [ ] Community-submitted fear data
