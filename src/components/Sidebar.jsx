import { Link } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
            <Link to="/" >
            <div className={styles.logo}><p>DEEPWISDOM</p></div>
            </Link>

      <input className={styles.search} type="text" placeholder="Поиск..." />

      <div className={styles.menu}>
        <p className={styles.section}>Дополнительные функции</p>
        <button>Топ 15 цитат</button>
        <button>Случайная цитата</button>
        <button>Избранное</button>

        <p className={styles.section}>История чатов</p>
        <button>Новый чат</button>
        <button>С плохим настроением</button>
        <button className={styles.active}>Мало зарабатываю</button>
      </div>
      <Link to="/profile" >
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
