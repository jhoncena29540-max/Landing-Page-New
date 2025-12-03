import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// NOTE: Ideally, the API key should be in process.env.API_KEY.
// For this environment, we assume process.env.API_KEY contains the key provided by the user: AIzaSyCRpuWhZsJgGga98M8YTDexxyO0E3mfjTo
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLandingPageHtml = async (prompt: string): Promise<string> => {
  try {
    const systemInstruction = `
      You are an expert Frontend Engineer and UI/UX Designer.
      Your task is to generate a COMPLETE, RESPONSIVE, SINGLE-SECTION HTML landing page based on the user's prompt.
      
      STYLING RULES:
      - Use ONLY Tailwind CSS classes for styling.
      - Do NOT use custom CSS or <style> tags.
      - Ensure the design is mobile-responsive (use md:, lg: prefixes).
      - Use professional color schemes.
      
      CONTENT RULES:
      - Include a Header/Nav (simple), Hero Section, Features Grid, Testimonials (optional), and a CTA Footer.
      - Use "https://picsum.photos/800/600" for large images and "https://picsum.photos/200/200" for small ones/avatars.
      - The output must be valid HTML that can be injected into a <div>.
      - Do NOT include <html>, <head>, or <body> tags. Just the sections.
      
      OUTPUT FORMAT:
      - Return ONLY the raw HTML string. Do not wrap in markdown code blocks (e.g., \`\`\`html).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a professional landing page for: ${prompt}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    let html = response.text || "";
    
    // Cleanup if model returns markdown
    html = html.replace(/```html/g, '').replace(/```/g, '');
    
    return html;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate landing page. Please try again.");
  }
};