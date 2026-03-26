// pages/api/healthyalternative/riddles/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("healthyalternative");
  const collection = db.collection("riddles");

  if (req.method === "GET") {
    try {
      const riddles = await collection.find({}).toArray();
      res.status(200).json({ success: true, data: riddles });
    } catch (error) {
      console.error("Error fetching riddles:", error);
      res.status(500).json({ success: false, message: "Failed to fetch riddles" });
    }
  } 
  
  else if (req.method === "POST") {
    try {
      const { question, answer } = req.body;
      if (!question || !answer) {
        return res.status(400).json({ success: false, message: "Question and Answer required" });
      }

      const newRiddle = {
        question,
        answer,
        createdAt: new Date(),
      };

      await collection.insertOne(newRiddle);
      res.status(201).json({ success: true, data: newRiddle });
    } catch (error) {
      console.error("Error adding riddle:", error);
      res.status(500).json({ success: false, message: "Failed to add riddle" });
    }
  } 
  
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
