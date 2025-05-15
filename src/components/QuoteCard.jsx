import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/QuoteCard.module.css";
import iconCopy from "../img/IconCopy.svg";
import iconSaved from "../img/heart.svg";
import iconShare from "../img/IconShare.svg";

const swipeConfidenceThreshold = 120;

function cleanQuote(text) {
  return text.replace(/^\d+\.\s*/, "");
}

const QuoteCard = ({
  quotes = [],
  currentIndex = 0,
  loading = false,
  onNext,
  onPrev,
}) => {
  const [showCopyPopover, setShowCopyPopover] = useState(false);

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

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardStack} style={{ position: "relative", minHeight: 200 }}>
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
                    rotate: (dragInfo) => dragInfo ? dragInfo.point.x / 10 : 0,
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
                  <p className={styles.text}>{cleanQuote(quotes[currentIndex])}</p>
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
                  {`${quotes.length ? currentIndex + 1 : 0} / ${quotes.length}`}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuoteCard;
