import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/Chatbox";
import Profile from "./components/Profile";
import RandomQuote from "./components/RandomQuote";
import styles from "./styles/App.module.css";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <Router>
      <div className={styles.container}>
        {/* Боковая панель */}
        <div
          className={`${styles.sidebarWrapper} ${
            isSidebarVisible ? styles.sidebarOpen : ""
          }`}
        >
          <Sidebar onClose={toggleSidebar} />
        </div>

        {/* Кнопка для открытия боковой панели */}
        {!isSidebarVisible && (
          <button className={styles.toggleSidebarBtn} onClick={toggleSidebar}>
            Открыть
          </button>
        )}

        {/* Основное содержимое */}
        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/random-quote" element={<RandomQuote />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
