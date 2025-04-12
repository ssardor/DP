import styles from "../styles/QuoteCard.module.css";

const QuoteCard = ({ text, loading }) => {
  return (
    <div className={`${styles.card} ${loading ? styles.loading : ""}`}>
      {!loading && <p className={styles.text}>"{text}"</p>}
    </div>
  );
};

export default QuoteCard;
