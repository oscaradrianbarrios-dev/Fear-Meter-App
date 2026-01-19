# FEAR METER - Product Requirements Document

## Original Problem Statement
Crear una aplicación de página única (SPA) llamada "FEAR METER" con estética de "horror biométrico". La interfaz debe ser clínica, minimalista y aterradora, no amigable. 

> **FINAL RULE**: The app must feel like "Something you shouldn't be using alone at night."

## Product Overview
FEAR METER es un sistema experimental de monitoreo biométrico de horror que simula la detección del miedo a través de métricas cardíacas y de estrés.

---

## Design Language (Disturbing & Cinematic)

### Global Tone
- **Background**: Absolute black (#000000)
- **Primary**: Pure red (#FF0000) 
- **Danger states only**: Dark red (#8B0000)
- **Text**: White (#FFFFFF) and Gray (#B0B0B0)
- **UI**: High contrast, clinical, threatening - NO soft UI, NO friendly animations, NO rounded "fitness" feel

### Typography
- Font: JetBrains Mono
- Letter-spacing: 0.15em - 0.35em (aggressive spacing)
- Numbers: Large, pulsing, aggressive

---

## Core Features

### ✅ 1. Monitor Principal
- Oscilloscope ECG with red glow (more chaotic at high BPM)
- Sharp-edged data blocks (no border-radius)
- BPM pulses with heartbeat rhythm
- STRESS flickers at high values (>60%)
- SIGNAL shows UNSTABLE/CRITICAL states

### ✅ 2. Calibration System V2
- Biometric baseline acquisition
- Persistence via localStorage
- Differentiates between exercise, stress, and fear
- Expiration warnings (24 hours validity)

### ✅ 3. Nightmare Protocol
- Nocturnal fear monitoring mode
- Separate UI for sleep detection
- Event log with timestamps
- Test mode for demonstrations

### ✅ 4. Investor Demo Mode
- Self-running scripted sequence
- Accessible via `/investor-demo` or `/investor`
- Designed for presentations

### ✅ 5. Psychological Horror UX
- Unsettling micro-interactions
- Clinical messaging
- Asymmetric layout
- Breathing data animations
- Red flickering effects

### ✅ 6. Multilingual Language Selector (NEW - December 2025)
- 9 languages: English, Español, Português, Italiano, 日本語, 中文, Deutsch, Русский, Français
- Located in side menu under "Language" section
- Vertical list with single selection
- Styling: Black background (#000000), Gray text (#B0B0B0), Red selected (#FF0000) with underline and glow
- Persists to localStorage
- Updates UI immediately without page reload
- Uses React Context for global state management

### ✅ 7. Redesigned Smartwatch Mode (NEW - December 2025)
- Concept: "The watch doesn't show data: it watches."
- Circular fullscreen simulation
- No decorative borders
- Biometric ring: Red arc (#FF0000) fills based on BPM
- Ring vibrates visually when BPM > 110
- Subtle red glow only on peaks
- Central BPM: Large number, JetBrains Mono bold, pure red
- Status: STABLE / ELEVATED / CRITICAL (auto-changes based on BPM)
- Interactions:
  - Short tap: Micro red flash
  - BPM > 120: Device vibration (navigator.vibrate), CRITICAL status
- Heartbeat animation synced with BPM
- No buttons, no unnecessary graphics
- Smooth transitions, no aggressive gaming animations

---

## Technical Stack
- React 18 with Vite
- Tailwind CSS
- React Router DOM
- Web Audio API for sound
- localStorage for persistence

---

## File Structure

```
/app/frontend/src/
├── components/
│   ├── CalibrationProtocol.jsx
│   ├── CriticalAlert.jsx
│   ├── DataGrid.jsx
│   ├── DemoMode.jsx
│   ├── ExpirationWarning.jsx
│   ├── FearMeterApp.jsx (main app)
│   ├── Header.jsx
│   ├── History.jsx
│   ├── InvestorDemo.jsx
│   ├── LanguageSelector.jsx (NEW)
│   ├── MainButton.jsx
│   ├── Monitor.jsx
│   ├── NightmareProtocol.jsx
│   ├── Oscilloscope.jsx
│   ├── PanicOverlay.jsx
│   ├── ResponseIndicator.jsx
│   ├── SideMenu.jsx
│   └── WatchMode.jsx (REDESIGNED)
├── contexts/
│   └── LanguageContext.jsx (NEW)
├── hooks/
│   ├── useCalibration.js
│   ├── useBiometricSimulation.js
│   ├── useSessionManager.js
│   └── useNightmareProtocol.js
├── i18n/
│   └── translations.js (9 languages)
├── styles/
│   └── horror-ux.css
└── App.js
```

---

## Routes
- `/` - Main Fear Meter app
- `/demo` - Demo mode
- `/nightmare` - Nightmare Protocol
- `/investor` or `/investor-demo` - Investor Demo Mode

---

## Completed Work (December 2025)

### Session Updates
1. **Multilingual Language Selector** - COMPLETED
   - Created LanguageContext for global state management
   - Implemented LanguageSelector modal with 9 languages
   - Updated SideMenu to open language selector
   - All UI strings translated in translations.js
   - Persists to localStorage under 'fear_meter_language'

2. **Smartwatch Mode Redesign** - COMPLETED
   - Circular fullscreen simulation
   - Biometric ring with visual vibration effect
   - STABLE/ELEVATED/CRITICAL status based on BPM thresholds
   - Heartbeat animation synced to BPM
   - Device vibration on CRITICAL state
   - Minimal, watching aesthetic

---

## Testing Status
- **All features tested**: 100% pass rate
- **Language Selector**: All 9 languages work, persistence verified
- **Watch Mode**: Circular interface, status changes, biometric ring confirmed

---

## Notes

- All biometric data is SIMULATED (MOCKED)
- No backend required
- Designed to feel disturbing, not friendly
- User's preferred language: Spanish

---

## Future/Backlog Tasks

### P1
- [ ] Traducir Investor Demo al español

### P2
- [ ] About / Legal page content
- [ ] Animated logo

### Future
- [ ] Real device integration (Web Bluetooth)
- [ ] Additional sound effects
