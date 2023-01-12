import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./Sizes.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import Cpu from "./screens/Cpu";
import Local from "./screens/Local";
import useLocalStorage from "./shared/hooks/useLocalStorage";
import { SocketProvider } from "./shared/contexts/SocketProvider";
import Online from "./screens/Online";

function genRandomId() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}

function App() {
    const [id, setId] = useLocalStorage("player-id", "");

    if (!id) {
        setId(genRandomId());
    }

    return (
        <SocketProvider id={id}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/cpu" element={<Cpu />} />
                    <Route path="/online" element={<Online />} />
                    <Route path="/local" element={<Local />} />
                </Routes>
            </Router>
        </SocketProvider>
    );
}

export default App;
