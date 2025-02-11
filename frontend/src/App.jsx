import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Scan from "./pages/Scan";
import Prescription from "./pages/Prescription";
import Chronic from "./pages/Chronic";
import Hero from "./pages/Hero";

function App() {
  return (
    <div className="flex min-h-screen">
      <div className="fixed z-50">
        <Sidebar />
      </div>
      <div className="flex-1 ml-16">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/chronic" element={<Chronic />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;