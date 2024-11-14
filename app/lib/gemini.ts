import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

export async function moderateContent(term: string, definition: string) {
  const prompt = `
    Please analyze this BORG-related term and definition for appropriateness.
    Term: "${term}"
    Definition: "${definition}"
    
    Rules:
    1. Must be related to BORG (Black Out Rage Gallon) culture
    2. No explicit content or harmful suggestions
    3. Should maintain a fun but responsible tone
    4. No hate speech or discriminatory content
    
    Respond with only "APPROVE" or "REJECT" followed by a brief reason.
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const decision = text.split('\n')[0].trim();
  return {
    approved: decision === 'APPROVE',
    reason: text.split('\n').slice(1).join('\n').trim()
  };
} 