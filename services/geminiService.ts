
import { GoogleGenAI, Type } from "@google/genai";

declare var process: any;

/**
 * Robust retry wrapper for Gemini API calls to handle transient 500/Rpc errors.
 */
async function callGeminiWithRetry<T>(fn: () => Promise<T>, retries = 5, baseDelay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const errorMessage = typeof err === 'string' ? err : err?.message || JSON.stringify(err) || "";
      
      const isRetryable = 
        errorMessage.includes("500") || 
        errorMessage.includes("Rpc failed") || 
        errorMessage.includes("429") ||
        errorMessage.includes("Internal error");

      if (!isRetryable || i === retries - 1) break;
      
      const delay = (baseDelay * Math.pow(2, i)) + (Math.random() * 500);
      console.warn(`Neural Link Attempt ${i + 1} failed. Re-establishing...`, errorMessage);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export const analyzeCropImage = async (base64Image: string) => {
  return callGeminiWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Analyze this crop image for health, pests, and nutrient deficiencies. Provide a professional diagnosis and sustainable recommendations in JSON format." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            sustainabilityImpact: { type: Type.STRING }
          },
          required: ["diagnosis", "confidence", "recommendations", "sustainabilityImpact"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const analyzeSoilImage = async (base64Image: string) => {
  return callGeminiWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Analyze this soil sample. Identify soil type and nutrient markers. Provide professional management advice in JSON format." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            sustainabilityImpact: { type: Type.STRING }
          },
          required: ["diagnosis", "confidence", "recommendations", "sustainabilityImpact"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const getStrategicReport = async (dataContext: string) => {
  return callGeminiWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a fact-checked strategic report for stakeholders. Context: ${dataContext}. Use Google Search to cross-reference with 2025 agricultural trends.`,
      config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return response.text || "";
  });
};

export const getClimateVerification = async (lat: number, lng: number) => {
  return callGeminiWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Provide an accurate climate outlook for Lat ${lat}, Lng ${lng} using real-time search data.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "";
  });
};

export const analyzeSystemSecurity = async (logs: any[]) => {
  return callGeminiWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze audit logs for threats: ${JSON.stringify(logs)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threatLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["threatLevel", "summary", "confidence", "riskFactors"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  });
};
