import { GoogleGenAI } from "@google/genai";
import { Term } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const explainTerm = async (term: Term): Promise<string> => {
  const ai = getClient();
  
  const prompt = `
    You are an expert technical interpreter and engineer specializing in Japanese manufacturing (Toyota production system, Resin molding, Die design).
    
    Please provide a detailed explanation for the following technical term:
    
    Term (Japanese): ${term.term}
    Reading: ${term.reading}
    English: ${term.english}
    Categories: ${term.categories.join(', ')}
    Current Basic Meaning: ${term.meaning}
    
    Your explanation should include:
    1. A deeper technical breakdown of what it is.
    2. Example usage in a factory or design context.
    3. If applicable, related terms or antonyms.
    
    Format the output in clear Markdown using bullet points where necessary. Keep the tone professional and educational.
    If the term is related to "Toyota Terms", emphasize its role in TPS (Toyota Production System).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 } // Use a small thinking budget for better reasoning
      }
    });
    
    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate explanation. Please check your API key.");
  }
};