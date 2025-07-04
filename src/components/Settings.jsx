import React, { useState } from "react";
import styles from "../styles/Settings.module.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LanguageModal from "./LanguageModal";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [push, setPush] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const handleLanguageClick = () => setShowLang((v) => !v);

  return (
    <div className={styles.settingsWrapper}>
      <motion.h1
        className={styles.settingsTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Settings
      </motion.h1>

      <div className={styles.settingsGroup}>
        <div className={styles.settingsGroupTitle}>APPEARANCE</div>
        <div className={styles.settingsRow}>
          <span>Dark Mode</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((v) => !v)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <div className={styles.settingsGroupTitle}>NOTIFICATIONS</div>
        <div className={styles.settingsRow}>
          <span>Push Notifications</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={push}
              onChange={() => setPush((v) => !v)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.settingsGroup}>
        <div className={styles.settingsGroupTitle}>ACCOUNT</div>
        <button className={styles.settingsRowBtn} onClick={handleLanguageClick}>
          Языки
        </button>
        <button className={styles.settingsRowBtn}>Privacy</button>

        <Link to="/plans">
          <button className={styles.upgradeBtn}>Upgrade to Premium</button>
        </Link>
      </div>

      <div className={styles.settingsGroup}>
        <div className={styles.settingsGroupTitle}>SUPPORT</div>
        <button className={styles.settingsRowBtn}>Help Center</button>
        <button className={styles.settingsRowBtn}>About</button>
      </div>

      {showLang && (
        <LanguageModal
          current={localStorage.getItem("dw_lang") || "ru"}
          onClose={() => setShowLang(false)}
          onApply={(lang) => {
            localStorage.setItem("dw_lang", lang);
            setShowLang(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};
export default Settings;
