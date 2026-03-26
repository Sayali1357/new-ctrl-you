import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface Challenge {
  title: string;
  done: boolean;
}

interface UserData {
  uid: string;
  name: string;
  challenges: Challenge[];
}

// GET challenges + leaderboard
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    
    if (!uid) {
      return NextResponse.json({ error: "UID required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("levelup");

    // Fetch user challenges
    const userData = await db.collection("challenges").findOne({ uid }) as UserData | null;
    
    // If user not found, create default challenges
    if (!userData) {
      const defaultChallenges: Challenge[] = [
        { title: "Drink 8 glasses of water", done: false },
        { title: "30 minutes of exercise", done: false },
        { title: "Eat 5 servings of fruits/vegetables", done: false },
        { title: "Get 7-8 hours of sleep", done: false },
        { title: "10 minutes of meditation", done: false },
        { title: "No sugary drinks", done: false }
      ];

      const newUser: UserData = {
        uid,
        name: "Anonymous",
        challenges: defaultChallenges
      };

      await db.collection("challenges").insertOne(newUser);
      
      // Create initial leaderboard with the new user
      const allDocs = await db.collection("challenges").find().toArray();
      const allUsers: UserData[] = allDocs.map(doc => ({
        uid: doc.uid,
        name: doc.name,
        challenges: doc.challenges
      }));
      const leaderboard = allUsers
        .map(user => ({
          uid: user.uid,
          name: user.name,
          completed: user.challenges.filter(c => c.done).length,
          total: user.challenges.length,
        }))
        .sort((a, b) => b.completed - a.completed)
        .slice(0, 10);

      return NextResponse.json({ 
        challenges: newUser.challenges, 
        leaderboard 
      });
    }

    // Leaderboard for existing user
    const allDocs = await db.collection("challenges").find().toArray();
    const allUsers: UserData[] = allDocs.map(doc => ({
      uid: doc.uid,
      name: doc.name,
      challenges: doc.challenges
    }));
    const leaderboard = allUsers
      .map(user => ({
        uid: user.uid,
        name: user.name,
        completed: user.challenges.filter(c => c.done).length,
        total: user.challenges.length,
      }))
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 10);

    return NextResponse.json({ 
      challenges: userData.challenges, 
      leaderboard 
    });
    
  } catch (err) {
    console.error("GET API Error:", err);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// POST: update challenges
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, name, challenges } = body;
    
    if (!uid || !name || !challenges) {
      return NextResponse.json({ 
        error: "Missing required fields: uid, name, or challenges" 
      }, { status: 400 });
    }

    // Validate challenges structure
    if (!Array.isArray(challenges) || challenges.some((c: any) => 
      typeof c.title !== 'string' || typeof c.done !== 'boolean'
    )) {
      return NextResponse.json({ 
        error: "Invalid challenges format" 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("levelup");

    const result = await db.collection("challenges").updateOne(
      { uid },
      { $set: { name, challenges, lastUpdated: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      updated: result.modifiedCount,
      upserted: result.upsertedCount 
    });
    
  } catch (err) {
    console.error("POST API Error:", err);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}