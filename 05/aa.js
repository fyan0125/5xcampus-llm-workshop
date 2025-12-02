import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function getEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });
  return response.embeddings[0].values; // 768 維向量
}
// 比較兩段⽂字的相似度
const v1 = await getEmbedding("信⽤卡年費多少？");
const v2 = await getEmbedding("申請信⽤卡要繳多少年費？");
const v3 = await getEmbedding("今天天氣如何？");

console.log(cosineSimilarity(v1, v2));
console.log(cosineSimilarity(v1, v3));
