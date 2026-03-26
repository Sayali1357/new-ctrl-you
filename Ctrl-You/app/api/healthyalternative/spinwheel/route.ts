import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface SpinData {
  uid: string;
  activity: string;
  points: number;
  icon: string;
  completed: boolean;
}

interface UserPointsDocument {
  uid: string;
  totalPoints: number;
  spinHistory: {
    activity: string;
    points: number;
    icon: string;
    timestamp: Date;
    completed: boolean;
  }[];
  lastUpdated: Date;
}

// GET user points and spin history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    console.log('GET request for UID:', uid);

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("levelup");
    const collection = db.collection<UserPointsDocument>("user_points");

    // Find user points document
    const userPoints = await collection.findOne({ uid }) as UserPointsDocument | null;

    console.log('Found user points:', userPoints);

    if (!userPoints) {
      // Return default values for new users
      return NextResponse.json({
        totalPoints: 0,
        spinHistory: [],
      });
    }

    // Sort history by timestamp descending and convert to proper format
    const sortedHistory = userPoints.spinHistory
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(spin => ({
        _id: spin.timestamp.getTime().toString(),
        activity: spin.activity,
        points: spin.points,
        icon: spin.icon || "🎯",
        timestamp: spin.timestamp.toISOString(),
        completed: spin.completed !== false, // Default to true if not specified
      }));

    return NextResponse.json({
      totalPoints: userPoints.totalPoints || 0,
      spinHistory: sortedHistory,
    });

  } catch (error) {
    console.error("GET SpinWheel API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST save spin result and update points
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, activity, points, icon, completed } = body;

    console.log('POST request body:', body);

    if (!uid || !activity || typeof points !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: uid, activity, or points" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("levelup");
    const collection = db.collection<UserPointsDocument>("user_points");

    const newSpin = {
      activity,
      points,
      icon: icon || "🎯",
      timestamp: new Date(),
      completed: completed !== false, // Default to true if not specified
    };

    console.log('New spin data:', newSpin);

    // Update user points - increment total points and add to history
    const result = await collection.updateOne(
      { uid },
      {
        $inc: { totalPoints: points },
        $push: { 
          spinHistory: newSpin,
        },
        $set: { lastUpdated: new Date() },
      },
      { upsert: true }
    );

    console.log('Update result:', result);

    // Get updated total points
    const updatedUser = await collection.findOne({ uid });

    const totalPoints = updatedUser && typeof updatedUser.totalPoints === "number"
      ? updatedUser.totalPoints
      : points;

    return NextResponse.json({
      success: true,
      totalPoints: totalPoints,
      spinId: newSpin.timestamp.getTime().toString(),
      message: "Points saved successfully",
    });

  } catch (error) {
    console.error("POST SpinWheel API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}