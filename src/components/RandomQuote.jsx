import { useState, } from "react";
import styles from "../styles/RandomQuote.module.css";
import iconCopy from "../img/IconCopy.svg";
import iconSaved from "../img/heart.svg";
import iconShare from "../img/IconShare.svg";

// Локальный массив цитат
const localQuotes = [
  { content: "Мудрость приходит с опытом.", author: "Народная мудрость" },
  {
    content: "Лучше сделать и пожалеть, чем не сделать и пожалеть.",
    author: "Неизвестный",
  },
  { content: "Счастье — это путь, а не пункт назначения.", author: "Будда" },
  { content: "Только тот, кто идет, осилит дорогу.", author: "Л.Н. Толстой" },
  { content: "Великие дела начинаются с малого.", author: "Сенека" },
  {
    content: "Не ошибается тот, кто ничего не делает.",
    author: "Теодор Рузвельт",
  },
  { content: "Будь собой, остальные роли уже заняты.", author: "Оскар Уайльд" },
  { content: "Время — лучший учитель.", author: "К. Гельвеций" },
  { content: "Сила в спокойствии.", author: "Лао-цзы" },
  {
    content:
      "Делай сегодня то, что другие не хотят, завтра будешь жить так, как другие не могут.",
    author: "Джерри Райс",
  },
];

const RandomQuote = () => {
  const [quote, setQuote] = useState(localQuotes[0]);
  const [loading, setLoading] = useState(false);
  const [showCopyPopover, setShowCopyPopover] = useState(false);
  const [error, setError] = useState(null);

  // framer-motion controls

  

  // Получить случайную цитату из массива
  const fetchRandomQuote = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * localQuotes.length);
      setQuote(localQuotes[randomIndex]);
      setLoading(false);
    }, 400); // имитация загрузки
  };

  const handleCopy = async () => {
    if (!quote) return;
    try {
      await navigator.clipboard.writeText(`${quote.content} - ${quote.author}`);
      setShowCopyPopover(true);
      setTimeout(() => setShowCopyPopover(false), 2000);
    } catch (err) {
      console.error("Ошибка при копировании:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        ) : quote ? (
          <div className={styles.quoteCard}>
            <p className={styles.quoteText}>"{quote.content}"</p>
            <p className={styles.author}>— {quote.author}</p>
            <div className={styles.actionButtons}>
              <div className={styles.buttonWrapper}>
                <button className={styles.actionButton} onClick={handleCopy}>
                  <img src={iconCopy} alt="Копировать" />
                </button>
                {showCopyPopover && (
                  <div className={styles.popover}>Скопировано!</div>
                )}
              </div>
              <button className={styles.actionButton}>
                <img src={iconSaved} alt="Нравится" />
              </button>
              <button className={styles.actionButton}>
                <img src={iconShare} alt="Поделиться" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.bottomButton}>
        <button
          className={`${styles.generateBtn} ${loading ? styles.loading : ""}`}
          onClick={fetchRandomQuote}
          disabled={loading}
          style={{ position: "relative" }}
        >
          <span className={styles.btnText}>
            {loading ? "Генерация..." : "Случайная цитата"}
          </span>
          <div className={styles.gradientBg}></div>
        </button>
      </div>
    </div>
  );
};

export default RandomQuote;
