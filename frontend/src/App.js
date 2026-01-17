import { BrowserRouter, Routes, Route } from "react-router-dom";
import FearMeterApp from "@/components/FearMeterApp";
import DemoMode from "@/components/DemoMode";

function App() {
    return (
        <div className="App bg-fear-black min-h-screen">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<FearMeterApp />} />
                    <Route path="/demo" element={<DemoMode />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
