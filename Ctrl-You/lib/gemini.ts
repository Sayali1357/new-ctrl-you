import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function generateDetoxPlan(summary: string, timings: string) {
  const prompt = `
You are a CBT digital wellness expert.
Based on this conversation summary:

${summary}

And the user's preferred time window:
${timings}

Create a balanced timetable that includes:
- Study / work hours
- Limited gaming windows
- Exercise and mindfulness
- Screen-free breaks
- Healthy sleep routine

Format the output as JSON with "time" and "activity".
`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
