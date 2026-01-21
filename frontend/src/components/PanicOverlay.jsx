import { useEffect, useState, useRef } from "react";

// Panic sequence: freeze UI -> blackout -> red flash -> show message
export const PanicOverlay = ({ active, onSequenceComplete }) => {
    const [phase, setPhase] = useState("idle"); // idle, blackout, flash, message, recovery
    const [opacity, setOpacity] = useState(0);
    const sequenceRef = useRef(null);

    useEffect(() => {
        if (active && phase === "idle") {
            // Start panic sequence
            setPhase("blackout");
            setOpacity(1);

            // Vibration pattern - fail silently if not supported
            try {
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200, 100, 400]);
                }
            } catch (e) {
                // Silent fail
            }

            // Phase 1: Blackout (holds for ~400ms)
            sequenceRef.current = setTimeout(() => {
                setPhase("flash");
            }, 400);

        } else if (!active && phase !== "idle") {
            // Clean up on deactivation
            if (sequenceRef.current) {
                clearTimeout(sequenceRef.current);
            }
        }

        return () => {
            if (sequenceRef.current) {
                clearTimeout(sequenceRef.current);
            }
        };
    }, [active, phase]);

    // Handle phase transitions
    useEffect(() => {
        if (phase === "flash") {
            // Phase 2: Red flash (120ms)
            sequenceRef.current = setTimeout(() => {
                setPhase("message");
            }, 120);
        } else if (phase === "message") {
            // Phase 3: Message visible, then start recovery
            sequenceRef.current = setTimeout(() => {
                setPhase("recovery");
                setOpacity(0);
            }, 1000);
        } else if (phase === "recovery") {
            // Phase 4: Gradual UI return (300ms)
            sequenceRef.current = setTimeout(() => {
                setPhase("idle");
                onSequenceComplete?.();
            }, 300);
        }

        return () => {
            if (sequenceRef.current) {
                clearTimeout(sequenceRef.current);
            }
        };
    }, [phase, onSequenceComplete]);

    if (phase === "idle") return null;

    const getBackgroundColor = () => {
        switch (phase) {
            case "blackout":
                return "#000000";
            case "flash":
                return "#FF5555";
            case "message":
            case "recovery":
                return "transparent";
            default:
                return "transparent";
        }
    };

    const showOverlay = phase === "blackout" || phase === "flash";

    return (
        <>
            {/* Blackout/Flash overlay */}
            {showOverlay && (
                <div 
                    className="fixed inset-0 z-[9999]"
                    style={{
                        backgroundColor: getBackgroundColor(),
                        opacity,
                        transition: phase === "recovery" ? "opacity 300ms ease-out" : "none",
                        pointerEvents: "all", // Block input
                    }}
                />
            )}
        </>
    );
};

export default PanicOverlay;
