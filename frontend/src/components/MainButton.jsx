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
                w-32 h-32 rounded-full border-2 
                font-bold text-xs tracking-[0.15em] uppercase
                transition-all duration-300
                flex items-center justify-center
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${isActive 
                    ? isPanic 
                        ? "border-fear-red bg-fear-dark-red/30 text-fear-red animate-pulse-aggressive" 
                        : "border-fear-red bg-fear-red/10 text-fear-red animate-pulse-red hover:bg-fear-red/20"
                    : "border-fear-gray/50 bg-transparent text-fear-gray hover:border-fear-red hover:text-fear-red hover:glow-red"
                }
            `}
        >
            <span className={`text-center leading-tight px-2 ${isPanic ? "text-glow-red-intense" : isActive ? "text-glow-red" : ""}`}>
                {isActive ? texts.stopSession : texts.startSession}
            </span>
        </button>
    );
};

export default MainButton;
