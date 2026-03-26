"use client";

import React, { use, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/firebase/firebase";
import VideoSession from "@/components/VideoSession";

interface CounselingPageProps {
  params: Promise<{ id: string }>; // ✅ params is now a Promise
}

export default function CounselingPage({ params }: CounselingPageProps) {
  // ✅ unwrap the Promise using React.use()
  const { id } = use(params);

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName || "Anonymous");
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!userId) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400 text-lg">
          Please sign in to start your counseling session.
        </p>
      </section>
    );
  }

  const handleSessionComplete = async (transcript: any[], duration: number) => {
    console.log("Session transcript:", transcript);
    console.log("Session duration (min):", duration);

    try {
      const res = await fetch("/api/counselling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: id,
          userId,
          transcript,
          duration,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to save session: ${res.status}`);
      }

      console.log("✅ Session saved successfully");
    } catch (error) {
      console.error("❌ Failed to save session", error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col gap-10 p-8 bg-gray-950 text-white">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-purple-400">
          💬 Mind Detox Counseling
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          Start your live AI counseling session instantly — no setup needed.
        </p>
      </header>

      <VideoSession
        sessionId={id}
        userId={userId}
        userName={userName}
        durationLimit={30}
        onComplete={handleSessionComplete}
      />
    </section>
  );
}
