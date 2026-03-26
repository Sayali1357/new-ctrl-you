"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/firebase/firebase";

const questions = [
  "Do you feel preoccupied with your gaming behavior?",
  "Do you feel more irritability, anxiety, or sadness when you try to reduce or stop your gaming activity?",
  "Do you feel the need to spend increasing time gaming to achieve satisfaction or pleasure?",
  "Do you systematically fail when trying to control or stop your gaming activity?",
  "Have you lost interest in previous hobbies or entertainment due to gaming?",
  "Have you continued gaming despite problems with other people?",
  "Have you deceived family members, therapists, or others about your gaming activity?",
  "Do you play to temporarily escape or relieve a negative mood (e.g., helplessness, guilt, anxiety)?",
  "Have you jeopardized or lost an important relationship, job, or educational opportunity due to gaming?",
];

const options = ["Never", "Rarely", "Sometimes", "Often", "Very Often"];

export default function GamingAddictionForm() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [responses, setResponses] = useState(Array(questions.length).fill(""));
  const [nextAvailableDate, setNextAvailableDate] = useState<Date | null>(null);
  const [isTestAvailable, setIsTestAvailable] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        setIsTestAvailable(false);
        return;
      }

      setUid(user.uid);

      try {
        const res = await fetch(`/api/last-test?uid=${user.uid}`);
        const data = await res.json();

        let available = true;
        let nextTestDate: Date | null = null;

        if (data?.lastTestDate) {
          const lastTest = new Date(data.lastTestDate);
          nextTestDate = new Date(lastTest.getTime() + 7 * 24 * 60 * 60 * 1000); // add 7 days in ms

          const now = new Date();
          if (now < nextTestDate) {
            available = false; // still locked
          }
        }

        setNextAvailableDate(nextTestDate);
        setIsTestAvailable(available);
      } catch (err) {
        console.error("Error fetching last test date:", err);
        setIsTestAvailable(true); // fallback
      }
    });

    return () => unsubscribe();
  }, []);


  const handleChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uid) {
      alert("You must be logged in to submit.");
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, responses }),
      });

      const data = await response.json();

      if (data.success) {
        // 🔹 Record test submission date & trigger email
        await fetch("/api/record-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid }),
        });
        const now = new Date();
        const nextTest = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        setNextAvailableDate(nextTest);
        setIsTestAvailable(false);
        router.push(`/result?category=${data.category}`);
      } else {
        alert("Failed to predict category");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // 🔹 Show lock screen if test not available
  if (!isTestAvailable && nextAvailableDate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">⏳ Test Locked</h2>
          <p className="text-lg mb-2">
            You can take your next test on:
          </p>
          <p className="text-blue-400 font-semibold">
            {nextAvailableDate.toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-3xl w-full"
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          🎮 Gaming Addiction Questionnaire
        </h1>

        {questions.map((q, i) => (
          <div key={i} className="mb-8 p-4 rounded-xl bg-gray-700 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">
                Question {i + 1} of {questions.length}
              </p>
              <span className="text-sm text-gray-400">
                {responses[i] ? "✔ Answered" : "❓ Not answered"}
              </span>
            </div>

            <p className="mb-4 text-lg">{q}</p>

            <div className="flex flex-wrap gap-4">
              {options.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition ${responses[i] === opt
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 hover:bg-gray-500"
                    }`}
                >
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={opt}
                    checked={responses[i] === opt}
                    onChange={() => handleChange(i, opt)}
                    className="hidden"
                    required
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={!isTestAvailable}
          className={`w-full py-3 rounded-xl font-semibold shadow-lg transition transform ${isTestAvailable
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
            : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
        >
          Submit
        </button>

      </form>
    </div>
  );
}
