import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || ''
);

const SYSTEM_PROMPT = `You are an empathetic AI counselor specialized in digital wellness and gaming addiction.
Use Cognitive Behavioral Therapy (CBT) techniques such as:
- Reflective listening (e.g., "It sounds like you feel anxious when you stop playing.")
- Open-ended questions (e.g., "What usually triggers your urge to play?")
- Avoiding judgmental language
- Providing positive reinforcement
- Gentle pacing and encouragement

Your goal is to help gamers understand their emotional triggers for gaming, guide them toward healthy digital habits, and offer supportive, warm conversation. Keep responses concise (2-4 sentences max) and conversational.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-001',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build chat history (all but the last message)
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });

    // Send the latest user message
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return NextResponse.json({ role: 'assistant', content: text });
  } catch (error: any) {
    console.error('❌ Chat API error:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
