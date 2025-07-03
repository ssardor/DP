import React, { useState } from "react";
import styles from "../styles/Register.module.css";
import Login from "./Login";
import { supabase } from "../supabaseClient";
import { t } from "../utils/i18n";
import emailIcon from "../img/sms.svg"; 
import lockIcon from "../img/lock.svg"; 
import eyeIcon from "../img/eye.svg"; 
import arrowleft from "../img/arrow-left.svg"; 
export default function Register({ onBack, onLogin }) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nickname || !email || !password || !password2) {
      alert("Пожалуйста, заполните все поля");
      return;
    }
    if (password !== password2) {
      alert("Пароли не совпадают");
      return;
    }
    // Только регистрация через Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    });
    // Всё! Профиль создастся автоматически через триггер
    if (error) {
      alert(error.message);
      return;
    }
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email: data.user.email,
      nickname,
      favorites_count: 0,
      active_days: 0,
      shares_count: 0,
      last_active_date: null,
    });
    alert("Проверьте почту для подтверждения регистрации!");
  };

  if (showEmail) {
    return <Login onBack={() => setShowEmail(false)} />;
  }
  return (
    <div className={styles.registerWrapper}>
      {/* Кнопка назад */}
      <button className={styles.backBtn} onClick={onBack}>
      <img src={arrowleft} alt="" />
      </button>

      <div className={styles.centerBlock}>
        <div className={styles.title}>{t("loginTitle")}</div>
        <div className={styles.subtitle}>{t("loginSubtitle")}</div>

        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}>👤</span>
            <input
              type="text"
              className={styles.input}
              placeholder="Никнейм"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><img src={emailIcon} alt="email" /></span>
            <input
              type="email"
              className={styles.input}
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><img src={lockIcon} alt="" /></span>
            <input
              type={showPassword ? "text" : "password"}
              className={styles.input}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ?<img src={eyeIcon} alt="eyeIcon" /> :<img src={eyeIcon} alt="eyeIcon" /> }
            </button>
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><img src={lockIcon} alt="lock" /></span>
            <input
              type={showPassword ? "text" : "password"}
              className={styles.input}
              placeholder="Подтвердите пароль"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className={styles.registerBtn}>
            Зарегистрироваться
          </button>
        </form>

        <div className={styles.bottomLinks}>
          <span className={styles.haveAccount}>{t("haveAccount")}</span>
          <span
            className={styles.loginLink}
            tabIndex={0}
            role="button"
            onClick={() => setShowEmail(true)}
          >
            {t("login")}
          </span>
        </div>
      </div>
    </div>
  );
}
