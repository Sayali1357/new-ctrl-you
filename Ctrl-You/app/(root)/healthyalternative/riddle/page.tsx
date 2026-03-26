"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const riddles = [
  {
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
    answer: "An echo",
  },
  {
    question: "The more of this there is, the less you see. What is it?",
    answer: "Darkness",
  },
  {
    question: "I have keys but open no locks. I have space but no room. You can enter, but you can’t go outside. What am I?",
    answer: "A keyboard",
  },
  {
    question: "What has many hearts but no other organs?",
    answer: "A deck of cards",
  },
  {
    question: "What can travel around the world while staying in a corner?",
    answer: "A stamp",
  },
];

export default function RiddlePage() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setCurrent(0);
    setShowAnswer(false);
  };

  const handleContinue = () => {
    if (current < riddles.length - 1) {
      setCurrent(current + 1);
      setShowAnswer(false);
    } else {
      setStarted(false); // End of riddles, go back to start screen
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-red-500 text-white flex flex-col items-center justify-center p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold mb-6"
      >
        Riddle Time 🧠
      </motion.h1>
      <p className="text-lg text-center mb-8">
        Solve fun riddles and challenge your brain!
      </p>

      {!started ? (
        <button
          className="mb-6 px-8 py-3 bg-yellow-300 text-pink-700 font-bold rounded-xl shadow hover:bg-yellow-400 transition"
          onClick={handleStart}
        >
          Start
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl flex flex-col items-center mb-6"
        >
          <div className="bg-white bg-opacity-10 rounded-xl p-6 mb-4 shadow-lg">
            <div className="text-xl font-semibold mb-2">
              {riddles[current].question}
            </div>
            {showAnswer ? (
              <div className="text-green-200 font-bold mb-2">
                Answer: {riddles[current].answer}
              </div>
            ) : (
              <button
                className="mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                onClick={() => setShowAnswer(true)}
              >
                Show Answer
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-green-400 text-pink-900 font-bold rounded-xl shadow hover:bg-green-500"
              onClick={handleContinue}
            >
              {current < riddles.length - 1 ? "Continue" : "Finish"}
            </button>
            <Link href="/healthyalternative">
              <button className="px-6 py-2 bg-white text-pink-600 font-bold rounded-xl shadow hover:bg-gray-200">
                Back to Hub
              </button>
            </Link>
          </div>
        </motion.div>
      )}

      {!started && (
        <Link href="/healthyalternative">
          <button className="px-6 py-3 bg-white text-pink-600 font-bold rounded-xl shadow hover:bg-gray-200">
            ← Back to Hub
          </button>
        </Link>
      )}
    </div>
  );
}