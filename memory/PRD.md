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

## Core Features (All Implemented ✅)

### 1. Monitor Principal
- Oscilloscope ECG with red glow (more chaotic at high BPM)
- Sharp-edged data blocks (no border-radius)
- BPM pulses with heartbeat rhythm
- STRESS flickers at high values (>60%)
- SIGNAL shows UNSTABLE/CRITICAL states

### 2. Micro-Interactions (CRITICAL) ✅ IMPLEMENTED
- **BPM > 100**: Screen gradually darkens
- **BPM > 120**: 
  - Subtle red vignette appears
  - Oscilloscope becomes more chaotic (higher amplitude, more jitter)
- **BPM > 125 + Stress > 75% (Panic)**:
  - UI FREEZES for 1 second
  - Full RED FLASH
  - Strong vibration pattern (if supported)
  - Text shows "CRITICAL STRESS DETECTED"
  - Sound: panic alarm with dissonant tones

### 3. Fear Sessions
- Persistent recording via localStorage
- Data saved: date, duration, avg/max BPM, max stress, panic events
- Sessions feel like "stored evidence"

### 4. History
- List + simple line graph views
- No decorative charts
- Clinical, evidence-like presentation

### 5. Watch Mode - Fullscreen Smartwatch
- Circular display with BPM and pulse arc
- Heavy focus on BPM + pulse arc
- Minimal text
- Looks like a forbidden device

### 6. Menu (Side Hidden)
- Slides from left ABRUPTLY (120ms slam animation)
- Sections: Monitor, Watch Mode, History, Language, About/Legal
- Demo Mode hidden (URL only: /investor-demo/)

### 7. Audio System (Web Audio API)
- Static burst on session start
- Rhythmic heartbeat synced with BPM
- Panic alarm with dissonant tones

### 8. PWA
- manifest.json + service worker
- Installable on mobile devices

---

## Technical Stack
- Pure Vanilla JavaScript (ES6+)
- HTML5 + CSS3
- No external dependencies
- Web Audio API for sound
- localStorage for persistence

---

## File Structure

```
/app/frontend/public/
├── fear-meter/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
│
└── investor-demo/
    ├── index.html
    ├── demo.css
    └── demo.js
```

---

## Bug Fixes (January 2026)

### ✅ Watch Mode Animation Bug - FIXED
- Changed animation from `requestAnimationFrame` to `setInterval`
- Oscilloscope stops when leaving Monitor view

### ✅ History View Timeout - FIXED  
- Added `stopOscilloscopeAnimation()` when switching to History view

---

## Refinements Applied (January 2026)

### ✅ Disturbing & Cinematic Refinements
- Removed all rounded corners from data blocks
- Menu appears abruptly (120ms slam animation)
- Screen darkening at BPM > 100
- Red vignette at BPM > 120
- Chaotic oscilloscope at high BPM
- 1 second UI freeze before panic flash
- BPM pulses with heartbeat rhythm
- Stress value flickers at high values

---

## Pending Tasks (Backlog)

### P1
- [ ] Traducir Investor Demo al español

### P2
- [ ] About / Legal page content
- [ ] Animated logo

### Future
- [ ] Real device integration (Web Bluetooth)
- [ ] Additional languages

---

## Notes

- All biometric data is SIMULATED
- No backend required
- Designed to feel disturbing, not friendly
- Keyboard shortcuts: SPACE (start/stop), ESC (close menus)
