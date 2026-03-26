// server.js
import express from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import nodemailer from "nodemailer";
import GamingTest from "./models/GamingTest.js";
import gamingRoutes from "./routes/gamingTest.js";

const app = express();
app.use(express.json());
app.use("/api/gamingtest", gamingRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/ctrlyou");

// 🔹 Setup email transporter (use your credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  try {
    const tests = await GamingTest.find();
    for (const t of tests) {
      const days = (Date.now() - new Date(t.lastTaken)) / (1000 * 60 * 60 * 24);
      if (days >= 7 && !t.notified) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: t.email,
          subject: "🎮 It's time to retake your Gaming Addiction Test!",
          text: "Hi there! Your 7 days are up — it’s time to retake your gaming addiction self-assessment.",
        });

        // Mark as notified to avoid multiple emails
        t.notified = true;
        await t.save();
      }
    }
    console.log("Daily email check complete.");
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));
