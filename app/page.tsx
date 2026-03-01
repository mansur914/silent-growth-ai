"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateText() {
    if (!topic) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка генерации");
      }

      setResult(data.text);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-3">
        Silent Growth AI 🚀
      </h1>

      <p className="text-gray-400 mb-8">
        Генератор вирусных описаний для Reels и TikTok
      </p>

      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Введите тему видео..."
        className="w-full max-w-xl p-4 rounded-lg bg-zinc-900 border border-zinc-700 outline-none"
      />

      <button
        onClick={generateText}
        disabled={loading}
        className="mt-4 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
      >
        {loading ? "Генерация..." : "Сгенерировать"}
      </button>

      {error && (
        <div className="mt-6 text-red-500">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 w-full max-w-xl bg-zinc-900 p-6 rounded-lg border border-zinc-700 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </main>
  );
}