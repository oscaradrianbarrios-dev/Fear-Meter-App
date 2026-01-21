import { useState, useEffect } from "react";

export const Disclaimer = () => {
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        // Solo mostrar si no se ha aceptado en esta sesión
        const accepted = sessionStorage.getItem("fear_disclaimer_accepted");
        if (!accepted) {
            setShow(true);
        }
    }, []);
    
    const handleAccept = () => {
        sessionStorage.setItem("fear_disclaimer_accepted", "true");
        setShow(false);
    };
    
    if (!show) return null;
    
    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#000000", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
            <div style={{ maxWidth: "400px", textAlign: "center", border: "1px solid #FF0000", padding: "24px", backgroundColor: "#000000" }}>
                <div style={{ width: "48px", height: "48px", margin: "0 auto 16px", border: "1px solid #FF0000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#FF0000", fontSize: "24px" }}>!</span>
                </div>
                <h2 style={{ color: "#FF0000", fontSize: "14px", letterSpacing: "0.3em", marginBottom: "16px" }}>IMPORTANT NOTICE</h2>
                <p style={{ color: "#CCCCCC", fontSize: "10px", marginBottom: "12px", lineHeight: "1.6" }}>
                    FEAR METER is an <span style={{ color: "#FF0000" }}>experimental entertainment application</span> that simulates biometric monitoring.
                </p>
                <p style={{ color: "#CCCCCC", fontSize: "10px", marginBottom: "16px", lineHeight: "1.6" }}>
                    This application is <span style={{ color: "#FF0000" }}>NOT a medical device</span>.
                </p>
                <div style={{ backgroundColor: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", padding: "12px", marginBottom: "16px" }}>
                    <p style={{ color: "#FF0000", fontSize: "8px", letterSpacing: "0.1em" }}>BY CONTINUING, YOU ACKNOWLEDGE THAT ALL BIOMETRIC DATA IS SIMULATED</p>
                </div>
                <button onClick={handleAccept} style={{ backgroundColor: "#FF0000", color: "#FFFFFF", border: "none", padding: "12px 32px", fontSize: "10px", letterSpacing: "0.2em", cursor: "pointer" }}>
                    I UNDERSTAND
                </button>
                <p style={{ color: "#666666", fontSize: "8px", marginTop: "16px" }}>© 2026 FEAR METER — ALL RIGHTS RESERVED</p>
            </div>
        </div>
    );
};

export default Disclaimer;
