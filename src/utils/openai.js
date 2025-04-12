const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const BASE_URL =
  "https://api.intelligence.io.solutions/api/v1/chat/completions";
const prompt = `Генерируй только ровно 10 цитат в следующем формате !!!
Каждая цитата начинается с номера и точки.
Не используй теги и не добавляй пояснений.

Формат:
1. [цитата]
2. [цитата]
3. [цитата]
4. [цитата]
5. [цитата]
6. [цитата]
7. [цитата]
8. [цитата]
9. [цитата]
10.[цитата]

ВАЖНО: Начинай СРАЗУ с "1." первую цитату без вводного текста!`;

console.log("API KEY status:", !!API_KEY);

// Добавьте отладочный вывод полного значения ключа
console.log("API KEY value:", API_KEY);

const cleanResponse = (text) => {
  if (!text) return "";

  // Удаляем всё, что находится до первой цифры с точкой
  let cleaned = text.replace(/^[\s\S]*?(?=1\.)/g, "");

  // Разбиваем на строки и фильтруем
  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d+\./.test(line)); // Оставляем только строки, начинающиеся с цифры и точки

  // Проверяем, что получили хотя бы одну цитату
  if (lines.length === 0) {
    throw new Error("Ответ не содержит цитат в правильном формате");
  }

  return lines.join("\n");
};

export const fetchQuoteFromOpenAI = async (userInput) => {
  try {
    if (!API_KEY) {
      throw new Error("API ключ не найден");
    }

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      mode: "cors",
      credentials: "same-origin",
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-R1",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: `Сгенерируй 10 цитат на тему "${userInput}"`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }

    const data = await response.json();
    return cleanResponse(data.choices[0].message.content);
  } catch (error) {
    console.error("Ошибка при получении цитаты:", error);
    return `Ошибка: ${error.message}`;
  }
};
