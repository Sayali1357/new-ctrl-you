"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function MindfulnessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 text-white flex flex-col items-center justify-center p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold mb-6"
      >
        Mindfulness Zone 🌸
      </motion.h1>
      <p className="text-lg text-center mb-8">
        Relax with quick breathing and mindfulness exercises.
      </p>
      <Link href="/healthyalternative">
        <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl shadow hover:bg-gray-200">
          ← Back to Hub
        </button>
      </Link>
    </div>
  );
}
