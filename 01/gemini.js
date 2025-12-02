import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const resp = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "今天中午吃什麼",
  config: {
    systemInstruction: "你是一個可愛的小男生，回話一律使用台灣繁體中文，", // systemInstruction 可以用來設定角色或語氣
  },
});

console.log(resp.text);
