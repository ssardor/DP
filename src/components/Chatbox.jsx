import { useState } from "react";
import styles from "../styles/ChatBox.module.css";
import QuoteCard from "./QuoteCard";
import { fetchQuoteFromOpenAI } from "../utils/openai";

const ChatBox = () => {
  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;
    setLoading(true);
    const result = await fetchQuoteFromOpenAI(input);
    // Разбиваем результат на отдельные цитаты
    {console.log(result)}
    const quotesArray = result.split("\n").filter((quote) => quote.trim());
    setQuotes(quotesArray);
    setCurrentQuoteIndex(0);
    setLoading(false);
  };

  const handleNext = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePrev = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.header}>
        Чат{" "}
        <span>
          ({quotes.length ? `${currentQuoteIndex + 1}/${quotes.length}` : "0/0"}
          )
        </span>
      </div>

      <div className={styles.messages}>
        <div className={styles.quoteNavigation}>
          <button onClick={handlePrev}>←</button>
          <QuoteCard text={quotes[currentQuoteIndex]} loading={loading} />
          <button onClick={handleNext}>→</button>
        </div>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.tags}>
          <button onClick={() => setInput("Мотивация")}>Мотивация</button>
          <button onClick={() => setInput("Успех")}>Успех</button>
          <button onClick={() => setInput("Философия")}>Философия</button>
          <button onClick={() => setInput("Искусство")}>Искусство</button>
          <button onClick={() => setInput("Любовь")}>Любовь</button>
        </div>
        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="Что у вас на душе?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className={styles.sendBtn} onClick={handleSend}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
