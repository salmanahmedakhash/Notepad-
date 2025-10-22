
import { GoogleGenAI } from "@google/genai";

export async function summarizeText(text: string): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following text for a notepad application. Provide a concise summary, capturing the key points in a few sentences or bullet points. The original text is:\n\n---\n\n${text}`,
        config: {
          temperature: 0.3,
          topP: 0.9,
          topK: 20,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error summarizing text with Gemini API:", error);
    if (error instanceof Error) {
        return `Failed to generate summary: ${error.message}`;
    }
    return "An unknown error occurred while generating the summary.";
  }
}
