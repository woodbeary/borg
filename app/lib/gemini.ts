import { GoogleGenerativeAI } from "@google/generative-ai";

interface ModerationResponse {
  approved: boolean;
  reason: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function moderateContent(term: string, definition: string) {
  console.log('Moderating content:', { term, definition });
  
  const prompt = `You are a content moderator for BORG (Black Out Rage Gallon) terms.
Review this submission:
Term: "${term}"
Definition: "${definition}"

Return ONLY a JSON object with this structure, nothing else:
{"approved": false, "reason": "why"} or {"approved": true, "reason": "why"}

Rules:
- Must be BORG-related
- No explicit content
- Must be informative`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log('Gemini response:', text);
    
    // Parse the response, if it fails return a default response
    try {
      const parsed = JSON.parse(text) as ModerationResponse;
      console.log('Parsed response:', parsed);
      return parsed;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        approved: false,
        reason: "Invalid response format from moderation"
      };
    }
  } catch (error) {
    console.error('Moderation error:', error);
    return {
      approved: false,
      reason: "Moderation service unavailable"
    };
  }
} 