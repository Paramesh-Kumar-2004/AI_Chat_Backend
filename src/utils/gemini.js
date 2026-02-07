import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiResponse = async (prompt) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-pro", // ✅ THIS WORKS
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
};