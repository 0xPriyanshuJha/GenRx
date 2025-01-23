import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
// import Login from './pages/Login'
import Scan from "./pages/Scan";
import Prescription from "./pages/Prescription";
import Chronic from "./pages/Chronic";
// import Contact from './pages/Contact'

import Hero from "./pages/Hero";

function App() {
  return (
    <>
      <Sidebar />
        <Hero />
      <Routes>
        <Route path="/Scan" element={<Scan />} />
        <Route path="/Prescription" element={<Prescription />} />
        <Route path="/Chronic" element={<Chronic />} />
      </Routes>
    </>
  );
}

export default App;
