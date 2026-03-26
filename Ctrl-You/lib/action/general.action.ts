"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { z } from "zod";

/* ---------------------------- SCHEMA DEFINITION ---------------------------- */
// Define how Gemini should return structured counseling feedback
export  const counselorFeedbackSchema = z.object({
  emotionalTriggers: z.string().describe("Identified emotional triggers related to gaming"),
  behavioralPatterns: z.string().describe("Detected gaming habits and behavior loops"),
  copingStrategies: z.string().describe("Suggested CBT-based coping methods for user"),
  motivationalFeedback: z.string().describe("Positive reinforcement and encouragement"),
  personalizedPlan: z.string().describe("Summary and personalized digital detox plan"),
  totalSessionSummary: z.string().describe("Concise summary of entire counseling session"),
});

/* ---------------------------- CREATE FEEDBACK ---------------------------- */
export async function createCounselorFeedback(params: {
  sessionId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}) {
  const { sessionId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map((sentence) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: counselorFeedbackSchema,
      prompt: `
        You are a compassionate AI counselor specializing in **digital wellness and gaming addiction**.
        Use **CBT (Cognitive Behavioral Therapy)** techniques to understand the user's emotional and behavioral triggers.

        Reflective listening: Rephrase their concerns empathetically.
        Open-ended questions: Encourage self-awareness.
        Positive reinforcement: Praise awareness and efforts.
        Avoid judgmental tone.
        Summarize at the end for a digital detox plan.

        Transcript:
        ${formattedTranscript}

        Analyze this conversation deeply and provide structured insights as per the schema.
      `,
      system:
        "You are a licensed digital wellness therapist. You generate structured feedback and a personalized plan from CBT-style conversation transcripts.",
    });

    const feedback = {
      sessionId,
      userId,
      ...object,
      createdAt: new Date().toISOString(),
    };

    const feedbackRef = feedbackId
      ? db.collection("counselorFeedback").doc(feedbackId)
      : db.collection("counselorFeedback").doc();

    await feedbackRef.set(feedback);
    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving counselor feedback:", error);
    return { success: false, error: "Failed to save counselor feedback" };
  }
}

/* ---------------------------- FETCH SESSION DATA ---------------------------- */

export async function getCounselingSessionById(sessionId: string) {
  try {
    const docRef = db.collection("counselingSessions").doc(sessionId);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("❌ Error fetching counseling session:", error);
    return null;
  }
}
export async function getFeedbackBySessionId(params: {
  sessionId: string;
  userId: string;
}) {
  const { sessionId, userId } = params;

  const snapshot = await db
    .collection("counselorFeedback")
    .where("sessionId", "==", sessionId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function getAllUserSessions(userId: string, limit = 20) {
  const sessions = await db
    .collection("counselingSessions")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return sessions.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
