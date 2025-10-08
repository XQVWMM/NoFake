import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />       {/* Halaman utama */}
        <Route path="/login" element={<Login />} /> {/* Halaman login */}
      </Routes>
    </Router>
  );
}

export default App;
