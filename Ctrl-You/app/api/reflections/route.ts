
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// ✅ GET reflections + streak
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("ctrlyou"); // change to your DB name
    const reflectionsCollection = db.collection("reflections");

    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get("firebaseUid");

    if (!firebaseUid) {
      return NextResponse.json({ success: false, message: "Missing firebaseUid" }, { status: 400 });
    }

    const reflections = await reflectionsCollection
      .find({ firebaseUid })
      .sort({ date: -1 })
      .toArray();

    // 🔥 Calculate streak
    let streak = 0;
    let currentDate = new Date().toISOString().split("T")[0];

    for (let i = 0; i < reflections.length; i++) {
      if (reflections[i].date === currentDate) {
        streak++;
        currentDate = new Date(new Date(currentDate).getTime() - 86400000)
          .toISOString()
          .split("T")[0];
      } else if (
        reflections[i].date ===
        new Date(new Date(currentDate).getTime() - 86400000).toISOString().split("T")[0]
      ) {
        streak++;
        currentDate = new Date(new Date(currentDate).getTime() - 86400000)
          .toISOString()
          .split("T")[0];
      } else {
        break;
      }
    }

    return NextResponse.json({ success: true, reflections, streak });
  } catch (error) {
    console.error("GET reflections error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ✅ POST reflection
export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("ctrlyou"); // change to your DB name
    const reflectionsCollection = db.collection("reflections");

    const { firebaseUid, habits, notes, mood, date } = await req.json();

    if (!firebaseUid || !date) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const reflection = {
      firebaseUid,
      habits: habits || [],
      notes: notes || "",
      mood: mood || "",
      date,
    };

    await reflectionsCollection.insertOne(reflection);

    return NextResponse.json({ success: true, reflection });
  } catch (error) {
    console.error("POST reflection error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
