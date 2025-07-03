import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import styles from "../styles/Sidebar.module.css";
import closeIcon from "../img/sidebar-left.svg";
import lineChart from "../img/new-line-chart-up-01.svg";
import iconCitation from "../img/dots-grid.svg";
import iconSaved from "../img/sidebar-heart.svg";
import searchIcon from "../img/IconSearch.svg";
import settingsIcon from "../img/settings-02.svg"; // Добавьте иконку настроек
import plansIcon from "../img/credit-card-01.svg"; // Добавьте иконку планов
import { t } from "../utils/i18n";
const truncateEmail = (email, maxLength = 20) => {
  if (!email) return "—";
  if (email.length <= maxLength) return email;

  const [username, domain] = email.split("@");
  if (!domain) return `${email.slice(0, maxLength)}...`;

  const truncatedUsername = username.slice(0, maxLength - (domain.length + 3));
  return `${truncatedUsername}...@${domain}`;
};

const Sidebar = ({
  onClose,
  onNewChat,
  chats = [], // значение по умолчанию!
  activeChatId,
  onSelectChat,
}) => {
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

  return (
    <div className={styles.sidebar}>
      {/* Шапка - статичная */}
      <div className={styles.header}>
        <Link to="/">
          <div className={styles.logo}>
            <p>DEEPWISDOM</p>
          </div>
        </Link>
        <button className={styles.closeSidebarBtn} onClick={onClose}>
          <img src={closeIcon} alt="Закрыть" />
        </button>
      </div>

      {/* Контент с прокруткой */}
      <div className={styles.scrollableContent}>
        <div className={styles.search_container}>
          <div className={styles.searchWrapper}>
            <img className={styles.searchIcon} src={searchIcon} alt="Поиск" />
            <input
              className={styles.search}
              type="text"
              placeholder="Поиск..."
            />
          </div>
        </div>
        <div className={styles.menu}>
          <p className={styles.section}>Дополнительные функции</p>
          <Link to="/top-quotes">
            <button>
              <div className={styles.buttonContent}>
                <img src={lineChart} alt="" />
                {t("topQuotes")}
              </div>
            </button>
          </Link>
          <Link to="/random-quote">
            <button>
              <div className={styles.buttonContent}>
                <img src={iconCitation} alt="" />
                {t("randomQuote")}
              </div>
            </button>
          </Link>
          <Link to="/favorites">
            <button>
              <div className={styles.buttonContent}>
                <img src={iconSaved} alt="" />
                {t("favorites")}
              </div>
            </button>
          </Link>
          <Link to="/settings">
            <button>
              <div className={styles.buttonContent}>
                <img src={settingsIcon} alt="" />
                {t("settings")}
              </div>
            </button>
          </Link>
          <Link to="/plans">
            <button>
              <div className={styles.buttonContent}>
                <img src={plansIcon} alt="" />
                {t("plans")}
              </div>
            </button>
          </Link>
          <p className={styles.section}>История чатов</p>
          <button onClick={onNewChat}>Новый чат</button>
          {chats?.map((chat) => (
            <button
              key={chat.id}
              className={activeChatId === chat.id ? styles.active : ""}
              onClick={() => onSelectChat(chat.id)}
            >
              {chat.title || "Новый чат"}
            </button>
          ))}
        </div>
      </div>

      {/* Профиль - статичный внизу */}
      <div className={styles.profileContainer}>
        <Link to="/profile">
          <div className={styles.profile}>
            <img
              src="https://i.imgur.com/rrggjXc_d.webp?maxwidth="
              alt="avatar"
              className={styles.avatar}
            />
            <div className={styles.nickname}>
              <p>{profile?.nickname || "Гость"}</p>
              <div className={styles.email}>
                <p title={profile?.email}>{truncateEmail(profile?.email)}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
