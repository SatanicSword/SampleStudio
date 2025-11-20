import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Vendor } from '../types';

// Singleton-ish pattern for the AI client
let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    // Using the environment variable as required
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const createVendorChatSession = (vendor: Vendor): Chat => {
  const client = getAiClient();
  
  const systemInstruction = `
    You are the Sirion AI Agent, a specialized assistant for Contract Lifecycle Management (CLM).
    You are currently assisting with the vendor: "${vendor.name}".
    
    Here is the specific context and contract data for this vendor:
    ---
    ${vendor.contextData}
    ---
    
    Your Role:
    1. Answer questions about the contract, renewal dates, values, and risks based strictly on the provided context.
    2. If asked to draft emails or letters, use a professional tone suitable for corporate legal/procurement communication.
    3. If asked about spend, refer to the context or general business logic if specific numbers aren't in the text (though you can assume the user sees the charts).
    4. Be concise, helpful, and formatted cleanly.
    5. Use Markdown for formatting lists, bold text, etc.
  `;

  return client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    }
  });
};

export const sendMessageStream = async (
  chat: Chat, 
  message: string
): Promise<AsyncGenerator<string, void, unknown>> => {
  const responseStream = await chat.sendMessageStream({ message });

  // Generator to yield text chunks
  async function* streamGenerator() {
    for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
            yield c.text;
        }
    }
  }

  return streamGenerator();
};