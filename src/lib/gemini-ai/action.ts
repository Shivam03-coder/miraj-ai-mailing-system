"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI with the provided API Key
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Define the generation config for Gemini AI
const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1024,
  responseMimeType: "text/plain",
};

export async function handlePromptWithContext(
  prompt: string,
  context?: string,
): Promise<string> {
  if (!prompt) {
    throw new Error("Prompt and context are required.");
  }

  try {
    // Combine the context and prompt to create a more detailed message for Gemini
    const fullPrompt = `${context}\n\nUser's question: ${prompt}`;

    // Start the chat session with Gemini
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the combined prompt to Gemini
    const result = await chatSession.sendMessage(fullPrompt);

    // Return the generated response from Gemini
    return result.response.text();
  } catch (error) {
    console.error("Error handling prompt with context:", error);
    throw new Error("An error occurred while processing your request.");
  }
}
