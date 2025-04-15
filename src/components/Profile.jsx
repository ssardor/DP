import React, { useState } from "react";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Nikolayev Nikolay",
    email: "nikola@gmail.com",
    likedQuotes: 42,
    daysUsing: 120,
    plan: "Premium",
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Здесь можно добавить логику сохранения данных на сервере
    console.log("Сохранено:", userData);
  };

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <h2>Личный аккаунт</h2>
        <button className={styles.logoutBtn}>Выйти</button>
      </div>

      <div className={styles.avatarSection}>
        <img
          src="https://i.imgur.com/rrggjXc_d.webp?maxwidth=520&shape=thumb&fidelity=high"
          alt="User Avatar"
          className={styles.avatar}
        />
        <button className={styles.editAvatarBtn}>Изменить фото</button>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          <label>Имя:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.name}</span>
          )}
        </div>

        <div className={styles.infoItem}>
          <label>Email:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.email}</span>
          )}
        </div>

        <div className={styles.infoItem}>
          <label>Лайкнутые цитаты:</label>
          <span>{userData.likedQuotes}</span>
        </div>

        <div className={styles.infoItem}>
          <label>Дней с нами:</label>
          <span>{userData.daysUsing}</span>
        </div>

        <div className={styles.infoItem}>
          <label>Текущий план:</label>
          <span>{userData.plan}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {isEditing ? (
          <button className={styles.saveBtn} onClick={handleSave}>
            Сохранить
          </button>
        ) : (
          <button className={styles.editBtn} onClick={handleEditToggle}>
            Редактировать
          </button>
        )}
      </div>

      <div className={styles.navigation}>
        <button>Избранное</button>
        <button>Месячные планы</button>
        <button>Настройки</button>
      </div>
    </div>
  );
};

export default Profile;