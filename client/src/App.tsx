import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './Sizes.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import Cpu from "./screens/Cpu";
import Local from "./screens/Local";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/cpu" element={<Cpu />} />
          <Route path="/local" element={<Local />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;