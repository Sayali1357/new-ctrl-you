import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

function normalizeWellness(w: any) {
  return {
    date: w.date,
    sleep: Number(w.sleep) || 0,
    study: Number(w.study) || 0,
    exercise: Number(w.exercise) || 0,
    gaming: Number(w.gaming) || 0,
    challenge: w.challenge || "",
  };
}

// ------------------- GET -------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "UID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ctrlyou");
    const user = await db.collection("wellness").findOne({ uid });

    if (!user || !user.wellness) {
      return NextResponse.json(
        { success: false, message: "No wellness data found" },
        { status: 404 }
      );
    }

    let wellnessArray = Array.isArray(user.wellness)
      ? user.wellness
      : [user.wellness];

    // Normalize numbers
    wellnessArray = wellnessArray.map(normalizeWellness);

    const last7Days = wellnessArray
      .sort((a: any, b: any) => b.date.localeCompare(a.date)) // newest → oldest
      .slice(0, 7)
      .reverse(); // oldest → newest

    return NextResponse.json({ success: true, data: last7Days });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// ------------------- POST -------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, wellness } = body;

    if (!uid || !wellness || !wellness.date) {
      return NextResponse.json(
        { success: false, message: "UID and wellness data with date are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ctrlyou");

    const normalizedWellness = normalizeWellness(wellness);

    const user = await db.collection("wellness").findOne({ uid });

    if (!user) {
      // New user
      await db.collection("wellness").insertOne({ uid, wellness: [normalizedWellness] });
    } else {
      let wellnessArray = Array.isArray(user.wellness)
        ? user.wellness
        : user.wellness
        ? [user.wellness]
        : [];

      // Normalize everything already stored
      wellnessArray = wellnessArray.map(normalizeWellness);

      const exists = wellnessArray.find((w: any) => w.date === normalizedWellness.date);

      if (exists) {
        // Update today's entry
        await db.collection("wellness").updateOne(
          { uid, "wellness.date": normalizedWellness.date },
          { $set: { "wellness.$": normalizedWellness } }
        );
      } else {
        // Add new
        wellnessArray.push(normalizedWellness);
        wellnessArray = wellnessArray
          .sort((a: any, b: any) => b.date.localeCompare(a.date))
          .slice(0, 7);

        await db.collection("wellness").updateOne(
          { uid },
          { $set: { wellness: wellnessArray } }
        );
      }
    }

    return NextResponse.json({ success: true, message: "Wellness saved successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
