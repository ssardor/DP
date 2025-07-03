import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LoginEmail.module.css";
import Register from "./Register";
import { supabase } from "../supabaseClient";
import { t } from "../utils/i18n";
import emailIcon from "../img/sms.svg"; 
import lockIcon from "../img/lock.svg"; 
import eyeIcon from "../img/eye.svg"; 
import arrowleft from "../img/arrow-left.svg"; 
export default function LoginEmail({ onBack }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Пожалуйста, заполните все поля");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      // Обновляем профиль пользователя
      if (user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          updated_at: new Date(),
        });

        if (profileError) throw profileError;
      }

      // Успешный вход
      navigate("/"); // Перенаправляем на главную
    } catch (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Неверный email или пароль"
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (showEmail) {
    return <Register onBack={() => setShowEmail(false)} />;
  }

  return (
    <div className={styles.loginEmailWrapper}>
      {/* Кнопка назад */}
      <button className={styles.backBtn} onClick={onBack}>
         <img src={arrowleft} alt="arrowleft" />
      </button>

      <div className={styles.centerBlock}>
        <div className={styles.title}>{t("loginTitle")}</div>
        <div className={styles.subtitle}>{t("loginSubtitle")}</div>
        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            {/* <img src={mailIcon} alt="" className={styles.inputIcon} /> */}
            <span className={styles.inputIcon}><img src={emailIcon} alt="email" /></span>
            <input
              type="email"
              value={email}
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            {/* <img src={lockIcon} alt="" className={styles.inputIcon} /> */}
            <span className={styles.inputIcon}><img src={lockIcon} alt="lock" /></span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <img src={eyeIcon} alt="eyeIcon" /> : <img src={eyeIcon} alt="eyeIcon" /> }
            </button>
          </div>
          <div className={styles.forgot}>
            <p className={styles.forgotLink}>Забыли пароль?</p>
          </div>
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <div className={styles.bottomLinks}>
          <span className={styles.noAccount}>У вас нет аккаунта?</span>
          <p className={styles.registerLink} onClick={() => setShowEmail(true)}>
            Зарегистрироваться
          </p>
        </div>
        {/* <button>{t("continueWithEmail")}</button>
        <button>{t("continueWithGoogle")}</button>
        <span>{t("noAccount")}</span>
        <span>{t("register")}</span>
        <span>{t("haveAccount")}</span>
        <span>{t("login")}</span> */}
      </div>
    </div>
  );
}
