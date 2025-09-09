
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnomalyResponse, RiskLabel } from '../types';

// IMPORTANT: Replace with your actual API key, ideally from environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const detectAnomaly = async (studentData: {
  attendance: number[];
  scores: number[];
  fees_due_in_last_3_months: number;
}): Promise<GeminiAnomalyResponse> => {
  if (!API_KEY) {
      return { is_anomaly: false, reason: "API key not configured." };
  }
  
  const prompt = `
    You are an expert student counselor AI. Analyze this student's data for the last 3 data points and determine if there are any anomalous patterns that suggest a sudden negative change in behavior.
    - Attendance is percentage (higher is better).
    - Scores are out of 100 (higher is better).
    - Fees due is a count (lower is better).
    A significant, unexpected drop in performance is an anomaly. A consistent low performance is not an anomaly, but a risk factor.
    Respond ONLY with the specified JSON object.
    Data: ${JSON.stringify(studentData)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_anomaly: {
              type: Type.BOOLEAN,
              description: "True if a significant negative anomaly is detected, otherwise false."
            },
            reason: {
              type: Type.STRING,
              description: "A brief, non-technical explanation if an anomaly is found (e.g., 'Sudden drop in test scores')."
            }
          },
          required: ["is_anomaly", "reason"]
        }
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as GeminiAnomalyResponse;
  } catch (error) {
    console.error("Gemini API call failed for anomaly detection:", error);
    // Fallback in case of API error
    return { is_anomaly: false, reason: "AI analysis failed." };
  }
};


export const generateCounselingMessage = async (riskScore: number, riskLabel: RiskLabel, riskFactors: string[]): Promise<string> => {
    if (!API_KEY) {
        return "AI message generation is disabled. Please configure your API key.";
    }

    const prompt = `
    You are an expert student counselor AI. A student is flagged as '${riskLabel}' with a risk score of ${riskScore}.
    The main contributing factors are: ${riskFactors.join(', ')}.
    Generate a concise, empathetic, and actionable message (under 75 words) for their guardian or mentor.
    The tone should be appropriate for the risk level. For 'On Track', be encouraging. For 'Critical', be concerned but supportive.
    Start the message with a suggestion for a good opening line, like 'A good way to start this conversation could be...'.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed for message generation:", error);
        return "Could not generate an AI message at this time. Please check the student's risk factors and compose a message manually.";
    }
};
