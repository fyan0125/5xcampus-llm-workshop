import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//模型沒有記憶功能，需要自己維護對話歷史
const chatHistory = [];

async function chat(message) {
  chatHistory.push({ role: "user", parts: [{ text: message }] });

  const resp = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "回話一律使用台灣繁體中文",
    },
    contents: chatHistory,
  });

  chatHistory.push({ role: "model", parts: [{ text: resp.text }] });
}

await chat("我是Celia，請多指教！");
await chat("我是誰？");

console.log(
  chatHistory.map((msg) => `${msg.role}: ${msg.parts[0].text}`).join("\n")
);
