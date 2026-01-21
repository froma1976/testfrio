
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, MODEL_NAME } from "../constants";
import { AnalysisResult } from "../types";

export const analyzeTestImages = async (
  base64Images: string[]
): Promise<AnalysisResult[]> => {

  // Always use process.env.API_KEY directly for initialization as per guidelines.
  // We create a new instance right before the call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imageParts = base64Images.map((img) => ({
    inlineData: {
      mimeType: "image/png",
      data: img.split(",")[1],
    },
  }));

  const textPart = {
    text: `Analiza estas ${base64Images.length} capturas de pantalla de un examen de gases fluorados. 
Extrae TODAS las preguntas presentes. 
Devuelve el resultado exclusivamente en formato JSON.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [...imageParts, textPart],
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    // Directly access .text property as per guidelines
    const resultText = response.text;

    if (!resultText) {
      throw new Error("Gemini no devolvió contenido.");
    }

    // Cleaning potential markdown blocks to extract valid JSON
    const cleanJson = resultText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJson) as AnalysisResult[];

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error?.message || "Error analizando las imágenes.");
  }
};
