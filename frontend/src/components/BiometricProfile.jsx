import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, Shield, Zap, Brain, Heart, Eye } from "lucide-react";

// Fear profile types
const PROFILE_TYPES = {
    jumpScareSensitive: {
        name: "Jump Scare Sensitive",
        description: "High reactivity to sudden frights",
        icon: Zap,
        color: "#FF0000",
    },
    psychologicalResistant: {
        name: "Psychological Horror Resistant",
        description: "Handles slow-burn terror well",
        icon: Brain,
        color: "#8E0E1C",
    },
    tensionBuilder: {
        name: "Tension Builder",
        description: "Fear accumulates gradually",
        icon: Heart,
        color: "#B11226",
    },
    fearless: {
        name: "Fearless Observer",
        description: "Minimal physiological response",
        icon: Eye,
        color: "rgba(142, 14, 28, 0.5)",
    },
    hyperReactive: {
        name: "Hyper-Reactive",
        description: "Extreme response to all stimuli",
        icon: Shield,
        color: "#FF0000",
    },
};

// Radar chart attributes
const FEAR_ATTRIBUTES = [
    { key: "jumpScare", label: "Jump Scare", angle: 0 },
    { key: "psychological", label: "Psychological", angle: 60 },
    { key: "gore", label: "Gore", angle: 120 },
    { key: "supernatural", label: "Supernatural", angle: 180 },
    { key: "tension", label: "Tension", angle: 240 },
    { key: "darkness", label: "Darkness", angle: 300 },
];

export const BiometricProfile = () => {
    const navigate = useNavigate();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [profile, setProfile] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("fear_meter_profile"));
        } catch {
            return null;
        }
    });

    // Generate random profile data (simulated)
    const generateProfile = () => {
        return {
            type: Object.keys(PROFILE_TYPES)[Math.floor(Math.random() * Object.keys(PROFILE_TYPES).length)],
            attributes: {
                jumpScare: 30 + Math.floor(Math.random() * 60),
                psychological: 30 + Math.floor(Math.random() * 60),
                gore: 20 + Math.floor(Math.random() * 50),
                supernatural: 30 + Math.floor(Math.random() * 60),
                tension: 40 + Math.floor(Math.random() * 50),
                darkness: 25 + Math.floor(Math.random() * 55),
            },
            stats: {
                avgBpm: 72 + Math.floor(Math.random() * 20),
                peakBpm: 110 + Math.floor(Math.random() * 35),
                fearEvents: Math.floor(Math.random() * 50),
                totalSessions: 5 + Math.floor(Math.random() * 20),
            },
            timestamp: Date.now(),
        };
    };

    // Start analysis
    const startAnalysis = () => {
        setIsAnalyzing(true);
        setAnalysisProgress(0);
    };

    // Analysis progress effect
    useEffect(() => {
        if (!isAnalyzing) return;

        const interval = setInterval(() => {
            setAnalysisProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsAnalyzing(false);
                    const newProfile = generateProfile();
                    setProfile(newProfile);
                    try {
                        localStorage.setItem("fear_meter_profile", JSON.stringify(newProfile));
                    } catch (e) {
                        console.warn("Failed to save profile:", e);
                    }
                    return 100;
                }
                return prev + 2;
            });
        }, 80);

        return () => clearInterval(interval);
    }, [isAnalyzing]);

    // Get profile type info
    const profileType = useMemo(() => {
        if (!profile) return null;
        return PROFILE_TYPES[profile.type];
    }, [profile]);

    // Render radar chart (simplified SVG)
    const renderRadarChart = () => {
        if (!profile) return null;

        const size = 200;
        const center = size / 2;
        const maxRadius = 80;

        // Calculate points for the profile polygon
        const points = FEAR_ATTRIBUTES.map(attr => {
            const value = profile.attributes[attr.key] / 100;
            const angle = (attr.angle - 90) * (Math.PI / 180);
            const r = value * maxRadius;
            return {
                x: center + r * Math.cos(angle),
                y: center + r * Math.sin(angle),
            };
        });

        const polygonPoints = points.map(p => `${p.x},${p.y}`).join(" ");

        return (
            <svg width={size} height={size} className="mx-auto">
                {/* Background circles */}
                {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={maxRadius * ratio}
                        fill="none"
                        stroke="rgba(142, 14, 28, 0.1)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axis lines */}
                {FEAR_ATTRIBUTES.map((attr, i) => {
                    const angle = (attr.angle - 90) * (Math.PI / 180);
                    const x2 = center + maxRadius * Math.cos(angle);
                    const y2 = center + maxRadius * Math.sin(angle);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={x2}
                            y2={y2}
                            stroke="rgba(142, 14, 28, 0.15)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Profile polygon */}
                <polygon
                    points={polygonPoints}
                    fill="rgba(177, 18, 38, 0.2)"
                    stroke="#B11226"
                    strokeWidth="2"
                />

                {/* Data points */}
                {points.map((point, i) => (
                    <circle
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#B11226"
                    />
                ))}

                {/* Labels */}
                {FEAR_ATTRIBUTES.map((attr, i) => {
                    const angle = (attr.angle - 90) * (Math.PI / 180);
                    const labelRadius = maxRadius + 25;
                    const x = center + labelRadius * Math.cos(angle);
                    const y = center + labelRadius * Math.sin(angle);
                    return (
                        <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(176, 176, 176, 0.5)"
                            fontSize="8"
                            style={{ letterSpacing: "0.1em" }}
                        >
                            {attr.label.toUpperCase()}
                        </text>
                    );
                })}
            </svg>
        );
    };

    // Render analyzing state
    const renderAnalyzing = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div 
                className="w-20 h-20 flex items-center justify-center mb-6"
                style={{ 
                    border: "2px solid rgba(142, 14, 28, 0.3)",
                    borderRadius: "50%",
                }}
            >
                <Brain 
                    className="w-10 h-10 animate-pulse"
                    style={{ color: "#8E0E1C" }}
                />
            </div>
            
            <h2 
                className="text-xs tracking-[0.2em] mb-4"
                style={{ color: "#8E0E1C" }}
            >
                ANALYZING BIOMETRIC PATTERNS
            </h2>
            
            <div 
                className="w-48 h-1 mb-2"
                style={{ backgroundColor: "rgba(142, 14, 28, 0.1)" }}
            >
                <div 
                    className="h-full transition-all duration-200"
                    style={{ 
                        width: `${analysisProgress}%`,
                        backgroundColor: "#8E0E1C",
                    }}
                />
            </div>
            
            <p 
                className="text-[9px] tracking-[0.1em]"
                style={{ color: "rgba(176, 176, 176, 0.5)" }}
            >
                {analysisProgress < 30 
                    ? "Collecting biometric data..."
                    : analysisProgress < 60
                        ? "Processing fear responses..."
                        : analysisProgress < 90
                            ? "Identifying patterns..."
                            : "Generating profile..."}
            </p>
        </div>
    );

    // Render no profile state
    const renderNoProfile = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div 
                className="w-20 h-20 flex items-center justify-center mb-6"
                style={{ 
                    border: "2px solid rgba(142, 14, 28, 0.2)",
                    borderRadius: "50%",
                }}
            >
                <User 
                    className="w-10 h-10"
                    style={{ color: "rgba(142, 14, 28, 0.4)" }}
                />
            </div>
            
            <h2 
                className="text-xs tracking-[0.2em] mb-2"
                style={{ color: "#8E0E1C" }}
            >
                NO PROFILE DETECTED
            </h2>
            
            <p 
                className="text-[9px] tracking-[0.1em] mb-8 text-center max-w-xs"
                style={{ color: "rgba(176, 176, 176, 0.5)" }}
            >
                Generate your biometric fear profile based on your physiological responses
            </p>
            
            <button
                onClick={startAnalysis}
                className="px-6 py-3 text-[10px] tracking-[0.15em]"
                style={{ 
                    backgroundColor: "rgba(142, 14, 28, 0.1)",
                    border: "1px solid rgba(142, 14, 28, 0.3)",
                    color: "#8E0E1C",
                }}
            >
                GENERATE PROFILE
            </button>
        </div>
    );

    // Render profile
    const renderProfile = () => (
        <div className="flex-1 overflow-y-auto">
            {/* Profile header */}
            <div 
                className="py-6 px-4 text-center"
                style={{ borderBottom: "1px solid rgba(142, 14, 28, 0.1)" }}
            >
                <div 
                    className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                    style={{ 
                        border: `2px solid ${profileType.color}`,
                        borderRadius: "50%",
                    }}
                >
                    <profileType.icon 
                        className="w-8 h-8"
                        style={{ color: profileType.color }}
                    />
                </div>
                
                <h2 
                    className="text-sm tracking-[0.15em] mb-1"
                    style={{ color: profileType.color }}
                >
                    {profileType.name.toUpperCase()}
                </h2>
                
                <p 
                    className="text-[9px] tracking-[0.1em]"
                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                >
                    {profileType.description}
                </p>
            </div>
            
            {/* Radar chart */}
            <div className="py-6">
                <h3 
                    className="text-[9px] tracking-[0.2em] mb-4 text-center"
                    style={{ color: "rgba(142, 14, 28, 0.5)" }}
                >
                    FEAR SENSITIVITY RADAR
                </h3>
                {renderRadarChart()}
            </div>
            
            {/* Attribute breakdown */}
            <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(142, 14, 28, 0.1)" }}>
                <h3 
                    className="text-[9px] tracking-[0.2em] mb-4"
                    style={{ color: "rgba(142, 14, 28, 0.5)" }}
                >
                    SENSITIVITY BREAKDOWN
                </h3>
                
                <div className="space-y-3">
                    {FEAR_ATTRIBUTES.map(attr => (
                        <div key={attr.key}>
                            <div className="flex justify-between mb-1">
                                <span 
                                    className="text-[8px] tracking-[0.1em]"
                                    style={{ color: "rgba(176, 176, 176, 0.6)" }}
                                >
                                    {attr.label.toUpperCase()}
                                </span>
                                <span 
                                    className="text-[9px] font-mono"
                                    style={{ color: "#8E0E1C" }}
                                >
                                    {profile.attributes[attr.key]}%
                                </span>
                            </div>
                            <div 
                                className="h-1 w-full"
                                style={{ backgroundColor: "rgba(142, 14, 28, 0.1)" }}
                            >
                                <div 
                                    className="h-full"
                                    style={{ 
                                        width: `${profile.attributes[attr.key]}%`,
                                        backgroundColor: profile.attributes[attr.key] > 70 
                                            ? "#FF0000" 
                                            : profile.attributes[attr.key] > 50 
                                                ? "#B11226" 
                                                : "#8E0E1C",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Stats */}
            <div 
                className="px-4 py-4 grid grid-cols-2 gap-4"
                style={{ borderTop: "1px solid rgba(142, 14, 28, 0.1)" }}
            >
                <div className="text-center">
                    <p className="text-[7px] tracking-[0.1em]" style={{ color: "rgba(142, 14, 28, 0.4)" }}>
                        AVG BPM
                    </p>
                    <p className="text-xl font-mono" style={{ color: "#8E0E1C" }}>
                        {profile.stats.avgBpm}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-[7px] tracking-[0.1em]" style={{ color: "rgba(142, 14, 28, 0.4)" }}>
                        PEAK BPM
                    </p>
                    <p className="text-xl font-mono" style={{ color: "#B11226" }}>
                        {profile.stats.peakBpm}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-[7px] tracking-[0.1em]" style={{ color: "rgba(142, 14, 28, 0.4)" }}>
                        FEAR EVENTS
                    </p>
                    <p className="text-xl font-mono" style={{ color: "#8E0E1C" }}>
                        {profile.stats.fearEvents}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-[7px] tracking-[0.1em]" style={{ color: "rgba(142, 14, 28, 0.4)" }}>
                        SESSIONS
                    </p>
                    <p className="text-xl font-mono" style={{ color: "#8E0E1C" }}>
                        {profile.stats.totalSessions}
                    </p>
                </div>
            </div>
            
            {/* Regenerate button */}
            <div className="px-4 py-6 text-center">
                <button
                    onClick={startAnalysis}
                    className="text-[9px] tracking-[0.1em] px-4 py-2"
                    style={{ 
                        color: "rgba(142, 14, 28, 0.5)",
                        border: "1px solid rgba(142, 14, 28, 0.2)",
                    }}
                >
                    REGENERATE PROFILE
                </button>
            </div>
        </div>
    );

    return (
        <div 
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: "#000000" }}
        >
            {/* Header */}
            <div 
                className="py-3 px-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(142, 14, 28, 0.1)" }}
            >
                <button
                    onClick={() => navigate("/")}
                    className="p-1"
                    style={{ color: "rgba(142, 14, 28, 0.5)" }}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span 
                    className="text-[9px] tracking-[0.25em]"
                    style={{ color: "rgba(142, 14, 28, 0.4)" }}
                >
                    BIOMETRIC PROFILE
                </span>
                
                <User className="w-4 h-4" style={{ color: "rgba(142, 14, 28, 0.3)" }} />
            </div>
            
            {/* Content */}
            {isAnalyzing ? (
                renderAnalyzing()
            ) : profile ? (
                renderProfile()
            ) : (
                renderNoProfile()
            )}
            
            {/* Footer */}
            <div 
                className="py-2 px-4 text-center"
                style={{ borderTop: "1px solid rgba(142, 14, 28, 0.05)" }}
            >
                <p 
                    className="text-[7px] tracking-[0.1em]"
                    style={{ color: "rgba(142, 14, 28, 0.25)" }}
                >
                    SIMULATED ANALYSIS — NOT REAL PSYCHOLOGICAL ASSESSMENT
                </p>
            </div>
        </div>
    );
};

export default BiometricProfile;
