const fetch = require("node-fetch");

// netlify/functions/proxy.js
exports.handler = async function (event, context) {
  console.log("Function invoked with event:", event);
  // Добавляем CORS заголовки
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Обработка preflight запросов
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: "Proxy is working!" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const response = await fetch(
      "https://api.intelligence.io.solutions/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: event.body,
      }
    );

    // Добавьте проверку статуса
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    console.log("External API status:", response.status);
    const text = await response.text();
    console.log("External API response:", text);

    const data = JSON.parse(text);

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: "Proxy error", details: error.message }),
    };
  }
};
