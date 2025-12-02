import { GoogleGenAI } from "@google/genai";
import { input } from "@inquirer/prompts";
import ora from "ora";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 使用內建的 chat 介面來維護對話歷史
const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  config: {
    systemInstruction: "你是一位專業的助理，回答請用繁體中文",
  },
});

const spinner = ora("思考中...");
const q1 = await input({ message: "你的問題是？" });
spinner.start();
const a1 = await chat.sendMessage({ message: q1 });
spinner.stop();
console.log(a1.text);

const q2 = await input({ message: "->" });
spinner.start();
const a2 = await chat.sendMessage({ message: q2 });
spinner.stop();
console.log(a2.text);
