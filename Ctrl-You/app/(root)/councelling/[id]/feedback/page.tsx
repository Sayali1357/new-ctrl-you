"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

import {
  getCounselingSessionById,
  getFeedbackBySessionId,
} from "@/lib/action/general.action";

export default function CounselingFeedbackPage() {
  const { id } = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = localStorage.getItem("userId") ?? ""; // Or from auth
        const sessionData = await getCounselingSessionById(String(id));
        const feedbackData = await getFeedbackBySessionId({ sessionId: String(id), userId });
        setSession(sessionData);
        setFeedback(feedbackData);
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-20 text-lg text-gray-400">Loading counseling session...</p>;

  if (!session)
    return (
      <div className="text-center mt-24">
        <h2 className="text-3xl font-semibold text-red-500">Session not found</h2>
        <Button onClick={() => router.push("/")}>Go Back</Button>
      </div>
    );

  return (
    <section className="p-10 md:p-20 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-3xl shadow-xl max-w-5xl mx-auto my-10">
      <div className="flex flex-col items-center text-center gap-4">
        <h1 className="text-4xl font-extrabold text-purple-700">
          🎯 Counseling Feedback Report
        </h1>
        <p className="text-gray-600 text-lg">
          Session ID: <span className="font-semibold">{id}</span>
        </p>
        <p className="text-gray-500">
          {session?.createdAt
            ? dayjs(session.createdAt).format("MMM D, YYYY h:mm A")
            : "Unknown Date"}
        </p>
      </div>

      <hr className="my-8 border-purple-300" />

      {feedback ? (
        <div className="flex flex-col gap-10">
          {/* Emotional Triggers */}
          <div className="bg-white rounded-2xl p-6 shadow-md border-l-8 border-pink-400">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">
              🧠 Emotional Triggers
            </h2>
            <p className="text-gray-700 leading-relaxed">{feedback.emotionalTriggers}</p>
          </div>

          {/* Behavioral Patterns */}
          <div className="bg-white rounded-2xl p-6 shadow-md border-l-8 border-orange-400">
            <h2 className="text-2xl font-semibold text-orange-600 mb-3">
              🔄 Behavioral Patterns
            </h2>
            <p className="text-gray-700 leading-relaxed">{feedback.behavioralPatterns}</p>
          </div>

          {/* Coping Strategies */}
          <div className="bg-white rounded-2xl p-6 shadow-md border-l-8 border-green-400">
            <h2 className="text-2xl font-semibold text-green-600 mb-3">
              🧩 Coping Strategies
            </h2>
            <p className="text-gray-700 leading-relaxed">{feedback.copingStrategies}</p>
          </div>

          {/* Motivational Feedback */}
          <div className="bg-white rounded-2xl p-6 shadow-md border-l-8 border-blue-400">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">
              💬 Motivational Feedback
            </h2>
            <p className="text-gray-700 leading-relaxed">{feedback.motivationalFeedback}</p>
          </div>

          {/* Personalized Plan */}
          <div className="bg-white rounded-2xl p-6 shadow-md border-l-8 border-purple-400">
            <h2 className="text-2xl font-semibold text-purple-600 mb-3">
              🌅 Personalized Plan
            </h2>
            <p className="text-gray-700 leading-relaxed">{feedback.personalizedPlan}</p>

            {/* Timetable Suggestion */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🗓️ Suggested Daily Timetable</h3>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
                <li>🌄 <b>6:30 AM – 7:30 AM:</b> Morning walk & meditation</li>
                <li>📚 <b>9:00 AM – 12:00 PM:</b> Study / Work session</li>
                <li>🥗 <b>12:00 PM – 1:00 PM:</b> Lunch break (no screens)</li>
                <li>💪 <b>5:00 PM – 6:00 PM:</b> Outdoor physical activity</li>
                <li>🎨 <b>7:00 PM – 8:00 PM:</b> Engage in a hobby or creative outlet</li>
                <li>🌙 <b>9:00 PM – 9:30 PM:</b> Reflection journaling / gratitude writing</li>
              </ul>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-indigo-200 to-purple-200 rounded-2xl p-6 shadow-md text-gray-800">
            <h2 className="text-2xl font-semibold mb-3">📘 Session Summary</h2>
            <p className="leading-relaxed">{feedback.totalSessionSummary}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">
          Feedback not generated yet. Please wait for analysis.
        </p>
      )}

      <div className="flex justify-center mt-10 gap-4">
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold"
        >
          Back to Dashboard
        </Button>
        <Button
          onClick={() => router.push(`/counseling/${id}/retake`)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-sm font-semibold"
        >
          Retake Session
        </Button>
      </div>
    </section>
  );
}
