import { GoogleGenAI } from "@google/genai";

// This will be undefined in a browser environment like GitHub Pages unless injected by a build tool.
const API_KEY = process.env.API_KEY;

// Initialize ai, but it could be null if API_KEY is missing. This prevents the app from crashing on load.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const encoded = (reader.result as string).split(',')[1];
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Checks if the GoogleGenAI instance was initialized.
 * Throws an error if the API key is missing.
 */
const ensureAiInitialized = () => {
    if (!ai) {
        throw new Error("API Key is not configured. AI features are unavailable. Please ensure your environment variables are set correctly for your deployment.");
    }
}

export const summarizeText = async (text: string): Promise<string> => {
  ensureAiInitialized();
  if (!text) {
    throw new Error("Input text cannot be empty.");
  }

  try {
    // The '!' non-null assertion is safe here because ensureAiInitialized would have thrown an error if ai was null.
    const response = await ai!.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize the following text concisely. Focus on the main points and key information. Provide the summary as a few clear paragraphs or bullet points if appropriate. Text to summarize:\n\n---\n\n${text}`,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
         throw new Error("The API key is invalid. Please check your configuration.");
    }
    throw new Error("Failed to generate summary. The AI service may be busy or unavailable.");
  }
};

export const transcribeAudio = async (audioFile: File): Promise<string> => {
  ensureAiInitialized();
  if (!audioFile) {
    throw new Error("Audio file is required.");
  }

  try {
    const base64Audio = await fileToBase64(audioFile);

    const audioPart = {
      inlineData: {
        mimeType: audioFile.type,
        data: base64Audio,
      },
    };

    const textPart = {
      text: "Transcribe this audio.",
    };

    const response = await ai!.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [audioPart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for transcription:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
      throw new Error("The API key is invalid. Please check your configuration.");
    }
    throw new Error("Failed to transcribe audio. The AI service may be busy or unavailable.");
  }
};

export const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
  ensureAiInitialized();
  if (!text) {
    throw new Error("Input text cannot be empty.");
  }

  try {
    const response = await ai!.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate the following text from ${sourceLang} to ${targetLang}:\n\n---\n\n${text}`,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for translation:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
         throw new Error("The API key is invalid. Please check your configuration.");
    }
    throw new Error("Failed to translate text. The AI service may be busy or unavailable.");
  }
};
