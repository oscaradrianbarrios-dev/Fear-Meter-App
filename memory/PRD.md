# FEAR METER - Product Requirements Document

## Original Problem Statement
Crear una aplicación de página única (SPA) llamada "FEAR METER" con estética de "horror biométrico". La interfaz debe ser clínica, minimalista y aterradora, no amigable. 

## Product Overview
FEAR METER es un sistema experimental de monitoreo biométrico de horror que simula la detección del miedo a través de métricas cardíacas y de estrés.

---

## Core Features (All Implemented ✅)

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

### 5. Watch Mode - FULLSCREEN SMARTWATCH ✅
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

### 6. Investor Demo Experience ✅
**URL: `/investor-demo/`** - Experiencia cinematográfica de 45 segundos con modelo de negocio completo

### 7. Audio System (Web Audio API) ✅
- Sonido de estática clínica al iniciar sesión
- Latido rítmico sincronizado con BPM (acelera con BPM alto)
- Alarma de pánico con tonos disonantes

### 8. PWA - Progressive Web App ✅
- manifest.json con todos los iconos
- Service Worker para funcionalidad offline
- Instalable en dispositivos móviles

---

## Technical Stack

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

---

## File Structure (Complete)

```
/app/frontend/public/
├── fear-meter/
│   ├── index.html          - Main HTML with PWA meta tags
│   ├── styles.css          - Complete design system
│   ├── app.js              - Logic + Audio Engine
│   ├── manifest.json       - PWA manifest
│   ├── sw.js               - Service Worker
│   └── icons/              - PWA icons (72px to 512px)
│
└── investor-demo/
    ├── index.html          - Investor demo structure
    ├── demo.css            - Demo styles
    └── demo.js             - Automated demo timeline
```

---

## Bug Fixes (January 2026)

### ✅ Watch Mode Animation Bug - FIXED
- **Problem**: `requestAnimationFrame` loop was blocking Playwright's idle detection, causing screenshot timeouts
- **Solution**: 
  1. Changed Watch animation from `requestAnimationFrame` to `setInterval(100ms)`
  2. Added `startOscilloscopeAnimation()` and `stopOscilloscopeAnimation()` functions
  3. Oscilloscope animation now stops when entering Watch Mode and restarts when exiting
  4. Removed duplicate `updateWatchMode()` function with incorrect DOM references

---

## GitHub Export Ready

The project is ready for "Save to GitHub". The Vanilla JS version at `/fear-meter/` can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

No build step required - just upload the files.

---

## Pending Tasks (Backlog)

### P1 - Next Priority
- [ ] Traducir Investor Demo al español

### P2 - Low Priority
- [ ] About / Legal page content
- [ ] Additional languages (PT, FR, DE)
- [ ] Animated logo for Fear Meter

### Future Enhancements
- [ ] Real device integration (heart rate monitors via Web Bluetooth)
- [ ] Export session data to JSON/CSV
- [ ] Share sessions feature
- [ ] Leaderboard of "most terrified"

---

## Notes

- All biometric data is SIMULATED (mock)
- No backend required
- No external APIs
- Designed for mobile-first (touch interactions)
- Keyboard shortcuts: SPACE (start/stop), ESC (close menus)
