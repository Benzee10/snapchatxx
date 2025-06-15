
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL, AI_TIP_PROMPT } from '../constants';

const getApiKey = (): string => {
  // In a browser environment, process might not be defined or process.env might not be populated
  // by a build tool like Vite or Webpack without explicit configuration.
  // Fallback or explicit provision is necessary.
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // Attempt to get from window if set by index.tsx for demo purposes
  if ((window as any).process && (window as any).process.env && (window as any).process.env.API_KEY) {
    return (window as any).process.env.API_KEY;
  }
  // Critical: If no API key, functionality will fail.
  // Alerting for demo purposes. In a real app, this should be handled gracefully.
  console.error("API_KEY is not defined. Please set process.env.API_KEY or window.process.env.API_KEY.");
  // Return a placeholder or throw error - for this demo, returning a string that will likely cause API failure,
  // prompting the user to check their setup.
  return "API_KEY_NOT_SET"; 
};


const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateAITip = async (): Promise<string> => {
  if (getApiKey() === "API_KEY_NOT_SET" || getApiKey() === "YOUR_GEMINI_API_KEY_HERE_OR_SET_VIA_ENV_VAR") {
    return "Could not generate tip: API Key not configured. Please set your Gemini API Key in index.tsx or as an environment variable.";
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: AI_TIP_PROMPT,
         config: {
            // For creative/suggestive text like tips, a bit of temperature can be good.
            temperature: 0.7, 
            topK: 40,
            topP: 0.95,
            // thinkingConfig: { thinkingBudget: 0 } // For quick, low-latency. Omit for higher quality default.
        }
    });
    
    // The .text property directly provides the string output.
    const tipText = response.text;
    
    if (!tipText) {
        throw new Error("Received an empty response from Gemini API.");
    }
    return tipText.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Gemini API Error: API key not valid. Please check your API key.");
    }
    throw new Error(`Failed to generate AI tip. ${error instanceof Error ? error.message : String(error)}`);
  }
};
