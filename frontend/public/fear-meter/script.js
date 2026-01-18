/**
 * FEAR METER v1.0
 * Biometric Horror System
 * Pure Vanilla JavaScript - No Dependencies
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    const CONFIG = {
        SIMULATION_INTERVAL: 500,
        PANIC_BPM: 110,
        PANIC_STRESS: 75,
        PANIC_COOLDOWN: 8000,
        PANIC_DURATION: 2000
    };

    // ============================================
    // STATE
    // ============================================
    
    const STATE = {
        isActive: false,
        isPanic: false,
        isBlocked: false,
        bpm: 72,
        stress: 0,
        signal: 'STABLE',
        baseBpm: 72,
        targetBpm: 72,
        currentView: 'monitor',
        menuOpen: false,
        language: 'EN',
        
        // Timers
        simulationInterval: null,
        oscilloscopeAnimation: null,
        watchAnimation: null,
        oscilloscopePhase: 0,
        
        // Session
        sessionStart: null,
        sessionData: [],
        
        // Panic
        lastPanic: 0,
        panicTimeout: null
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    
    const DOM = {};

    function cacheDOMElements() {
        // Overlays
        DOM.vignetteOverlay = document.getElementById('vignette-overlay');
        DOM.panicOverlay = document.getElementById('panic-overlay');
        DOM.criticalAlert = document.getElementById('critical-alert');
        
        // Header
        DOM.menuBtn = document.getElementById('menu-btn');
        
        // Monitor
        DOM.viewMonitor = document.getElementById('view-monitor');
        DOM.oscilloscopeContainer = document.getElementById('oscilloscope-container');
        DOM.oscilloscope = document.getElementById('oscilloscope');
        DOM.ecgDot = document.querySelector('.ecg-dot');
        DOM.criticalLabel = document.getElementById('critical-label');
        DOM.bpmBlock = document.getElementById('bpm-block');
        DOM.stressBlock = document.getElementById('stress-block');
        DOM.signalBlock = document.getElementById('signal-block');
        DOM.bpmValue = document.getElementById('bpm-value');
        DOM.stressValue = document.getElementById('stress-value');
        DOM.signalValue = document.getElementById('signal-value');
        DOM.mainBtn = document.getElementById('main-btn');
        DOM.mainBtnText = document.getElementById('main-btn-text');
        
        // Watch
        DOM.viewWatch = document.getElementById('view-watch');
        DOM.watchCanvas = document.getElementById('watch-canvas');
        DOM.watchBpm = document.getElementById('watch-bpm');
        DOM.watchStatusText = document.getElementById('watch-status-text');
        DOM.watchDot = document.querySelector('.watch-dot');
        DOM.watchSignal = document.querySelector('.watch-signal');
        DOM.watchStartBtn = document.getElementById('watch-start-btn');
        DOM.watchExitBtn = document.getElementById('watch-exit-btn');
        
        // History
        DOM.viewHistory = document.getElementById('view-history');
        DOM.historyContent = document.getElementById('history-content');
        DOM.tabBtns = document.querySelectorAll('.tab-btn');
        
        // Menu
        DOM.menuOverlay = document.getElementById('menu-overlay');
        DOM.sideMenu = document.getElementById('side-menu');
        DOM.menuClose = document.getElementById('menu-close');
        DOM.menuItems = document.querySelectorAll('.menu-item');
        DOM.langBtns = document.querySelectorAll('.lang-btn');
    }

    // ============================================
    // UTILITIES
    // ============================================
    
    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    function getHistory() {
        try {
            return JSON.parse(localStorage.getItem('fearMeterHistory')) || [];
        } catch {
            return [];
        }
    }

    function saveHistory(data) {
        try {
            localStorage.setItem('fearMeterHistory', JSON.stringify(data));
        } catch {}
    }

    // ============================================
    // OSCILLOSCOPE
    // ============================================
    
    function setupOscilloscope() {
        const canvas = DOM.oscilloscope;
        if (!canvas) return;

        function updateSize() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            const ctx = canvas.getContext('2d');
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        updateSize();
        window.addEventListener('resize', updateSize);
    }

    function drawOscilloscope() {
        const canvas = DOM.oscilloscope;
        if (!canvas || STATE.currentView !== 'monitor') {
            STATE.oscilloscopeAnimation = null;
            return;
        }

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const centerY = height / 2;

        // Clear
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = 'rgba(255,0,0,0.04)';
        ctx.lineWidth = 1;
        for (let y = 0; y <= height; y += height / 4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        for (let x = 0; x <= width; x += width / 8) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        if (!STATE.isActive) {
            // Flat line
            ctx.strokeStyle = 'rgba(255,0,0,0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();
            STATE.oscilloscopeAnimation = requestAnimationFrame(drawOscilloscope);
            return;
        }

        // ECG waveform
        const bpm = STATE.bpm;
        const isPanic = STATE.isPanic;
        const frequency = bpm / 60;
        const speed = frequency * 4 + (isPanic ? 3 : 0);
        const amplitude = height * (isPanic ? 0.4 : 0.28);
        const jitter = (Math.random() - 0.5) * (isPanic ? 8 : 0.5);

        STATE.oscilloscopePhase += speed * 0.02;

        ctx.strokeStyle = isPanic ? 'rgba(139,0,0,0.95)' : 'rgba(255,0,0,0.85)';
        ctx.lineWidth = isPanic ? 2.5 : 1.5;
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = isPanic ? 12 : 4;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
            const t = (x / width) * Math.PI * 4 + STATE.oscilloscopePhase;
            const cyclePos = (t % (Math.PI * 2)) / (Math.PI * 2);
            
            let y = 0;
            if (cyclePos < 0.1) {
                y = Math.sin(cyclePos * Math.PI * 10) * 0.2;
            } else if (cyclePos < 0.15) {
                y = 0;
            } else if (cyclePos < 0.2) {
                y = -0.1;
            } else if (cyclePos < 0.25) {
                y = Math.sin((cyclePos - 0.2) * Math.PI * 20) * (isPanic ? 1.3 : 1);
            } else if (cyclePos < 0.3) {
                y = isPanic ? -0.3 : -0.2;
            } else if (cyclePos < 0.35) {
                y = 0;
            } else if (cyclePos < 0.5) {
                y = Math.sin((cyclePos - 0.35) * Math.PI * 6.67) * 0.3;
            }

            const noise = isPanic ? (Math.random() - 0.5) * 2 : 0;
            const yPos = centerY - (y * amplitude) + jitter + noise;
            
            if (x === 0) ctx.moveTo(x, yPos);
            else ctx.lineTo(x, yPos);
        }

        ctx.stroke();
        ctx.shadowBlur = 0;

        STATE.oscilloscopeAnimation = requestAnimationFrame(drawOscilloscope);
    }

    function startOscilloscope() {
        if (!STATE.oscilloscopeAnimation) {
            drawOscilloscope();
        }
    }

    function stopOscilloscope() {
        if (STATE.oscilloscopeAnimation) {
            cancelAnimationFrame(STATE.oscilloscopeAnimation);
            STATE.oscilloscopeAnimation = null;
        }
    }

    // ============================================
    // WATCH CANVAS
    // ============================================
    
    function setupWatchCanvas() {
        const canvas = DOM.watchCanvas;
        if (!canvas) return;

        function updateSize() {
            const face = canvas.parentElement;
            const size = Math.min(face.offsetWidth, face.offsetHeight);
            canvas.width = size * window.devicePixelRatio;
            canvas.height = size * window.devicePixelRatio;
            canvas.style.width = size + 'px';
            canvas.style.height = size + 'px';
            const ctx = canvas.getContext('2d');
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        updateSize();
        window.addEventListener('resize', updateSize);
    }

    function drawWatchArc() {
        const canvas = DOM.watchCanvas;
        if (!canvas || STATE.currentView !== 'watch') return;

        const ctx = canvas.getContext('2d');
        const size = Math.min(canvas.offsetWidth, canvas.offsetHeight);
        if (size <= 0) return;

        const center = size / 2;
        const radius = center - 10;

        ctx.clearRect(0, 0, size, size);

        // Background circle
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,0,0,0.15)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Progress arc
        if (STATE.isActive) {
            const progress = Math.min((STATE.bpm - 60) / 80, 1);
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + (Math.PI * 2 * progress);

            ctx.beginPath();
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.strokeStyle = STATE.isPanic ? '#8B0000' : '#FF0000';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#FF0000';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    function startWatchAnimation() {
        if (STATE.watchAnimation) return;
        
        drawWatchArc();
        STATE.watchAnimation = setInterval(() => {
            if (STATE.currentView !== 'watch') {
                stopWatchAnimation();
                return;
            }
            drawWatchArc();
        }, 100);
    }

    function stopWatchAnimation() {
        if (STATE.watchAnimation) {
            clearInterval(STATE.watchAnimation);
            STATE.watchAnimation = null;
        }
    }

    // ============================================
    // BIOMETRIC SIMULATION
    // ============================================
    
    function calculateStress(bpm) {
        if (bpm <= 70) return Math.round(Math.random() * 10);
        if (bpm <= 85) return Math.round(15 + Math.random() * 15);
        if (bpm <= 100) return Math.round(35 + Math.random() * 20);
        if (bpm <= 115) return Math.round(60 + Math.random() * 15);
        return Math.round(80 + Math.random() * 20);
    }

    function calculateSignal(bpm, stress) {
        if (stress > 80 || bpm > 115) return 'CRITICAL';
        if (stress > 50 || bpm > 95) return 'ELEVATED';
        return 'STABLE';
    }

    function simulateBpm() {
        const now = Date.now();
        
        // Move towards target
        const diff = STATE.targetBpm - STATE.baseBpm;
        STATE.baseBpm += diff * 0.1;
        
        // Add variation
        const variation = (Math.random() - 0.5) * (STATE.isPanic ? 6 : 4);
        
        // Random spikes
        if (Math.random() < 0.03) {
            STATE.targetBpm = Math.min(135, STATE.baseBpm + Math.random() * 25);
        }
        
        // Gradual decrease
        if (STATE.targetBpm > 85 && Math.random() < 0.04 && !STATE.isPanic) {
            STATE.targetBpm -= 1.5;
        }

        const newBpm = Math.round(clamp(STATE.baseBpm + variation, 60, 140));
        const newStress = calculateStress(newBpm);
        const newSignal = calculateSignal(newBpm, newStress);
        
        STATE.bpm = newBpm;
        STATE.stress = newStress;
        STATE.signal = newSignal;

        // Screen effects
        updateScreenEffects(newBpm);

        // Panic check
        const shouldPanic = newBpm > CONFIG.PANIC_BPM && newStress > CONFIG.PANIC_STRESS;
        
        if (shouldPanic && !STATE.isPanic && now - STATE.lastPanic > CONFIG.PANIC_COOLDOWN) {
            triggerPanic();
        } else if (!shouldPanic && STATE.isPanic) {
            endPanic();
        }

        // Record data
        if (STATE.sessionStart) {
            STATE.sessionData.push({ time: now, bpm: newBpm, stress: newStress });
        }

        updateDisplay();
        updateWatch();
    }

    function updateScreenEffects(bpm) {
        if (!STATE.isActive) {
            DOM.vignetteOverlay.classList.remove('active');
            return;
        }
        
        // Vignette above 100 BPM
        DOM.vignetteOverlay.classList.toggle('active', bpm > 100);
    }

    // ============================================
    // PANIC MODE
    // ============================================
    
    function triggerPanic() {
        STATE.isPanic = true;
        STATE.isBlocked = true;
        STATE.lastPanic = Date.now();
        
        // Vibration
        try {
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        } catch {}
        
        // Flash
        DOM.panicOverlay.classList.add('flash');
        setTimeout(() => DOM.panicOverlay.classList.remove('flash'), 200);
        
        // Critical alert after 1 second
        STATE.panicTimeout = setTimeout(() => {
            DOM.criticalAlert.classList.add('visible');
            
            // Auto-dismiss
            setTimeout(() => {
                DOM.criticalAlert.classList.remove('visible');
                STATE.isBlocked = false;
            }, CONFIG.PANIC_DURATION);
        }, 1000);
        
        updatePanicUI(true);
    }

    function endPanic() {
        STATE.isPanic = false;
        
        if (STATE.panicTimeout) {
            clearTimeout(STATE.panicTimeout);
            STATE.panicTimeout = null;
        }
        
        DOM.criticalAlert.classList.remove('visible');
        STATE.isBlocked = false;
        
        // Recovery
        STATE.targetBpm = 75 + Math.random() * 10;
        
        updatePanicUI(false);
    }

    function updatePanicUI(isPanic) {
        DOM.oscilloscopeContainer.classList.toggle('panic', isPanic);
        DOM.criticalLabel.classList.toggle('visible', isPanic);
        DOM.mainBtn.classList.toggle('panic', isPanic);
    }

    // ============================================
    // SESSION MANAGEMENT
    // ============================================
    
    function startSession() {
        if (STATE.isBlocked) return;
        
        STATE.isActive = true;
        STATE.sessionStart = Date.now();
        STATE.sessionData = [];
        STATE.baseBpm = 72;
        STATE.targetBpm = 75 + Math.random() * 10;
        
        STATE.simulationInterval = setInterval(simulateBpm, CONFIG.SIMULATION_INTERVAL);
        
        updateDisplay();
        updateWatch();
        updateMainButton();
        
        DOM.ecgDot.classList.add('active');
    }

    function stopSession() {
        STATE.isActive = false;
        
        if (STATE.simulationInterval) {
            clearInterval(STATE.simulationInterval);
            STATE.simulationInterval = null;
        }
        
        if (STATE.isPanic) endPanic();
        
        // Save session
        if (STATE.sessionStart && STATE.sessionData.length > 0) {
            saveSession();
        }
        
        STATE.sessionStart = null;
        STATE.sessionData = [];
        STATE.bpm = 72;
        STATE.stress = 0;
        STATE.signal = 'STABLE';
        
        updateDisplay();
        updateWatch();
        updateMainButton();
        updateScreenEffects(72);
        
        DOM.ecgDot.classList.remove('active');
    }

    function saveSession() {
        const history = getHistory();
        const duration = Date.now() - STATE.sessionStart;
        const bpms = STATE.sessionData.map(d => d.bpm);
        
        const session = {
            id: STATE.sessionStart,
            date: new Date(STATE.sessionStart).toLocaleDateString(),
            duration: Math.round(duration / 1000),
            avgBpm: Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length),
            maxBpm: Math.max(...bpms),
            maxStress: Math.max(...STATE.sessionData.map(d => d.stress))
        };
        
        history.unshift(session);
        if (history.length > 50) history.pop();
        saveHistory(history);
    }

    // ============================================
    // UI UPDATES
    // ============================================
    
    function updateDisplay() {
        if (STATE.isActive) {
            DOM.bpmValue.textContent = STATE.bpm;
            DOM.stressValue.textContent = STATE.stress + '%';
            DOM.signalValue.textContent = STATE.signal;
        } else {
            DOM.bpmValue.textContent = '---';
            DOM.stressValue.textContent = '---';
            DOM.signalValue.textContent = '---';
        }
        
        const isActive = STATE.isActive;
        const isPanic = STATE.isPanic;
        
        [DOM.bpmBlock, DOM.stressBlock, DOM.signalBlock].forEach(block => {
            block.classList.toggle('active', isActive && !isPanic);
            block.classList.toggle('critical', isPanic);
        });
        
        [DOM.bpmValue, DOM.stressValue, DOM.signalValue].forEach(val => {
            val.classList.toggle('active', isActive && !isPanic);
            val.classList.toggle('panic', isPanic);
        });
    }

    function updateMainButton() {
        DOM.mainBtnText.textContent = STATE.isActive ? 'STOP SESSION' : 'START SESSION';
        DOM.mainBtn.classList.toggle('active', STATE.isActive && !STATE.isPanic);
    }

    function updateWatch() {
        if (STATE.isActive) {
            DOM.watchBpm.textContent = STATE.bpm;
            DOM.watchBpm.classList.add('active');
            DOM.watchDot.classList.add('active');
            DOM.watchStatusText.textContent = STATE.isPanic ? 'CRITICAL' : 'RECORDING';
            DOM.watchSignal.classList.add('visible');
            DOM.watchStartBtn.textContent = 'STOP';
        } else {
            DOM.watchBpm.textContent = '---';
            DOM.watchBpm.classList.remove('active');
            DOM.watchDot.classList.remove('active');
            DOM.watchStatusText.textContent = 'STANDBY';
            DOM.watchSignal.classList.remove('visible');
            DOM.watchStartBtn.textContent = 'START';
        }
    }

    // ============================================
    // HISTORY
    // ============================================
    
    function renderHistory() {
        const history = getHistory();
        
        if (history.length === 0) {
            DOM.historyContent.innerHTML = `
                <div class="history-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <p>NO SESSIONS RECORDED</p>
                </div>
            `;
            return;
        }
        
        DOM.historyContent.innerHTML = history.map(s => `
            <div class="session-card">
                <div class="session-card-header">
                    <span class="session-date">${s.date}</span>
                    <span class="session-duration">${s.duration}s</span>
                </div>
                <div class="session-stats">
                    <span class="session-stat">AVG: <span>${s.avgBpm}</span></span>
                    <span class="session-stat">MAX: <span>${s.maxBpm}</span></span>
                    <span class="session-stat">STRESS: <span>${s.maxStress}%</span></span>
                </div>
            </div>
        `).join('');
    }

    // ============================================
    // VIEW MANAGEMENT
    // ============================================
    
    function showView(viewName) {
        if (viewName === 'about') {
            alert('FEAR METER v1.0\n\nExperimental Biometric Horror System\n\n© 2026 FEAR METER');
            return;
        }
        
        STATE.currentView = viewName;
        
        // Stop animations
        stopOscilloscope();
        stopWatchAnimation();
        
        // Hide all views
        DOM.viewMonitor.classList.remove('active');
        DOM.viewWatch.classList.remove('active');
        DOM.viewHistory.classList.remove('active');
        
        // Show selected view
        if (viewName === 'monitor') {
            DOM.viewMonitor.classList.add('active');
            startOscilloscope();
        } else if (viewName === 'watch') {
            DOM.viewWatch.classList.add('active');
            setupWatchCanvas();
            startWatchAnimation();
            updateWatch();
        } else if (viewName === 'history') {
            DOM.viewHistory.classList.add('active');
            renderHistory();
        }
        
        // Update menu
        DOM.menuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });
        
        closeMenu();
    }

    // ============================================
    // MENU
    // ============================================
    
    function openMenu() {
        if (STATE.isBlocked) return;
        STATE.menuOpen = true;
        DOM.menuOverlay.classList.add('visible');
        DOM.sideMenu.classList.add('open');
    }

    function closeMenu() {
        STATE.menuOpen = false;
        DOM.menuOverlay.classList.remove('visible');
        DOM.sideMenu.classList.remove('open');
    }

    // ============================================
    // LANGUAGE
    // ============================================
    
    const TEXTS = {
        EN: {
            startSession: 'START SESSION',
            stopSession: 'STOP SESSION',
            noSessions: 'NO SESSIONS RECORDED'
        },
        ES: {
            startSession: 'INICIAR SESIÓN',
            stopSession: 'DETENER SESIÓN',
            noSessions: 'SIN SESIONES REGISTRADAS'
        }
    };

    function setLanguage(lang) {
        STATE.language = lang;
        DOM.langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        updateMainButton();
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    function setupEventListeners() {
        // Main button
        DOM.mainBtn.addEventListener('click', () => {
            if (STATE.isActive) stopSession();
            else startSession();
        });
        
        // Menu
        DOM.menuBtn.addEventListener('click', openMenu);
        DOM.menuClose.addEventListener('click', closeMenu);
        DOM.menuOverlay.addEventListener('click', closeMenu);
        
        // Menu items
        DOM.menuItems.forEach(item => {
            item.addEventListener('click', () => showView(item.dataset.view));
        });
        
        // Language
        DOM.langBtns.forEach(btn => {
            btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
        });
        
        // Watch buttons
        DOM.watchStartBtn.addEventListener('click', () => {
            if (STATE.isActive) stopSession();
            else startSession();
        });
        
        DOM.watchExitBtn.addEventListener('click', () => {
            if (STATE.isActive) stopSession();
            showView('monitor');
        });
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !STATE.isBlocked) {
                e.preventDefault();
                if (STATE.isActive) stopSession();
                else startSession();
            }
            if (e.code === 'Escape') {
                if (STATE.menuOpen) closeMenu();
                else if (STATE.currentView !== 'monitor') showView('monitor');
            }
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        cacheDOMElements();
        setupEventListeners();
        setupOscilloscope();
        startOscilloscope();
        updateDisplay();
        updateMainButton();
        
        console.log('%c FEAR METER v1.0 ', 'background:#8B0000;color:#FF0000;font-size:14px;font-weight:bold');
        console.log('%c Biometric Horror System ', 'color:#B0B0B0;font-size:10px');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
