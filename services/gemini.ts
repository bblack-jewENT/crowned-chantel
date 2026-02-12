
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getPageantAdvice = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: "You are the personal pageant assistant for Chantel, a world-class pageant queen and model. Your name is 'The Crown Guide'. You help users with pageant walk tips, interview preparation, outfit selection, and general modeling advice based on Chantel's professional standards. Be elegant, encouraging, and highly professional. Keep responses concise but impactful.",
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently adjusting my crown. Please try asking again in a moment, darling.";
  }
};
