// app/api/news/route.ts (or pages/api/news/index.ts if using Pages router)

import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    // ✅ Just await clientPromise, no parentheses!
    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with actual DB name

    const news = await db.collection("news").find().toArray();
    const newspapers = await db.collection("newspapers").find().toArray();

    return Response.json({ news, newspapers });
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
