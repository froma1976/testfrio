import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, MODEL_NAME } from "../constants";
import { AnalysisResult } from "../types";

export const analyzeTestImages = async (base64Images: string[]): Promise<AnalysisResult[]> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key no encontrada. Por favor, asegúrate de que la clave de API esté configurada correctamente como variable de entorno.");
  }

  // Create a new instance right before the call to pick up environment changes
  const ai = new GoogleGenAI({ apiKey });
  
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
      throw new Error("El modelo no devolvió ninguna respuesta.");
    }

    // Limpieza de posibles artefactos de markdown
    const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as AnalysisResult[];
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key")) {
      throw new Error("Error de Autenticación: La clave de API no es válida o el proyecto no tiene habilitada la facturación para este modelo.");
    }
    throw new Error(error.message || "Error técnico al procesar las imágenes.");
  }
};