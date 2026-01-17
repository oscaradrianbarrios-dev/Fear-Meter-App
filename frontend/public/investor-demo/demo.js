/**
 * FEAR METER — Investor Demo
 * Cinematic Business Model Experience
 * © 2026 FEAR METER
 */

(function() {
    'use strict';

    // ============================================
    // TIMELINE CONFIGURATION (Extended for Business Model)
    // ============================================
    
    const TIMELINE = {
        TOTAL_DURATION: 45000, // 45 seconds for full business model
        screens: [
            { id: 'screen-1', start: 0, end: 3000 },       // Impact (0-3s)
            { id: 'screen-2', start: 3000, end: 7000 },    // Problem (3-7s)
            { id: 'screen-3', start: 7000, end: 12000 },   // Solution (7-12s)
            { id: 'screen-4', start: 12000, end: 17000 },  // Demo/Panic (12-17s)
            { id: 'screen-5', start: 17000, end: 22000 },  // Applications (17-22s)
            { id: 'screen-6', start: 22000, end: 27000 },  // Layer 1: B2C (22-27s)
            { id: 'screen-7', start: 27000, end: 32000 },  // Layer 2: Hardware (27-32s)
            { id: 'screen-8', start: 32000, end: 37000 },  // Layer 3: B2B (32-37s)
            { id: 'screen-9', start: 37000, end: 41000 },  // Projection (37-41s)
            { id: 'screen-10', start: 41000, end: 45000 }, // Closing (41-45s)
        ]
    };

    // ============================================
    // STATE
    // ============================================
    
    const STATE = {
        isPlaying: false,
        startTime: null,
        currentTime: 0,
        animationFrame: null,
        currentScreen: null,
        bpm: 72,
        stress: 0,
        oscilloscopePhase: 0,
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    
    const DOM = {
        oscilloscope: document.getElementById('oscilloscope'),
        progressFill: document.getElementById('progress-fill'),
        deckBtn: document.getElementById('deck-btn'),
        replayBtn: document.getElementById('replay-btn'),
        panicFlash: document.getElementById('panic-flash'),
        screens: {},
        bpmDisplays: {},
    };

    function cacheDOMElements() {
        TIMELINE.screens.forEach(screen => {
            DOM.screens[screen.id] = document.getElementById(screen.id);
        });
        
        DOM.bpmDisplays = {
            bpm1: document.getElementById('bpm-1'),
            bpm2: document.getElementById('bpm-2'),
            stress2: document.getElementById('stress-2'),
            phoneBpm: document.getElementById('phone-bpm'),
            watchBpm: document.getElementById('watch-bpm'),
            panicBpm: document.getElementById('panic-bpm'),
        };
        
        DOM.phoneCanvas = document.getElementById('phone-canvas');
        DOM.watchCanvas = document.getElementById('watch-canvas');
        DOM.finalPulse = document.getElementById('final-pulse');
    }

    // ============================================
    // OSCILLOSCOPE
    // ============================================
    
    function setupOscilloscope() {
        const canvas = DOM.oscilloscope;
        const updateSize = () => {
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio;
            const ctx = canvas.getContext('2d');
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        updateSize();
        window.addEventListener('resize', updateSize);
    }

    function drawOscilloscope() {
        const canvas = DOM.oscilloscope;
        const ctx = canvas.getContext('2d');
        const width = window.innerWidth;
        const height = window.innerHeight;
        const centerY = height / 2;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Calculate waveform parameters based on BPM
        const frequency = STATE.bpm / 60;
        const amplitude = height * 0.15;
        const speed = frequency * 3;

        STATE.oscilloscopePhase += speed * 0.02;

        // Draw ECG waveform
        ctx.strokeStyle = STATE.bpm > 110 ? 'rgba(139, 0, 0, 0.8)' : 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = STATE.bpm > 110 ? 15 : 8;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
            const t = (x / width) * Math.PI * 4 + STATE.oscilloscopePhase;
            let y = 0;
            const cyclePos = (t % (Math.PI * 2)) / (Math.PI * 2);
            
            if (cyclePos < 0.1) {
                y = Math.sin(cyclePos * Math.PI * 10) * 0.2;
            } else if (cyclePos < 0.15) {
                y = 0;
            } else if (cyclePos < 0.2) {
                y = -0.1;
            } else if (cyclePos < 0.25) {
                y = Math.sin((cyclePos - 0.2) * Math.PI * 20);
            } else if (cyclePos < 0.3) {
                y = -0.2;
            } else if (cyclePos < 0.35) {
                y = 0;
            } else if (cyclePos < 0.5) {
                y = Math.sin((cyclePos - 0.35) * Math.PI * 6.67) * 0.3;
            } else {
                y = 0;
            }

            const yPos = centerY - (y * amplitude);
            
            if (x === 0) {
                ctx.moveTo(x, yPos);
            } else {
                ctx.lineTo(x, yPos);
            }
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // ============================================
    // MINI CANVASES (Phone & Watch)
    // ============================================
    
    function setupMiniCanvases() {
        [DOM.phoneCanvas, DOM.watchCanvas].forEach(canvas => {
            if (!canvas) return;
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth * window.devicePixelRatio;
            canvas.height = parent.offsetHeight * window.devicePixelRatio;
            const ctx = canvas.getContext('2d');
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        });
    }

    function drawPhoneOscilloscope() {
        const canvas = DOM.phoneCanvas;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;
        const centerY = height / 2;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
            const t = (x / width) * Math.PI * 3 + STATE.oscilloscopePhase;
            let y = 0;
            const cyclePos = (t % (Math.PI * 2)) / (Math.PI * 2);
            
            if (cyclePos > 0.2 && cyclePos < 0.25) {
                y = Math.sin((cyclePos - 0.2) * Math.PI * 20) * 0.8;
            } else if (cyclePos > 0.35 && cyclePos < 0.5) {
                y = Math.sin((cyclePos - 0.35) * Math.PI * 6.67) * 0.2;
            }

            const yPos = centerY - (y * height * 0.4);
            x === 0 ? ctx.moveTo(x, yPos) : ctx.lineTo(x, yPos);
        }

        ctx.stroke();
    }

    function drawWatchArc() {
        const canvas = DOM.watchCanvas;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const size = canvas.width / window.devicePixelRatio;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.4;

        ctx.clearRect(0, 0, size, size);

        // Background arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Progress arc
        const progress = (STATE.bpm - 60) / 80;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (Math.PI * 2 * Math.min(progress, 1));

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    // ============================================
    // SCREEN TRANSITIONS
    // ============================================
    
    function showScreen(screenId) {
        if (STATE.currentScreen === screenId) return;
        
        // Hide all screens
        Object.values(DOM.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = DOM.screens[screenId];
        if (targetScreen) {
            targetScreen.classList.add('active');
            STATE.currentScreen = screenId;
            
            // Trigger screen-specific animations
            triggerScreenAnimations(screenId);
        }
    }

    function triggerScreenAnimations(screenId) {
        switch(screenId) {
            case 'screen-3':
                // Reveal devices
                setTimeout(() => {
                    document.querySelectorAll('.device').forEach((el, i) => {
                        setTimeout(() => el.classList.add('visible'), i * 400);
                    });
                }, 300);
                break;
                
            case 'screen-4':
                // Trigger panic flash
                setTimeout(() => {
                    DOM.panicFlash.classList.add('active');
                    triggerVibration();
                    setTimeout(() => DOM.panicFlash.classList.remove('active'), 200);
                }, 1000);
                break;
                
            case 'screen-5':
                // Reveal applications
                setTimeout(() => {
                    document.querySelectorAll('.app-item').forEach(el => {
                        el.classList.add('visible');
                    });
                }, 200);
                break;
                
            case 'screen-6':
                // Reveal business model
                setTimeout(() => {
                    document.querySelectorAll('.model-item, .model-plus').forEach(el => {
                        el.classList.add('visible');
                    });
                    document.querySelector('.tagline').classList.add('visible');
                }, 200);
                break;
                
            case 'screen-7':
                // Final screen
                setTimeout(() => {
                    DOM.finalPulse.classList.add('visible');
                    document.querySelector('.footer').classList.add('visible');
                    DOM.replayBtn.classList.add('visible');
                }, 300);
                break;
        }
    }

    function triggerVibration() {
        try {
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 200]);
            }
        } catch(e) {}
    }

    // ============================================
    // BPM SIMULATION
    // ============================================
    
    function updateBPM(time) {
        // BPM progression based on timeline
        if (time < 3000) {
            STATE.bpm = 72;
            STATE.stress = 0;
        } else if (time < 7000) {
            // Gradual increase
            const progress = (time - 3000) / 4000;
            STATE.bpm = 72 + (progress * 15);
            STATE.stress = progress * 45;
        } else if (time < 12000) {
            // Stable elevated
            STATE.bpm = 85 + Math.sin(time / 500) * 3;
            STATE.stress = 40 + Math.sin(time / 400) * 5;
        } else if (time < 18000) {
            // PANIC
            const progress = (time - 12000) / 2000;
            if (progress < 1) {
                STATE.bpm = 85 + (progress * 35);
            } else {
                STATE.bpm = 120 - ((progress - 1) * 10);
            }
            STATE.stress = 75 + Math.sin(time / 200) * 10;
        } else if (time < 24000) {
            // Recovery
            STATE.bpm = 95 - ((time - 18000) / 6000) * 15;
            STATE.stress = 60 - ((time - 18000) / 6000) * 20;
        } else {
            // Calm end
            STATE.bpm = 80 + Math.sin(time / 800) * 3;
            STATE.stress = 35;
        }

        // Update displays
        updateBPMDisplays();
    }

    function updateBPMDisplays() {
        const bpm = Math.round(STATE.bpm);
        const stress = Math.round(STATE.stress);

        if (DOM.bpmDisplays.bpm1) DOM.bpmDisplays.bpm1.textContent = bpm;
        if (DOM.bpmDisplays.bpm2) DOM.bpmDisplays.bpm2.textContent = bpm;
        if (DOM.bpmDisplays.stress2) DOM.bpmDisplays.stress2.textContent = stress + '%';
        if (DOM.bpmDisplays.phoneBpm) DOM.bpmDisplays.phoneBpm.textContent = bpm;
        if (DOM.bpmDisplays.watchBpm) DOM.bpmDisplays.watchBpm.textContent = bpm;
        if (DOM.bpmDisplays.panicBpm) DOM.bpmDisplays.panicBpm.textContent = bpm;
    }

    // ============================================
    // MAIN LOOP
    // ============================================
    
    function update() {
        if (!STATE.isPlaying) return;

        const now = Date.now();
        STATE.currentTime = now - STATE.startTime;

        // Update progress bar
        const progress = Math.min(STATE.currentTime / TIMELINE.TOTAL_DURATION, 1);
        DOM.progressFill.style.width = (progress * 100) + '%';

        // Update BPM
        updateBPM(STATE.currentTime);

        // Determine current screen
        for (const screen of TIMELINE.screens) {
            if (STATE.currentTime >= screen.start && STATE.currentTime < screen.end) {
                showScreen(screen.id);
                break;
            }
        }

        // Draw oscilloscope
        drawOscilloscope();
        drawPhoneOscilloscope();
        drawWatchArc();

        // Check if demo ended
        if (STATE.currentTime >= TIMELINE.TOTAL_DURATION) {
            STATE.isPlaying = false;
            showScreen('screen-7');
            return;
        }

        STATE.animationFrame = requestAnimationFrame(update);
    }

    // ============================================
    // CONTROLS
    // ============================================
    
    function start() {
        // Reset state
        STATE.isPlaying = true;
        STATE.startTime = Date.now();
        STATE.currentTime = 0;
        STATE.currentScreen = null;
        STATE.bpm = 72;
        STATE.stress = 0;

        // Reset UI
        DOM.progressFill.style.width = '0%';
        DOM.replayBtn.classList.remove('visible');
        
        // Reset all animations
        document.querySelectorAll('.device, .app-item, .model-item, .model-plus, .tagline, .footer').forEach(el => {
            el.classList.remove('visible');
        });
        DOM.finalPulse.classList.remove('visible');

        // Show deck button after a delay
        setTimeout(() => {
            DOM.deckBtn.classList.add('visible');
        }, 5000);

        // Start loop
        update();
    }

    function replay() {
        start();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        cacheDOMElements();
        setupOscilloscope();
        
        // Setup mini canvases after a brief delay (DOM needs to render)
        setTimeout(setupMiniCanvases, 100);

        // Event listeners
        DOM.replayBtn.addEventListener('click', replay);

        // Auto-start
        setTimeout(start, 500);

        console.log('%c FEAR METER ', 'background: #8B0000; color: #FF0000; font-size: 14px; font-weight: bold;');
        console.log('%c Investor Demo ', 'color: #B0B0B0; font-size: 10px;');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
