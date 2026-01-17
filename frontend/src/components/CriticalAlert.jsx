export const CriticalAlert = ({ text }) => {
    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-[9999]"
            style={{ backgroundColor: "rgba(139, 0, 0, 0.92)" }}
        >
            <div className="text-center px-8 micro-tremor">
                <div 
                    className="font-bold text-lg tracking-[0.2em] uppercase"
                    style={{ 
                        color: "#FFFFFF",
                        textShadow: "0 0 20px rgba(255, 0, 0, 0.6)"
                    }}
                >
                    {text}
                </div>
                <div className="mt-6 flex justify-center gap-3">
                    <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.7)" }}
                    />
                    <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.7)", animationDelay: "0.15s" }}
                    />
                    <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.7)", animationDelay: "0.3s" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CriticalAlert;
