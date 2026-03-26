import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

type Score = {
  _id?: string;
  userId: string;
  username: string;
  game: string;
  score: number;
  timestamp?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("games_db");
  const collection = db.collection<Score>("scores");

  if (req.method === "GET") {
    // Get all scores or filter by game/user
    const { game, userId } = req.query;
    const query: any = {};
    if (game) query.game = game;
    if (userId) query.userId = userId;

    const scores = await collection.find(query).sort({ score: -1 }).toArray();
    res.status(200).json({ success: true, scores });
  } else if (req.method === "POST") {
    // Add new score
    const { userId, username, game, score } = req.body;
    if (!userId || !username || !game || score === undefined)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const newScore: Score = {
      userId,
      username,
      game,
      score,
      timestamp: new Date().toISOString(),
    };
    await collection.insertOne(newScore);
    res.status(201).json({ success: true, score: newScore });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
