export const CriticalAlert = ({ text }) => {
    return (
        <div className="critical-overlay animate-panic-flash">
            <div className="text-center px-8">
                <div className="critical-text">
                    {text}
                </div>
                <div className="mt-4 flex justify-center gap-2">
                    <div className="w-3 h-3 bg-fear-red rounded-full animate-pulse" />
                    <div className="w-3 h-3 bg-fear-red rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                    <div className="w-3 h-3 bg-fear-red rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                </div>
            </div>
        </div>
    );
};

export default CriticalAlert;
