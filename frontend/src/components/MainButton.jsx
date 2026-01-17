export const MainButton = ({
    isActive,
    isPanic,
    onClick,
    texts,
    disabled,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-28 h-28 rounded-full
                font-bold text-[10px] tracking-[0.2em] uppercase
                transition-all duration-500
                flex items-center justify-center
                ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={{
                border: isActive 
                    ? isPanic 
                        ? "1px solid rgba(139, 0, 0, 0.8)" 
                        : "1px solid rgba(255, 0, 0, 0.5)"
                    : "1px solid rgba(176, 176, 176, 0.25)",
                backgroundColor: isActive 
                    ? isPanic 
                        ? "rgba(139, 0, 0, 0.15)" 
                        : "rgba(255, 0, 0, 0.05)"
                    : "transparent",
                color: isActive 
                    ? isPanic 
                        ? "rgba(255, 0, 0, 0.9)" 
                        : "rgba(255, 0, 0, 0.8)"
                    : "rgba(176, 176, 176, 0.6)",
                boxShadow: isActive 
                    ? isPanic 
                        ? "0 0 15px rgba(139, 0, 0, 0.3), inset 0 0 20px rgba(139, 0, 0, 0.1)"
                        : "0 0 10px rgba(255, 0, 0, 0.15)"
                    : "none"
            }}
            onMouseEnter={(e) => {
                if (!isActive && !disabled) {
                    e.currentTarget.style.borderColor = "rgba(255, 0, 0, 0.4)";
                    e.currentTarget.style.color = "rgba(255, 0, 0, 0.7)";
                    e.currentTarget.style.boxShadow = "0 0 8px rgba(255, 0, 0, 0.1)";
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive && !disabled) {
                    e.currentTarget.style.borderColor = "rgba(176, 176, 176, 0.25)";
                    e.currentTarget.style.color = "rgba(176, 176, 176, 0.6)";
                    e.currentTarget.style.boxShadow = "none";
                }
            }}
        >
            <span 
                className={`text-center leading-tight px-2 ${
                    isActive ? (isPanic ? "micro-tremor" : "") : ""
                }`}
                style={{
                    textShadow: isActive 
                        ? isPanic 
                            ? "0 0 8px rgba(255, 0, 0, 0.5)"
                            : "0 0 4px rgba(255, 0, 0, 0.3)"
                        : "none"
                }}
            >
                {isActive ? texts.stopSession : texts.startSession}
            </span>
        </button>
    );
};

export default MainButton;
