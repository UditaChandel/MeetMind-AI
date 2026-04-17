import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({

    model: "models/gemini-2.5-flash-lite",
});