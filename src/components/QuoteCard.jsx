import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/QuoteCard.module.css";
import iconCopy from "../img/IconCopy.svg";
import iconSaved from "../img/heart.svg"; // Пустое сердце
import iconLiked from "../img/heartLiked.png"; // Заполненное сердце
import iconShare from "../img/IconShare.svg";
import { supabase } from "../supabaseClient";

const swipeConfidenceThreshold = 120;

function cleanQuote(text) {
  return text.replace(/^\d+\.\s*/, "");
}

const QuoteCard = ({ quotes, loading, currentIndex = 0, onNext, onPrev }) => {
  const [showCopyPopover, setShowCopyPopover] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLiked(false);
  }, [currentIndex, quotes]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(quotes[currentIndex]);
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
        // Добавление в избранное
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          query: "Избранная цитата",
          response: quotes[currentIndex],
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
        setIsLiked(true);

        // После успешного добавления в избранное
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("favorites_count")
          .eq("id", user.id)
          .single();

        if (!profileError && profile) {
          await supabase
            .from("profiles")
            .update({
              favorites_count: (profile.favorites_count || 0) + 1,
            })
            .eq("id", user.id);
        }
      } else {
        // Удаление из избранного
        const { error } = await supabase.from("favorites").delete().match({
          user_id: user.id,
          response: quotes[currentIndex],
        });

        if (error) throw error;
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Ошибка при работе с избранным:", error);
    }
  };

  const handleShare = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Логика для обработки шаринга цитаты
      // Например, увеличение счетчика шарингов в профиле пользователя
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("shares_count")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      await supabase
        .from("profiles")
        .update({
          shares_count: (profile.shares_count || 0) + 1,
        })
        .eq("id", user.id);

      // Здесь можно добавить дополнительную логику, например, открытие окна шаринга
      console.log("Цитата успешно поделена!");
    } catch (error) {
      console.error("Ошибка при шаринге цитаты:", error);
    }
  };

  // Для эффекта стопки: максимум 3 карточки в DOM
  const stack = [];
  for (let i = quotes.length - currentIndex - 1; i > 0; i--) {
    stack.push(
      <motion.div
        key={currentIndex + i}
        className={`${styles.card} ${styles.stackedCard}`}
        style={{
          zIndex: i,
          transform: `scale(${1 - i * 0.04}) translateY(${-i * 12}px)`,
          opacity: 0.7 - i * 0.07,
          background: "#5b5a5a",
          pointerEvents: "none",
          position: "absolute",
        }}
      >
        <p className={styles.text}>{cleanQuote(quotes[currentIndex + i])}</p>
      </motion.div>
    );
  }

  // Проверяем что quotes это массив и что текущая цитата существует
  if (!Array.isArray(quotes) || !quotes[currentIndex]) {
    return <div>Загрузка...</div>;
  }


  return (
    <div className={styles.cardContainer}>
      <div
        className={styles.cardStack}
        style={{ position: "relative", minHeight: 200 }}
      >
        {loading ? (
          <motion.div
            key="loading"
            className={styles.loadingCard}
            style={{
              zIndex: 10,
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className={styles.spinner}></div>
          </motion.div>
        ) : (
          <>
            {stack}
            <AnimatePresence initial={false}>
              {quotes[currentIndex] && (
                <motion.div
                  key={currentIndex}
                  className={styles.card}
                  style={{
                    zIndex: 10,
                    position: "absolute",
                    background: "#1a1a1a",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                  }}
                  initial={{ scale: 0.97, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    x: 0,
                    opacity: 0,
                    rotate: 0,
                    transition: { duration: 0.7, ease: "easeInOut" },
                  }}
                  drag="x"
                  dragListener={true}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.95}
                  whileDrag={{
                    scale: 1.09,
                    rotate: (dragInfo) =>
                      dragInfo ? dragInfo.point.x / 10 : 0,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.40)",
                  }}
                  onDragEnd={(e, info) => {
                    if (
                      (info.offset.x > swipeConfidenceThreshold ||
                        info.offset.x < -swipeConfidenceThreshold) &&
                      currentIndex < quotes.length - 1
                    ) {
                      onNext();
                    }
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                >
                  <p className={styles.text}>
                    {cleanQuote(quotes[currentIndex])}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
      {/* Кнопки появляются плавно вместе с карточкой */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            className={styles.controlsWrapper}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className={styles.allControls}>
              <div className={styles.navigation}>
                <button
                  onClick={() => currentIndex > 0 && onPrev()}
                  disabled={currentIndex === 0}
                >
                  &larr;
                </button>
                <span className={styles.counter}>
                  {`${quotes.length - 1 ? currentIndex + 1 : 0} / ${
                    quotes.length - 1
                  }`}
                </span>
                <button
                  onClick={() => currentIndex < quotes.length - 1 && onNext()}
                  disabled={currentIndex === quotes.length - 1}
                >
                  &rarr;
                </button>
              </div>
              <div className={styles.actionButtons}>
                <div className={styles.buttonWrapper}>
                  <button
                    className={styles.actionButton}
                    onClick={handleCopy}
                    title="Копировать"
                  >
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
                  title={isLiked ? "Убрать из избранного" : "В избранное"}
                >
                  <img
                    src={isLiked ? iconLiked : iconSaved}
                    alt={isLiked ? "Убрать из избранного" : "В избранное"}
                  />
                </button>
                <button
                  className={styles.actionButton}
                  title="Поделиться"
                  onClick={handleShare}
                >
                  <img src={iconShare} alt="Поделиться" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuoteCard;
