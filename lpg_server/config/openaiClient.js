import { OpenAI } from "openai";

const openaiClient = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: process.env.GROQ_API_BASE_URL,
});

export default openaiClient;

