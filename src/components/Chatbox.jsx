import { useState, useRef, useEffect } from "react";
import styles from "../styles/ChatBox.module.css";
import QuoteCard from "./QuoteCard";
import { fetchQuoteFromOpenAI } from "../utils/openai";
import iconSend from "../img/Icon.svg";
import iconLoading from "../img/IconProccess.png";
// Импортируем иконку "Поделиться"
const ChatBox = ({ isSidebarOpen }) => {
  const [history, setHistory] = useState([]); // История запросов и карточек
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // Реф для последнего элемента
  const messagesContainerRef = useRef(null); // Реф для контейнера сообщений
  const firstMessageRef = useRef(null); // Реф для первого элемента
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const tagsRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
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
      {
        query: input,
        quotes: ["Loading..."],
        loading: true,
        currentIndex: 0,
      },
    ]);

    // Скроллим к новому сообщению
    scrollToBottom();

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

  // Скролл при добавлении нового сообщения
  useEffect(() => {
    if (history.length > 0) {
      scrollToBottom();
    }
  }, [history.length]);

  const handleNavigation = (index, direction) => {
    setHistory((prev) => {
      const updatedHistory = [...prev];
      const currentItem = updatedHistory[index];

      if (
        direction === "next" &&
        currentItem.currentIndex < currentItem.quotes.length - 1
      ) {
        currentItem.currentIndex++;
      } else if (direction === "prev" && currentItem.currentIndex > 0) {
        currentItem.currentIndex--;
      }

      return updatedHistory;
    });
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!tagsRef.current) return;

    const difference = touchStart - touchEnd;
    const scrollAmount = 150; // Adjust this value based on your needs

    if (Math.abs(difference) > 50) {
      // Minimum swipe distance
      if (difference > 0) {
        // Swipe left
        tagsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else {
        // Swipe right
        tagsRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className={`${styles.chatBox} ${!isSidebarOpen ? styles.expanded : ""}`}
    >
      <div className={styles.messages} ref={messagesContainerRef}>
        {history.map((entry, index) => (
          <div
            key={index}
            className={styles.historyItem}
            ref={index === 0 ? firstMessageRef : null}
          >
            <div className={styles.queryContainer}>
              <div className={styles.query}>{entry.query}</div>
            </div>
            <QuoteCard
              quotes={entry.quotes}
              loading={entry.loading}
              onNext={() => handleNavigation(index, "next")}
              onPrev={() => handleNavigation(index, "prev")}
              currentIndex={entry.currentIndex}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputSection}>
        <div
          className={styles.tags}
          ref={tagsRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? (
              <img src={iconLoading} alt="Загрузка" />
            ) : (
              <img src={iconSend} alt="Отправить" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
