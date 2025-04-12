
import styles from '../styles/Sidebar.module.css';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>DEEPWISDOM</div>

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

      <div className={styles.profile}>
        <img src="https://via.placeholder.com/32" alt="avatar" />
        <div>
          <p>Nikolayev Nikolay</p>
          <p className={styles.email}>nikola@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
