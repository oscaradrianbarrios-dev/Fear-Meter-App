import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Share2, Download, Instagram, Copy, Check } from "lucide-react";

// Custom X (Twitter) icon
const XIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

// Facebook icon
const FacebookIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

// TikTok icon
const TikTokIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
);

// Twitch icon
const TwitchIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
);

const CARD_TEMPLATES = [
    { id: "survivor", title: "SURVIVAL CARD", bgColor: "#0a0a0a" },
    { id: "extreme", title: "EXTREME FEAR", bgColor: "#1a0000" },
    { id: "fearless", title: "FEARLESS", bgColor: "#000a0a" },
];

const MOVIES = ["Hereditary", "The Conjuring", "Sinister", "Insidious", "It Follows", "A Quiet Place", "The Ring", "The Exorcist"];

export const FearSharing = () => {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState("survivor");
    const [selectedMovie, setSelectedMovie] = useState("Hereditary");
    const [peakBpm, setPeakBpm] = useState(128);
    const [fearScore, setFearScore] = useState(75);
    const [copied, setCopied] = useState(false);

    const shareLink = `https://fearmeter.app/share?m=${encodeURIComponent(selectedMovie)}&b=${peakBpm}&s=${fearScore}`;

    const copyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {}
    }, [shareLink]);

    const shareToSocial = (platform) => {
        const text = `I survived ${selectedMovie} with a peak BPM of ${peakBpm} and fear score of ${fearScore}! #FearMeter`;
        const urls = {
            x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(text)}`,
            tiktok: `https://www.tiktok.com/`,
            twitch: `https://www.twitch.tv/`,
        };
        window.open(urls[platform], '_blank');
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#000000" }}>
            {/* Header */}
            <div className="py-3 px-4 flex items-center justify-between" style={{ borderBottom: "1px solid #FF0000" }}>
                <button onClick={() => navigate("/")} style={{ color: "#FF0000" }}><ChevronLeft size={24} /></button>
                <span style={{ color: "#FF0000", fontSize: "12px", letterSpacing: "0.2em" }}>SHARE YOUR FEAR</span>
                <Share2 size={20} style={{ color: "#FF0000" }} />
            </div>
            
            {/* Card Preview */}
            <div className="py-6 px-4">
                <div className="w-72 mx-auto p-6" style={{ backgroundColor: CARD_TEMPLATES.find(t => t.id === selectedTemplate)?.bgColor, border: "2px solid #FF0000" }}>
                    <div className="text-center mb-4">
                        <p style={{ color: "#FF0000", fontSize: "8px", letterSpacing: "0.3em" }}>FEAR METER CERTIFIED</p>
                        <h2 style={{ color: "#FF0000", fontSize: "18px", letterSpacing: "0.2em", marginTop: "8px" }}>
                            {selectedTemplate === "survivor" ? "SURVIVOR" : selectedTemplate === "extreme" ? "EXTREME FEAR" : "FEARLESS"}
                        </h2>
                    </div>
                    <div className="text-center mb-4">
                        <p style={{ color: "#888", fontSize: "8px" }}>I WATCHED</p>
                        <p style={{ color: "#FFF", fontSize: "20px", marginTop: "4px" }}>{selectedMovie}</p>
                    </div>
                    <div className="flex justify-around mb-4">
                        <div className="text-center">
                            <p style={{ color: "#FF0000", fontSize: "8px" }}>PEAK BPM</p>
                            <p style={{ color: "#FF0000", fontSize: "28px", fontWeight: "bold" }}>{peakBpm}</p>
                        </div>
                        <div className="text-center">
                            <p style={{ color: "#FF0000", fontSize: "8px" }}>FEAR SCORE</p>
                            <p style={{ color: "#FF0000", fontSize: "28px", fontWeight: "bold" }}>{fearScore}</p>
                        </div>
                    </div>
                    <div style={{ height: "8px", backgroundColor: "rgba(255,0,0,0.2)", marginBottom: "16px" }}>
                        <div style={{ height: "100%", width: `${fearScore}%`, backgroundColor: "#FF0000" }} />
                    </div>
                    <p style={{ color: "#666", fontSize: "8px", textAlign: "center" }}>© 2026 FEAR METER</p>
                </div>
            </div>
            
            {/* Customization */}
            <div className="flex-1 overflow-y-auto px-4">
                {/* Templates */}
                <div className="mb-4">
                    <p style={{ color: "#FF0000", fontSize: "10px", marginBottom: "8px" }}>CARD TEMPLATE</p>
                    <div className="flex gap-2">
                        {CARD_TEMPLATES.map(t => (
                            <button key={t.id} onClick={() => setSelectedTemplate(t.id)} style={{ flex: 1, padding: "10px", backgroundColor: selectedTemplate === t.id ? "rgba(255,0,0,0.2)" : "transparent", border: `1px solid ${selectedTemplate === t.id ? "#FF0000" : "#333"}`, color: "#FF0000", fontSize: "9px" }}>
                                {t.title}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Movies */}
                <div className="mb-4">
                    <p style={{ color: "#FF0000", fontSize: "10px", marginBottom: "8px" }}>MOVIE</p>
                    <div className="flex flex-wrap gap-2">
                        {MOVIES.map(m => (
                            <button key={m} onClick={() => setSelectedMovie(m)} style={{ padding: "8px 12px", backgroundColor: selectedMovie === m ? "rgba(255,0,0,0.2)" : "transparent", border: `1px solid ${selectedMovie === m ? "#FF0000" : "#333"}`, color: selectedMovie === m ? "#FF0000" : "#888", fontSize: "9px" }}>
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Sliders */}
                <div className="mb-4">
                    <div className="flex justify-between"><span style={{ color: "#FF0000", fontSize: "10px" }}>PEAK BPM</span><span style={{ color: "#FF0000" }}>{peakBpm}</span></div>
                    <input type="range" min="70" max="160" value={peakBpm} onChange={(e) => setPeakBpm(parseInt(e.target.value))} className="w-full" style={{ accentColor: "#FF0000" }} />
                </div>
                <div className="mb-4">
                    <div className="flex justify-between"><span style={{ color: "#FF0000", fontSize: "10px" }}>FEAR SCORE</span><span style={{ color: "#FF0000" }}>{fearScore}</span></div>
                    <input type="range" min="0" max="100" value={fearScore} onChange={(e) => setFearScore(parseInt(e.target.value))} className="w-full" style={{ accentColor: "#FF0000" }} />
                </div>
            </div>
            
            {/* Share Buttons */}
            <div className="p-4" style={{ borderTop: "1px solid #FF0000" }}>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 mb-3" style={{ backgroundColor: "rgba(255,0,0,0.1)", border: "1px solid #FF0000", color: "#FF0000", fontSize: "11px" }}>
                    {copied ? <><Check size={16} /> LINK COPIED!</> : <><Copy size={16} /> COPY SHARE LINK</>}
                </button>
                
                {/* Social Row 1 */}
                <div className="flex gap-2 mb-2">
                    <button onClick={() => shareToSocial('x')} className="flex-1 flex items-center justify-center gap-2 py-3" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid #FFF", color: "#FFF", fontSize: "10px" }}>
                        <XIcon size={16} /> X
                    </button>
                    <button onClick={() => shareToSocial('facebook')} className="flex-1 flex items-center justify-center gap-2 py-3" style={{ backgroundColor: "rgba(24,119,242,0.1)", border: "1px solid #1877F2", color: "#1877F2", fontSize: "10px" }}>
                        <FacebookIcon size={16} /> FACEBOOK
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3" style={{ backgroundColor: "rgba(225,48,108,0.1)", border: "1px solid #E1306C", color: "#E1306C", fontSize: "10px" }}>
                        <Instagram size={16} /> INSTAGRAM
                    </button>
                </div>
                
                {/* Social Row 2 */}
                <div className="flex gap-2">
                    <button onClick={() => shareToSocial('tiktok')} className="flex-1 flex items-center justify-center gap-2 py-3" style={{ backgroundColor: "rgba(255,0,80,0.1)", border: "1px solid #FF0050", color: "#FF0050", fontSize: "10px" }}>
                        <TikTokIcon size={16} /> TIKTOK
                    </button>
                    <button onClick={() => shareToSocial('twitch')} className="flex-1 flex items-center justify-center gap-2 py-3" style={{ backgroundColor: "rgba(145,70,255,0.1)", border: "1px solid #9146FF", color: "#9146FF", fontSize: "10px" }}>
                        <TwitchIcon size={16} /> TWITCH
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3" style={{ backgroundColor: "rgba(255,0,0,0.1)", border: "1px solid #FF0000", color: "#FF0000", fontSize: "10px" }}>
                        <Download size={16} /> SAVE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FearSharing;
