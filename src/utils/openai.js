const API_KEY = process.env.AI_API_KEY;
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8888/.netlify/functions/proxy"
    : "/api/proxy";
const prompt = `Создай 11 оригинальных цитат с глубоким философским смыслом.

Требования к формату:
- Каждая цитата должна иметь порядковый номер и точку (например: "1.")
- Начни сразу с первой цитаты без вступительного текста
- Не добавляй комментарии, пояснения или теги к цитатам
- Строго придерживайся формата " [текст цитаты]"
- Не доавбляй нумерацию к цитатам, только текст
Требования к содержанию:
- Каждая цитата должна содержать глубокую философскую мысль
- Обеспечь абсолютную уникальность каждой цитаты
- Избегай повторения слов, фраз и концепций между цитатами
- Используй разнообразные темы: жизнь, успех, мудрость, время, познание
- Сделай цитаты лаконичными, но содержательными
- Предоставь цитаты на том же языке, на котором задан вопрос

Формат вывода:
 [цитата]
 [цитата]
 [цитата]
 [цитата]
 [цитата]
 [цитата]
 [цитата]
 [цитата]
 [цитата]
 [цитата]
 [цитата]`;

console.log("API KEY status:", !!API_KEY);

// Добавьте отладочный вывод полного значения ключа
console.log("API KEY value:", API_KEY);

console.log("API_KEY:", API_KEY ? "Loaded" : "Not Loaded");
console.log("API_URL:", API_URL);

const cleanResponse = (text) => {
  if (!text) return "";

  console.log("Raw API response:", text);

  // Удаляем всё, что находится до первой цифры с точкой
  let cleaned = text.replace(/^[\s\S]*?(?=1\.)/g, "");
  console.log("Cleaned response:", cleaned);

  // Разбиваем на строки и фильтруем
  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d+\./.test(line)); // Оставляем только строки, начинающиеся с цифры и точки

  console.log("Filtered lines:", lines);

  // Проверяем, что получили хотя бы одну цитату
  if (lines.length === 0) {
    throw new Error("Ответ не содержит цитат в правильном формате");
  }

  return lines.join("\n");
};

export const fetchQuoteFromOpenAI = async (userInput, signal) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: `Сгенерируй 11 цитат на тему "${userInput}"`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
      signal, // <-- добавляем сигнал
    });

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }

    const data = await response.json();
    return cleanResponse(data.choices[0].message.content);
  } catch (error) {
    if (error.name === "AbortError") {
      return "__aborted__";
    }
    console.error("Ошибка при получении цитаты:", error);
    return `Ошибка: ${error.message}`;
  }
};
