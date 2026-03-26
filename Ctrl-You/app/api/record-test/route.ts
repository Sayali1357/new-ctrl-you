import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { uid } = await req.json();
  if (!uid) return NextResponse.json({ error: "Missing UID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("ctrlyou");
  const user = await db.collection("users").findOne({ uid });

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 7);

  // Save record
  await db.collection("test_tracker").insertOne({
    uid,
    lastTestDate: new Date(),
    nextAvailable: nextDate,
  });

  // Send email notification (you’ll need an SMTP setup)
  if (user?.email) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Gaming Wellness" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your next gaming assessment will be available soon!",
      text: `Hi! Your next gaming addiction test will be available on ${nextDate.toDateString()}.`,
    });
  }

  return NextResponse.json({ success: true });
}
