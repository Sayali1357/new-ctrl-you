"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Bot,
  Users,
  Sparkles,
  Wind,
  Smartphone,
  BookOpen,
  Gamepad2,
  Mountain,
} from "lucide-react"; // ✅ Added Gamepad2 & Mountain for new sections

const tasks = [
  {
    title: "Riddle",
    description: "Challenge your brain with fun riddles",
    link: "/healthyalternative/riddle",
    icon: Brain,
    color: "from-pink-500 to-red-500",
  },
  {
    title: "AI Wellness Buddy",
    description: "Chat with your AI buddy for stress relief",
    link: "/healthyalternative/ai-buddy",
    icon: Bot,
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Community Corner",
    description: "Share tips and connect with others",
    link: "/healthyalternative/community",
    icon: Users,
    color: "from-yellow-500 to-emerald-500",
  },
  {
    title: "Surprise Me",
    description: "Get a random healthy activity suggestion",
    link: "/healthyalternative/surprise",
    icon: Sparkles,
    color: "from-yellow-400 to-orange-500",
  },
  {
    title: "Mindfulness",
    description: "Quick breathing and relaxation exercises",
    link: "/healthyalternative/mindfulness",
    icon: Wind,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Digital Detox",
    description: "Plan and track your screen-free time",
    link: "/healthyalternative/digital-detox",
    icon: Smartphone,
    color: "from-blue-600 to-cyan-500",
  },
  {
    title: "Wellness Library",
    description: "Explore articles, videos, and hobbies",
    link: "/healthyalternative/library",
    icon: BookOpen,
    color: "from-rose-500 to-pink-400",
  },
  {
    title: "Adventure Zone",
    description: "Take challenges and level up your wellness",
    link: "/healthyalternative/adventure",
    icon: Mountain,
    color: "from-orange-600 to-red-500",
  },
  {
    title: "Games Zone",
    description: "Play brain-boosting mini-games",
    link: "/healthyalternative/games",
    icon: Gamepad2,
    color: "from-teal-500 to-green-500",
  },
];

export default function HealthyAlternativeMain() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text"
      >
        Healthy Alternatives Hub
      </motion.h1>

      {/* Task Grid */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {tasks.map((task, index) => {
          const Icon = task.icon;
          return (
            <Link key={index} href={task.link}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer bg-gradient-to-br ${task.color} shadow-lg hover:shadow-2xl transition-all`}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-start space-y-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Icon size={32} />
                  </div>
                  <h2 className="text-2xl font-bold">{task.title}</h2>
                  <p className="text-gray-200 text-sm">{task.description}</p>
                  <span className="mt-auto text-sm text-indigo-100 font-semibold">
                    Explore →
                  </span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
