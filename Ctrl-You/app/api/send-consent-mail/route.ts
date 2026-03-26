// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodemailer = require("nodemailer");
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

/**
 * POST → Save parent info + send email (requires Firebase UID)
 * GET → Fetch parent info (all or by UID)
 */

// ----------------------------- POST -----------------------------
export async function POST(req: Request) {
  try {
    const { uid, parentName, parentEmail, parentMobile, childConsent } = await req.json();

    if (!uid || !parentName || !parentEmail || childConsent !== true) {
      return NextResponse.json(
        { message: "Incomplete form or consent not given" },
        { status: 400 }
      );
    }

    // --- MongoDB Connection ---
    const client = await clientPromise;
    const db = client.db("ctrlyou");
    const collection = db.collection("parent_consent");

    // --- Store in Database ---
    await collection.insertOne({
      uid,
      parentName,
      parentEmail,
      parentMobile,
      childConsent,
      createdAt: new Date(),
    });

    // --- Email Notification ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"Ctrl-You App" <${process.env.EMAIL_USER}>`,
      to: parentEmail,
      subject: "Child Consent Notification",
      html: `
        <h2>Hi ${parentName},</h2>
        <p>Your child (UID: <strong>${uid}</strong>) has given consent to use the Ctrl-You platform.</p>
        <p><strong>Parent Mobile:</strong> ${parentMobile}</p>
        <p>Thank you for your cooperation.</p>
      `,
    });

    return NextResponse.json(
      { message: "Email sent and data stored successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /parent-consent:", error);
    return NextResponse.json(
      { message: "Failed to send email or save data", error: String(error) },
      { status: 500 }
    );
  }
}

// ----------------------------- GET -----------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    const client = await clientPromise;
    const db = client.db("ctrlyou");
    const collection = db.collection("parent_consent");

    // If UID is provided → filter by UID
    const query = uid ? { uid } : {};
    const data = await collection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /parent-consent:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch parent consent data" },
      { status: 500 }
    );
  }
}
