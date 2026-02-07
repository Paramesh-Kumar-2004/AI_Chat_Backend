import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiResponse = async (messages) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
    });

    const prompt = messages
        .map(m => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
        .join("\n");

    const result = await model.generateContent(prompt);

    return result.response.text();
};
