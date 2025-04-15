import { useState, useRef, useEffect } from "react";
import styles from "../styles/ChatBox.module.css";
import QuoteCard from "./QuoteCard";
import { fetchQuoteFromOpenAI } from "../utils/openai";

const ChatBox = () => {
  const [history, setHistory] = useState([]); // История запросов и карточек
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // Реф для последнего элемента
  const messagesContainerRef = useRef(null); // Реф для контейнера сообщений
  const firstMessageRef = useRef(null); // Реф для первого элемента

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };



  const isScrolledToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return false;
    return (
      container.scrollHeight - container.scrollTop === container.clientHeight
    );
  };

  const handleSend = async () => {
    if (!input) return;
    setLoading(true);

    // Добавляем запрос в историю с состоянием "Loading"
    setHistory((prev) => [
      ...prev,
      { query: input, quotes: ["Loading..."], loading: true, currentIndex: 0 },
    ]);

    try {
      const result = await fetchQuoteFromOpenAI(input);
      if (result.startsWith("Ошибка:")) {
        throw new Error(result);
      }

      const quotesArray = result.split("\n").filter((quote) => quote.trim());

      // Обновляем последний элемент истории с результатом
      setHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1] = {
          query: input,
          quotes: quotesArray,
          loading: false,
          currentIndex: 0,
        };
        return updatedHistory;
      });
    } catch (error) {
      console.error("Ошибка:", error);

      // Обновляем последний элемент истории с ошибкой
      setHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1] = {
          query: input,
          quotes: ["Ошибка при загрузке цитат."],
          loading: false,
          currentIndex: 0,
        };
        return updatedHistory;
      });
    } finally {
      setLoading(false);
      setInput(""); // Очищаем поле ввода
    }
  };

  // Прокручиваем вниз только если пользователь находится внизу
  useEffect(() => {
    if (isScrolledToBottom()) {
      scrollToBottom();
    }
  }, [history]);

  const handleNavigation = (index, direction) => {
    setHistory((prev) => {
      const updatedHistory = [...prev];
      const currentItem = updatedHistory[index];
      const newIndex =
        direction === "next"
          ? (currentItem.currentIndex + 1) % currentItem.quotes.length
          : (currentItem.currentIndex - 1 + currentItem.quotes.length) %
            currentItem.quotes.length;

      updatedHistory[index] = { ...currentItem, currentIndex: newIndex };
      return updatedHistory;
    });
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.messages} ref={messagesContainerRef}>
        {history.map((entry, index) => (
          <div
            key={index}
            className={styles.historyItem}
            ref={index === 0 ? firstMessageRef : null} // Реф для первого элемента
          >
            <div className={styles.queryContainer}>
              <div className={styles.query}>{entry.query}</div>
            </div>
            <QuoteCard
              text={entry.quotes[entry.currentIndex]}
              loading={entry.loading}
              onNext={() => handleNavigation(index, "next")}
              onPrev={() => handleNavigation(index, "prev")}
            />
          </div>
        ))}
        {/* Реф для автоматической прокрутки */}
        <div ref={messagesEndRef} />
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
            {loading ? "..." : "Отправить"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
