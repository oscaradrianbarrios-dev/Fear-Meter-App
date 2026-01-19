import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import FearMeterApp from "@/components/FearMeterApp";
import DemoMode from "@/components/DemoMode";
import NightmareProtocol from "@/components/NightmareProtocol";
import InvestorDemo from "@/components/InvestorDemo";

function App() {
    return (
        <LanguageProvider>
            <div className="App bg-fear-black min-h-screen">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<FearMeterApp />} />
                        <Route path="/demo" element={<DemoMode />} />
                        <Route path="/nightmare" element={<NightmareProtocol />} />
                        <Route path="/investor" element={<InvestorDemo />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </LanguageProvider>
    );
}

export default App;
