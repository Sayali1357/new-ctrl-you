import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { v4 as uuidv4 } from "uuid"; // ✅ for unique session IDs

/**
 * POST /api/counseling
 * Generate AI counseling feedback and digital detox plan
 */
export async function POST(request) {
  try {
    const { userid, transcript, duration } = await request.json();

    if (!userid || !transcript || !Array.isArray(transcript)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid fields: userid or transcript" },
        { status: 400 }
      );
    }
    if (!doc.exists) {
  // auto-create an empty session
  const newSession = {
    sessionId,
    transcript: [],
    createdAt: new Date().toISOString(),
  };
  await docRef.set(newSession);
  return NextResponse.json({ success: true, session: newSession });
}


    // ✅ Generate a unique session ID
    const sessionId = uuidv4();

    // Format transcript into readable text
    const formattedTranscript = transcript
      .map((s) => `- ${s.role}: ${s.content}`)
      .join("\n");

    // ✅ Generate AI counseling feedback using Gemini
    const { text: feedbackText } = await generateText({
  model: google("gemini-2.0-flash-001", {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY, // ✅ key loaded from .env.local
  }),
  messages: [
    {
      role: "user",
      content: `
You are an empathetic AI counselor specialized in digital wellness and gaming addiction.
The user just had a counseling session with you.

Transcript:
${formattedTranscript}

Please generate structured counseling feedback using CBT techniques:
1. Emotional Triggers (why the user plays)
2. Behavioral Patterns (how and when they play)
3. Coping Strategies (CBT-based methods)
4. Motivational Feedback (praise & encouragement)
5. Personalized Digital Detox Plan (daily timetable)
6. Overall Session Summary

Use a compassionate, motivational therapist tone. Format clearly in markdown sections.
      `,
    },
  ],
});

console.log("🔑 GEMINI_API_KEY loaded:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);

    // ✅ Store session in Firestore
    const sessionData = {
      sessionId,
      userId: userid,
      transcript,
      feedback: feedbackText,
      duration: duration || "30 minutes",
      createdAt: new Date().toISOString(),
    };

    await db.collection("counselingSessions").doc(sessionId).set(sessionData);
    try {
  await db.collection("counselingSessions").doc(sessionId).set(sessionData);
  console.log("✅ Session saved to Firestore:", sessionId);
} catch (saveError) {
  console.error("❌ Firestore save failed:", saveError);
}

    return NextResponse.json(
      { success: true, sessionId, feedback: feedbackText },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error generating counseling feedback:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/counseling
 * Test endpoint
 */


export async function GET(req) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing session ID" },
        { status: 400 }
      );
    }

    const snapshot = await db
      .collection("counselingSessions")
      .where("sessionId", "==", sessionId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    return NextResponse.json(
      { success: true, session: doc.data() },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/counseling error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
