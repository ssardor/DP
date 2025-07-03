import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/Chatbox";
import Profile from "./components/Profile";
import RandomQuote from "./components/RandomQuote";
import styles from "./styles/App.module.css";
import TopQuotes15 from "./components/TopQuotes15";
import PremiumScreen from "./components/PremiumScreen";
import Settings from "./components/Settings";
import Login from "./components/Login";
import Favorites from "./components/Favorites";
import { supabase } from "./supabaseClient";

function AppContent() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    // Если ширина экрана <= 768px (мобильная) — сайдбар закрыт
    return window.innerWidth > 768;
  });
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [newChatTrigger, setNewChatTrigger] = useState(Date.now());
  const location = useLocation();
  const navigate = useNavigate(); // Добавляем хук для навигации

  // Загрузка чатов при входе
  useEffect(() => {
    loadChats();
  }, []);

  // Загрузка чатов из БД
  const loadChats = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: chats, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Убедимся, что история существует для каждого чата
      const processedChats =
        chats?.map((chat) => ({
          ...chat,
          history: chat.history || [],
        })) || [];

      setChats(processedChats);
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    }
  };

  // Сохранение чата в БД
  const saveChat = async (chat) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Убедимся что история это массив
      const history = Array.isArray(chat.history) ? chat.history : [];

      const { error } = await supabase.from("chats").upsert({
        id: chat.id,
        user_id: user.id,
        title: chat.title || "Новый чат",
        history: history,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Перезагружаем чаты после сохранения
      await loadChats();
    } catch (error) {
      console.error("Ошибка сохранения чата:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const handleNewChat = () => {
    // Полностью очищаем активный чат
    setActiveChatId(null);
    setNewChatTrigger(Date.now());
    navigate("/"); // Добавляем переход на главную при создании нового чата
  };

  const isLoginPage = location.pathname === "/login";

  // Получить активный чат
  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleSend = async (input, quotes, navigation) => {
    // Обработка навигации
    if (navigation) {
      const updatedChats = chats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              history: chat.history.map((msg, idx) =>
                idx === navigation.index
                  ? { ...msg, currentIndex: navigation.newIndex }
                  : msg
              ),
            }
          : chat
      );
      setChats(updatedChats);
      const updatedChat = updatedChats.find((c) => c.id === activeChatId);
      if (updatedChat) await saveChat(updatedChat);
      return;
    }

    if (!activeChatId) {
      // Создание нового чата
      const newChat = {
        id: Date.now(),
        title: input.split(" ")[0] || "Новый чат",
        history: [
          {
            query: input,
            quotes: quotes || ["Загрузка..."],
            loading: !quotes,
            currentIndex: 0,
          },
        ],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      await saveChat(newChat);
    } else {
      // Добавление сообщения в существующий чат
      const updatedChats = chats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              history: [
                ...chat.history,
                {
                  query: input,
                  quotes: quotes || ["Загрузка..."],
                  loading: !quotes,
                  currentIndex: 0,
                },
              ],
            }
          : chat
      );
      setChats(updatedChats);
      const updatedChat = updatedChats.find((c) => c.id === activeChatId);
      if (updatedChat) await saveChat(updatedChat);
    }
  };

  // Обработчик выбора чата
  const handleSelectChat = async (chatId) => {
    try {
      setActiveChatId(chatId);
      navigate("/"); // Добавляем переход на главную при выборе чата

      // Находим чат в текущем состоянии
      const currentChat = chats.find((c) => c.id === chatId);
      if (!currentChat) return;

      // Если история уже загружена, не делаем запрос
      if (currentChat.history && currentChat.history.length > 0) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Загружаем историю если её нет
      const { data: chatData, error } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chatId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      // Обновляем состояние с историей
      if (chatData) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? { ...chat, history: chatData.history || [] }
              : chat
          )
        );
      }
    } catch (error) {
      console.error("Ошибка загрузки чата:", error);
    }
  };

  const chatProps = {
    chat: activeChat,
    onSend: handleSend,
    isSidebarOpen: isSidebarVisible,
    newChatTrigger: newChatTrigger,
  };

  // Если страница логина — рендерим только Login, без layout
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  // Все остальные страницы — основной layout
  return (
    <div className={styles.container}>
      {/* Кнопка открытия сайдбара */}
      {!isSidebarVisible && (
        <button className={styles.toggleSidebarBtn} onClick={toggleSidebar}>
          ☰
        </button>
      )}

      <div
        className={`${styles.sidebarWrapper} ${
          isSidebarVisible ? styles.sidebarOpen : ""
        }`}
      >
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onClose={toggleSidebar}
          onNewChat={handleNewChat}
        />
      </div>

      <div className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<ChatBox {...chatProps} />} />
          <Route path="/top-quotes" element={<TopQuotes15 />} />
          <Route path="/random-quote" element={<RandomQuote />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/plans" element={<PremiumScreen />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          {/* Добавляем обработку 404 */}
          <Route path="/404" element={<div>Страница не найдена</div>} />
          {/* Все остальные пути ведут к ChatBox */}
          <Route path="*" element={<ChatBox {...chatProps} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
