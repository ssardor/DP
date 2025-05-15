import React, { useState, useEffect } from "react";
import styles from "../styles/TopQuotes.module.css";
import iconCopy from "../img/IconCopy.svg";
import iconShare from "../img/IconShare.svg";
const initialQuotes = [
  {
    text: "Будь собой, остальные роли уже заняты.",
    author: "Оскар Уайльд",
    likes: 1400,
    shares: 230,
    liked: false,
  },
  {
    text: "Иногда молчание — самый громкий крик.",
    author: "Неизвестный автор",
    likes: 2300,
    shares: 500,
    liked: false,
  },
  {
    text: "Счастье — это путь, а не пункт назначения.",
    author: "Будда",
    likes: 1800,
    shares: 320,
    liked: false,
  },
  {
    text: "Тот, кто хочет — ищет возможности, кто не хочет — ищет причины.",
    author: "Сократ",
    likes: 2100,
    shares: 410,
    liked: false,
  },
  {
    text: "Мечтай так, будто будешь жить вечно. Живи так, будто умрёшь сегодня.",
    author: "Джеймс Дин",
    likes: 1950,
    shares: 380,
    liked: false,
  },
  {
    text: "Не ошибается тот, кто ничего не делает.",
    author: "Теодор Рузвельт",
    likes: 1700,
    shares: 290,
    liked: false,
  },
  {
    text: "Сделай сегодня то, что другие не хотят, завтра будешь жить так, как другие не могут.",
    author: "Джерри Райс",
    likes: 1600,
    shares: 270,
    liked: false,
  },
  {
    text: "Великие дела начинаются с малого.",
    author: "Лао-цзы",
    likes: 1500,
    shares: 250,
    liked: false,
  },
  {
    text: "Лучше зажечь одну свечу, чем проклинать темноту.",
    author: "Конфуций",
    likes: 1750,
    shares: 310,
    liked: false,
  },
  {
    text: "Сила не в том, чтобы никогда не падать, а в том, чтобы подниматься каждый раз, когда падаешь.",
    author: "Нельсон Мандела",
    likes: 2200,
    shares: 430,
    liked: false,
  },
  {
    text: "Только тот, кто предпринимает абсурдные попытки, сможет достичь невозможного.",
    author: "Альберт Эйнштейн",
    likes: 2000,
    shares: 390,
    liked: false,
  },
  {
    text: "Не позволяй вчерашнему дню занять слишком много места в сегодняшнем.",
    author: "Уилл Роджерс",
    likes: 1550,
    shares: 260,
    liked: false,
  },
  {
    text: "Верь в себя, и у тебя всё получится.",
    author: "Неизвестный автор",
    likes: 1450,
    shares: 240,
    liked: false,
  },
  {
    text: "Трудности делают нас сильнее.",
    author: "Фридрих Ницше",
    likes: 1650,
    shares: 280,
    liked: false,
  },
  {
    text: "Самое большое приключение, которое вы можете совершить, — это жить жизнью своей мечты.",
    author: "Опра Уинфри",
    likes: 1850,
    shares: 330,
    liked: false,
  },
];

const TopQuotes15 = () => {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [showToTop, setShowToTop] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      setShowToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLike = (idx) => {
    setQuotes((prev) =>
      prev.map((q, i) =>
        i === idx
          ? {
              ...q,
              liked: !q.liked,
              likes: q.liked ? q.likes - 1 : q.likes + 1,
            }
          : q
      )
    );
  };

  const handleCopy = (text, author, idx) => {
    navigator.clipboard.writeText(`"${text}" — ${author}`);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1600);
  };

  const handleShare = (text, author) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Цитата",
          text: `"${text}" — ${author}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      alert("Функция шэринга не поддерживается на этом устройстве.");
    }
  };

  return (
    <div className={styles.topQuotesWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}> Топ 15 Цитат</h1>
      </header>
      <div className={styles.quotesList}>
        {quotes.map((q, idx) => (
          <div className={styles.quoteCard} key={idx}>
            <div className={styles.quoteText}>"{q.text}"</div>
            <div className={styles.quoteAuthor}>— {q.author}</div>
            <div className={styles.divider} />
            <div className={styles.metrics}>
              <span className={styles.metric}>
                <span
                  className={`${styles.heart} ${q.liked ? styles.liked : ""}`}
                  onClick={() => handleLike(idx)}
                  title={q.liked ? "Убрать из избранного" : "В избранное"}
                >
                  {q.liked ? "❤️" : "🤍"}
                </span>
                {q.likes.toLocaleString("ru-RU")}
              </span>
              <span className={styles.metric}>
                <img src={iconShare} alt="Поделиться" />
                {q.shares.toLocaleString("ru-RU")}
              </span>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.actionBtn}
                onClick={() => handleLike(idx)}
                aria-label="Лайк"
              >
                {q.liked ? "❤️" : "🤍"}
              </button>
              <div style={{ position: "relative" }}>
                <button
                  className={styles.actionBtn}
                  onClick={() => handleCopy(q.text, q.author, idx)}
                  aria-label="Скопировать"
                >
                  <img src={iconCopy} alt="Скопировать" />
                </button>
                {copiedIdx === idx && (
                  <div className={styles.popover}>Скопировано!</div>
                )}
              </div>
              <button
                className={styles.actionBtn}
                onClick={() => handleShare(q.text, q.author)}
                aria-label="Поделиться"
              >
                <img src={iconShare} alt="Поделиться" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.cta}>
        Хотите больше? Попробуйте подборку по настроению!
      </div>
      <button
        className={`${styles.toTopBtn} ${showToTop ? styles.show : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Наверх"
      >
        ↑
      </button>
    </div>
  );
};

export default TopQuotes15;
