import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import FearMeterApp from "@/components/FearMeterApp";
import DemoMode from "@/components/DemoMode";
import NightmareProtocol from "@/components/NightmareProtocol";
import InvestorDemo from "@/components/InvestorDemo";
import FearLibrary from "@/components/FearLibrary";
import Disclaimer from "@/components/Disclaimer";

function App() {
    return (
        <SettingsProvider>
            <LanguageProvider>
                <div className="App bg-fear-black min-h-screen">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<FearMeterApp />} />
                            <Route path="/demo" element={<DemoMode />} />
                            <Route path="/nightmare" element={<NightmareProtocol />} />
                            <Route path="/investor" element={<InvestorDemo />} />
                            <Route path="/investor-demo" element={<InvestorDemo />} />
                            <Route path="/library" element={<FearLibrary />} />
                        </Routes>
                    </BrowserRouter>
                    <Disclaimer />
                </div>
            </LanguageProvider>
        </SettingsProvider>
    );
}

export default App;
