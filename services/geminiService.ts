import { GoogleGenAI, Modality, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to get client with user-selected key (required for Pro Image model)
const getAuthenticatedAI = async (): Promise<GoogleGenAI> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (hasKey) {
       // When a user selects a key, it is injected into process.env.API_KEY automatically
       // But we should create a new instance to be safe
       return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }
  return ai;
};

// 1. Analyze Room Image (Gemini 3 Pro)
export const analyzeRoomImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt || "Analyze this interior design. Describe the style, color palette, and key furniture pieces." }
        ]
      }
    });
    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

// 2. Edit Room Image (Gemini 2.5 Flash Image)
export const editRoomImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG for edit flows usually
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Edit Error:", error);
    throw error;
  }
};

// 3. Generate Design (Gemini 3 Pro Image)
export const generateDesignImage = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string> => {
  try {
    // Ensure we use the authenticated client for Pro Image model
    const authAi = await getAuthenticatedAI();
    
    const response = await authAi.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "4:3"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Generation Error:", error);
    throw error;
  }
};

// 4. Agent Chat (Gemini 3 Pro)
export const chatWithAgent = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "You are 'Buddy', a helpful, knowledgeable, and polite interior design assistant for Gruha Alankara. You help users with design advice, furniture booking, and style recommendations. Be concise and friendly.",
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm having trouble understanding that.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

// 5. Text to Speech (Gemini 2.5 Flash TTS)
export const generateSpeech = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, calm voice suitable for luxury design
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("No audio generated");
    return audioData;
  } catch (error) {
    console.error("TTS Error:", error);
    return "";
  }
};

// Helper for Key Selection
export const checkAndRequestApiKey = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
     const hasKey = await win.aistudio.hasSelectedApiKey();
     if (!hasKey) {
       await win.aistudio.openSelectKey();
       return await win.aistudio.hasSelectedApiKey();
     }
     return true;
  }
  return true; // Fallback if not running in the specific environment
};
