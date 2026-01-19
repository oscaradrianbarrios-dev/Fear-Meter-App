# FEAR METER - Product Requirements Document

## Original Problem Statement
Crear una aplicación llamada "FEAR METER" con estética de "horror biométrico clínico". La interfaz debe ser seria, fría, clínica e incómoda - preparada para demos, inversores y escalado futuro.

> **FINAL RULE**: The app must feel like "Something you shouldn't be using alone at night."

---

## Design Language (Clinical Horror)

### Color Palette
- **Background**: Absolute black (#000000)
- **Clinical Red**: #8E0E1C (primary UI)
- **Clinical Red Accent**: #B11226 (highlights)
- **Critical Red**: #FF0000 (ONLY critical states)
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
- Heartbeat Sync: UI pulses with BPM

### ✅ 2. Clinical Audio System
- Hospital monitor-style beeps
- Progressive activation based on BPM
- Toggle: Sound ON/OFF in menu

### ✅ 3. Calibration Mode
- Options: Rest, Physical activity, Emotional stress, Real fear
- Movement detection → excludes from Fear Score

### ✅ 4. Nightmare Protocol
- "Nighttime Fear Analysis (Passive)"
- BPM > 120 for 8+ seconds triggers detection
- Disclaimer: "Passive analysis — not medical diagnosis"

### ✅ 5. Fear Library
- **Movies**: Horror films with Avg BPM Spike, Fear Level
- **Games**: Peak BPM, Session duration
- **Attractions**: Haunted houses with Fear Intensity
- **Ranking**: Global Fear Index

### ✅ 6. Movie Session Mode (NEW)
- Select movie from library
- Experience fear timeline simulation in real-time
- Visual timeline with fear peak markers
- Alerts: "JUMP SCARE INCOMING", "TENSION BUILDING"
- Session complete summary with Fear Score vs Global Average

### ✅ 7. VR Experience (NEW)
- Simulated VR headset connection (WebXR demo)
- 3 video categories that adapt to BPM:
  - 🟢 CALM (<90 BPM): Empty corridors, wind sounds
  - 🟡 TENSION (90-110 BPM): Shadows, footsteps, creaking doors
  - 🔴 TERROR (>110 BPM): Apparitions, chase sequences
- Adaptive message: "SYSTEM DETECTING HIGH FEAR — INTENSIFYING"
- Compatible devices list: Meta Quest, HTC Vive, Valve Index, PlayStation VR

### ✅ 8. Fear Challenge (NEW)
- Competitive mode: Keep BPM under threshold as long as possible
- **ENDURANCE**: Target <100 BPM (1x score multiplier)
- **EXTREME**: Target <90 BPM (1.5x score multiplier)
- 3 lives system (violations = losing a life)
- Personal best tracking (localStorage)
- **Global Leaderboard** with top 10 players (simulated)

### ✅ 9. Biometric Profile (NEW)
- Generate fear profile based on simulated analysis
- **Profile Types**: Jump Scare Sensitive, Psychological Horror Resistant, Tension Builder, Fearless Observer, Hyper-Reactive
- **Radar Chart** with 6 fear attributes:
  - Jump Scare, Psychological, Gore, Supernatural, Tension, Darkness
- **Sensitivity Breakdown** with percentage bars
- Stats: AVG BPM, PEAK BPM, FEAR EVENTS, SESSIONS

### ✅ 10. Fear Sharing (NEW)
- Generate shareable cards for social media
- **3 Card Templates**: Survival Card, Extreme Fear, Fearless
- Customization: Movie selection, Peak BPM, Fear Score
- QR code linking to app
- Share buttons: Copy Link, Twitter, Instagram, Save Image

### ✅ 11. Heartbeat Sync Effect (NEW)
- UI pulses at the rhythm of BPM
- Normal state: subtle pulse
- Critical state: faster, more intense pulse
- Entire interface "breathes" with the user

### ✅ 12. Language Selector
- 9 languages: EN, ES, PT, IT, JA, ZH, DE, RU, FR

### ✅ 13. Smartwatch Mode
- Circular display with biometric ring
- STABLE/ELEVATED/CRITICAL states

### ✅ 14. Legal Disclaimer
- Modal on first visit
- "NOT a medical device"
- "For entertainment & experimental analysis only"

---

## Routes
- `/` - Main Fear Meter app
- `/demo` - Demo mode
- `/nightmare` - Nightmare Protocol
- `/investor` - Investor Demo
- `/library` - Fear Library
- `/movie-session` - Movie Session Mode (NEW)
- `/vr` - VR Experience (NEW)
- `/challenge` - Fear Challenge (NEW)
- `/profile` - Biometric Profile (NEW)
- `/share` - Fear Sharing (NEW)

---

## File Structure

```
/app/frontend/src/
├── components/
│   ├── BiometricProfile.jsx (NEW)
│   ├── CalibrationProtocol.jsx
│   ├── Disclaimer.jsx
│   ├── FearChallenge.jsx (NEW)
│   ├── FearLibrary.jsx
│   ├── FearMeterApp.jsx
│   ├── FearSharing.jsx (NEW)
│   ├── MovieSession.jsx (NEW)
│   ├── NightmareProtocol.jsx
│   ├── SideMenu.jsx
│   ├── SoundToggle.jsx
│   ├── VRExperience.jsx (NEW)
│   ├── WatchMode.jsx
│   └── ...
├── contexts/
│   ├── LanguageContext.jsx
│   └── SettingsContext.jsx
├── hooks/
│   ├── useClinicalAudio.js
│   ├── useNightmareProtocol.js
│   └── ...
├── styles/
│   └── horror-ux.css (Heartbeat Sync animations)
└── App.js
```

---

## Testing Status
- **All features tested**: 100% pass rate
- **Test report**: `/app/test_reports/iteration_4.json`

---

## Notes

- **ALL DATA IS SIMULATED** (MOCKED) - No real biometric measurements
- **NOT A MEDICAL DEVICE** - Entertainment only
- **VR is simulated** - WebXR demo mode, no real VR integration
- **Leaderboards are simulated** - Demo data
- User's preferred language: Spanish

---

## Future/Backlog Tasks

### P1
- [ ] Real WebXR integration (requires hardware)
- [ ] Firebase/backend for real leaderboards

### P2
- [ ] More movies in Fear Library
- [ ] Audio improvements (directional sound)

### Future
- [ ] Real biometric device integration (Web Bluetooth)
- [ ] Multiplayer fear challenges
- [ ] Community-submitted content
