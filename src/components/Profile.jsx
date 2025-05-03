import React from "react";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  return (
    <div className={styles.profilePage}>
      {/* Top Navigation Bar */}
      <div className={styles.topBar}>
       
        <div className={styles.center}>Профиль</div>
        
      </div>

      {/* User Profile Section */}
      <div className={styles.avatarBlock}>
        <div className={styles.avatarCircle}>G</div>
        <div className={styles.username}>Guest User</div>
        <div className={styles.email}>guest@example.com</div>
        <button className={styles.editProfileBtn}>
          ✏️ Редактировать профиль
        </button>
      </div>

      {/* Stats Section */}
      <div className={styles.statsCard}>
        <div className={styles.statsRow}>
          <div className={styles.statCol}>
            <div className={styles.statIcon}>💬</div>
            <div className={styles.statNum}>0</div>
            <div className={styles.statLabel}>     shared quotes </div>
          </div>
          <div className={styles.statCol}>
            <div className={styles.statIcon}>❤️</div>
            <div className={styles.statNum}>0</div>
            <div className={styles.statLabel}>Избранное</div>
          </div>
          <div className={styles.statCol}>
            <div className={styles.statIcon}>⏰</div>
            <div className={styles.statNum}>0</div>
            <div className={styles.statLabel}>Дней</div>
          </div>
        </div>
      </div>

      {/* Premium Section */}
      <div className={styles.premiumCard}>
        <div className={styles.premiumTitle}>Премиум-аккаунт</div>
        <div className={styles.premiumSubtitle}>
          Безлимитные цитаты, без рекламы и больше функций
        </div>
        <button className={styles.premiumBtn}>Перейти на Премиум</button>
      </div>

      {/* Daily Quote Limit Section */}
      <div className={styles.limitCard}>
        <div className={styles.limitTitle}>Лимит цитат в день</div>
        <div className={styles.limitBarBg}>
          <div className={styles.limitBar} style={{ width: "100%" }}></div>
        </div>
        <div className={styles.limitText}>10 из 10 цитат осталось сегодня</div>
      </div>

      {/* Log Out Button */}
      <div className={styles.logoutSection}>
        <button className={styles.logoutBtn2}>Выйти</button>
      </div>
    </div>
  );
};

export default Profile;
