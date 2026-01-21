import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, MODEL_NAME } from "../constants";
import { AnalysisResult } from "../types";

export const analyzeTestImages = async (base64Images: string[]): Promise<AnalysisResult[]> => {
  // Siempre crear una instancia nueva para capturar la clave actualizada del proceso
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imageParts = base64Images.map(img => ({
    inlineData: {
      mimeType: 'image/png',
      data: img.split(',')[1],
    },
  }));

  const textPart = {
    text: `Analiza estas ${base64Images.length} capturas de pantalla de un examen de gases fluorados. Extrae TODAS las preguntas presentes. Devuelve el resultado exclusivamente en formato JSON.`
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ parts: [...imageParts, textPart] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("El modelo no devolvió ninguna respuesta válida.");
    }

    const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as AnalysisResult[];
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Si la clave falla o el proyecto no tiene facturación, lanzamos un error específico
    if (error.message?.includes("Requested entity was not found") || error.message?.includes("API key")) {
      throw new Error("AUTH_ERROR");
    }
    
    throw new Error(error.message || "Error al analizar las imágenes.");
  }
};