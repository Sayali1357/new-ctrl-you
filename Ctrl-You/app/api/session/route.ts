import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

// ✅ Create session
export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Missing sessionId" });
    }

    await db.collection("sessions").doc(sessionId).set({
      createdAt: new Date().toISOString(),
      status: "active",
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error creating session:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}

// ✅ Fetch session
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, error: "Missing id" });

    const doc = await db.collection("sessions").doc(id).get();

    if (!doc.exists)
      return NextResponse.json({ success: false, error: "Session not found" });

    return NextResponse.json({ success: true, session: doc.data() });
  } catch (err: any) {
    console.error("Fetch session error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
