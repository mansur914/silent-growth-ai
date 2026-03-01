import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Ты эксперт по созданию вирусных описаний для Reels."
        },
        {
          role: "user",
          content: "Создай вирусное описание для видео."
        }
      ],
    });

    return Response.json({
      text: completion.choices[0].message.content
    });

  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return Response.json(
      { error: error.message || "AI error" },
      { status: 500 }
    );
  }
}