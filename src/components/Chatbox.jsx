import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ChatBox.module.css";
import QuoteCard from "./QuoteCard";
import iconSend from "../img/Icon.svg";
import iconLoading from "../img/IconProccess.png";
import { supabase } from "../supabaseClient";

const ChatBox = ({ chat, onSend, isSidebarOpen, newChatTrigger }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [stopped, setStopped] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const firstMessageRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const tagsRef = useRef(null);

  // Проверяем авторизацию при монтировании
  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Сброс истории при новом чате
  useEffect(() => {
    // Сбрасываем состояние при смене чата
    setInput("");
    setStopped(false);
    setLoading(false);
    setAbortController(null);
  }, [chat?.id, newChatTrigger]);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  async function fetchQuotesByTags(query) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const orFilter = words.map((word) => `tags.ilike.%${word}%`).join(",");
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .or(orFilter)
      .limit(10);

    if (error) {
      console.error("Ошибка поиска цитат:", error);
      return [];
    }

    // Преобразуем цитаты в нужный формат
    return data.map((quote) => ({
      text: String(quote.quote_text || ""), // Убедимся что text это строка
      author: String(quote.author || ""),
    }));
  }

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setStopped(false);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const quotes = await fetchQuotesByTags(input);
      // Форматируем цитаты перед отправкой
      const formattedQuotes = quotes.map((q) => `"${q.text}" — ${q.author}`);
      await onSend(input, formattedQuotes);

      setInput(""); // Очищаем поле ввода
    } catch (error) {
      console.error("Ошибка при отправке:", error);
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setStopped(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chat?.history?.length > 0) {
      scrollToBottom();
    }
  }, [chat?.history?.length]);

  const handleNavigation = (index, direction) => {
    if (!chat?.history?.[index]?.quotes) return;

    const currentItem = chat.history[index];
    const quotesLength = Array.isArray(currentItem.quotes)
      ? currentItem.quotes.length
      : 0;

    if (direction === "next" && currentItem.currentIndex < quotesLength - 1) {
      onSend(null, null, {
        type: "navigation",
        index,
        newIndex: currentItem.currentIndex + 1,
      });
    }
  };

  const handlePrev = (entryIndex) => {
    if (!chat?.history?.[entryIndex]) return;

    const currentItem = chat.history[entryIndex];
    onSend(null, null, {
      type: "navigation",
      index: entryIndex,
      newIndex: Math.max(0, currentItem.currentIndex - 1),
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
        {(!chat || !chat.history || chat.history.length === 0) && (
          <div className={styles.emptyChat}>
            <p>Выберите категорию или введите свой запрос!</p>
          </div>
        )}
        {chat?.history?.map((entry, index) => (
          <div key={index} className={styles.historyItem}>
            <div className={styles.queryContainer}>
              <div className={styles.query}>{entry.query}</div>
            </div>
            <QuoteCard
              quotes={entry.quotes}
              loading={entry.loading}
              currentIndex={entry.currentIndex || 0}
              onNext={() => handleNavigation(index, "next")}
              onPrev={() => handlePrev(index)}
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
