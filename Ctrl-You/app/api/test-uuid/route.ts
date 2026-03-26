import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const sessionId = uuidv4();
  console.log("Generated Test ID:", sessionId);
  return NextResponse.json({ sessionId });
}
