import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Share2, Download, Twitter, Instagram, Copy, Check } from "lucide-react";

// Card templates
const CARD_TEMPLATES = [
    {
        id: "survivor",
        title: "SURVIVAL CARD",
        description: "Show you survived a horror experience",
        bgColor: "#0a0a0a",
    },
    {
        id: "extreme",
        title: "EXTREME FEAR",
        description: "For peak BPM over 130",
        bgColor: "#1a0000",
    },
    {
        id: "fearless",
        title: "FEARLESS",
        description: "Low fear response bragging rights",
        bgColor: "#000a0a",
    },
];

// Sample movies for selection
const MOVIES = [
    "Hereditary", "The Conjuring", "Sinister", "Insidious", 
    "It Follows", "A Quiet Place", "The Ring", "The Exorcist",
];

export const FearSharing = () => {
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const [selectedTemplate, setSelectedTemplate] = useState("survivor");
    const [selectedMovie, setSelectedMovie] = useState("Hereditary");
    const [peakBpm, setPeakBpm] = useState(128);
    const [fearScore, setFearScore] = useState(75);
    const [copied, setCopied] = useState(false);

    // Generate shareable link
    const shareLink = `https://fearmeter.app/share?m=${encodeURIComponent(selectedMovie)}&b=${peakBpm}&s=${fearScore}`;

    // Copy link to clipboard
    const copyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.warn("Failed to copy:", e);
        }
    }, [shareLink]);

    // Get card style based on template
    const getCardStyle = () => {
        const template = CARD_TEMPLATES.find(t => t.id === selectedTemplate);
        return {
            backgroundColor: template?.bgColor || "#0a0a0a",
        };
    };

    // Render the shareable card
    const renderCard = () => (
        <div 
            ref={cardRef}
            className="w-72 mx-auto p-6 relative overflow-hidden"
            style={{ 
                ...getCardStyle(),
                border: "1px solid rgba(142, 14, 28, 0.3)",
            }}
        >
            {/* Background pattern */}
            <div 
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(142, 14, 28, 0.5) 10px,
                        rgba(142, 14, 28, 0.5) 11px
                    )`,
                }}
            />
            
            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <p 
                        className="text-[8px] tracking-[0.3em] mb-1"
                        style={{ color: "rgba(142, 14, 28, 0.5)" }}
                    >
                        FEAR METER CERTIFIED
                    </p>
                    <h2 
                        className="text-lg tracking-[0.2em]"
                        style={{ color: "#B11226" }}
                    >
                        {selectedTemplate === "survivor" && "SURVIVOR"}
                        {selectedTemplate === "extreme" && "EXTREME FEAR"}
                        {selectedTemplate === "fearless" && "FEARLESS"}
                    </h2>
                </div>
                
                {/* Movie */}
                <div className="text-center mb-6">
                    <p 
                        className="text-[8px] tracking-[0.15em] mb-1"
                        style={{ color: "rgba(176, 176, 176, 0.4)" }}
                    >
                        I WATCHED
                    </p>
                    <p 
                        className="text-xl tracking-[0.1em]"
                        style={{ color: "rgba(176, 176, 176, 0.9)" }}
                    >
                        {selectedMovie}
                    </p>
                </div>
                
                {/* Stats */}
                <div className="flex justify-around mb-6">
                    <div className="text-center">
                        <p 
                            className="text-[7px] tracking-[0.1em] mb-1"
                            style={{ color: "rgba(142, 14, 28, 0.4)" }}
                        >
                            PEAK BPM
                        </p>
                        <p 
                            className="text-3xl font-mono font-bold"
                            style={{ 
                                color: peakBpm > 130 ? "#FF0000" : "#B11226",
                                textShadow: peakBpm > 130 ? "0 0 10px rgba(255, 0, 0, 0.3)" : "none",
                            }}
                        >
                            {peakBpm}
                        </p>
                    </div>
                    <div className="text-center">
                        <p 
                            className="text-[7px] tracking-[0.1em] mb-1"
                            style={{ color: "rgba(142, 14, 28, 0.4)" }}
                        >
                            FEAR SCORE
                        </p>
                        <p 
                            className="text-3xl font-mono font-bold"
                            style={{ color: "#8E0E1C" }}
                        >
                            {fearScore}
                        </p>
                    </div>
                </div>
                
                {/* Fear bar */}
                <div className="mb-4">
                    <div 
                        className="h-2 w-full"
                        style={{ backgroundColor: "rgba(142, 14, 28, 0.1)" }}
                    >
                        <div 
                            className="h-full"
                            style={{ 
                                width: `${fearScore}%`,
                                backgroundColor: fearScore > 80 
                                    ? "#FF0000" 
                                    : fearScore > 50 
                                        ? "#B11226" 
                                        : "#8E0E1C",
                            }}
                        />
                    </div>
                </div>
                
                {/* QR placeholder */}
                <div className="flex justify-center mb-4">
                    <div 
                        className="w-16 h-16 flex items-center justify-center"
                        style={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            padding: "4px",
                        }}
                    >
                        <div 
                            className="w-full h-full grid grid-cols-5 gap-0.5"
                            style={{ backgroundColor: "white" }}
                        >
                            {/* Simplified QR pattern */}
                            {Array(25).fill(0).map((_, i) => (
                                <div 
                                    key={i}
                                    style={{ 
                                        backgroundColor: Math.random() > 0.5 ? "#000" : "#fff",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="text-center">
                    <p 
                        className="text-[7px] tracking-[0.15em]"
                        style={{ color: "rgba(142, 14, 28, 0.4)" }}
                    >
                        SCAN TO TRY FEAR METER
                    </p>
                    <p 
                        className="text-[6px] tracking-[0.1em] mt-1"
                        style={{ color: "rgba(176, 176, 176, 0.3)" }}
                    >
                        fearmeter.app
                    </p>
                </div>
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
                    SHARE YOUR FEAR
                </span>
                
                <Share2 className="w-4 h-4" style={{ color: "rgba(142, 14, 28, 0.3)" }} />
            </div>
            
            {/* Card Preview */}
            <div className="py-6">
                {renderCard()}
            </div>
            
            {/* Customization */}
            <div className="flex-1 overflow-y-auto px-4">
                {/* Template selection */}
                <div className="mb-6">
                    <p 
                        className="text-[9px] tracking-[0.15em] mb-3"
                        style={{ color: "rgba(142, 14, 28, 0.5)" }}
                    >
                        CARD TEMPLATE
                    </p>
                    <div className="flex gap-2">
                        {CARD_TEMPLATES.map(template => (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                className="flex-1 py-2 px-3 text-[8px] tracking-[0.1em]"
                                style={{ 
                                    backgroundColor: selectedTemplate === template.id 
                                        ? "rgba(142, 14, 28, 0.15)" 
                                        : "rgba(142, 14, 28, 0.03)",
                                    border: `1px solid ${selectedTemplate === template.id 
                                        ? "rgba(142, 14, 28, 0.4)" 
                                        : "rgba(142, 14, 28, 0.1)"}`,
                                    color: selectedTemplate === template.id 
                                        ? "#B11226" 
                                        : "rgba(142, 14, 28, 0.5)",
                                }}
                            >
                                {template.title}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Movie selection */}
                <div className="mb-6">
                    <p 
                        className="text-[9px] tracking-[0.15em] mb-3"
                        style={{ color: "rgba(142, 14, 28, 0.5)" }}
                    >
                        MOVIE
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {MOVIES.map(movie => (
                            <button
                                key={movie}
                                onClick={() => setSelectedMovie(movie)}
                                className="py-1.5 px-3 text-[8px] tracking-[0.05em]"
                                style={{ 
                                    backgroundColor: selectedMovie === movie 
                                        ? "rgba(142, 14, 28, 0.15)" 
                                        : "transparent",
                                    border: `1px solid ${selectedMovie === movie 
                                        ? "rgba(142, 14, 28, 0.4)" 
                                        : "rgba(142, 14, 28, 0.1)"}`,
                                    color: selectedMovie === movie 
                                        ? "#B11226" 
                                        : "rgba(176, 176, 176, 0.5)",
                                }}
                            >
                                {movie}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* BPM slider */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <p 
                            className="text-[9px] tracking-[0.15em]"
                            style={{ color: "rgba(142, 14, 28, 0.5)" }}
                        >
                            PEAK BPM
                        </p>
                        <p 
                            className="text-[10px] font-mono"
                            style={{ color: "#8E0E1C" }}
                        >
                            {peakBpm}
                        </p>
                    </div>
                    <input
                        type="range"
                        min="70"
                        max="160"
                        value={peakBpm}
                        onChange={(e) => setPeakBpm(parseInt(e.target.value))}
                        className="w-full h-1 appearance-none cursor-pointer"
                        style={{ 
                            backgroundColor: "rgba(142, 14, 28, 0.2)",
                            accentColor: "#8E0E1C",
                        }}
                    />
                </div>
                
                {/* Fear score slider */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <p 
                            className="text-[9px] tracking-[0.15em]"
                            style={{ color: "rgba(142, 14, 28, 0.5)" }}
                        >
                            FEAR SCORE
                        </p>
                        <p 
                            className="text-[10px] font-mono"
                            style={{ color: "#8E0E1C" }}
                        >
                            {fearScore}
                        </p>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={fearScore}
                        onChange={(e) => setFearScore(parseInt(e.target.value))}
                        className="w-full h-1 appearance-none cursor-pointer"
                        style={{ 
                            backgroundColor: "rgba(142, 14, 28, 0.2)",
                            accentColor: "#8E0E1C",
                        }}
                    />
                </div>
            </div>
            
            {/* Share buttons */}
            <div 
                className="p-4"
                style={{ borderTop: "1px solid rgba(142, 14, 28, 0.1)" }}
            >
                {/* Copy link */}
                <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-3 mb-3 text-[10px] tracking-[0.15em]"
                    style={{ 
                        backgroundColor: "rgba(142, 14, 28, 0.1)",
                        border: "1px solid rgba(142, 14, 28, 0.3)",
                        color: "#8E0E1C",
                    }}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            LINK COPIED!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            COPY SHARE LINK
                        </>
                    )}
                </button>
                
                {/* Social buttons */}
                <div className="flex gap-3">
                    <button
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[9px] tracking-[0.1em]"
                        style={{ 
                            backgroundColor: "rgba(29, 161, 242, 0.1)",
                            border: "1px solid rgba(29, 161, 242, 0.3)",
                            color: "#1DA1F2",
                        }}
                    >
                        <Twitter className="w-4 h-4" />
                        TWITTER
                    </button>
                    <button
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[9px] tracking-[0.1em]"
                        style={{ 
                            backgroundColor: "rgba(225, 48, 108, 0.1)",
                            border: "1px solid rgba(225, 48, 108, 0.3)",
                            color: "#E1306C",
                        }}
                    >
                        <Instagram className="w-4 h-4" />
                        INSTAGRAM
                    </button>
                    <button
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[9px] tracking-[0.1em]"
                        style={{ 
                            backgroundColor: "rgba(142, 14, 28, 0.05)",
                            border: "1px solid rgba(142, 14, 28, 0.2)",
                            color: "#8E0E1C",
                        }}
                    >
                        <Download className="w-4 h-4" />
                        SAVE
                    </button>
                </div>
            </div>
            
            {/* Footer */}
            <div 
                className="py-2 px-4 text-center"
                style={{ borderTop: "1px solid rgba(142, 14, 28, 0.05)" }}
            >
                <p 
                    className="text-[7px] tracking-[0.1em]"
                    style={{ color: "rgba(142, 14, 28, 0.25)" }}
                >
                    SHARE YOUR FEAR EXPERIENCE WITH THE WORLD
                </p>
            </div>
        </div>
    );
};

export default FearSharing;
