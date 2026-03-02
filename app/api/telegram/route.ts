export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      console.log("Incoming update:", JSON.stringify(body));
  
      const chatId = body.message?.chat?.id;
      const userText = body.message?.text;
  
      // Если это не текстовое сообщение — просто отвечаем OK
      if (!chatId || !userText) {
        return new Response("OK");
      }
  
      // 🔥 Запрос к DeepSeek
      const aiResponse = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content:
                  "Ты эксперт по созданию вирусных описаний для Reels и TikTok.",
              },
              {
                role: "user",
                content: userText,
              },
            ],
            temperature: 0.7,
          }),
        }
      );
  
      const aiData = await aiResponse.json();
  
      const reply =
        aiData?.choices?.[0]?.message?.content ||
        "Произошла ошибка генерации.";
  
      // 📩 Отправка ответа в Telegram
      await fetch(
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
  
      return new Response("OK");
    } catch (error) {
      console.error("ERROR:", error);
      return new Response("Error", { status: 500 });
    }
  }