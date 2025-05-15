import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/Chatbox";
import Profile from "./components/Profile";
import RandomQuote from "./components/RandomQuote";
import styles from "./styles/App.module.css";
import TopQuotes15 from "./components/TopQuotes15";
import PremiumScreen from "./components/PremiumScreen";
import Settings from "./components/Settings";
function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Было false, теперь true

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
            <Route path="/top-quotes" element={<TopQuotes15 />} />
            <Route path="/settings" element={<Settings/>} />
            <Route path="/plans" element={<PremiumScreen/>} />
            <Route path="*" element={<ChatBox />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
