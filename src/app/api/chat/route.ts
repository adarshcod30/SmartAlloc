import { NextResponse } from 'next/server';
import { callGeminiText } from '@/services/gemini';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const prompt = `You are the SmartAlloc AI Assistant, an intelligent co-pilot strictly focused on Finance, Budgeting, and Resource Allocation. 
The user is a Financial/Engineering leader. 

Instructions:
1. Only answer questions related to finance, budget, resource allocation, cloud costs, and operational efficiency. If the user asks about unrelated topics, politely pivot back to your area of expertise.
2. Directly answer whatever the user asks in a conversational, professional tone.
3. CRITICAL: DO NOT use any markdown formatting. Never use asterisks (*) for bolding or italics. Never use hashes (#). Never use special characters. Use plain, readable text with natural paragraph breaks.
4. If they specifically ask for an allocation plan, provide it clearly in plain text paragraphs.

User question: "${message}"`;

    const reply = await callGeminiText(prompt);
    
    // Ensure no markdown asterisks leak out just in case
    const textReply = reply.replace(/\*/g, '').replace(/#/g, '');

    return NextResponse.json({ reply: textReply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
