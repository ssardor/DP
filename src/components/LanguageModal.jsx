import React, { useState } from "react";
import styles from "../styles/LanguageModal.module.css";

const LANGS = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uz", label: "O'zbek tili", flag: "🇺🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function LanguageModal({ current, onClose, onApply }) {
  const [selected, setSelected] = useState(current);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>Язык</span>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>
        <div className={styles.list}>
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.langBtn} ${selected === lang.code ? styles.active : ""}`}
              onClick={() => setSelected(lang.code)}
              type="button"
            >
              <span className={styles.flag}>{lang.flag}</span>
              <span className={styles.langLabel}>{lang.label}</span>
              <span className={styles.radio}>
                {selected === lang.code ? <span className={styles.radioActive} /> : null}
              </span>
            </button>
          ))}
        </div>
        <button
          className={styles.applyBtn}
          onClick={() => onApply(selected)}
        >
          Применить
        </button>
      </div>
    </div>
  );
}