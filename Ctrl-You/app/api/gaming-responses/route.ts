// app/api/progress/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    if (!uid) return NextResponse.json({ success: false, error: "Missing UID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("ctrlyou");
    const collection = db.collection("questionaire");

    // Fetch only total_score and created_at
    const scores = await collection
      .find(
        { uid }, 
        { projection: { total_score: 1, created_at: 1 } }
      )
      .sort({ created_at: 1 })
      .toArray();

    // Map to match frontend keys
    const mappedScores = scores.map(entry => ({
      _id: entry._id.toString(),
      total_score: entry.total_score,
      createdAt: entry.created_at
    }));

    return NextResponse.json({ success: true, scores: mappedScores });
  } catch (err) {
    console.error("Error fetching scores:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch scores" }, { status: 500 });
  }
}
