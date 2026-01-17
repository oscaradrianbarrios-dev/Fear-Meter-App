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
}) => {
    return (
        <div className="flex-1 flex flex-col gap-6 py-4">
            {/* Oscilloscope Section */}
            <div className="flex-shrink-0">
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
            <div className="flex-1 flex items-center justify-center min-h-[140px]">
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
