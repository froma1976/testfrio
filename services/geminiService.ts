
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT, MODEL_NAME } from "../constants";
import { AnalysisResult } from "../types";

export const analyzeTestImages = async (base64Images: string[]): Promise<AnalysisResult[]> => {
  // Use process.env.API_KEY as per instructions
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("No se ha configurado la clave de API (process.env.API_KEY).");
  }

  // Always create a new GoogleGenAI instance right before the call
  const ai = new GoogleGenAI({ apiKey });

  const imageParts = base64Images.map((img) => {
    const [header, data] = img.split(",");
    const mimeType = header.match(/:(.*?);/)?.[1] || "image/png";
    return {
      inlineData: {
        mimeType,
        data,
      },
    };
  });

  const textPart = {
    text: `Analiza estas ${base64Images.length} capturas de pantalla de un examen de gases fluorados. Extrae TODAS las preguntas presentes. Devuelve el resultado exclusivamente en formato JSON.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      // contents should be an object with parts array for multi-modal requests
      contents: { parts: [...imageParts, textPart] },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        // Enable thinking budget for complex technical reasoning tasks
        thinkingConfig: { thinkingBudget: 16384 },
        // Use responseSchema for high-quality JSON generation
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: 'The text of the exam question.',
              },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    text: { type: Type.STRING },
                  },
                  required: ["label", "text"],
                },
                description: 'The possible answers.',
              },
              correctOption: {
                type: Type.STRING,
                description: 'The label of the correct answer.',
              },
              justification: {
                type: Type.STRING,
                description: 'Detailed technical explanation.',
              },
              regulationReference: {
                type: Type.STRING,
                description: 'Reference to the law or manual.',
              },
            },
            required: ["question", "options", "correctOption", "justification", "regulationReference"],
          },
        },
      },
    });

    // Access .text property directly
    const resultText = response.text;
    if (!resultText) throw new Error("No se recibió respuesta del modelo.");

    return JSON.parse(resultText) as AnalysisResult[];
  } catch (error: any) {
    // Propagate error to be handled by the UI
    console.error("Gemini API Error:", error);
    throw error;
  }
};