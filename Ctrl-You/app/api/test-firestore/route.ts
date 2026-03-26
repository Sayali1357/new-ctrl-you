import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function GET() {
  try {
    const docRef = await db.collection("testCollection").add({
      message: "Hello Firestore!",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, id: docRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Firestore Test Error:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
