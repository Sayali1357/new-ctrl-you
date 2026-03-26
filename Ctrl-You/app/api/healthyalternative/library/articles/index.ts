import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export interface Article {
  _id?: string;
  title: string;
  source: string;
  url: string;
  excerpt: string;
  category: "mostRead" | "lifestyle";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("wellness_db");
    const collection = db.collection<Article>("library_articles");

    if (req.method === "GET") {
      const articles = await collection.find({}).toArray();
      return res.status(200).json({ success: true, articles });
    }

    if (req.method === "POST") {
      const { title, source, url, excerpt, category } = req.body;
      if (!title || !source || !url || !excerpt || !category) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }
      const newArticle: Article = { title, source, url, excerpt, category };
      await collection.insertOne(newArticle);
      return res.status(201).json({ success: true, article: newArticle });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Error in /api/healthyalternative/library/articles:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
