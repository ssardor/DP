import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/Chatbox";
import Profile from "./components/Profile";
import styles from "./styles/App.module.css";

function App() {
  return (
    <Router>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
