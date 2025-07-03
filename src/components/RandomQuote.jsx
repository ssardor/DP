import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "../utils/i18n";
import styles from "../styles/RandomQuote.module.css";
import iconCopy from "../img/IconCopy.svg";
import iconSaved from "../img/heart.svg"; // Пустое сердце
import iconShare from "../img/IconShare.svg";
import iconLiked from "../img/heartLiked.png"; // Заполненное сердце
import { supabase } from "../supabaseClient"; // путь поправьте, если отличается
// Инициализация клиента Supabase
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  // framer-motion controls

  // Получить случайную цитату из массива
  const fetchRandomQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("quotes").select("*");
      if (error) throw error;
      if (data && data.length > 0) {
        const random = data[Math.floor(Math.random() * data.length)];
        setQuote({ content: random.quote_text, author: random.author }); // исправлено!
      } else {
        setError("Нет цитат в базе");
      }
    } catch (err) {
      setError("Ошибка загрузки цитаты");
    } finally {
      setLoading(false);
    }
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

  const handleLike = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      if (!isLiked) {
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          query: "Случайная цитата",
          response: `"${quote.content}" — ${quote.author}`,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
        setIsLiked(true);
      } else {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .match({
            user_id: user.id,
            response: `"${quote.content}" — ${quote.author}`,
          });

        if (error) throw error;
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Ошибка при работе с избранным:", error);
    }
  };

  // Сброс лайка при смене цитаты
  useEffect(() => {
    setIsLiked(false);
  }, [quote]);

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
              <button
                className={`${styles.actionButton} ${
                  isLiked ? styles.liked : ""
                }`}
                onClick={handleLike}
              >
                <img
                  src={isLiked ? iconLiked : iconSaved}
                  alt={isLiked ? "Убрать из избранного" : "В избранное"}
                />
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
            {loading ? t("generating") : t("randomQuote")}
          </span>
          <div className={styles.gradientBg}></div>
        </button>
      </div>
    </div>
  );
};

export default RandomQuote;
