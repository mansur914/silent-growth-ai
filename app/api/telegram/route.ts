import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Incoming update:", JSON.stringify(body));

    const chatId = body.message?.chat?.id;
    const userText = body.message?.text;

    if (!chatId || !userText) {
      return new Response("OK");
    }

    // --- Запрос к DeepSeek ---
    const aiResponse = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "Ты эксперт по вирусному маркетингу. Пиши цепляющие, эмоциональные и продающие описания для Reels и TikTok. Используй триггеры, интригу и сильный хук в начале."
          },
          {
            role: "user",
            content: userText
          }
        ],
        temperature: 0.7
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("DeepSeek error:", errorText);
      throw new Error("Ошибка DeepSeek API");
    }

    const aiData = await aiResponse.json();

    const reply =
      aiData.choices?.[0]?.message?.content ||
      "Произошла ошибка генерации.";

    // --- Ответ в Telegram ---
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply,
        }),
      }
    );

    const telegramData = await telegramResponse.json();
    console.log("Telegram response:", telegramData);

    return new Response("OK");
  } catch (error) {
    console.error("ERROR:", error);
    return new Response("Error", { status: 500 });
  }
}