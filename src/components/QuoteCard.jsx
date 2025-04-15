import styles from "../styles/QuoteCard.module.css";

const QuoteCard = ({ text, loading, onNext, onPrev }) => {
  return (
    <div className={`${styles.card} ${loading ? styles.loading : ""}`}>
      {!loading && <p className={styles.text}>{text}</p>}
      {!loading && (
        <div className={styles.navigation}>
          <button onClick={onPrev}>&larr;</button>
          <button onClick={onNext}>&rarr;</button>
        </div>
      )}
    </div>
  );
};

export default QuoteCard;
