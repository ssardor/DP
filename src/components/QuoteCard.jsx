import { useState } from "react";
import styles from "../styles/QuoteCard.module.css";
import iconCopy from "../img/IconCopy.svg";
import iconSaved from "../img/heart.svg";
import iconShare from "../img/IconShare.svg";
import { motion, AnimatePresence } from "framer-motion";

const swipeConfidenceThreshold = 120;

const QuoteCard = ({
  quotes = [],
  currentIndex = 0,
  loading = false,
  onNext,
  onPrev,
}) => {
  const [showCopyPopover, setShowCopyPopover] = useState(false);

  // Копирование
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(quotes[currentIndex]);
      setShowCopyPopover(true);
      setTimeout(() => setShowCopyPopover(false), 2000);
    } catch (err) {
      console.error("Ошибка при копировании:", err);
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
          zIndex: i, // чем ближе к пользователю, тем больше z-index
          scale: 1 - i * 0.04,
          y: -i * 12,
          opacity: 0.7 - i * 0.07,
          background: "#5b5a5a",
          pointerEvents: "none",
          position: "absolute",
        }}
      >
        <p className={styles.text}>{quotes[currentIndex + i]}</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardStack} style={{ position: "relative" }}>
        {/* Стек карточек (следующие) */}
        {stack}

        {/* Активная карточка */}
        <AnimatePresence initial={false}>
          {quotes[currentIndex] && (
            <motion.div
              key={currentIndex}
              className={styles.card}
              style={{
                zIndex: 10,
                position: "absolute",
                background: "#1a1a1a",
              }}
              initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={(direction) => ({
                x: direction === "right" ? 500 : -500,
                opacity: 0,
                rotate: direction === "right" ? 30 : -30,
                transition: { duration: 0.35 },
              })}
              drag="x"
              dragListener={true}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(e, info) => {
                if (
                  info.offset.x > swipeConfidenceThreshold &&
                  currentIndex < quotes.length - 1
                ) {
                  onNext();
                } else if (
                  info.offset.x < -swipeConfidenceThreshold &&
                  currentIndex > 0
                ) {
                  onPrev();
                }
              }}
            >
              <p className={styles.text}>{quotes[currentIndex]}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className={styles.controlsWrapper}>
        <div className={styles.allControls}>
          <div className={styles.navigation}>
            <button
              onClick={() => currentIndex > 0 && onPrev()}
              disabled={currentIndex === 0}
            >
              &larr;
            </button>
            <span className={styles.counter}>
              {`${currentIndex + 1} / ${quotes.length}`}
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
      </div>
    </div>
  );
};

export default QuoteCard;
