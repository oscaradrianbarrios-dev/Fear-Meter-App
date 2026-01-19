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
- **Primary**: Pure red (#FF0000) - Critical states only
- **Secondary**: Dark red (#8B0000) - UI elements, menu items
- **Text**: Gray (#B0B0B0) and muted variations
- **UI**: High contrast, clinical, threatening - NO soft UI, NO friendly animations

### Typography
- Font: JetBrains Mono
- Letter-spacing: 0.15em - 0.35em (aggressive spacing)
- Numbers: Large, pulsing, aggressive

---

## Core Features

### ✅ 1. Monitor Principal
- Oscilloscope ECG with biological imperfections (not perfect/symmetrical)
- Sharp-edged data blocks (no border-radius)
- BPM pulses with heartbeat rhythm
- Clinical messages: "Signal unstable", "Biometric pattern altered", "Emotional anomaly detected"

### ✅ 2. Calibration System V2
- Biometric baseline acquisition
- Persistence via localStorage
- Differentiates between exercise, stress, and fear
- Expiration warnings (24 hours validity)

### ✅ 3. Nightmare Protocol (IMPROVED - December 2025)
- Concept: "The system watches even when you sleep"
- Activation from side menu
- Pre-activation: "PASSIVE BIOMETRIC MONITORING"
- Active state: "NIGHTMARE MODE ACTIVE" (small red text, minimal UI)
- BPM fluctuates slowly with micro random spikes
- Critical event detection: BPM > 120 for 8+ seconds triggers:
  - Long device vibration (navigator.vibrate)
  - Brief red flash (100ms)
  - Text: "NIGHTMARE DETECTED"
  - Returns to black after 3 seconds
- Summary on deactivation: Night events detected, Peak BPM, Duration
- No sounds, no flashy animations, clinical and cold

### ✅ 4. Investor Demo Mode
- Self-running scripted sequence
- Accessible via `/investor-demo` or `/investor`
- Designed for presentations

### ✅ 5. Psychological Horror UX (IMPROVED - December 2025)
- Reduced decorative animations (animate only on critical states)
- Visual rhythm: BPM visible but not always animated
- Oscilloscope with irregular heartbeats (not "perfect")
- Emotional states:
  - NORMAL → stable interface
  - ELEVATED → darker red (#8B0000)
  - CRITICAL → pure red (#FF0000) + micro flicker
- Clinical messages replacing generic text

### ✅ 6. Multilingual Language Selector
- 9 languages: English, Español, Português, Italiano, 日本語, 中文, Deutsch, Русский, Français
- Located in side menu
- Vertical list with single selection
- Styling: Black background, gray text, red selected with underline and glow
- Persists to localStorage
- Updates UI immediately without page reload

### ✅ 7. Smartwatch Mode
- Concept: "The watch doesn't show data: it watches."
- Circular fullscreen simulation
- Biometric ring: Red arc fills based on BPM
- Ring vibrates visually when BPM > 110
- Central BPM: Large number, JetBrains Mono bold
- Status: STABLE / ELEVATED / CRITICAL
- Device vibration on CRITICAL state

### ✅ 8. Side Menu (IMPROVED - December 2025)
- Slow appearance (300ms) - more unsettling
- Absolute black background
- Muted dark red text (rgba(139, 0, 0, x))
- Items: Monitor, Watch Mode, History, Nightmare Protocol, Language, About / Legal
- No hover effects (cleaner, colder)

### ✅ 9. History View
- Clinical records style
- Date + Duration + Peak BPM
- No color graphs
- Only red/white text on black

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
│   ├── LanguageSelector.jsx
│   ├── MainButton.jsx
│   ├── Monitor.jsx
│   ├── NightmareProtocol.jsx (IMPROVED)
│   ├── Oscilloscope.jsx (IMPROVED - biological)
│   ├── PanicOverlay.jsx
│   ├── ResponseIndicator.jsx (clinical messages)
│   ├── SideMenu.jsx (IMPROVED - 300ms, dark red)
│   └── WatchMode.jsx
├── contexts/
│   └── LanguageContext.jsx
├── hooks/
│   ├── useCalibration.js
│   ├── useBiometricSimulation.js
│   ├── useSessionManager.js
│   └── useNightmareProtocol.js (IMPROVED)
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

### Latest Session
1. **Language Selector** - COMPLETED
   - React Context for global state
   - 9 languages working
   - localStorage persistence

2. **Nightmare Protocol Improvements** - COMPLETED
   - Minimalist UI
   - BPM > 120 for 8+ seconds triggers detection
   - Vibration and flash effects
   - Summary view on deactivation

3. **Psychological Horror UX** - COMPLETED
   - Biological oscilloscope with imperfections
   - Slower menu transitions (300ms)
   - Dark red color scheme (#8B0000)
   - Clinical messages

4. **Smartwatch Mode** - COMPLETED
   - Circular display with biometric ring
   - STABLE/ELEVATED/CRITICAL states

---

## Testing Status
- **All features tested**: 100% pass rate
- **Test report**: `/app/test_reports/iteration_2.json`

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
- [ ] Additional clinical messages in all languages

### Future
- [ ] Real device integration (Web Bluetooth)
- [ ] Sound effects (minimal, clinical)
