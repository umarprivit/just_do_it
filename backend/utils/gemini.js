import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateDecisionOptions = async ({ title, mood, context, prompt }) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const promptText = `
You are an AI that generates branching story options for a decision-based simulation.
Context: ${context}
Mood: ${mood}
${prompt ? `Current situation: ${prompt}` : ''}

Generate 3 different options for the user to choose from. Each option should:
1. Be a clear, actionable choice
2. Have a brief description of what happens next
3. Lead to different outcomes

Return a JSON array of options in this exact format (no markdown, no backticks):
[
  {
    "text": "The choice text",
    "outcomeText": "What happens next"
  }
]`;

    const result = await model.generateContent(promptText);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure it's valid JSON
    const cleanText = text
      .replace(/```json\n?/g, '') // Remove ```json
      .replace(/```\n?/g, '')     // Remove ```
      .replace(/`/g, '')          // Remove any remaining backticks
      .trim();                    // Remove extra whitespace

    // Parse the response and ensure it's an array of options
    const options = JSON.parse(cleanText);
    if (!Array.isArray(options) || options.length === 0) {
      throw new Error('Invalid response format from AI');
    }

    return options;
  } catch (error) {
    console.error('Error generating options:', error);
    // Return default options if AI fails
    return [
      {
        text: "Continue forward",
        outcomeText: "You decide to move forward with your journey."
      },
      {
        text: "Take a different path",
        outcomeText: "You choose to explore an alternative route."
      },
      {
        text: "Wait and observe",
        outcomeText: "You decide to take a moment to assess the situation."
      }
    ];
  }
};
