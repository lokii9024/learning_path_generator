import { OpenAI } from "openai";
import dotenv from "dotenv"

dotenv.config()

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.GROQ_API_BASE_URL
});

export default openaiClient;

