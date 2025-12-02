import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "你是誰？",
  config: {
    temperature: 0.7, // 控制隨機性(0~2，建議0~1)
    maxOutputTokens: 256, // 最大輸出長度
  },
});

console.log("Response from Gemini:", response.text);
