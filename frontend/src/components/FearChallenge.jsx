import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, Timer, Zap, Crown } from "lucide-react";

// Simulated global leaderboard
const GLOBAL_LEADERBOARD = [
    { rank: 1, name: "FearlessOne", score: 245, time: "4:12", country: "JP" },
    { rank: 2, name: "NightOwl", score: 238, time: "4:05", country: "US" },
    { rank: 3, name: "DarkSoul", score: 231, time: "3:58", country: "DE" },
    { rank: 4, name: "ShadowWalker", score: 225, time: "3:52", country: "BR" },
    { rank: 5, name: "PhantomHeart", score: 218, time: "3:45", country: "UK" },
    { rank: 6, name: "AbyssGazer", score: 210, time: "3:38", country: "CA" },
    { rank: 7, name: "VoidSeeker", score: 205, time: "3:32", country: "AU" },
    { rank: 8, name: "TerrorTest", score: 198, time: "3:25", country: "FR" },
    { rank: 9, name: "NightmareX", score: 192, time: "3:18", country: "ES" },
    { rank: 10, name: "DreadLord", score: 185, time: "3:10", country: "MX" },
];

// Challenge modes
const CHALLENGE_MODES = {
    endurance: {
        name: "ENDURANCE",
        description: "Keep BPM under 100 as long as possible",
        icon: Timer,
        targetBpm: 100,
        scoreMultiplier: 1,
    },
    extreme: {
        name: "EXTREME",
        description: "Keep BPM under 90 — maximum difficulty",
        icon: Zap,
        targetBpm: 90,
        scoreMultiplier: 1.5,
    },
};

export const FearChallenge = () => {
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [currentBpm, setCurrentBpm] = useState(72);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [score, setScore] = useState(0);
    const [violations, setViolations] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [personalBest, setPersonalBest] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("fear_challenge_best")) || { score: 0, time: 0 };
        } catch {
            return { score: 0, time: 0 };
        }
    });
    const intervalRef = useRef(null);
    const baseBpm = 72;

    // Start challenge
    const startChallenge = useCallback((mode) => {
        setSelectedMode(mode);
        setIsActive(true);
        setCurrentBpm(baseBpm);
        setElapsedTime(0);
        setScore(0);
        setViolations(0);
        setGameOver(false);
    }, []);

    // End challenge
    const endChallenge = useCallback(() => {
        setIsActive(false);
        setGameOver(true);
        
        // Save personal best
        const finalScore = Math.round(score);
        if (finalScore > personalBest.score) {
            const newBest = { score: finalScore, time: elapsedTime };
            setPersonalBest(newBest);
            try {
                localStorage.setItem("fear_challenge_best", JSON.stringify(newBest));
            } catch (e) {
                console.warn("Failed to save personal best:", e);
            }
        }
    }, [score, elapsedTime, personalBest.score]);

    // Game loop
    useEffect(() => {
        if (!isActive || !selectedMode) return;

        intervalRef.current = setInterval(() => {
            // Simulate BPM with increasing difficulty over time
            setCurrentBpm(prev => {
                const timeBonus = elapsedTime * 0.02; // BPM increases over time
                const randomChange = (Math.random() - 0.4) * 6 + timeBonus;
                const spike = Math.random() < 0.03 ? 15 : 0;
                
                let newBpm = prev + randomChange + spike;
                newBpm = Math.max(65, Math.min(140, newBpm));
                newBpm = Math.round(newBpm);
                
                // Check violation
                const mode = CHALLENGE_MODES[selectedMode];
                if (newBpm >= mode.targetBpm) {
                    setViolations(v => {
                        const newViolations = v + 1;
                        if (newViolations >= 3) {
                            // Game over after 3 violations
                            setTimeout(() => endChallenge(), 100);
                        }
                        return newViolations;
                    });
                }
                
                return newBpm;
            });
            
            // Update time and score
            setElapsedTime(t => t + 1);
            setScore(s => {
                const mode = CHALLENGE_MODES[selectedMode];
                const basePoints = 1 * mode.scoreMultiplier;
                const bpmBonus = currentBpm < mode.targetBpm - 10 ? 0.5 : 0;
                return s + basePoints + bpmBonus;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, selectedMode, elapsedTime, currentBpm, endChallenge]);

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Render mode selection
    const renderModeSelection = () => (
        <div className="flex-1 p-4">
            <h2 
                className="text-xs tracking-[0.2em] mb-2 text-center"
                style={{ color: "#FF0000" }}
            >
                FEAR CHALLENGE
            </h2>
            <p 
                className="text-[9px] tracking-[0.1em] mb-8 text-center"
                style={{ color: "rgba(176, 176, 176, 0.5)" }}
            >
                How long can you stay calm under fear?
            </p>
            
            <div className="space-y-4">
                {Object.entries(CHALLENGE_MODES).map(([key, mode]) => (
                    <button
                        key={key}
                        onClick={() => startChallenge(key)}
                        className="w-full p-4 text-left transition-all duration-200"
                        style={{ 
                            backgroundColor: "rgba(255, 0, 0, 0.03)",
                            border: "1px solid rgba(255, 0, 0, 0.15)",
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <mode.icon className="w-5 h-5 mt-0.5" style={{ color: "#FF0000" }} />
                            <div>
                                <h3 
                                    className="text-sm tracking-[0.15em]"
                                    style={{ color: "#FF0000" }}
                                >
                                    {mode.name}
                                </h3>
                                <p 
                                    className="text-[9px] tracking-[0.05em] mt-1"
                                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                                >
                                    {mode.description}
                                </p>
                                <p 
                                    className="text-[8px] tracking-[0.1em] mt-2"
                                    style={{ color: "rgba(255, 0, 0, 0.5)" }}
                                >
                                    SCORE MULTIPLIER: {mode.scoreMultiplier}x
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            
            {/* Personal Best */}
            {personalBest.score > 0 && (
                <div 
                    className="mt-8 p-4 text-center"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.05)",
                        border: "1px solid rgba(255, 0, 0, 0.1)",
                    }}
                >
                    <p 
                        className="text-[8px] tracking-[0.15em] mb-2"
                        style={{ color: "rgba(255, 0, 0, 0.4)" }}
                    >
                        YOUR PERSONAL BEST
                    </p>
                    <p 
                        className="text-2xl font-mono"
                        style={{ color: "#FF0000" }}
                    >
                        {personalBest.score}
                    </p>
                    <p 
                        className="text-[9px] font-mono mt-1"
                        style={{ color: "rgba(176, 176, 176, 0.5)" }}
                    >
                        {formatTime(personalBest.time)}
                    </p>
                </div>
            )}
        </div>
    );

    // Render active challenge
    const renderActiveChallenge = () => {
        const mode = CHALLENGE_MODES[selectedMode];
        const isOverLimit = currentBpm >= mode.targetBpm;
        
        return (
            <div className="flex-1 flex flex-col">
                {/* Mode indicator */}
                <div 
                    className="py-2 px-4 text-center"
                    style={{ 
                        backgroundColor: isOverLimit ? "rgba(255, 0, 0, 0.1)" : "rgba(255, 0, 0, 0.05)",
                        borderBottom: `1px solid ${isOverLimit ? "rgba(255, 0, 0, 0.3)" : "rgba(255, 0, 0, 0.1)"}`,
                    }}
                >
                    <span 
                        className="text-[9px] tracking-[0.2em]"
                        style={{ color: isOverLimit ? "#FF0000" : "#FF0000" }}
                    >
                        {mode.name} MODE — TARGET: &lt;{mode.targetBpm} BPM
                    </span>
                </div>
                
                {/* Main display */}
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    {/* BPM */}
                    <div 
                        className="text-7xl font-mono font-bold"
                        style={{ 
                            color: isOverLimit ? "#FF0000" : currentBpm > mode.targetBpm - 10 ? "#FF0000" : "#FF0000",
                            textShadow: isOverLimit ? "0 0 30px rgba(255, 0, 0, 0.5)" : "none",
                            animation: isOverLimit ? "shake 0.2s ease-in-out infinite" : "none",
                        }}
                    >
                        {currentBpm}
                    </div>
                    <span 
                        className="text-[10px] tracking-[0.2em] mt-1"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        BPM
                    </span>
                    
                    {/* Warning */}
                    {isOverLimit && (
                        <div 
                            className="mt-4 py-2 px-4 animate-pulse"
                            style={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                        >
                            <span 
                                className="text-[10px] tracking-[0.15em]"
                                style={{ color: "#FF0000" }}
                            >
                                ⚠ BPM VIOLATION — CALM DOWN
                            </span>
                        </div>
                    )}
                    
                    {/* Violations */}
                    <div className="flex gap-2 mt-6">
                        {[0, 1, 2].map(i => (
                            <div 
                                key={i}
                                className="w-3 h-3 rounded-full"
                                style={{ 
                                    backgroundColor: i < violations 
                                        ? "#FF0000" 
                                        : "rgba(255, 0, 0, 0.2)",
                                }}
                            />
                        ))}
                    </div>
                    <span 
                        className="text-[8px] tracking-[0.1em] mt-2"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        {3 - violations} LIVES REMAINING
                    </span>
                </div>
                
                {/* Stats */}
                <div 
                    className="py-4 px-6 flex justify-around"
                    style={{ borderTop: "1px solid rgba(255, 0, 0, 0.1)" }}
                >
                    <div className="text-center">
                        <p className="text-[8px] tracking-[0.1em]" style={{ color: "rgba(255, 0, 0, 0.4)" }}>
                            TIME
                        </p>
                        <p className="text-xl font-mono" style={{ color: "#FF0000" }}>
                            {formatTime(elapsedTime)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[8px] tracking-[0.1em]" style={{ color: "rgba(255, 0, 0, 0.4)" }}>
                            SCORE
                        </p>
                        <p className="text-xl font-mono" style={{ color: "#FF0000" }}>
                            {Math.round(score)}
                        </p>
                    </div>
                </div>
                
                {/* Give up button */}
                <div className="py-4 flex justify-center">
                    <button
                        onClick={endChallenge}
                        className="text-[9px] tracking-[0.1em] px-4 py-2"
                        style={{ color: "rgba(255, 0, 0, 0.4)" }}
                    >
                        GIVE UP
                    </button>
                </div>
            </div>
        );
    };

    // Render game over
    const renderGameOver = () => {
        const finalScore = Math.round(score);
        const isNewBest = finalScore > personalBest.score;
        
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <h2 
                    className="text-sm tracking-[0.3em] mb-2"
                    style={{ color: "#FF0000" }}
                >
                    CHALLENGE OVER
                </h2>
                <p 
                    className="text-[9px] tracking-[0.1em] mb-8"
                    style={{ color: "rgba(176, 176, 176, 0.5)" }}
                >
                    Fear overcame you
                </p>
                
                {isNewBest && (
                    <div 
                        className="flex items-center gap-2 mb-4 py-2 px-4"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                    >
                        <Crown className="w-4 h-4" style={{ color: "#FF0000" }} />
                        <span 
                            className="text-[10px] tracking-[0.15em]"
                            style={{ color: "#FF0000" }}
                        >
                            NEW PERSONAL BEST!
                        </span>
                    </div>
                )}
                
                <div className="space-y-4 text-center">
                    <div>
                        <p className="text-[8px] tracking-[0.15em]" style={{ color: "rgba(255, 0, 0, 0.4)" }}>
                            FINAL SCORE
                        </p>
                        <p className="text-4xl font-mono" style={{ color: "#FF0000" }}>
                            {finalScore}
                        </p>
                    </div>
                    <div>
                        <p className="text-[8px] tracking-[0.15em]" style={{ color: "rgba(255, 0, 0, 0.4)" }}>
                            SURVIVAL TIME
                        </p>
                        <p className="text-2xl font-mono" style={{ color: "#FF0000" }}>
                            {formatTime(elapsedTime)}
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={() => {
                        setSelectedMode(null);
                        setGameOver(false);
                    }}
                    className="mt-8 px-6 py-3 text-[10px] tracking-[0.15em]"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        border: "1px solid rgba(255, 0, 0, 0.3)",
                        color: "#FF0000",
                    }}
                >
                    TRY AGAIN
                </button>
            </div>
        );
    };

    // Render leaderboard
    const renderLeaderboard = () => (
        <div className="p-4">
            <h3 
                className="text-[10px] tracking-[0.2em] mb-4 text-center"
                style={{ color: "rgba(255, 0, 0, 0.5)" }}
            >
                GLOBAL LEADERBOARD
            </h3>
            
            <div className="space-y-2">
                {GLOBAL_LEADERBOARD.map((entry) => (
                    <div 
                        key={entry.rank}
                        className="flex items-center gap-3 py-2 px-3"
                        style={{ 
                            backgroundColor: entry.rank <= 3 
                                ? "rgba(255, 0, 0, 0.05)" 
                                : "transparent",
                            borderBottom: "1px solid rgba(255, 0, 0, 0.05)",
                        }}
                    >
                        <span 
                            className="text-sm font-mono w-6"
                            style={{ 
                                color: entry.rank === 1 
                                    ? "#FF0000" 
                                    : entry.rank <= 3 
                                        ? "#FF0000" 
                                        : "#FF0000",
                            }}
                        >
                            {entry.rank}
                        </span>
                        <div className="flex-1">
                            <p 
                                className="text-[10px] tracking-[0.1em]"
                                style={{ color: "rgba(176, 176, 176, 0.7)" }}
                            >
                                {entry.name}
                            </p>
                            <p 
                                className="text-[8px]"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                {entry.country}
                            </p>
                        </div>
                        <div className="text-right">
                            <p 
                                className="text-sm font-mono"
                                style={{ color: "#FF0000" }}
                            >
                                {entry.score}
                            </p>
                            <p 
                                className="text-[8px] font-mono"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                {entry.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            <p 
                className="text-[7px] tracking-[0.1em] text-center mt-4"
                style={{ color: "rgba(255, 0, 0, 0.3)" }}
            >
                SIMULATED LEADERBOARD — DEMO DATA
            </p>
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
                style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.1)" }}
            >
                <button
                    onClick={() => navigate("/")}
                    className="p-1"
                    style={{ color: "rgba(255, 0, 0, 0.5)" }}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span 
                    className="text-[9px] tracking-[0.25em]"
                    style={{ color: "rgba(255, 0, 0, 0.4)" }}
                >
                    FEAR CHALLENGE
                </span>
                
                <Trophy className="w-4 h-4" style={{ color: "rgba(255, 0, 0, 0.3)" }} />
            </div>
            
            {/* Content */}
            {gameOver ? (
                <>
                    {renderGameOver()}
                    {renderLeaderboard()}
                </>
            ) : isActive ? (
                renderActiveChallenge()
            ) : (
                <>
                    {renderModeSelection()}
                    {renderLeaderboard()}
                </>
            )}
            
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }
            `}</style>
        </div>
    );
};

export default FearChallenge;
