# FEAR METER - Product Requirements Document

## Original Problem Statement
Crear una aplicación de página única (SPA) llamada "FEAR METER" con estética de "horror biométrico". La interfaz debe ser clínica, minimalista y aterradora, no amigable. 

## Product Overview
FEAR METER es un sistema experimental de monitoreo biométrico de horror que simula la detección del miedo a través de métricas cardíacas y de estrés.

---

## Core Features (Implemented ✅)

### 1. Monitor Principal
- Osciloscopio ECG animado en canvas
- Panel de datos: BPM, STRESS %, SIGNAL
- Botón circular START/STOP SESSION
- Fluctuación realista de datos biométricos

### 2. Modo Pánico (Panic Mode)
- Activación automática: BPM > 110 AND Stress > 75%
- Efecto de pantalla: flash + blackout
- Overlay "CRITICAL STRESS DETECTED"
- Vibración del dispositivo (si disponible)
- Jitter visual en el osciloscopio
- Recuperación gradual

### 3. Fear Sessions (Sesiones de Miedo)
- Grabación de sesiones completas
- Persistencia via localStorage
- Datos guardados: fecha, duración, BPM promedio/máximo, stress máximo
- Historial de eventos de pánico

### 4. Historial (History)
- Vista de lista con tarjetas detalladas
- Vista de gráfico con evolución del miedo
- Detalle de sesión con mini-gráfico BPM
- Marcadores de eventos PANIC
- Análisis técnico por sesión

### 5. Watch Mode - FULLSCREEN SMARTWATCH ✅ NEW
**Interfaz fullscreen que simula un ecosistema Watch + Smartphone**

#### Layout
- Pantalla circular centrada (320px en desktop, responsivo en móvil)
- Fondo negro absoluto (#000000)
- Borde rojo tenue pulsante
- BPM grande al centro (72px)
- Arco de progreso circular que se llena según BPM
- Indicador "LIVE FEAR SIGNAL"

#### Sincronización Smartphone ↔ Watch
- Watch refleja BPM actual en tiempo real
- Estado de sesión sincronizado (START/STOP)
- Eventos de pánico reflejados en ambos dispositivos
- Flash rojo en Watch durante pánico
- Arco se vuelve sólido durante pánico
- Mensaje "SESSION SAVED" al finalizar

#### Controles
- Botón START/STOP integrado
- Botón EXIT para volver al Monitor
- Tap en watch face para aumentar stress
- Long-press (2s) para activar Demo Mode

### 6. Demo Mode para Inversores ✅ ENHANCED
- Activación: long-press en Watch face o acceso oculto
- Loop controlado con BPM progresivo (70→125→85)
- Evento de pánico simulado automáticamente
- Indicador discreto "DEMO DATA — SIMULATED"
- No guarda datos reales en historial

### 7. Menú Lateral
- Navegación entre vistas
- Selector de idioma (EN/ES)
- About / Legal

### 8. Audio System (Web Audio API)
- Sonido de estática clínica al iniciar sesión
- Latido rítmico sincronizado con BPM
- Alarma de pánico con tonos disonantes
- Datos más estables (70-110 BPM)
- Historial pre-cargado
- Indicador discreto "DEMO MODE"

---

## Technical Stack

### React Version (Development)
- React 18 + React Router
- Tailwind CSS + Shadcn/UI components
- Custom hooks: useBiometricSimulation, useSessionManager
- Canvas API para osciloscopio
- localStorage para persistencia

### Vanilla JS Version (Production/Export)
- HTML5 + CSS3 + Vanilla JavaScript
- Sin dependencias externas
- Archivos separados: index.html, styles.css, app.js
- Ready for GitHub Pages o hosting estático

---

## Design System

### Color Palette
```
Black (Background): #000000
Primary Red: #FF0000
Dark Red (Panic): #8B0000
Secondary Gray: #B0B0B0
White: #FFFFFF
```

### Typography
- Font: JetBrains Mono (Google Fonts)
- Weights: 400 (regular), 700 (bold)
- Letter-spacing: 0.1em - 0.3em

### Visual Effects
- Subtle pulsing animations
- Glow effects (red shadows)
- Micro-tremor for tension
- Screen jitter during panic
- Amplitude ramp on oscilloscope start

---

## File Structure

### React App
```
/app/frontend/src/
├── components/
│   ├── FearMeterApp.jsx (Main wrapper)
│   ├── Monitor.jsx
│   ├── Oscilloscope.jsx
│   ├── DataGrid.jsx
│   ├── MainButton.jsx
│   ├── SideMenu.jsx
│   ├── WatchMode.jsx
│   ├── History.jsx
│   ├── CriticalAlert.jsx
│   └── PanicOverlay.jsx
├── hooks/
│   ├── useBiometricSimulation.js
│   └── useSessionManager.js
└── index.css
```

### Vanilla JS Version
```
/app/frontend/public/fear-meter/
├── index.html
├── styles.css
└── app.js
```

---

## Data Schema (localStorage)

```json
{
  "key": "fear_meter_sessions",
  "sessions": [
    {
      "id": 1736637600000,
      "startTime": 1736637600000,
      "endTime": 1736637720000,
      "name": "Night Terror",
      "date": "Jan 11, 2026, 10:00 PM",
      "duration": 120000,
      "durationText": "2m 0s",
      "avgBpm": 95,
      "maxBpm": 128,
      "maxStress": 85,
      "bpmHistory": [{"timestamp": ..., "value": 72}, ...],
      "panicEvents": [{"timestamp": ..., "bpm": 125, "stress": 88}],
      "hasPanicEvent": true,
      "panicCount": 1
    }
  ]
}
```

---

## URLs & Routes

- `/` - Main React App (Monitor)
- `/demo` - Demo Mode for Investors
- `/fear-meter/` - Static Vanilla JS version

---

## Completed Work Log

### January 2026
- ✅ Initial scaffolding with React + Tailwind + Shadcn
- ✅ Core UI components (Header, Monitor, Oscilloscope, DataGrid)
- ✅ Biometric simulation hook with realistic fluctuation
- ✅ Panic Mode with visual effects (freeze, flash, jitter)
- ✅ Side Menu with language switching (EN/ES)
- ✅ Watch Mode with circular UI
- ✅ History view (list + graph + detail)
- ✅ Demo Mode for investors
- ✅ Fear Sessions with localStorage persistence
- ✅ **Production export: Vanilla JS version** (HTML + CSS + JS)

---

## Pending Tasks (Backlog)

### P2 - Low Priority
- [ ] About / Legal page content
- [ ] Additional languages (PT, FR, DE)

### Future Enhancements
- [ ] Real device integration (heart rate monitors via Web Bluetooth)
- [ ] Export session data to JSON/CSV
- [ ] Share sessions feature
- [ ] Leaderboard of "most terrified"

---

## Recently Completed (January 2026)

### ✅ Web Audio API - Sound Effects
- **Static burst sound** on session start (clinical, unsettling)
- **Rhythmic heartbeat** that accelerates with BPM
- **Panic alarm** with dissonant tones during critical events
- All sounds generated programmatically - no external audio files

### ✅ PWA Manifest & Installation
- Full PWA support for mobile installation
- Service Worker for offline functionality
- App icons (72px to 512px)
- Standalone display mode
- Theme color: black (#000000)

---

## File Structure (Complete)

```
/app/frontend/public/fear-meter/
├── index.html          (13.6KB) - Main HTML with PWA meta tags
├── styles.css          (26.9KB) - Complete design system
├── app.js              (63.1KB) - Logic + Audio Engine
├── manifest.json       (2.2KB)  - PWA manifest
├── sw.js               (5.0KB)  - Service Worker
└── icons/
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    └── icon-512.png
```

---

## GitHub Export Ready

The project is ready for "Save to GitHub". The Vanilla JS version at `/fear-meter/` can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

No build step required - just upload the 3 files.

---

## Notes

- All biometric data is SIMULATED (mock)
- No backend required
- No external APIs
- Designed for mobile-first (touch interactions)
- Keyboard shortcuts: SPACE (start/stop), ESC (close menus)
