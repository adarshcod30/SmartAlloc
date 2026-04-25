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
    
    let textReply = reply;
    
    // Check if the response is JSON (which happens when the Gemini API fails and hits our local fallback engine)
    try {
      const parsed = JSON.parse(reply);
      if (parsed.summary && parsed.reallocation_plan) {
        let planText = "[SYSTEM ALERT: The Google Gemini API is currently unavailable or the API key is missing. Re-routing to the offline Local Fallback Engine.]\n\n";
        planText += "Plan:\nWe recommend a dynamic reallocation strategy.\n\n";
        planText += "Reasoning:\n" + parsed.summary + "\n\n";
        planText += "Proposed Actions:\n";
        parsed.reallocation_plan.forEach((a: any) => {
          planText += `• ${a.action_type.toUpperCase()} for ${a.target_id} (Risk mitigation priority: ${a.priority})\n`;
        });
        textReply = planText;
      }
    } catch {
      // It's standard text from Gemini, leave it alone.
      textReply = textReply.replace(/\*/g, '').replace(/#/g, '');
    }

    return NextResponse.json({ reply: textReply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
