import { Link } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";
import closeIcon from "../img/X.svg";
import lineChart from "../img/line-chart-up-01.svg";
import iconCitation from "../img/IconCitation.png";
import iconSaved from "../img/IconLiked.svg";
import searchIcon from "../img/IconSearch.svg";
const Sidebar = ({ onClose }) => {
  return (
    <div className={styles.sidebar}>
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

      <div className={styles.search_container}>
        <div className={styles.searchWrapper}>
          <img className={styles.searchIcon} src={searchIcon} alt="Поиск" />
          <input className={styles.search} type="text" placeholder="Поиск..." />
        </div>
      </div>
      <div className={styles.menu}>
        <p className={styles.section}>Дополнительные функции</p>
        <Link to="/top-quotes">
          <button>
            <div className={styles.buttonContent}>
              <img src={lineChart} alt="" />
              Топ 15 цитат
            </div>
          </button>
        </Link>
        <Link to="/random-quote">
          <button>
            <div className={styles.buttonContent}>
              <img src={iconCitation} alt="" />
              Случайная цитата
            </div>
          </button>
        </Link>
        <button>
          <div className={styles.buttonContent}>
            <img src={iconSaved} alt="" />
            Избранное
          </div>
        </button>
        <Link to="/settings">
          <button>
            <div className={styles.buttonContent}>
              {/* <img src={iconCitation} alt="" /> */}
              Настройки
            </div>
          </button>
        </Link>
        <Link to="/plans">
          <button>
            <div className={styles.buttonContent}>
              {/* <img src={iconCitation} alt="" /> */}
              Планы
            </div>
          </button>
        </Link>
        <p className={styles.section}>История чатов</p>
        <button>Новый чат</button>
       
        <button className={styles.active}>Мало зарабатываю</button>
      </div>
      <Link to="/profile">
        <div className={styles.profile}>
          <img
            src="https://i.imgur.com/rrggjXc_d.webp?maxwidth=520&shape=thumb&fidelity=high"
            alt="avatar"
            className={styles.avatar}
          />
          <div className={styles.nickname}>
            <p>Nikolayev Nikolay</p>
            <p className={styles.email}>nikola@gmail.com</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
