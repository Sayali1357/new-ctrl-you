import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

interface Message {
  from: "bot" | "user";
  text: string;
  timestamp: string;
}

interface UserChat {
  userId: string;
  messages: Message[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("mindmate");
    const collection = db.collection<UserChat>("chats");

    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    if (req.method === "GET") {
      const userChat = await collection.findOne({ userId });
      return res.status(200).json({ success: true, messages: userChat?.messages || [] });
    }

    if (req.method === "POST") {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ success: false, message: "Invalid messages" });
      }

      await collection.updateOne(
        { userId },
        { $set: { messages } },
        { upsert: true }
      );

      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
