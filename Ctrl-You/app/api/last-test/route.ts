import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  if (!uid) return NextResponse.json({ error: "Missing UID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("ctrlyou");
  const record = await db.collection("gaming_responses").findOne({ uid }, { sort: { created_at: -1 } });

  if (!record) return NextResponse.json({ lastTestDate: null });
  return NextResponse.json({ lastTestDate: record.created_at });
}
