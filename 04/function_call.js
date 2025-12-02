import { GoogleGenAI, Type } from "@google/genai";
import { input } from "@inquirer/prompts";
import ora from "ora";

const spinner = ora("思考中..");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function getWeather(city, unit) {
  return { city, degree: Math.random() * 30 };
}

async function getYouBike(address) {
  const YOUBIKE_API =
    "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";
  const resp = await fetch(YOUBIKE_API);
  const sites = await resp.json();

  const allSites = sites.filter((s) => {
    return s.ar.includes(address);
  });

  return { sites: allSites };
}

function handleFunctionCall(functionCall) {
  const { name, args } = functionCall;

  switch (name) {
    case "get_weather":
      return getWeather(args.city, args.unit);
    case "get_youbike":
      return getYouBike(args.address);
    default:
      return { error: "未知的函式" };
  }
}

const getWeatherDeclaration = {
  name: "get_weather",
  description: "查詢指定城市的天氣資訊",
  parameters: {
    type: Type.OBJECT,
    properties: {
      city: {
        type: Type.STRING,
        description: "城市名稱，例如：台北、⾼雄、東京",
      },
      unit: {
        type: Type.STRING,
        enum: ["celsius", "fahrenheit"],
        description: "溫度單位",
      },
    },
    required: ["city"],
  },
};

const getYouBikeData = {
  name: "get_youbike",
  description: "查詢 Youbike 資訊",
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: {
        type: Type.STRING,
        description: "地址或路名，例如：中正路",
      },
    },
    required: ["address"],
  },
};

const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  config: {
    systemInstruction: "你是一位熱情的歐巴桑",
    tools: [
      {
        functionDeclarations: [getWeatherDeclaration, getYouBikeData],
      },
    ],
  },
});

let question = await input({ message: "->" });
while (question.trim() != "") {
  if (question.trim() == "exit") {
    console.log("Bye~~");
  }

  spinner.start();
  const response = await chat.sendMessage({
    message: question,
  });
  spinner.stop();

  if (response.functionCalls?.length > 0) {
    const fc_responses = response.functionCalls.map((fc) => {
      return {
        name: fc.name,
        response: handleFunctionCall(fc),
      };
    });

    // 將函式結果送回給 AI
    const finql_responses = await chat.sendMessage({
      message: fc_responses.map((fr) => ({
        functionResponse: {
          name: fr.name,
          response: fr.response,
        },
      })),
    });

    console.log(finql_responses.text);
  } else {
    console.log(response.text);
  }

  question = await input({ message: "->" });
}
