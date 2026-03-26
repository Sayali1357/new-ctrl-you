// pages/api/healthyalternative/library/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("wellness_library");

    if (req.method === "GET") {
      const sections = await db.collection("sections").find().toArray();
      const videos = await db.collection("videos").find().toArray();
      const infographics = await db.collection("infographics").find().toArray();
      const mindmaps = await db.collection("mindmaps").find().toArray();

      return res.status(200).json({ sections, videos, infographics, mindmaps });
    }

    if (req.method === "POST") {
      // ✅ Add a new mindmap
      const { image } = req.body;
      if (!image) return res.status(400).json({ error: "No image provided" });

      await db.collection("mindmaps").insertOne({ image, uploadedAt: new Date() });
      return res.status(201).json({ message: "Mindmap uploaded successfully" });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({ error: "Failed to fetch library data" });
  }
}
