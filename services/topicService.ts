
import { GoogleGenAI } from "@google/genai";

export const generateTopicSummary = async (topicId: number, topicTitle: string): Promise<string> => {
  // Always use process.env.API_KEY directly for initialization as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Actúa como un instructor senior de refrigeración industrial. 
    Genera un resumen técnico detallado para el Tema ${topicId}: "${topicTitle}".
    Este resumen es para alumnos que se preparan para el carnet de manipulador de gases fluorados en España.
    
    REQUISITOS DEL RESUMEN:
    1. Usa un lenguaje técnico preciso pero didáctico.
    2. Incluye los puntos clave de la normativa vigente (Reglamento UE 2024/573 y RD 115/2017).
    3. Estructura la respuesta con: 
       - Conceptos Fundamentales.
       - Componentes o Procesos Clave.
       - Consideraciones de Seguridad o Medio Ambiente.
       - "Tip de Examen" (lo que suelen preguntar).
    4. Usa formato Markdown con negritas y viñetas.
    5. Responde exclusivamente en ESPAÑOL.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    // Access the .text property directly
    return response.text || "No se pudo generar el resumen.";
  } catch (error: any) {
    console.error("Error generating summary:", error);
    throw new Error("Error al conectar con el experto en el tema.");
  }
};
