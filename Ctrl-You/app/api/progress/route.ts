import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body: { uid: string; total_score: number; journalText: string; responses?: Record<string, string> } = await req.json();
    const { uid, total_score, journalText, responses } = body;

    if (!uid || typeof uid !== "string" || total_score === undefined || !journalText) {
      return NextResponse.json({ success: false, error: "Missing or invalid required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ctrlyou");
    const collection = db.collection("progress");

    const newEntry = {
      uid,
      total_score,
      journalText,
      responses: responses || {},
      createdAt: new Date(),
    };

    await collection.insertOne(newEntry);

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (error) {
    console.error("❌ Error saving progress:", error);
    return NextResponse.json({ success: false, error: "Failed to save progress" }, { status: 500 });
  }
}
