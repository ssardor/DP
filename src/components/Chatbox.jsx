import { useState, useRef, useEffect } from "react";
import styles from "../styles/ChatBox.module.css";
import QuoteCard from "./QuoteCard";
import { fetchQuoteFromOpenAI } from "../utils/openai";
import iconSend from "../img/Icon.svg";
import iconLoading from "../img/IconProccess.png";
// Импортируем иконку "Поделиться"

const ChatBox = ({ isSidebarOpen }) => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [ setStopped] = useState(false); // Новое состояние
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const firstMessageRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const tagsRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleSend = async () => {
    if (!input) return;
    setLoading(true);
    setStopped(false);

    // Создаем новый AbortController для этого запроса
    const controller = new AbortController();
    setAbortController(controller);

    setHistory((prev) => [
      ...prev,
      {
        query: input,
        quotes: ["Loading..."],
        loading: true,
        currentIndex: 0,
      },
    ]);

    scrollToBottom();

    try {
      const result = await fetchQuoteFromOpenAI(input, controller.signal);
      if (result === "__aborted__") {
        // Если был вызван abort
        setHistory((prev) => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1] = {
            query: input,
            quotes: ["Процесс остановлен"],
            loading: false,
            currentIndex: 0,
          };
          return updatedHistory;
        });
        setStopped(true);
        return;
      }
      if (result.startsWith("Ошибка:")) {
        throw new Error(result);
      }
      const quotesArray = result.split("\n").filter((quote) => quote.trim());
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
      if (error.name === "AbortError") {
        setHistory((prev) => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1] = {
            query: input,
            quotes: ["Процесс остановлен"],
            loading: false,
            currentIndex: 0,
          };
          return updatedHistory;
        });
        setStopped(true);
      } else {
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
      }
    } finally {
      setLoading(false);
      setInput("");
      setAbortController(null);
    }
  };

  // Кнопка остановки процесса
  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setStopped(true);
      setLoading(false);
    }
  };

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
      }
      return updatedHistory;
    });
  };

  const handlePrev = (entryIndex) => {
    setHistory((prev) =>
      prev.map((entry, idx) =>
        idx === entryIndex
          ? { ...entry, currentIndex: Math.max(0, entry.currentIndex - 1) }
          : entry
      )
    );
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
    const scrollAmount = 150;
    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        tagsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else {
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
            {entry.quotes.length === 1 &&
            entry.quotes[0] === "Процесс остановлен" ? (
              <h4
                style={{
                  textAlign: "center",
                  color: "#646464",
                  margin: "24px 0",
                }}
              >
                Процесс остановлен
              </h4>
            ) : (
              <QuoteCard
                quotes={entry.quotes}
                loading={entry.loading}
                onNext={() => handleNavigation(index, "next")}
                onPrev={() => handlePrev(index)}
                currentIndex={entry.currentIndex}
              />
            )}
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
            onClick={loading ? handleStop : handleSend}
            disabled={loading && !abortController}
          >
            {loading ? (
              <img
                src={iconLoading}
                alt="Загрузка"
                style={{ cursor: "pointer" }}
              />
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
