import { useState } from "react";

export const Disclaimer = () => {
    const [show, setShow] = useState(true);
    
    if (!show) return null;
    
    return (
        <div style={{ 
            position: "fixed", 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: "#000000", 
            zIndex: 999999, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "16px" 
        }}>
            <div style={{ 
                maxWidth: "400px", 
                textAlign: "center", 
                border: "2px solid #FF0000", 
                padding: "24px", 
                backgroundColor: "#000000",
                boxShadow: "0 0 50px rgba(255,0,0,0.3)"
            }}>
                <div style={{ 
                    width: "48px", height: "48px", 
                    margin: "0 auto 16px", 
                    border: "2px solid #FF0000", 
                    display: "flex", alignItems: "center", justifyContent: "center" 
                }}>
                    <span style={{ color: "#FF0000", fontSize: "24px", fontWeight: "bold" }}>!</span>
                </div>
                
                <h2 style={{ color: "#FF0000", fontSize: "16px", letterSpacing: "0.3em", marginBottom: "20px", fontWeight: "bold" }}>
                    IMPORTANT NOTICE
                </h2>
                
                <p style={{ color: "#FFFFFF", fontSize: "12px", marginBottom: "12px", lineHeight: "1.8" }}>
                    FEAR METER is an <span style={{ color: "#FF0000", fontWeight: "bold" }}>experimental entertainment application</span> that simulates biometric monitoring.
                </p>
                
                <p style={{ color: "#FFFFFF", fontSize: "12px", marginBottom: "20px", lineHeight: "1.8" }}>
                    This application is <span style={{ color: "#FF0000", fontWeight: "bold" }}>NOT a medical device</span>.
                </p>
                
                <div style={{ 
                    backgroundColor: "rgba(255,0,0,0.15)", 
                    border: "1px solid #FF0000", 
                    padding: "12px", 
                    marginBottom: "20px" 
                }}>
                    <p style={{ color: "#FF0000", fontSize: "9px", letterSpacing: "0.1em" }}>
                        BY CONTINUING, YOU ACKNOWLEDGE THAT ALL BIOMETRIC DATA IS SIMULATED
                    </p>
                </div>
                
                <button 
                    onClick={() => setShow(false)} 
                    style={{ 
                        backgroundColor: "#FF0000", 
                        color: "#FFFFFF", 
                        border: "none", 
                        padding: "14px 40px", 
                        fontSize: "12px", 
                        letterSpacing: "0.2em", 
                        cursor: "pointer",
                        fontWeight: "bold",
                        boxShadow: "0 0 20px rgba(255,0,0,0.5)"
                    }}
                >
                    I UNDERSTAND
                </button>
                
                <p style={{ color: "#888888", fontSize: "10px", marginTop: "20px", letterSpacing: "0.1em" }}>
                    © 2026 FEAR METER — ALL RIGHTS RESERVED
                </p>
            </div>
        </div>
    );
};

export default Disclaimer;
