import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Film, Gamepad2, Ticket, TrendingUp } from "lucide-react";

// Simulated fear data for movies
const MOVIES_DATA = [
    { id: 1, title: "Hereditary", year: 2018, avgBpmSpike: 28, fearLevel: "EXTREME", peakMoment: "Head click scene" },
    { id: 2, title: "The Conjuring", year: 2013, avgBpmSpike: 22, fearLevel: "HIGH", peakMoment: "Clapping hands" },
    { id: 3, title: "Sinister", year: 2012, avgBpmSpike: 25, fearLevel: "EXTREME", peakMoment: "Lawn mower tape" },
    { id: 4, title: "Insidious", year: 2010, avgBpmSpike: 20, fearLevel: "HIGH", peakMoment: "Red face demon" },
    { id: 5, title: "The Ring", year: 2002, avgBpmSpike: 18, fearLevel: "HIGH", peakMoment: "TV emergence" },
    { id: 6, title: "It Follows", year: 2014, avgBpmSpike: 15, fearLevel: "MODERATE", peakMoment: "Beach scene" },
    { id: 7, title: "A Quiet Place", year: 2018, avgBpmSpike: 21, fearLevel: "HIGH", peakMoment: "Nail scene" },
    { id: 8, title: "The Exorcist", year: 1973, avgBpmSpike: 24, fearLevel: "EXTREME", peakMoment: "Spider walk" },
];

// Simulated fear data for games
const GAMES_DATA = [
    { id: 1, title: "Outlast", year: 2013, peakBpm: 142, avgSession: "45 min", peakMoment: "Doctor chase" },
    { id: 2, title: "Amnesia: The Dark Descent", year: 2010, peakBpm: 138, avgSession: "60 min", peakMoment: "Water lurker" },
    { id: 3, title: "Resident Evil 7", year: 2017, peakBpm: 135, avgSession: "90 min", peakMoment: "Mia attack" },
    { id: 4, title: "P.T.", year: 2014, peakBpm: 145, avgSession: "30 min", peakMoment: "Lisa appearance" },
    { id: 5, title: "Alien: Isolation", year: 2014, peakBpm: 140, avgSession: "120 min", peakMoment: "First encounter" },
    { id: 6, title: "SOMA", year: 2015, peakBpm: 125, avgSession: "75 min", peakMoment: "Abyss descent" },
];

// Simulated fear data for attractions
const ATTRACTIONS_DATA = [
    { id: 1, name: "Halloween Horror Nights", location: "Universal Studios", intensity: 85, fearIndex: "EXTREME" },
    { id: 2, name: "McKamey Manor", location: "Tennessee, USA", intensity: 98, fearIndex: "CRITICAL" },
    { id: 3, name: "Pennhurst Asylum", location: "Pennsylvania, USA", intensity: 82, fearIndex: "EXTREME" },
    { id: 4, name: "Eastern State Penitentiary", location: "Philadelphia, USA", intensity: 78, fearIndex: "HIGH" },
    { id: 5, name: "The Haunted Mansion", location: "Disneyland", intensity: 35, fearIndex: "LOW" },
];

// Fear level badge component
const FearBadge = ({ level }) => {
    const colors = {
        LOW: { bg: "rgba(255, 0, 0, 0.1)", text: "rgba(255, 0, 0, 0.5)" },
        MODERATE: { bg: "rgba(255, 0, 0, 0.15)", text: "rgba(255, 0, 0, 0.7)" },
        HIGH: { bg: "rgba(255, 0, 0, 0.2)", text: "#FF0000" },
        EXTREME: { bg: "rgba(255, 0, 0, 0.15)", text: "#FF0000" },
        CRITICAL: { bg: "rgba(255, 0, 0, 0.25)", text: "#FF0000" },
    };
    
    const style = colors[level] || colors.MODERATE;
    
    return (
        <span 
            className="text-[8px] tracking-[0.1em] px-2 py-0.5"
            style={{ 
                backgroundColor: style.bg,
                color: style.text,
                border: `1px solid ${style.text}`,
            }}
        >
            {level}
        </span>
    );
};

export const FearLibrary = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("movies");
    
    const tabs = [
        { id: "movies", label: "MOVIES", icon: Film },
        { id: "games", label: "GAMES", icon: Gamepad2 },
        { id: "attractions", label: "ATTRACTIONS", icon: Ticket },
        { id: "ranking", label: "RANKING", icon: TrendingUp },
    ];
    
    const renderMovies = () => (
        <div className="space-y-2">
            {MOVIES_DATA.map((movie) => (
                <div 
                    key={movie.id}
                    className="p-3"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.03)",
                        border: "1px solid rgba(255, 0, 0, 0.1)",
                    }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 
                                className="text-xs tracking-[0.1em]"
                                style={{ color: "#FF0000" }}
                            >
                                {movie.title}
                            </h3>
                            <p 
                                className="text-[9px] tracking-[0.05em]"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                {movie.year}
                            </p>
                        </div>
                        <FearBadge level={movie.fearLevel} />
                    </div>
                    <div className="flex gap-4 text-[8px]">
                        <div>
                            <span style={{ color: "rgba(176, 176, 176, 0.4)" }}>AVG SPIKE: </span>
                            <span style={{ color: "#FF0000" }}>+{movie.avgBpmSpike} BPM</span>
                        </div>
                        <div>
                            <span style={{ color: "rgba(176, 176, 176, 0.4)" }}>PEAK: </span>
                            <span style={{ color: "rgba(176, 176, 176, 0.6)" }}>{movie.peakMoment}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
    const renderGames = () => (
        <div className="space-y-2">
            {GAMES_DATA.map((game) => (
                <div 
                    key={game.id}
                    className="p-3"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.03)",
                        border: "1px solid rgba(255, 0, 0, 0.1)",
                    }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 
                                className="text-xs tracking-[0.1em]"
                                style={{ color: "#FF0000" }}
                            >
                                {game.title}
                            </h3>
                            <p 
                                className="text-[9px] tracking-[0.05em]"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                {game.year}
                            </p>
                        </div>
                        <span 
                            className="text-sm font-mono"
                            style={{ color: game.peakBpm > 140 ? "#FF0000" : "#FF0000" }}
                        >
                            {game.peakBpm}
                        </span>
                    </div>
                    <div className="flex gap-4 text-[8px]">
                        <div>
                            <span style={{ color: "rgba(176, 176, 176, 0.4)" }}>AVG SESSION: </span>
                            <span style={{ color: "rgba(176, 176, 176, 0.6)" }}>{game.avgSession}</span>
                        </div>
                        <div>
                            <span style={{ color: "rgba(176, 176, 176, 0.4)" }}>PEAK FEAR: </span>
                            <span style={{ color: "#FF0000" }}>{game.peakMoment}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
    const renderAttractions = () => (
        <div className="space-y-2">
            {ATTRACTIONS_DATA.map((attraction) => (
                <div 
                    key={attraction.id}
                    className="p-3"
                    style={{ 
                        backgroundColor: "rgba(255, 0, 0, 0.03)",
                        border: "1px solid rgba(255, 0, 0, 0.1)",
                    }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 
                                className="text-xs tracking-[0.1em]"
                                style={{ color: "#FF0000" }}
                            >
                                {attraction.name}
                            </h3>
                            <p 
                                className="text-[9px] tracking-[0.05em]"
                                style={{ color: "rgba(176, 176, 176, 0.4)" }}
                            >
                                {attraction.location}
                            </p>
                        </div>
                        <FearBadge level={attraction.fearIndex} />
                    </div>
                    {/* Intensity bar */}
                    <div className="mt-2">
                        <div 
                            className="h-1 w-full"
                            style={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                        >
                            <div 
                                className="h-full transition-all duration-500"
                                style={{ 
                                    width: `${attraction.intensity}%`,
                                    backgroundColor: attraction.intensity > 90 
                                        ? "#FF0000" 
                                        : attraction.intensity > 70 
                                            ? "#FF0000" 
                                            : "#FF0000",
                                }}
                            />
                        </div>
                        <p 
                            className="text-[7px] tracking-[0.1em] mt-1"
                            style={{ color: "rgba(176, 176, 176, 0.4)" }}
                        >
                            INTENSITY: {attraction.intensity}%
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
    
    const renderRanking = () => (
        <div className="space-y-6">
            {/* Global Fear Index */}
            <div>
                <h3 
                    className="text-[10px] tracking-[0.2em] mb-3"
                    style={{ color: "rgba(255, 0, 0, 0.5)" }}
                >
                    GLOBAL FEAR INDEX — TOP 5
                </h3>
                
                {/* Movies ranking */}
                <div className="mb-4">
                    <p 
                        className="text-[8px] tracking-[0.15em] mb-2"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        🎬 MOVIES
                    </p>
                    {MOVIES_DATA.slice(0, 5).sort((a, b) => b.avgBpmSpike - a.avgBpmSpike).map((movie, idx) => (
                        <div 
                            key={movie.id}
                            className="flex items-center gap-2 py-1"
                            style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.05)" }}
                        >
                            <span 
                                className="text-[10px] font-mono w-4"
                                style={{ color: idx === 0 ? "#FF0000" : "#FF0000" }}
                            >
                                {idx + 1}
                            </span>
                            <span 
                                className="text-[9px] flex-1"
                                style={{ color: "rgba(176, 176, 176, 0.7)" }}
                            >
                                {movie.title}
                            </span>
                            <span 
                                className="text-[9px] font-mono"
                                style={{ color: "#FF0000" }}
                            >
                                +{movie.avgBpmSpike}
                            </span>
                        </div>
                    ))}
                </div>
                
                {/* Games ranking */}
                <div>
                    <p 
                        className="text-[8px] tracking-[0.15em] mb-2"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        🎮 GAMES
                    </p>
                    {GAMES_DATA.slice(0, 5).sort((a, b) => b.peakBpm - a.peakBpm).map((game, idx) => (
                        <div 
                            key={game.id}
                            className="flex items-center gap-2 py-1"
                            style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.05)" }}
                        >
                            <span 
                                className="text-[10px] font-mono w-4"
                                style={{ color: idx === 0 ? "#FF0000" : "#FF0000" }}
                            >
                                {idx + 1}
                            </span>
                            <span 
                                className="text-[9px] flex-1"
                                style={{ color: "rgba(176, 176, 176, 0.7)" }}
                            >
                                {game.title}
                            </span>
                            <span 
                                className="text-[9px] font-mono"
                                style={{ color: "#FF0000" }}
                            >
                                {game.peakBpm}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Disclaimer */}
            <div 
                className="p-3"
                style={{ 
                    backgroundColor: "rgba(255, 0, 0, 0.03)",
                    border: "1px solid rgba(255, 0, 0, 0.1)",
                }}
            >
                <p 
                    className="text-[7px] tracking-[0.1em] text-center"
                    style={{ color: "rgba(255, 0, 0, 0.4)" }}
                >
                    COMMUNITY-BASED SIMULATED DATA FOR DEMO & TESTING PURPOSES
                </p>
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
                    FEAR LIBRARY
                </span>
                
                <div className="w-4" />
            </div>
            
            {/* Tabs */}
            <div 
                className="flex"
                style={{ borderBottom: "1px solid rgba(255, 0, 0, 0.1)" }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex-1 py-3 flex flex-col items-center gap-1 transition-colors duration-200"
                        style={{ 
                            color: activeTab === tab.id 
                                ? "#FF0000" 
                                : "rgba(255, 0, 0, 0.3)",
                            borderBottom: activeTab === tab.id 
                                ? "1px solid #FF0000" 
                                : "1px solid transparent",
                        }}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="text-[7px] tracking-[0.1em]">{tab.label}</span>
                    </button>
                ))}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "movies" && renderMovies()}
                {activeTab === "games" && renderGames()}
                {activeTab === "attractions" && renderAttractions()}
                {activeTab === "ranking" && renderRanking()}
            </div>
            
            {/* Footer disclaimer */}
            <div 
                className="py-3 px-4 text-center"
                style={{ borderTop: "1px solid rgba(255, 0, 0, 0.05)" }}
            >
                <p 
                    className="text-[7px] tracking-[0.15em]"
                    style={{ color: "rgba(255, 0, 0, 0.3)" }}
                >
                    ALL DATA SIMULATED — NOT MEDICAL DEVICE
                </p>
            </div>
        </div>
    );
};

export default FearLibrary;
