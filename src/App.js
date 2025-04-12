
import Sidebar from './components/Sidebar';
import ChatBox from './components/Chatbox';
import styles from './styles/App.module.css';

function App() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <ChatBox />
    </div>
  );
}

export default App;












// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// const AI_API_URL = "https://api.intelligence.io.solutions/api/v1/chat/completions";
// const AI_MODEL = "deepseek-ai/DeepSeek-R1";
// const AI_API_KEY = process.env.REACT_APP_AI_API_KEY;

// function cleanResponse(text) {
//   if (!text) return "";
//   let result = "";
//   let insideTag = false;
//   let depth = 0;
//   for (let i = 0; i < text.length; i++) {
//     if (text.slice(i, i + 7).toLowerCase() === "<think>") {
//       insideTag = true;
//       depth++;
//       i += 6;
//       continue;
//     }
//     if (text.slice(i, i + 8).toLowerCase() === "</think>") {
//       depth--;
//       if (depth === 0) insideTag = false;
//       i += 7;
//       continue;
//     }
//     if (!insideTag) result += text[i];
//   }
//   return result.trim();
// }

// const App = () => {
//   const [query, setQuery] = useState('');
//   const [quotes, setQuotes] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [categories, setCategories] = useState(['Мотивация', 'Успех', 'Философия', 'Искусство', 'Любовь']);
//   const [selectedHistoryItem, setSelectedHistoryItem] = useState('С плохим настроением');

//   const handleQueryChange = (e) => setQuery(e.target.value);

//   useEffect(() => {
//     // Initialize with a quote for the selected history item
//     fetchQuotes("С плохим настроением");
//   }, []);

//   const fetchQuotes = async (customQuery = null) => {
//     setIsLoading(true);
//     try {
//       const promptQuery = customQuery || query;
      
//       const prompt = `Ты — генератор цитат. Выдавай **ТОЛЬКО 8 цитат** строго по теме.  
// Без пояснений, без вводных фраз, НЕ ИСПОЛЬЗУЙ теги <think> или любые другие HTML/XML теги! .  

// 📌 **Пример работы:**  
// Запрос: "мудрость"  
// Ответ:  
// 1.Мудрость приходит с опытом.  
// 2.Тот, кто много говорит, редко бывает мудрым.  
// 3.Истинная мудрость — это умение слушать.  
// 4.Мудрый человек знает, когда промолчать.  
// 5.Ошибки — лучшие учителя мудрости.  
// 6.Настоящая мудрость проста и ясна.  
// 7.Чем больше знаешь, тем больше понимаешь, как мало знаешь.  
// 8.Терпение — ключ к мудрости.`;

//       const response = await axios.post(
//         AI_API_URL,
//         {
//           model: AI_MODEL,
//           messages: [
//             { role: "system", content: prompt },
//             { role: "user", content: promptQuery },
//           ],
//           temperature: 0.9,
//           max_tokens: 350,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${AI_API_KEY}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const aiResponse = cleanResponse(response.data.choices[0].message.content);
//       const quotesArray = aiResponse.split('\n').filter(line => line.trim() !== '').slice(0, 8);
//       setQuotes(quotesArray);
//       setCurrentIndex(0);
//     } catch (error) {
//       console.error("Ошибка AI:", error.response ? error.response.data : error);
//       // For testing purposes without API key
//       if (customQuery === "С плохим настроением" || query === "С плохим настроением") {
//         setQuotes([
//           "Когда нечего есть, лучше лечь спать. Когда плохое настроение, лучше лечь спать. Проснёшься — уже в порядке. А если не выходит, лучше опять лечь спать."
//         ]);
//       } else {
//         setQuotes([
//           "1. Цитата по вашему запросу №1",
//           "2. Цитата по вашему запросу №2",
//           "3. Цитата по вашему запросу №3",
//           "4. Цитата по вашему запросу №4",
//           "5. Цитата по вашему запросу №5",
//           "6. Цитата по вашему запросу №6",
//           "7. Цитата по вашему запросу №7",
//           "8. Цитата по вашему запросу №8"
//         ]);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : quotes.length - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex < quotes.length - 1 ? prevIndex + 1 : 0));
//   };

//   const handleHistoryItemClick = (item) => {
//     setSelectedHistoryItem(item);
//     fetchQuotes(item);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       fetchQuotes();
//     }
//   };

//   return (
//     <div className="app">
//       {/* Боковая панель */}
//       <aside className="sidebar">
//         <div className="sidebar-header">
//           <div className="logo">
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
//                 fill="#74AA9C"
//               />
//               <path
//                 d="M12 6C9.24 6 7 8.24 7 11C7 13.76 9.24 16 12 16C14.76 16 17 13.76 17 11C17 8.24 14.76 6 12 6ZM12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14Z"
//                 fill="#74AA9C"
//               />
//             </svg>
//             <h1>DEEPWISDOM</h1>
//           </div>
//         </div>
//         <nav className="sidebar-nav">
//           <div className="search-container">
//             <svg
//               className="search-icon"
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
//                 fill="#8B949E"
//               />
//             </svg>
//             <input type="text" className="search-input" placeholder="Поиск..." />
//           </div>
//           <div className="nav-section">
//             <h3>Дополнительные функции</h3>
//             <button className="nav-item">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                 <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="#8B949E"/>
//               </svg>
//               Топ 15 цитат
//             </button>
//             <button className="nav-item">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                 <path d="M7.5 18C4.46 18 2 15.54 2 12.5S4.46 7 7.5 7H18c2.21 0 4 1.79 4 4s-1.79 4-4 4H9.5C8.12 15 7 13.88 7 12.5S8.12 10 9.5 10H17v1.5H9.5c-.55 0-1 .45-1 1s.45 1 1 1H18c1.38 0 2.5-1.12 2.5-2.5S19.38 8.5 18 8.5H7.5c-2.21 0-4 1.79-4 4s1.79 4 4 4H17V18H7.5z" fill="#8B949E"/>
//               </svg>
//               Случайная цитата
//             </button>
//             <button className="nav-item active">
//               <span className="heart-icon">♥</span> Избранное
//             </button>
//           </div>
//           <div className="nav-section">
//             <h3>История чатов</h3>
//             <button 
//               className={`nav-item ${selectedHistoryItem === "Новый чат" ? "active" : ""}`}
//               onClick={() => handleHistoryItemClick("Новый чат")}
//             >
//               Новый чат
//             </button>
//             <button 
//               className={`nav-item ${selectedHistoryItem === "С плохим настроением" ? "active" : ""}`}
//               onClick={() => handleHistoryItemClick("С плохим настроением")}
//             >
//               С плохим настроением
//             </button>
//             <button 
//               className={`nav-item ${selectedHistoryItem === "Мало зарабатываю" ? "active" : ""}`}
//               onClick={() => handleHistoryItemClick("Мало зарабатываю")}
//             >
//               Мало зарабатываю
//             </button>
//           </div>
//         </nav>
//         <div className="sidebar-footer">
//           <div className="user-info">
//             <img
//               src="https://via.placeholder.com/32"
//               alt="User avatar"
//               className="user-avatar"
//             />
//             <div className="user-details">
//               <p className="user-name">Nikolayev Nikolay</p>
//               <p className="user-email">nikola@gmail.com</p>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Основной контент */}
//       <main className="main-content">
//         <header className="chat-header">
//           <h2>Чат ({quotes.length > 0 ? currentIndex + 1 : 0}/{quotes.length})</h2>
//         </header>

//         <div className="chat-body">
//           {isLoading ? (
//             <div className="loading">
//               <div className="spinner"></div>
//               <p>Загрузка...</p>
//             </div>
//           ) : quotes.length > 0 ? (
//             <div className="quote-wrapper">
//               <div className="quote-card">
//                 <p className="quote-text">
//                   "{quotes[currentIndex].replace(/^\d+\.\s*/, '')}"
//                 </p>
//               </div>
//               <div className="quote-actions">
//                 <button onClick={handlePrev} className="action-button">
//                   ←
//                 </button>
//                 <button onClick={handleNext} className="action-button">
//                   →
//                 </button>
//                 <button className="action-button">
//                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                     <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.2L7 18V5h10v13z" fill="#8B949E"/>
//                   </svg>
//                 </button>
//                 <button className="action-button">
//                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#8B949E"/>
//                   </svg>
//                 </button>
//                 <button className="action-button">
//                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                     <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill="#8B949E"/>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="categories-container">
//               {categories.map((category, index) => (
//                 <button 
//                   key={index} 
//                   className="category-button"
//                   onClick={() => fetchQuotes(category)}
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="chat-input">
//           <input
//             type="text"
//             value={query}
//             onChange={handleQueryChange}
//             onKeyPress={handleKeyPress}
//             placeholder="Что у вас на душе?"
//           />
//           <button className="send-button" onClick={() => fetchQuotes()}>
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//               <path d="M8 5v14l11-7z" fill="#c9d1d9"/>
//             </svg>
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default App;