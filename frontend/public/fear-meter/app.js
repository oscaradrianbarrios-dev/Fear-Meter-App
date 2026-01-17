/**
 * FEAR METER v1.0 - Biometric Horror System
 * Experimental Fear Detection Interface
 * 
 * © 2026 FEAR METER - All Rights Reserved
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION & STATE
    // ============================================
    
    const CONFIG = {
        STORAGE_KEY: 'fear_meter_sessions',
        PANIC_BPM_THRESHOLD: 110,
        PANIC_STRESS_THRESHOLD: 75,
        PANIC_COOLDOWN: 8000,
        MAX_SESSIONS: 50,
        SIMULATION_INTERVAL: 100,
    };

    const STATE = {
        currentView: 'monitor',
        isActive: false,
        isPanic: false,
        isRecovering: false,
        isBlocked: false,
        menuOpen: false,
        language: 'EN',
        
        // Biometric data
        bpm: 72,
        stress: 0,
        signal: 'ACTIVE',
        
        // Simulation refs
        baseBpm: 72,
        targetBpm: 72,
        lastPanic: 0,
        panicActive: false,
        simulationInterval: null,
        recoveryInterval: null,
        panicTimeout: null,
        
        // Session tracking
        currentSession: null,
        isRecording: false,
        bpmHistory: [],
        stressHistory: [],
        panicEvents: [],
        peakBpm: 0,
        peakStress: 0,
        totalBpm: 0,
        sampleCount: 0,
        
        // Oscilloscope
        oscilloscopePhase: 0,
        oscilloscopeStartTime: null,
        oscilloscopeAnimation: null,
        
        // Audio
        audioContext: null,
        audioEnabled: false,
        heartbeatInterval: null,
        
        // Watch Mode
        watchAnimation: null,
        isWatchFullscreen: false,
        
        // Demo Mode
        isDemoMode: false,
        demoInterval: null,
        demoPanicTriggered: false,
    };

    // ============================================
    // WEB AUDIO API - SOUND ENGINE
    // ============================================
    
    const AudioEngine = {
        context: null,
        masterGain: null,
        isInitialized: false,
        
        // Initialize audio context (must be called after user interaction)
        init() {
            if (this.isInitialized) return true;
            
            try {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.context.createGain();
                this.masterGain.gain.value = 0.4;
                this.masterGain.connect(this.context.destination);
                this.isInitialized = true;
                STATE.audioEnabled = true;
                console.log('%c♫ Audio Engine Initialized', 'color: #FF0000');
                return true;
            } catch (e) {
                console.error('Audio initialization failed:', e);
                return false;
            }
        },
        
        // Resume audio context if suspended
        resume() {
            if (this.context && this.context.state === 'suspended') {
                this.context.resume();
            }
        },
        
        // Create clinical static/noise burst (startup sound)
        playStaticBurst(duration = 0.8) {
            if (!this.isInitialized) return;
            this.resume();
            
            const ctx = this.context;
            const now = ctx.currentTime;
            
            // Create noise buffer
            const bufferSize = ctx.sampleRate * duration;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            
            // Generate filtered noise (more clinical, less harsh)
            for (let i = 0; i < bufferSize; i++) {
                // Mix white noise with some structure
                const noise = (Math.random() * 2 - 1) * 0.5;
                const modulation = Math.sin(i / 100) * 0.3;
                output[i] = noise * (1 - i / bufferSize) + modulation * 0.1;
            }
            
            // Create source
            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            
            // Filter for clinical sound
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 800;
            filter.Q.value = 1.5;
            
            // Envelope
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
            
            // Add subtle distortion for clinical edge
            const distortion = ctx.createWaveShaper();
            distortion.curve = this.makeDistortionCurve(50);
            
            // Connect nodes
            noiseSource.connect(filter);
            filter.connect(distortion);
            distortion.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            // Play
            noiseSource.start(now);
            noiseSource.stop(now + duration);
            
            // Add a subtle beep overlay
            this.playBeep(400, 0.15, 0.1, now + 0.1);
            this.playBeep(600, 0.1, 0.08, now + 0.3);
        },
        
        // Play single heartbeat sound
        playHeartbeat(intensity = 1) {
            if (!this.isInitialized) return;
            this.resume();
            
            const ctx = this.context;
            const now = ctx.currentTime;
            
            // Heartbeat is two sounds: "lub" (lower) and "dub" (higher)
            // LUB - first heart sound (mitral/tricuspid valves closing)
            const lubOsc = ctx.createOscillator();
            const lubGain = ctx.createGain();
            const lubFilter = ctx.createBiquadFilter();
            
            lubOsc.type = 'sine';
            lubOsc.frequency.setValueAtTime(55, now);
            lubOsc.frequency.exponentialRampToValueAtTime(35, now + 0.1);
            
            lubFilter.type = 'lowpass';
            lubFilter.frequency.value = 150;
            
            lubGain.gain.setValueAtTime(0, now);
            lubGain.gain.linearRampToValueAtTime(0.6 * intensity, now + 0.02);
            lubGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            
            lubOsc.connect(lubFilter);
            lubFilter.connect(lubGain);
            lubGain.connect(this.masterGain);
            
            lubOsc.start(now);
            lubOsc.stop(now + 0.2);
            
            // DUB - second heart sound (aortic/pulmonary valves closing)
            const dubOsc = ctx.createOscillator();
            const dubGain = ctx.createGain();
            const dubFilter = ctx.createBiquadFilter();
            
            dubOsc.type = 'sine';
            dubOsc.frequency.setValueAtTime(70, now + 0.12);
            dubOsc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
            
            dubFilter.type = 'lowpass';
            dubFilter.frequency.value = 180;
            
            dubGain.gain.setValueAtTime(0, now + 0.12);
            dubGain.gain.linearRampToValueAtTime(0.4 * intensity, now + 0.14);
            dubGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            
            dubOsc.connect(dubFilter);
            dubFilter.connect(dubGain);
            dubGain.connect(this.masterGain);
            
            dubOsc.start(now + 0.12);
            dubOsc.stop(now + 0.3);
            
            // Add subtle sub-bass thump for physical feel
            const subOsc = ctx.createOscillator();
            const subGain = ctx.createGain();
            
            subOsc.type = 'sine';
            subOsc.frequency.value = 30;
            
            subGain.gain.setValueAtTime(0, now);
            subGain.gain.linearRampToValueAtTime(0.3 * intensity, now + 0.01);
            subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            
            subOsc.connect(subGain);
            subGain.connect(this.masterGain);
            
            subOsc.start(now);
            subOsc.stop(now + 0.15);
        },
        
        // Play panic alarm sound
        playPanicAlarm() {
            if (!this.isInitialized) return;
            this.resume();
            
            const ctx = this.context;
            const now = ctx.currentTime;
            
            // Dissonant alarm tones
            const frequencies = [440, 466.16, 523.25]; // A4, Bb4, C5 - tense cluster
            
            frequencies.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sawtooth';
                osc.frequency.value = freq;
                
                // Tremolo effect
                const tremolo = ctx.createOscillator();
                const tremoloGain = ctx.createGain();
                tremolo.frequency.value = 8 + i * 2;
                tremoloGain.gain.value = 0.3;
                tremolo.connect(tremoloGain);
                tremoloGain.connect(gain.gain);
                
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 1.5);
                
                osc.connect(gain);
                gain.connect(this.masterGain);
                
                tremolo.start(now);
                osc.start(now);
                osc.stop(now + 1.5);
                tremolo.stop(now + 1.5);
            });
        },
        
        // Simple beep utility
        playBeep(frequency, duration, volume, startTime) {
            const ctx = this.context;
            const start = startTime || ctx.currentTime;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = frequency;
            
            gain.gain.setValueAtTime(volume, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(start);
            osc.stop(start + duration);
        },
        
        // Distortion curve for clinical edge
        makeDistortionCurve(amount) {
            const samples = 44100;
            const curve = new Float32Array(samples);
            const deg = Math.PI / 180;
            
            for (let i = 0; i < samples; i++) {
                const x = (i * 2) / samples - 1;
                curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
            }
            return curve;
        },
        
        // Start rhythmic heartbeat synchronized to BPM
        startHeartbeat() {
            if (STATE.heartbeatInterval) {
                clearInterval(STATE.heartbeatInterval);
            }
            
            const scheduleNextBeat = () => {
                if (!STATE.isActive || !this.isInitialized) {
                    this.stopHeartbeat();
                    return;
                }
                
                // Calculate interval from BPM (ms between beats)
                const interval = 60000 / STATE.bpm;
                
                // Intensity increases with BPM
                const intensity = Math.min(1.5, 0.7 + (STATE.bpm - 60) / 100);
                
                this.playHeartbeat(intensity);
                
                // Schedule next beat
                STATE.heartbeatInterval = setTimeout(scheduleNextBeat, interval);
            };
            
            // Start immediately
            scheduleNextBeat();
        },
        
        // Stop heartbeat
        stopHeartbeat() {
            if (STATE.heartbeatInterval) {
                clearTimeout(STATE.heartbeatInterval);
                STATE.heartbeatInterval = null;
            }
        },
        
        // Cleanup
        dispose() {
            this.stopHeartbeat();
            if (this.context) {
                this.context.close();
            }
        }
    };

    // ============================================
    // TRANSLATIONS
    // ============================================
    
    const TEXTS = {
        EN: {
            monitor: 'Monitor',
            watchMode: 'Watch Mode',
            history: 'History',
            language: 'Language',
            about: 'About / Legal',
            startSession: 'START SESSION',
            stopSession: 'STOP SESSION',
            bpm: 'BPM',
            stress: 'STRESS',
            signal: 'SIGNAL',
            active: 'ACTIVE',
            unstable: 'UNSTABLE',
            critical: 'CRITICAL',
            criticalAlert: 'CRITICAL STRESS DETECTED',
            noSessions: 'NO SESSIONS RECORDED',
            maxBpm: 'MAX BPM',
            maxStress: 'MAX STRESS',
            footer: '© 2026 FEAR METER',
            footerSub: 'Experimental Biometric Horror System',
        },
        ES: {
            monitor: 'Monitor',
            watchMode: 'Modo Reloj',
            history: 'Historial',
            language: 'Idioma',
            about: 'Acerca de / Legal',
            startSession: 'INICIAR SESIÓN',
            stopSession: 'DETENER SESIÓN',
            bpm: 'BPM',
            stress: 'ESTRÉS',
            signal: 'SEÑAL',
            active: 'ACTIVO',
            unstable: 'INESTABLE',
            critical: 'CRÍTICO',
            criticalAlert: 'ESTRÉS CRÍTICO DETECTADO',
            noSessions: 'SIN SESIONES REGISTRADAS',
            maxBpm: 'BPM MÁX',
            maxStress: 'ESTRÉS MÁX',
            footer: '© 2026 FEAR METER',
            footerSub: 'Sistema Biométrico de Horror Experimental',
        },
    };

    const SESSION_NAMES = [
        'Night Terror', 'Shadow Encounter', 'Dark Vision', 'Fear Response',
        'Stress Event', 'Panic Episode', 'Anxiety Spike', 'Horror Moment',
        'Dread Instance', 'Terror Wave',
    ];

    // ============================================
    // DOM ELEMENTS
    // ============================================
    
    const DOM = {};

    function cacheDOMElements() {
        // Views
        DOM.viewMonitor = document.getElementById('view-monitor');
        DOM.viewWatch = document.getElementById('view-watch');
        DOM.viewHistory = document.getElementById('view-history');
        
        // Oscilloscope
        DOM.oscilloscopeContainer = document.getElementById('oscilloscope-container');
        DOM.oscilloscope = document.getElementById('oscilloscope');
        DOM.ecgIndicator = document.querySelector('.ecg-indicator');
        DOM.criticalLabel = document.getElementById('critical-label');
        DOM.stabilizingLabel = document.getElementById('stabilizing-label');
        
        // Data grid
        DOM.bpmBlock = document.getElementById('bpm-block');
        DOM.stressBlock = document.getElementById('stress-block');
        DOM.signalBlock = document.getElementById('signal-block');
        DOM.bpmValue = document.getElementById('bpm-value');
        DOM.stressValue = document.getElementById('stress-value');
        DOM.signalValue = document.getElementById('signal-value');
        
        // Main button
        DOM.mainBtn = document.getElementById('main-btn');
        
        // Menu
        DOM.menuBtn = document.getElementById('menu-btn');
        DOM.menuOverlay = document.getElementById('menu-overlay');
        DOM.sideMenu = document.getElementById('side-menu');
        DOM.menuClose = document.getElementById('menu-close');
        DOM.menuItems = document.querySelectorAll('.menu-item[data-view]');
        DOM.langBtns = document.querySelectorAll('.lang-btn');
        
        // Watch Mode - Fullscreen
        DOM.watchCanvas = document.getElementById('watch-canvas');
        DOM.watchFace = document.getElementById('watch-face');
        DOM.watchRing = document.getElementById('watch-ring');
        DOM.watchBpm = document.getElementById('watch-bpm');
        DOM.sessionDot = document.getElementById('session-dot');
        DOM.sessionStatusText = document.getElementById('session-status-text');
        DOM.watchSessionStatus = document.getElementById('watch-session-status');
        DOM.watchSignal = document.getElementById('watch-signal');
        DOM.signalPulse = document.getElementById('signal-pulse');
        DOM.watchPanicFlash = document.getElementById('watch-panic-flash');
        DOM.watchMessage = document.getElementById('watch-message');
        DOM.watchMessageText = document.getElementById('watch-message-text');
        DOM.watchDemoIndicator = document.getElementById('watch-demo-indicator');
        DOM.watchStartBtn = document.getElementById('watch-start-btn');
        DOM.watchExitBtn = document.getElementById('watch-exit-btn');
        DOM.watchControlText = document.getElementById('watch-control-text');
        DOM.controlIcon = document.getElementById('control-icon');
        DOM.watchConnection = document.getElementById('watch-connection');
        
        // History
        DOM.historyList = document.getElementById('history-list');
        DOM.historyGraph = document.getElementById('history-graph');
        DOM.historyEmpty = document.getElementById('history-empty');
        DOM.historySvg = document.getElementById('history-svg');
        DOM.graphInfo = document.getElementById('graph-info');
        DOM.btnListView = document.getElementById('btn-list-view');
        DOM.btnGraphView = document.getElementById('btn-graph-view');
        DOM.btnClearHistory = document.getElementById('btn-clear-history');
        DOM.sessionDetail = document.getElementById('session-detail');
        
        // Panic/Critical
        DOM.panicOverlay = document.getElementById('panic-overlay');
        DOM.criticalAlert = document.getElementById('critical-alert');
    }

    // ============================================
    // UTILITIES
    // ============================================
    
    function formatDate(timestamp) {
        const date = timestamp ? new Date(timestamp) : new Date();
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes === 0) {
            return `${remainingSeconds}s`;
        }
        return `${minutes}m ${remainingSeconds}s`;
    }

    function generateSessionName() {
        return SESSION_NAMES[Math.floor(Math.random() * SESSION_NAMES.length)];
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // ============================================
    // LOCAL STORAGE
    // ============================================
    
    function loadSessions() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load sessions:', e);
            return [];
        }
    }

    function saveSessions(sessions) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(sessions));
        } catch (e) {
            console.error('Failed to save sessions:', e);
        }
    }

    // ============================================
    // BIOMETRIC SIMULATION
    // ============================================
    
    function calculateStress(currentBpm) {
        const minBpm = 60;
        const maxBpm = 140;
        const normalized = (currentBpm - minBpm) / (maxBpm - minBpm);
        return clamp(Math.round(normalized * 100), 0, 100);
    }

    function calculateSignal(currentBpm, currentStress) {
        if (currentBpm > CONFIG.PANIC_BPM_THRESHOLD && currentStress > CONFIG.PANIC_STRESS_THRESHOLD) {
            return 'CRITICAL';
        }
        if (currentBpm > 95 || currentStress > 50) {
            return 'UNSTABLE';
        }
        return 'ACTIVE';
    }

    function startRecovery() {
        STATE.isRecovering = true;
        updateStabilizingLabel();
        
        const recoveryDuration = 3000;
        const startTime = Date.now();
        const startBpm = STATE.targetBpm;
        const targetRecoveryBpm = 85;
        
        STATE.recoveryInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / recoveryDuration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 2);
            
            STATE.targetBpm = startBpm - ((startBpm - targetRecoveryBpm) * easeProgress);
            
            if (progress >= 1) {
                clearInterval(STATE.recoveryInterval);
                STATE.recoveryInterval = null;
                STATE.isRecovering = false;
                updateStabilizingLabel();
            }
        }, 50);
    }

    function simulateBpm() {
        const now = Date.now();
        
        // Gradually move towards target
        const diff = STATE.targetBpm - STATE.baseBpm;
        STATE.baseBpm += diff * 0.1;
        
        // Add natural variation
        const variationAmount = STATE.isPanic ? 6 : 4;
        const variation = (Math.random() - 0.5) * variationAmount;
        
        // Normal mode behavior
        if (!STATE.isRecovering) {
            // Random spikes
            if (Math.random() < 0.03) {
                STATE.targetBpm = Math.min(135, STATE.baseBpm + Math.random() * 25);
            }
            
            // Gradual decrease when elevated
            if (STATE.targetBpm > 85 && Math.random() < 0.04 && !STATE.isPanic) {
                STATE.targetBpm -= 1.5;
            }
        }

        const newBpm = Math.round(clamp(STATE.baseBpm + variation, 60, 140));
        const newStress = calculateStress(newBpm);
        const newSignal = calculateSignal(newBpm, newStress);
        
        STATE.bpm = newBpm;
        STATE.stress = newStress;
        STATE.signal = newSignal;

        // PANIC ACTIVATION
        const shouldPanic = newBpm > CONFIG.PANIC_BPM_THRESHOLD && newStress > CONFIG.PANIC_STRESS_THRESHOLD;
        
        if (shouldPanic && !STATE.panicActive && now - STATE.lastPanic > CONFIG.PANIC_COOLDOWN) {
            triggerPanic();
        } else if (!shouldPanic && STATE.panicActive) {
            endPanic();
        }

        // Record data if session is active
        if (STATE.isRecording) {
            recordDataPoint(newBpm, newStress);
        }

        // Update UI
        updateDataDisplay();
        updateWatchMode();
    }

    function triggerPanic() {
        STATE.panicActive = true;
        STATE.lastPanic = Date.now();
        STATE.isPanic = true;
        STATE.isBlocked = true;
        
        // Play panic alarm sound
        AudioEngine.playPanicAlarm();
        
        // Trigger vibration if available
        try {
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
        } catch (e) {}
        
        // Show panic overlay flash (smartphone)
        DOM.panicOverlay.classList.remove('hidden');
        DOM.panicOverlay.classList.add('active');
        
        setTimeout(() => {
            DOM.panicOverlay.classList.remove('active');
        }, 200);
        
        // Trigger watch panic flash (synced with smartphone)
        triggerWatchPanicFlash();
        updateWatchMode();
        
        // Show critical alert after delay
        STATE.panicTimeout = setTimeout(() => {
            DOM.criticalAlert.classList.remove('hidden');
            DOM.criticalAlert.classList.add('visible');
            
            // Auto-dismiss after 2 seconds
            setTimeout(() => {
                handlePanicSequenceComplete();
            }, 2000);
        }, 520);
        
        updatePanicUI(true);
    }

    function endPanic() {
        STATE.panicActive = false;
        STATE.isPanic = false;
        startRecovery();
        updatePanicUI(false);
        updateWatchMode();
    }

    function handlePanicSequenceComplete() {
        DOM.criticalAlert.classList.remove('visible');
        
        setTimeout(() => {
            DOM.criticalAlert.classList.add('hidden');
            DOM.panicOverlay.classList.add('hidden');
            STATE.isBlocked = false;
        }, 300);
    }

    function triggerTap() {
        if (!STATE.isActive || STATE.isRecovering || STATE.isBlocked) return;
        
        STATE.targetBpm = Math.min(140, STATE.targetBpm + 10);
        STATE.baseBpm = Math.min(140, STATE.baseBpm + 4);
    }

    // ============================================
    // SESSION MANAGEMENT
    // ============================================
    
    function startSession() {
        STATE.currentSession = {
            id: Date.now(),
            startTime: Date.now(),
            name: generateSessionName(),
        };
        
        // Reset tracking
        STATE.bpmHistory = [];
        STATE.stressHistory = [];
        STATE.panicEvents = [];
        STATE.peakBpm = 0;
        STATE.peakStress = 0;
        STATE.totalBpm = 0;
        STATE.sampleCount = 0;
        STATE.isRecording = true;
    }

    function recordDataPoint(bpm, stress) {
        if (!STATE.isRecording) return;
        
        const timestamp = Date.now();
        
        // Update history (keep last 100 points)
        STATE.bpmHistory.push({ timestamp, value: bpm });
        STATE.stressHistory.push({ timestamp, value: stress });
        
        if (STATE.bpmHistory.length > 100) STATE.bpmHistory.shift();
        if (STATE.stressHistory.length > 100) STATE.stressHistory.shift();
        
        // Update peaks
        if (bpm > STATE.peakBpm) STATE.peakBpm = bpm;
        if (stress > STATE.peakStress) STATE.peakStress = stress;
        
        // Update average
        STATE.totalBpm += bpm;
        STATE.sampleCount += 1;
        
        // Check for PANIC EVENT
        if (bpm > 120 && stress > 85) {
            const lastPanic = STATE.panicEvents[STATE.panicEvents.length - 1];
            if (!lastPanic || timestamp - lastPanic.timestamp > 5000) {
                STATE.panicEvents.push({ timestamp, bpm, stress });
                
                try {
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100]);
                    }
                } catch (e) {}
            }
        }
    }

    function endSession() {
        if (!STATE.currentSession || !STATE.isRecording) return null;

        const endTime = Date.now();
        const duration = endTime - STATE.currentSession.startTime;
        const avgBpm = STATE.sampleCount > 0 
            ? Math.round(STATE.totalBpm / STATE.sampleCount) 
            : 0;

        const completedSession = {
            ...STATE.currentSession,
            endTime,
            date: formatDate(STATE.currentSession.startTime),
            duration,
            durationText: formatDuration(duration),
            avgBpm,
            maxBpm: STATE.peakBpm,
            maxStress: STATE.peakStress,
            bpmHistory: [...STATE.bpmHistory],
            panicEvents: [...STATE.panicEvents],
            hasPanicEvent: STATE.panicEvents.length > 0,
            panicCount: STATE.panicEvents.length,
        };

        // Save to storage
        const sessions = loadSessions();
        sessions.unshift(completedSession);
        saveSessions(sessions.slice(0, CONFIG.MAX_SESSIONS));

        // Reset state
        STATE.currentSession = null;
        STATE.isRecording = false;
        STATE.bpmHistory = [];
        STATE.stressHistory = [];
        STATE.panicEvents = [];
        STATE.peakBpm = 0;
        STATE.peakStress = 0;
        STATE.totalBpm = 0;
        STATE.sampleCount = 0;

        return completedSession;
    }

    function clearAllHistory() {
        saveSessions([]);
        renderHistory();
    }

    // ============================================
    // OSCILLOSCOPE DRAWING
    // ============================================
    
    function setupOscilloscope() {
        const canvas = DOM.oscilloscope;
        if (!canvas) return;

        const updateSize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            const ctx = canvas.getContext('2d');
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        updateSize();
        window.addEventListener('resize', updateSize);
    }

    function drawOscilloscope() {
        const canvas = DOM.oscilloscope;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const centerY = height / 2;

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines
        const gridOpacity = STATE.isPanic ? 0.03 : 0.06;
        ctx.strokeStyle = `rgba(${STATE.isPanic ? '139, 0, 0' : '255, 0, 0'}, ${gridOpacity})`;
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
            // Flat line when inactive
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();
            
            STATE.oscilloscopeAnimation = requestAnimationFrame(drawOscilloscope);
            return;
        }

        // Calculate amplitude ramp
        let amplitudeMultiplier = 1;
        if (STATE.oscilloscopeStartTime) {
            const elapsed = Date.now() - STATE.oscilloscopeStartTime;
            const rampProgress = Math.min(elapsed / 2000, 1);
            amplitudeMultiplier = 0.3 + (0.7 * (1 - Math.pow(1 - rampProgress, 3)));
        }

        // PANIC MODE settings
        const baseFrequency = STATE.bpm / 60;
        const frequencyMultiplier = STATE.isPanic ? 2.0 : 1.0;
        const frequency = baseFrequency * frequencyMultiplier;
        
        const speed = (frequency * 4) + (STATE.isPanic ? 3 : 0);
        const baseAmplitude = STATE.isPanic ? height * 0.42 : height * 0.28;
        const amplitude = baseAmplitude * amplitudeMultiplier;
        
        const jitterAmount = STATE.isPanic ? 8 : 0.5;
        const jitter = (Math.random() - 0.5) * jitterAmount;
        const timingJitter = STATE.isPanic ? (Math.random() - 0.5) * 0.15 : 0;

        STATE.oscilloscopePhase += speed * 0.02;

        // ECG waveform
        const strokeColor = STATE.isPanic ? 'rgba(139, 0, 0, 0.95)' : 'rgba(255, 0, 0, 0.85)';
        const glowColor = STATE.isPanic ? '#8B0000' : '#FF0000';
        
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = STATE.isPanic ? 2.5 : 1.5;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = STATE.isPanic ? 12 : 4;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
            const t = (x / width) * Math.PI * 4 * frequencyMultiplier + STATE.oscilloscopePhase;
            
            let y = 0;
            const cyclePos = ((t + timingJitter) % (Math.PI * 2)) / (Math.PI * 2);
            
            if (cyclePos < 0.1) {
                y = Math.sin(cyclePos * Math.PI * 10) * 0.2;
            } else if (cyclePos < 0.15) {
                y = 0;
            } else if (cyclePos < 0.2) {
                y = -0.1;
            } else if (cyclePos < 0.25) {
                const spikeMultiplier = STATE.isPanic ? 1.3 : 1;
                y = Math.sin((cyclePos - 0.2) * Math.PI * 20) * spikeMultiplier;
            } else if (cyclePos < 0.3) {
                y = STATE.isPanic ? -0.3 : -0.2;
            } else if (cyclePos < 0.35) {
                y = 0;
            } else if (cyclePos < 0.5) {
                y = Math.sin((cyclePos - 0.35) * Math.PI * 6.67) * 0.3;
            } else {
                y = 0;
            }

            const pixelNoise = STATE.isPanic ? (Math.random() - 0.5) * 2 : 0;
            const yPos = centerY - (y * amplitude) + jitter + pixelNoise;
            
            if (x === 0) {
                ctx.moveTo(x, yPos);
            } else {
                ctx.lineTo(x, yPos);
            }
        }

        ctx.stroke();
        ctx.shadowBlur = 0;

        // Scan line during panic
        if (STATE.isPanic) {
            const scanSpeed = 1500;
            const scanY = (Date.now() % scanSpeed) / scanSpeed * height;
            ctx.strokeStyle = 'rgba(139, 0, 0, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(width, scanY);
            ctx.stroke();
        }

        STATE.oscilloscopeAnimation = requestAnimationFrame(drawOscilloscope);
    }

    // ============================================
    // WATCH MODE DRAWING
    // ============================================
    
    function setupWatchCanvas() {
        const canvas = DOM.watchCanvas;
        if (!canvas) return;

        const updateSize = () => {
            const container = canvas.parentElement;
            const size = Math.min(container.offsetWidth, 280);
            canvas.width = size * window.devicePixelRatio;
            canvas.height = size * window.devicePixelRatio;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;
            const ctx = canvas.getContext('2d');
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        updateSize();
        window.addEventListener('resize', updateSize);
    }

    // ============================================
    // WATCH MODE - FULLSCREEN SMARTWATCH
    // ============================================
    
    function setupWatchCanvas() {
        const canvas = DOM.watchCanvas;
        if (!canvas) return;
        
        const updateSize = () => {
            const face = DOM.watchFace;
            if (!face) return;
            
            const size = face.offsetWidth;
            canvas.width = size * window.devicePixelRatio;
            canvas.height = size * window.devicePixelRatio;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;
            
            const ctx = canvas.getContext('2d');
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        
        updateSize();
        window.addEventListener('resize', updateSize);
        
        // Start watch animation loop
        startWatchAnimation();
    }
    
    function startWatchAnimation() {
        const animate = () => {
            if (STATE.isWatchFullscreen) {
                drawWatchArc();
            }
            STATE.watchAnimation = requestAnimationFrame(animate);
        };
        animate();
    }
    
    function drawWatchArc() {
        const canvas = DOM.watchCanvas;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const size = parseInt(canvas.style.width) || 320;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.42;
        const arcWidth = STATE.isPanic ? 10 : 6;
        
        // Clear canvas
        ctx.clearRect(0, 0, size, size);
        
        // Draw background arc (track)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.08)';
        ctx.lineWidth = arcWidth;
        ctx.stroke();
        
        // Calculate progress (BPM 60-140 = 0-100%)
        const minBpm = 60;
        const maxBpm = 140;
        const progress = STATE.isActive 
            ? Math.min((STATE.bpm - minBpm) / (maxBpm - minBpm), 1) 
            : 0;
        
        if (progress > 0) {
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + (Math.PI * 2 * progress);
            
            // Glow effect
            ctx.shadowColor = STATE.isPanic ? '#8B0000' : '#FF0000';
            ctx.shadowBlur = STATE.isPanic ? 25 : 15;
            
            // Draw progress arc
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            
            // Color intensity based on BPM
            const intensity = 0.5 + (progress * 0.5);
            ctx.strokeStyle = STATE.isPanic 
                ? `rgba(139, 0, 0, ${intensity})`
                : `rgba(255, 0, 0, ${intensity})`;
            
            ctx.lineWidth = arcWidth;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            // Reset shadow
            ctx.shadowBlur = 0;
            
            // Draw arc end cap glow
            if (STATE.isActive) {
                const endX = centerX + Math.cos(endAngle) * radius;
                const endY = centerY + Math.sin(endAngle) * radius;
                
                ctx.beginPath();
                ctx.arc(endX, endY, arcWidth / 2 + 2, 0, Math.PI * 2);
                ctx.fillStyle = STATE.isPanic 
                    ? 'rgba(139, 0, 0, 0.8)'
                    : 'rgba(255, 0, 0, 0.6)';
                ctx.fill();
            }
        }
        
        // Draw tick marks
        const tickCount = 12;
        for (let i = 0; i < tickCount; i++) {
            const angle = (Math.PI * 2 * i) / tickCount - Math.PI / 2;
            const innerRadius = radius + arcWidth + 4;
            const outerRadius = innerRadius + 6;
            
            ctx.beginPath();
            ctx.moveTo(
                centerX + Math.cos(angle) * innerRadius,
                centerY + Math.sin(angle) * innerRadius
            );
            ctx.lineTo(
                centerX + Math.cos(angle) * outerRadius,
                centerY + Math.sin(angle) * outerRadius
            );
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.15)';
            ctx.lineWidth = i % 3 === 0 ? 2 : 1;
            ctx.stroke();
        }
    }
    
    function updateWatchMode() {
        if (!DOM.watchBpm) return;
        
        // Update BPM display
        DOM.watchBpm.textContent = STATE.isActive ? STATE.bpm : '---';
        DOM.watchBpm.classList.toggle('active', STATE.isActive && !STATE.isPanic);
        DOM.watchBpm.classList.toggle('panic', STATE.isPanic);
        
        // Update session status
        if (DOM.sessionDot) {
            DOM.sessionDot.classList.toggle('active', STATE.isActive && !STATE.isPanic);
            DOM.sessionDot.classList.toggle('panic', STATE.isPanic);
        }
        
        if (DOM.sessionStatusText) {
            if (STATE.isPanic) {
                DOM.sessionStatusText.textContent = 'CRITICAL';
                DOM.sessionStatusText.className = 'panic';
            } else if (STATE.isActive) {
                DOM.sessionStatusText.textContent = 'RECORDING';
                DOM.sessionStatusText.className = 'active';
            } else {
                DOM.sessionStatusText.textContent = 'STANDBY';
                DOM.sessionStatusText.className = '';
            }
        }
        
        if (DOM.watchSessionStatus) {
            DOM.watchSessionStatus.classList.toggle('active', STATE.isActive);
        }
        
        // Update live signal indicator
        if (DOM.watchSignal) {
            DOM.watchSignal.classList.toggle('active', STATE.isActive);
        }
        
        if (DOM.signalPulse) {
            DOM.signalPulse.classList.toggle('active', STATE.isActive);
        }
        
        // Update watch ring
        if (DOM.watchRing) {
            DOM.watchRing.classList.toggle('active', STATE.isActive && !STATE.isPanic);
            DOM.watchRing.classList.toggle('panic', STATE.isPanic);
        }
        
        // Update watch face jitter
        if (DOM.watchFace) {
            DOM.watchFace.classList.toggle('jitter', STATE.isPanic);
        }
        
        // Update control button
        if (DOM.watchStartBtn) {
            DOM.watchStartBtn.classList.toggle('active', STATE.isActive && !STATE.isPanic);
            DOM.watchStartBtn.classList.toggle('panic', STATE.isPanic);
        }
        
        if (DOM.watchControlText) {
            DOM.watchControlText.textContent = STATE.isActive ? 'STOP' : 'START';
        }
        
        if (DOM.controlIcon) {
            DOM.controlIcon.innerHTML = STATE.isActive 
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        }
        
        // Update demo indicator
        if (DOM.watchDemoIndicator) {
            DOM.watchDemoIndicator.classList.toggle('visible', STATE.isDemoMode);
        }
    }
    
    function triggerWatchPanicFlash() {
        if (!DOM.watchPanicFlash) return;
        
        DOM.watchPanicFlash.classList.add('active');
        
        // Vibrate device if supported
        try {
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 200]);
            }
        } catch (e) {}
        
        setTimeout(() => {
            DOM.watchPanicFlash.classList.remove('active');
        }, 200);
    }
    
    function showWatchMessage(message, duration = 2000) {
        if (!DOM.watchMessage || !DOM.watchMessageText) return;
        
        DOM.watchMessageText.textContent = message;
        DOM.watchMessage.classList.add('visible');
        
        setTimeout(() => {
            DOM.watchMessage.classList.remove('visible');
        }, duration);
    }
    
    function enterWatchMode() {
        STATE.isWatchFullscreen = true;
        STATE.currentView = 'watch';
        
        // Hide other views
        if (DOM.viewMonitor) DOM.viewMonitor.classList.remove('active');
        if (DOM.viewHistory) DOM.viewHistory.classList.remove('active');
        
        // Show watch fullscreen with transition
        if (DOM.viewWatch) {
            DOM.viewWatch.classList.add('active');
        }
        
        // Setup canvas if needed
        setTimeout(() => {
            setupWatchCanvas();
            updateWatchMode();
        }, 50);
        
        // Update menu active state
        DOM.menuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === 'watch');
        });
        
        closeMenu();
    }
    
    function exitWatchMode() {
        STATE.isWatchFullscreen = false;
        
        // Exit Demo Mode if active
        if (STATE.isDemoMode) {
            exitDemoMode();
        }
        
        // Switch to monitor view
        switchView('monitor');
    }
    
    // ============================================
    // DEMO MODE - INVESTOR SIMULATION
    // ============================================
    
    function enterDemoMode() {
        STATE.isDemoMode = true;
        STATE.demoPanicTriggered = false;
        
        // Show demo indicator
        if (DOM.watchDemoIndicator) {
            DOM.watchDemoIndicator.classList.add('visible');
        }
        
        // Start controlled simulation if not already active
        if (!STATE.isActive) {
            startDemoSimulation();
        }
    }
    
    function exitDemoMode() {
        STATE.isDemoMode = false;
        STATE.demoPanicTriggered = false;
        
        // Clear demo interval
        if (STATE.demoInterval) {
            clearInterval(STATE.demoInterval);
            STATE.demoInterval = null;
        }
        
        // Hide demo indicator
        if (DOM.watchDemoIndicator) {
            DOM.watchDemoIndicator.classList.remove('visible');
        }
    }
    
    function startDemoSimulation() {
        STATE.isActive = true;
        STATE.baseBpm = 70;
        STATE.targetBpm = 70;
        
        // Initialize audio
        AudioEngine.init();
        AudioEngine.playStaticBurst(0.5);
        setTimeout(() => AudioEngine.startHeartbeat(), 600);
        
        // Update UI
        updateMainButton();
        updateWatchMode();
        updateOscilloscopeIndicator();
        
        // Demo progression: gradually increase BPM over time
        let demoStep = 0;
        const demoDuration = 30000; // 30 seconds total demo
        const stepInterval = 500;
        const totalSteps = demoDuration / stepInterval;
        
        STATE.demoInterval = setInterval(() => {
            demoStep++;
            const progress = demoStep / totalSteps;
            
            if (progress < 0.4) {
                // Phase 1: Gradual increase (70-90 BPM)
                STATE.targetBpm = 70 + (progress / 0.4) * 20;
            } else if (progress < 0.6) {
                // Phase 2: Build tension (90-105 BPM)
                STATE.targetBpm = 90 + ((progress - 0.4) / 0.2) * 15;
            } else if (progress < 0.75) {
                // Phase 3: Approach panic (105-115 BPM)
                STATE.targetBpm = 105 + ((progress - 0.6) / 0.15) * 10;
                
                // Trigger panic near the end of this phase
                if (progress > 0.7 && !STATE.demoPanicTriggered) {
                    STATE.demoPanicTriggered = true;
                    STATE.targetBpm = 125;
                }
            } else if (progress < 0.9) {
                // Phase 4: Recovery (115-85 BPM)
                STATE.targetBpm = 115 - ((progress - 0.75) / 0.15) * 30;
            } else {
                // Phase 5: Stable end (85 BPM)
                STATE.targetBpm = 85;
            }
            
            // Add small variation
            STATE.targetBpm += (Math.random() - 0.5) * 4;
            
            // Reset demo at end
            if (demoStep >= totalSteps) {
                demoStep = 0;
                STATE.demoPanicTriggered = false;
            }
        }, stepInterval);
        
        // Start normal simulation
        STATE.simulationInterval = setInterval(simulateBpm, CONFIG.SIMULATION_INTERVAL);
    }

    // ============================================
    // UI UPDATES
    // ============================================
    
    function updateDataDisplay() {
        const t = TEXTS[STATE.language];
        
        if (STATE.isActive) {
            DOM.bpmValue.textContent = STATE.bpm;
            DOM.stressValue.textContent = `${STATE.stress}%`;
            
            if (STATE.signal === 'CRITICAL') {
                DOM.signalValue.textContent = t.critical;
            } else if (STATE.signal === 'UNSTABLE') {
                DOM.signalValue.textContent = t.unstable;
            } else {
                DOM.signalValue.textContent = t.active;
            }
        } else {
            DOM.bpmValue.textContent = '---';
            DOM.stressValue.textContent = '---';
            DOM.signalValue.textContent = '---';
        }
        
        // Update classes
        const isDataActive = STATE.isActive;
        const isPanic = STATE.isPanic;
        
        [DOM.bpmBlock, DOM.stressBlock, DOM.signalBlock].forEach(block => {
            block.classList.toggle('active', isDataActive && !isPanic);
            block.classList.toggle('critical', isPanic);
        });
        
        [DOM.bpmValue, DOM.stressValue].forEach(value => {
            value.classList.toggle('active', isDataActive && !isPanic);
            value.classList.toggle('panic', isPanic);
        });
        
        DOM.signalValue.classList.remove('unstable', 'critical-signal');
        if (STATE.signal === 'CRITICAL') {
            DOM.signalValue.classList.add('critical-signal');
        } else if (STATE.signal === 'UNSTABLE') {
            DOM.signalValue.classList.add('unstable');
        }
        DOM.signalValue.classList.toggle('active', isDataActive);
    }

    function updateWatchMode() {
        // Update watch BPM display
        DOM.watchBpm.textContent = STATE.isActive ? STATE.bpm : '---';
        DOM.watchBpm.classList.toggle('active', STATE.isActive && !STATE.isPanic);
        DOM.watchBpm.classList.toggle('panic', STATE.isPanic);
        
        // Update status
        DOM.watchStatusDot.classList.toggle('active', STATE.isActive && !STATE.isPanic);
        DOM.watchStatusDot.classList.toggle('panic', STATE.isPanic);
        
        if (STATE.isPanic) {
            DOM.watchStatusText.textContent = 'CRITICAL';
            DOM.watchStatusText.className = 'panic';
        } else if (STATE.isActive) {
            DOM.watchStatusText.textContent = 'MONITORING';
            DOM.watchStatusText.className = 'active';
        } else {
            DOM.watchStatusText.textContent = 'STANDBY';
            DOM.watchStatusText.className = '';
        }
        
        // Update stress bar
        DOM.watchStressContainer.classList.toggle('visible', STATE.isActive);
        DOM.watchStressPercent.textContent = `${STATE.stress}%`;
        DOM.watchStressPercent.classList.toggle('panic', STATE.isPanic);
        DOM.watchStressFill.style.width = `${STATE.stress}%`;
        DOM.watchStressFill.classList.toggle('panic', STATE.isPanic);
        
        // Update jitter
        DOM.watchContainer.classList.toggle('jitter', STATE.isPanic);
        
        // Redraw canvas
        drawWatch();
    }

    function updateMainButton() {
        const t = TEXTS[STATE.language];
        const btn = DOM.mainBtn;
        const span = btn.querySelector('span');
        
        span.textContent = STATE.isActive ? t.stopSession : t.startSession;
        
        btn.classList.toggle('active', STATE.isActive && !STATE.isPanic);
        btn.classList.toggle('panic', STATE.isPanic);
        btn.disabled = STATE.isBlocked;
    }

    function updatePanicUI(isPanic) {
        DOM.oscilloscopeContainer.classList.toggle('panic', isPanic);
        DOM.ecgIndicator.classList.toggle('panic', isPanic);
        DOM.criticalLabel.classList.toggle('hidden', !isPanic);
        updateMainButton();
    }

    function updateStabilizingLabel() {
        DOM.stabilizingLabel.classList.toggle('hidden', !STATE.isRecovering);
    }

    function updateOscilloscopeIndicator() {
        DOM.ecgIndicator.classList.toggle('active', STATE.isActive);
    }

    // ============================================
    // HISTORY RENDERING
    // ============================================
    
    function renderHistory() {
        const sessions = loadSessions();
        
        if (sessions.length === 0) {
            DOM.historyList.classList.add('hidden');
            DOM.historyGraph.classList.add('hidden');
            DOM.historyEmpty.classList.remove('hidden');
            return;
        }
        
        DOM.historyEmpty.classList.add('hidden');
        
        if (DOM.btnListView.classList.contains('active')) {
            DOM.historyList.classList.remove('hidden');
            DOM.historyGraph.classList.add('hidden');
            renderHistoryList(sessions);
        } else {
            DOM.historyList.classList.add('hidden');
            DOM.historyGraph.classList.remove('hidden');
            renderHistoryGraph(sessions);
        }
    }

    function renderHistoryList(sessions) {
        DOM.historyList.innerHTML = sessions.map((session, index) => `
            <div class="history-item ${session.hasPanicEvent ? 'has-panic' : ''}" 
                 data-session-id="${session.id}"
                 style="animation-delay: ${index * 50}ms">
                <div class="history-item-header">
                    <div class="history-item-info">
                        <div class="history-item-date">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${session.date}
                            ${session.hasPanicEvent ? `
                                <span class="panic-badge">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                    PANIC
                                </span>
                            ` : ''}
                        </div>
                        <div class="history-item-name ${session.hasPanicEvent ? 'panic' : ''}">${session.name}</div>
                        ${session.durationText ? `<div class="history-item-duration">Duration: ${session.durationText}</div>` : ''}
                    </div>
                    <div class="history-item-number">#${String(sessions.length - index).padStart(2, '0')}</div>
                </div>
                <div class="history-stress-bar">
                    <div class="history-stress-fill" style="width: ${session.maxStress || 0}%; background-color: ${session.maxStress > 85 ? '#8B0000' : '#FF0000'}; box-shadow: ${session.maxStress > 85 ? '0 0 8px rgba(139, 0, 0, 0.5)' : '0 0 4px rgba(255, 0, 0, 0.3)'}"></div>
                </div>
                <div class="history-stats">
                    <div class="history-stat">
                        <div class="history-stat-label">PEAK BPM</div>
                        <div class="history-stat-value ${session.maxBpm > 120 ? 'panic' : ''}">${session.maxBpm || 0}</div>
                    </div>
                    <div class="history-stat">
                        <div class="history-stat-label">AVG BPM</div>
                        <div class="history-stat-value avg">${session.avgBpm || session.maxBpm || 0}</div>
                    </div>
                    <div class="history-stat">
                        <div class="history-stat-label">MAX STRESS</div>
                        <div class="history-stat-value ${session.maxStress > 85 ? 'panic' : ''}">${session.maxStress || 0}%</div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        DOM.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const sessionId = parseInt(item.dataset.sessionId);
                const session = sessions.find(s => s.id === sessionId);
                if (session) {
                    showSessionDetail(session);
                }
            });
        });
    }

    function renderHistoryGraph(sessions) {
        const svg = DOM.historySvg;
        const recentSessions = sessions.slice(0, 10);
        
        if (recentSessions.length === 0) {
            svg.innerHTML = '';
            return;
        }

        const width = 300;
        const height = 150;
        const padding = 10;
        
        const maxBpm = Math.max(...recentSessions.map(s => s.maxBpm || 0), 140);
        const minBpm = Math.min(...recentSessions.map(s => s.maxBpm || 60), 60);
        
        const points = recentSessions.map((session, i, arr) => {
            const x = padding + (i / Math.max(arr.length - 1, 1)) * (width - padding * 2);
            const y = height - padding - (((session.maxBpm || 60) - minBpm) / (maxBpm - minBpm || 1)) * (height - padding * 2);
            return { x, y, session };
        });

        // Generate path
        let pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        
        // Generate circles
        const circles = points.map(p => `
            <circle
                cx="${p.x}"
                cy="${p.y}"
                r="3"
                fill="${p.session.hasPanicEvent ? '#8B0000' : '#FF0000'}"
                stroke="#000"
                stroke-width="1.5"
            />
        `).join('');

        // Grid lines
        const gridLines = [0, 1, 2, 3].map(i => `
            <line
                x1="10"
                y1="${10 + i * 43.33}"
                x2="290"
                y2="${10 + i * 43.33}"
                stroke="rgba(255, 0, 0, 0.08)"
                stroke-width="1"
            />
        `).join('');

        svg.innerHTML = `
            ${gridLines}
            <path
                d="${pathD}"
                stroke="#FF0000"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.5))"
            />
            ${circles}
        `;

        // Update info
        const panicCount = sessions.filter(s => s.hasPanicEvent).length;
        DOM.graphInfo.innerHTML = `
            <div>${sessions.length} SESSION${sessions.length !== 1 ? 'S' : ''} RECORDED</div>
            ${panicCount > 0 ? `
                <div class="graph-panic-info">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    </svg>
                    ${panicCount} PANIC EVENT${panicCount !== 1 ? 'S' : ''}
                </div>
            ` : ''}
        `;
    }

    function showSessionDetail(session) {
        const hasCritical = session.maxBpm > 120 || session.maxStress > 85;
        
        // Generate BPM graph path
        let bpmPath = 'M 10 75 Q 75 60, 150 45 T 290 35';
        if (session.bpmHistory && session.bpmHistory.length > 0) {
            const history = session.bpmHistory;
            const maxBpm = Math.max(...history.map(h => h.value), 140);
            const minBpm = Math.min(...history.map(h => h.value), 60);
            
            const pathPoints = history.map((point, i) => {
                const x = 10 + (i / (history.length - 1 || 1)) * 280;
                const y = 90 - ((point.value - minBpm) / (maxBpm - minBpm || 1)) * 70;
                return { x, y };
            });
            
            bpmPath = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
        }

        DOM.sessionDetail.innerHTML = `
            <div class="detail-header">
                <button class="back-btn" id="detail-back">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    BACK
                </button>
                <div class="detail-title">SESSION DETAIL</div>
            </div>
            
            <div class="detail-card ${session.hasPanicEvent ? 'has-panic' : ''}">
                <div class="detail-card-header">
                    <div>
                        <div class="detail-name ${session.hasPanicEvent ? 'panic' : ''}">${session.name}</div>
                        <div class="detail-date">${session.date}</div>
                    </div>
                    ${session.hasPanicEvent ? `
                        <span class="panic-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            </svg>
                            PANIC EVENT
                        </span>
                    ` : ''}
                </div>
                
                ${session.durationText ? `<div class="detail-duration">DURATION: ${session.durationText}</div>` : ''}
                
                <div class="detail-graph">
                    <div class="detail-graph-label">BPM TIMELINE</div>
                    <svg viewBox="0 0 300 100">
                        ${[0, 1, 2, 3].map(i => `
                            <line x1="10" y1="${10 + i * 26.67}" x2="290" y2="${10 + i * 26.67}" stroke="rgba(255, 0, 0, 0.05)" stroke-width="1"/>
                        `).join('')}
                        <path d="${bpmPath}" stroke="${session.hasPanicEvent ? '#8B0000' : '#FF0000'}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                
                <div class="detail-stats">
                    <div class="detail-stat">
                        <div class="detail-stat-label">PEAK BPM</div>
                        <div class="detail-stat-value ${session.maxBpm > 120 ? 'panic' : ''}">${session.maxBpm || 0}</div>
                    </div>
                    <div class="detail-stat">
                        <div class="detail-stat-label">MAX STRESS</div>
                        <div class="detail-stat-value ${session.maxStress > 85 ? 'panic' : ''}">${session.maxStress || 0}%</div>
                    </div>
                    <div class="detail-stat">
                        <div class="detail-stat-label">AVG BPM</div>
                        <div class="detail-stat-value avg">${session.avgBpm || session.maxBpm || 0}</div>
                    </div>
                    <div class="detail-stat">
                        <div class="detail-stat-label">PANIC EVENTS</div>
                        <div class="detail-stat-value ${session.panicCount > 0 ? 'panic' : 'muted'}">${session.panicCount || 0}</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-analysis">
                <div class="detail-analysis-title">TECHNICAL ANALYSIS</div>
                ${session.maxBpm > 100 ? `
                    <div class="analysis-item peak">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                        <span>PEAK FEAR EVENT DETECTED</span>
                    </div>
                ` : ''}
                ${hasCritical ? `
                    <div class="analysis-item critical">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        </svg>
                        <span>CRITICAL STRESS DETECTED</span>
                    </div>
                ` : ''}
                ${!session.maxBpm || session.maxBpm < 80 ? `
                    <div class="analysis-nominal">NOMINAL STRESS LEVELS</div>
                ` : ''}
            </div>
        `;
        
        DOM.sessionDetail.classList.remove('hidden');
        
        // Add back button handler
        document.getElementById('detail-back').addEventListener('click', () => {
            DOM.sessionDetail.classList.add('hidden');
        });
    }

    // ============================================
    // VIEW MANAGEMENT
    // ============================================
    
    function switchView(viewName) {
        STATE.currentView = viewName;
        
        // Handle watch fullscreen mode
        if (viewName === 'watch') {
            enterWatchMode();
            return;
        }
        
        // Exit watch fullscreen if active
        STATE.isWatchFullscreen = false;
        
        // Update view visibility
        DOM.viewMonitor.classList.toggle('active', viewName === 'monitor');
        DOM.viewWatch.classList.remove('active');
        DOM.viewHistory.classList.toggle('active', viewName === 'history');
        
        // Update menu items
        DOM.menuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });
        
        // Render history if switching to it
        if (viewName === 'history') {
            renderHistory();
        }
        
        closeMenu();
    }

    // ============================================
    // MENU MANAGEMENT
    // ============================================
    
    function openMenu() {
        if (STATE.isBlocked) return;
        
        STATE.menuOpen = true;
        DOM.menuOverlay.classList.remove('hidden');
        
        requestAnimationFrame(() => {
            DOM.menuOverlay.classList.add('visible');
            DOM.sideMenu.classList.add('open');
        });
    }

    function closeMenu() {
        STATE.menuOpen = false;
        DOM.menuOverlay.classList.remove('visible');
        DOM.sideMenu.classList.remove('open');
        
        setTimeout(() => {
            DOM.menuOverlay.classList.add('hidden');
        }, 250);
    }

    // ============================================
    // LANGUAGE MANAGEMENT
    // ============================================
    
    function setLanguage(lang) {
        STATE.language = lang;
        
        // Update active button
        DOM.langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update all text elements
        const t = TEXTS[lang];
        
        document.querySelectorAll('[data-text-monitor]').forEach(el => el.textContent = t.monitor);
        document.querySelectorAll('[data-text-watch]').forEach(el => el.textContent = t.watchMode);
        document.querySelectorAll('[data-text-history]').forEach(el => el.textContent = t.history);
        document.querySelectorAll('[data-text-language]').forEach(el => el.textContent = t.language);
        document.querySelectorAll('[data-text-about]').forEach(el => el.textContent = t.about);
        document.querySelectorAll('[data-text-bpm]').forEach(el => el.textContent = t.bpm);
        document.querySelectorAll('[data-text-stress]').forEach(el => el.textContent = t.stress);
        document.querySelectorAll('[data-text-signal]').forEach(el => el.textContent = t.signal);
        document.querySelectorAll('[data-text-no-sessions]').forEach(el => el.textContent = t.noSessions);
        document.querySelectorAll('[data-text-footer]').forEach(el => el.textContent = t.footer);
        document.querySelectorAll('[data-text-footer-sub]').forEach(el => el.textContent = t.footerSub);
        document.querySelectorAll('[data-text-critical]').forEach(el => el.textContent = t.criticalAlert);
        document.querySelectorAll('[data-text-watch-mode]').forEach(el => el.textContent = t.watchMode);
        
        // Update main button text
        updateMainButton();
        
        // Update data display
        updateDataDisplay();
    }

    // ============================================
    // START/STOP SIMULATION
    // ============================================
    
    function startMonitoring() {
        // Don't start new session in demo mode (demo has its own simulation)
        if (STATE.isDemoMode) return;
        
        STATE.isActive = true;
        STATE.isPanic = false;
        STATE.isRecovering = false;
        STATE.baseBpm = 72;
        STATE.targetBpm = 78;
        STATE.lastPanic = 0;
        STATE.panicActive = false;
        STATE.oscilloscopeStartTime = Date.now();
        
        // Initialize and play startup audio
        AudioEngine.init();
        AudioEngine.playStaticBurst(0.8);
        
        // Start heartbeat sound after static burst
        setTimeout(() => {
            AudioEngine.startHeartbeat();
        }, 900);
        
        // Start simulation
        STATE.simulationInterval = setInterval(simulateBpm, CONFIG.SIMULATION_INTERVAL);
        
        // Start session recording (only if not in demo mode)
        if (!STATE.isDemoMode) {
            startSession();
        }
        
        // Update UI
        DOM.oscilloscopeContainer.classList.add('ramping');
        setTimeout(() => {
            DOM.oscilloscopeContainer.classList.remove('ramping');
        }, 2000);
        
        updateMainButton();
        updateOscilloscopeIndicator();
        updateWatchMode();
    }

    function stopMonitoring() {
        const wasRecording = STATE.isRecording && !STATE.isDemoMode;
        
        STATE.isActive = false;
        STATE.isPanic = false;
        STATE.isRecovering = false;
        STATE.bpm = 72;
        STATE.stress = 0;
        STATE.signal = 'ACTIVE';
        STATE.panicActive = false;
        STATE.oscilloscopeStartTime = null;
        
        // Stop audio
        AudioEngine.stopHeartbeat();
        
        // Clear intervals
        if (STATE.simulationInterval) {
            clearInterval(STATE.simulationInterval);
            STATE.simulationInterval = null;
        }
        if (STATE.recoveryInterval) {
            clearInterval(STATE.recoveryInterval);
            STATE.recoveryInterval = null;
        }
        if (STATE.panicTimeout) {
            clearTimeout(STATE.panicTimeout);
            STATE.panicTimeout = null;
        }
        
        // End session and save (only if not demo mode)
        if (!STATE.isDemoMode) {
            endSession();
            
            // Show "SESSION SAVED" message on watch
            if (wasRecording && STATE.isWatchFullscreen) {
                showWatchMessage('SESSION SAVED', 2000);
            }
        }
        
        // Update UI
        updateMainButton();
        updateDataDisplay();
        updateOscilloscopeIndicator();
        updatePanicUI(false);
        updateStabilizingLabel();
        updateWatchMode();
    }

    function toggleMonitoring() {
        if (STATE.isBlocked) return;
        
        if (STATE.isActive) {
            stopMonitoring();
        } else {
            startMonitoring();
        }
    }
    
    // Toggle monitoring from watch mode
    function toggleWatchSession() {
        if (STATE.isBlocked) return;
        
        // Initialize audio on first interaction
        AudioEngine.init();
        
        if (STATE.isActive) {
            stopMonitoring();
            
            // Exit demo mode if active
            if (STATE.isDemoMode) {
                exitDemoMode();
            }
        } else {
            startMonitoring();
        }
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    function setupEventListeners() {
        // Main button
        DOM.mainBtn.addEventListener('click', toggleMonitoring);
        
        // Menu
        DOM.menuBtn.addEventListener('click', openMenu);
        DOM.menuClose.addEventListener('click', closeMenu);
        DOM.menuOverlay.addEventListener('click', closeMenu);
        
        // Menu navigation
        DOM.menuItems.forEach(item => {
            item.addEventListener('click', () => {
                switchView(item.dataset.view);
            });
        });
        
        // Language buttons
        DOM.langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setLanguage(btn.dataset.lang);
            });
        });
        
        // Watch Mode Controls
        if (DOM.watchStartBtn) {
            DOM.watchStartBtn.addEventListener('click', toggleWatchSession);
        }
        
        if (DOM.watchExitBtn) {
            DOM.watchExitBtn.addEventListener('click', exitWatchMode);
        }
        
        // Watch face tap to increase stress
        if (DOM.watchFace) {
            DOM.watchFace.addEventListener('click', (e) => {
                // Don't trigger on buttons
                if (e.target.closest('button')) return;
                triggerTap();
            });
        }
        
        // Long press on watch to activate demo mode
        let watchLongPressTimer = null;
        if (DOM.watchFace) {
            DOM.watchFace.addEventListener('mousedown', () => {
                watchLongPressTimer = setTimeout(() => {
                    if (!STATE.isDemoMode && !STATE.isActive) {
                        enterDemoMode();
                    }
                }, 2000);
            });
            
            DOM.watchFace.addEventListener('mouseup', () => {
                if (watchLongPressTimer) {
                    clearTimeout(watchLongPressTimer);
                    watchLongPressTimer = null;
                }
            });
            
            DOM.watchFace.addEventListener('touchstart', () => {
                watchLongPressTimer = setTimeout(() => {
                    if (!STATE.isDemoMode && !STATE.isActive) {
                        enterDemoMode();
                    }
                }, 2000);
            });
            
            DOM.watchFace.addEventListener('touchend', () => {
                if (watchLongPressTimer) {
                    clearTimeout(watchLongPressTimer);
                    watchLongPressTimer = null;
                }
            });
        }
        
        // History view toggle
        DOM.btnListView.addEventListener('click', () => {
            DOM.btnListView.classList.add('active');
            DOM.btnGraphView.classList.remove('active');
            renderHistory();
        });
        
        DOM.btnGraphView.addEventListener('click', () => {
            DOM.btnGraphView.classList.add('active');
            DOM.btnListView.classList.remove('active');
            renderHistory();
        });
        
        // Clear history
        DOM.btnClearHistory.addEventListener('click', () => {
            if (confirm('Clear all session history?')) {
                clearAllHistory();
            }
        });
        
        // Tap to increase stress (click anywhere on app when active)
        document.getElementById('app').addEventListener('click', (e) => {
            // Don't trigger if clicking buttons or menu or in watch mode
            if (e.target.closest('button') || e.target.closest('.side-menu') || e.target.closest('.menu-overlay') || e.target.closest('.watch-fullscreen')) {
                return;
            }
            triggerTap();
        });
        
        // Touch swipe for menu
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = Math.abs(touchEndY - touchStartY);
            
            // Swipe from left edge to open menu (not in watch fullscreen)
            if (touchStartX < 30 && deltaX > 50 && deltaY < 50 && !STATE.isBlocked && !STATE.isWatchFullscreen) {
                openMenu();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (STATE.isWatchFullscreen) {
                    exitWatchMode();
                    return;
                }
                if (STATE.menuOpen) {
                    closeMenu();
                }
                if (!DOM.sessionDetail.classList.contains('hidden')) {
                    DOM.sessionDetail.classList.add('hidden');
                }
            }
            if (e.key === ' ' && !STATE.menuOpen) {
                e.preventDefault();
                toggleMonitoring();
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
        setupWatchCanvas();
        
        // Start oscilloscope animation
        drawOscilloscope();
        
        // Initial UI state
        updateMainButton();
        updateDataDisplay();
        setLanguage('EN');
        
        // Render history if on that view
        if (STATE.currentView === 'history') {
            renderHistory();
        }
        
        console.log('%c FEAR METER v1.0 ', 'background: #8B0000; color: #FF0000; font-size: 14px; font-weight: bold;');
        console.log('%c Experimental Biometric Horror System ', 'color: #B0B0B0; font-size: 10px;');
    }

    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
