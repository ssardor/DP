import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import LoginEmail from "./LoginEmail"; // Импортируйте email-экран
import { t } from "../utils/i18n";
import email from "../img/sms.svg"; // Путь к иконке email
import google from "../img/Group.svg"; // Путь к иконке email

export default function Login() {
  const [showEmail, setShowEmail] = useState(false);

  if (showEmail) {
    return <LoginEmail onBack={() => setShowEmail(false)} />;
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.logoBlock}>
        <div className={styles.logoCircle}>
          {/* Градиентный круг с иконкой */}
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
            <defs>
              <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FF4D5D" />
              </radialGradient>
            </defs>
            <circle cx="27" cy="27" r="27" fill="url(#grad)" />
            {/* Можно добавить иконку в центр, если нужно */}
          </svg>
        </div>
        <span className={styles.logoText}>DEEPWISDOM</span>
      </div>
      <div className={styles.title}>{t("loginTitle")}</div>
      <div className={styles.subtitle}>{t("loginSubtitle")}</div>

      <button className={styles.loginBtn} onClick={() => setShowEmail(true)}>
        <img src={email} alt="Почта" className={styles.btnIcon} />
        {t("continueWithEmail")}
      </button>

      <div className={styles.divider}>
        <span>или</span>
      </div>

      <button className={styles.loginBtn}>
        <img src={google} alt="Google" className={styles.btnIcon} />
        {t("continueWithGoogle")}
      </button>

      <div className={styles.loginLink}>
        <span>{t("noAccount")}</span>
        <button type="button" className={styles.linkAccent} style={{ background: "none", border: "none", padding: 0, color: "inherit", cursor: "pointer" }}>
          {t("register")}
        </button>
        <span>{t("haveAccount")}</span>
        <button type="button" className={styles.linkAccent} style={{ background: "none", border: "none", padding: 0, color: "inherit", cursor: "pointer" }}>
          {t("login")}
        </button>
      </div>
    </div>
  );
}
