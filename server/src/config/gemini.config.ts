import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env.config';

let geminiAi: GoogleGenerativeAI | null = null;

export const initializeGemini = (): GoogleGenerativeAI | null => {
  if (geminiAi) return geminiAi;

  if (!env.GEMINI_API_KEY) {
    console.warn('[Gemini Config] API Key pending. Gemini AI configuration ready.');
    return null;
  }

  try {
    geminiAi = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    console.log('[Gemini Config] Google Gemini API initialized.');
    return geminiAi;
  } catch (error) {
    console.warn('[Gemini Config] Initialization error:', error instanceof Error ? error.message : error);
    return null;
  }
};
