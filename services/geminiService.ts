import { GoogleGenAI, Type } from "@google/genai";
import { OpportunityType, Category, UserProfile } from '../types';

// Ensure API Key exists
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface InterpretedQuery {
  sql: string;
  filters: {
    type?: OpportunityType;
    category?: Category;
    is_remote?: boolean;
    minStipend?: number;
    anyKeyword?: string;
  };
  explanation: string;
}

export const interpretUserQuery = async (userPrompt: string): Promise<InterpretedQuery> => {
  if (!apiKey) {
     console.warn("No API Key found. Returning mock response.");
     return {
       sql: "SELECT * FROM opportunities WHERE description LIKE '%" + userPrompt + "%'",
       filters: { anyKeyword: userPrompt },
       explanation: "Simulating AI response due to missing API key."
     };
  }

  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are an intelligent SQL query generator for a database of youth opportunities.
    The table name is 'opportunities'.
    
    Columns:
    - id (number)
    - title (string)
    - type (Enum: 'Scholarship', 'Internship', 'Workshop', 'Mentorship', 'Entry Level Job')
    - category (Enum: 'Technology', 'Arts & Design', 'Skilled Trades', 'Academic', 'Community Service')
    - is_remote (boolean)
    - stipend_amount (number)
    - location (string)
    
    Your goal is to translate natural language requests into a JSON object containing:
    1. A valid SQL string representation (e.g. "SELECT * FROM opportunities WHERE...")
    2. A structured filter object corresponding to the SQL logic.
    3. A brief, encouraging explanation for the user.

    If the user asks for something vague like "cool stuff", broaden the search.
    If they mention "paid", set minStipend to 1.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sql: { type: Type.STRING },
            explanation: { type: Type.STRING },
            filters: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: Object.values(OpportunityType), nullable: true },
                category: { type: Type.STRING, enum: Object.values(Category), nullable: true },
                is_remote: { type: Type.BOOLEAN, nullable: true },
                minStipend: { type: Type.NUMBER, nullable: true },
                anyKeyword: { type: Type.STRING, nullable: true }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as InterpretedQuery;

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      sql: `SELECT * FROM opportunities WHERE description LIKE '%${userPrompt}%'`,
      filters: { anyKeyword: userPrompt },
      explanation: "I had a bit of trouble connecting to the AI brain, but I've searched for keywords matching your request!"
    };
  }
};

// New Function: Parse Resume Text
export const parseResumeText = async (resumeText: string): Promise<Partial<UserProfile>> => {
  if (!apiKey) throw new Error("API Key required for resume parsing");

  const model = "gemini-3-flash-preview";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Extract structured profile data from this resume text: ${resumeText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bio: { type: Type.STRING, description: "A short professional summary (max 30 words) based on the resume." },
            skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of technical or soft skills found." },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Resume parsing failed", e);
    throw e;
  }
};
