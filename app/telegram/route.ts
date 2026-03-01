import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN!;

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
    }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const chatId = body.message?.chat?.id;
    const userText = body.message?.text;

    if (!chatId || !userText) {
      return Response.json({ ok: true });
    }

    if (userText === "/start") {
      await sendMessage(
        chatId,
        "🚀 Silent Growth AI\n\nПришли описание ролика — я сделаю его вирусным.\n\n3 бесплатных запроса в день."
      );
      return Response.json({ ok: true });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Ты эксперт по вирусным описаниям для Reels и TikTok. Делай мощный хук, вовлекающий текст и хештеги.",
        },
        {
          role: "user",
          content: `Улучши это описание:\n${userText}`,
        },
      ],
    });

    await sendMessage(
      chatId,
      completion.choices[0].message.content ?? "Ошибка AI"
    );

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Telegram error:", error);
    return Response.json({ ok: true });
  }
}