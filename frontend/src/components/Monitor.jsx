import Oscilloscope from "./Oscilloscope";
import DataGrid from "./DataGrid";
import MainButton from "./MainButton";

export const Monitor = ({
    bpm,
    stress,
    signal,
    isActive,
    isPanic,
    isRecovering,
    onStartStop,
    texts,
    isBlocked,
    isDemo = false,
    isCalibrated = false,
    responseType,
}) => {
    // Determine if high BPM for red flicker effect
    const isHighBpm = bpm > 95;
    const isCriticalBpm = bpm > 110;
    
    return (
        <div 
            className={`flex-1 flex flex-col py-4 relative ${isHighBpm ? 'fear-red-flicker' : ''}`}
            style={{ 
                gap: '23px', // Asymmetric gap
                marginLeft: '3px', // Subtle asymmetry
            }}
        >
            {/* Subtle watching indicator */}
            {isActive && (
                <div 
                    className="absolute top-2 right-3 fear-observer-dot"
                    title="Recording..."
                />
            )}
            
            {/* Oscilloscope Section */}
            <div className={`flex-shrink-0 ${isCriticalBpm ? 'fear-micro-shake' : ''}`}>
                <Oscilloscope
                    bpm={bpm}
                    isActive={isActive}
                    isPanic={isPanic}
                    isRecovering={isRecovering}
                />
            </div>

            {/* Data Grid */}
            <DataGrid
                bpm={bpm}
                stress={stress}
                signal={signal}
                isActive={isActive}
                isPanic={isPanic}
                texts={texts}
            />

            {/* Main Button */}
            <div 
                className="flex-1 flex items-center justify-center min-h-[140px]"
                style={{ marginRight: '2px' }} // Subtle asymmetry
            >
                <MainButton
                    isActive={isActive}
                    isPanic={isPanic}
                    isRecovering={isRecovering}
                    onClick={onStartStop}
                    texts={texts}
                    disabled={isBlocked}
                />
            </div>
        </div>
    );
};

export default Monitor;
