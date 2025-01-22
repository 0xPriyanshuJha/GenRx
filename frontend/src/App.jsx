import { useState } from 'react'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Dashboard from './pages/Dashboard'
import { Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar'
import Scan from './pages/Scan'
import Prescription from './pages/Prescription'
import Chronic from './pages/Chronic'
// import Contact from './pages/Contact'


function App() {
  return (
    <>
      <Sidebar />
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/scans" element={<Scan />} />
        <Route path="/Prescription" element={<Prescription />} />
        <Route path="/Chronic" element={<Chronic />} />
        {/* <Route path="/Contact" element={<Contact />} /> */}
      </Routes>
    </>
  )
}

export default App
