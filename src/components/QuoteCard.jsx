import { useState } from "react";
import styles from "../styles/QuoteCard.module.css";
import iconCopy from "../img/IconCopy.svg";
import iconSaved from "../img/heart.svg";
import iconShare from "../img/IconShare.svg";

const QuoteCard = ({ text, loading, onNext, onPrev }) => {
  const [showPopover, setShowPopover] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 2000); // Hide after 2 seconds
    } catch (err) {
      console.error("Ошибка при копировании:", err);
    }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.card} ${loading ? styles.loading : ""}`}>
        {!loading && <p className={styles.text}>{text}</p>}
      </div>
      {!loading && (
        <div className={styles.cardControls}>
          <div className={styles.navigation}>
            <button onClick={onPrev}>&larr;</button>
            <button onClick={onNext}>&rarr;</button>
          </div>
          <div className={styles.rightButtons}>
            <div className={styles.buttonWrapper}>
              <button
                className={styles.actionButton}
                onClick={handleCopy}
                title="Скопировать цитату"
              >
                <img src={iconCopy} alt="Скопировать" />
              </button>
              {showPopover && (
                <div className={styles.popover}>Цитата скопирована!</div>
              )}
            </div>
            <button className={styles.actionButton}>
              <img src={iconSaved} alt="Сохранить" />
            </button>
            <button className={styles.actionButton}>
              <img src={iconShare} alt="Поделиться" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteCard;
