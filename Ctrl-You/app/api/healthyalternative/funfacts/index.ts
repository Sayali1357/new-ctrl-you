// pages/api/healthyalternative/funfacts/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { FunFact } from "@/models/FunFact";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const facts = await FunFact.find({});
      return res.status(200).json(facts);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching fun facts" });
    }
  }

  if (req.method === "POST") {
    try {
      const { fact } = req.body;
      if (!fact) return res.status(400).json({ message: "Fact is required" });

      const newFact = await FunFact.create({ fact });
      return res.status(201).json(newFact);
    } catch (error) {
      return res.status(500).json({ message: "Error saving fun fact" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
