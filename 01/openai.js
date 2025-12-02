import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "你是誰" }],
  temperature: 0.7,
});

console.log(response.choices[0].message.content);
