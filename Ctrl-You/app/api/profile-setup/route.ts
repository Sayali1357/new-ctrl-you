import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// POST → Save or update profile
export async function POST(req: Request) {
  try {
    const { uid, profile } = await req.json();

    if (!uid || !profile) {
      return NextResponse.json(
        { success: false, message: "UID and profile are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ctrlyou");

    // Include UID in profile data
    const profileData = {
      uid,
      name: profile.name || "",
      username: profile.username || "",
      email: profile.email || "",
      age: profile.age || "",
      location: profile.location || "",
      bio: profile.bio || "",
      avatar: profile.avatar || "",
      counselor: profile.counselor || "",
      updatedAt: new Date(),
    };

    // Upsert and return the saved document
    const result = await db.collection("profiles").findOneAndUpdate(
      { uid },                // filter by UID
      { $set: profileData },   // update
      { upsert: true, returnDocument: "after" } // return updated doc
    );

    return NextResponse.json({
      success: true,
      message: "Profile saved successfully",
      profile: result?.value ?? null, // actual saved profile or null if result is null
    });
  } catch (err) {
    console.error("Error saving profile:", err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}


// GET → Fetch profile by UID
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ success: false, message: "UID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ctrlyou");

    const profile = await db.collection("profiles").findOne({ uid });

    if (!profile) {
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
