import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return Response.json(
        { error: "Тема не указана" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Ты эксперт по вирусному контенту.

Создавай:
— мощный хук в начале
— 2-3 строки вовлечения
— призыв к действию
— 5-8 релевантных хештегов

Пиши динамично, эмоционально и современно.
          `,
        },
        {
          role: "user",
          content: `Создай вирусное описание для темы: ${topic}`,
        },
      ],
    });

    return Response.json({
      text: completion.choices[0].message.content ?? "",
    });

  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return Response.json(
      { error: error.message || "AI error" },
      { status: 500 }
    );
  }
}