import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Profile.module.css";
import { supabase } from "../supabaseClient";
import edit from "../img/IconPen.svg"; // Путь к иконке редактирования
import heart from "../img/heartProfile.png"; // Путь к иконке сердца
import days from "../img/clock-rewind.png"; // Путь к иконке календаря
import shared from "../img/message-circle-01.png"; // Путь к иконке чатов
import crown from "../img/crown.png"; // Путь к иконке короны
import { t } from "../utils/i18n";
const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const favoritesCount = localStorage.getItem("favorites_count") || "0";

  const stats = [
    {
      icon: <img src={shared} alt="" style={{ width: 28, height: 28 }} />,
      number: profile?.shares_count ?? "0",
      label: t("chats"),
    },
    {
      icon: <img src={heart} alt="" style={{ width: 28, height: 28 }} />,
      number: favoritesCount,
      label: t("favorites"),
    },
    {
      icon: <img src={days} alt="" style={{ width: 28, height: 28 }} />,
      number: profile?.active_days ?? "0",
      label: t("days"),
    },
  ];

  return (
    <div className={styles.profileContainer}>
      <motion.header
        className={styles.header}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>{t("profile")}</h1>
      </motion.header>

      <div className={styles.content}>
        <div className={styles.avatarBlock}>
          <div className={styles.profile_avatar}>
            <img
              src="https://i.imgur.com/rrggjXc_d.webp?maxwidth="
              alt="profile"
            />
          </div>
          <h2 className={styles.username}>{profile?.nickname || "Гость"}</h2>
          <p className={styles.email}>{profile?.email || "—"}</p>
          <button className={styles.editProfileBtn}>
            <img src={edit} alt="" />
            Изменить профиль
          </button>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statsRow}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCol}>
                <span className={styles.statIcon}>{stat.icon}</span>
                <span className={styles.statNum}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.premiumCard}>
          <h3 className={styles.premiumTitle}>
            {" "}
            <img src={crown} alt="" /> {t("premium")}
          </h3>
          <p className={styles.premiumSubtitle}>
            Безлимитные квоты, новые добавки и фичи только в премиум тарифе
          </p>
          <button className={styles.premiumBtn}>{t("premium")}</button>
        </div>

        <div className={styles.limitCard}>
          <h3 className={styles.limitTitle}>{t("dailyLimit")}</h3>
          <div className={styles.limitBarBg}>
            <div className={styles.limitBar} style={{ width: "70%" }} />
          </div>
          <p className={styles.limitText}>
            10 из 14 цитат просмотрено на сегодня
          </p>
        </div>

        <div className={styles.logoutSection}>
          <button className={styles.logoutBtn2} onClick={handleLogout}>
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
