"use client";
import { useState } from "react";
import { ScreenTime } from "./ScreenTimeInput";

interface Props {
  screenTime: ScreenTime;
}

export default function DetoxPlanner({ screenTime }: Props) {
  const [customTask, setCustomTask] = useState("");
  const [schedule, setSchedule] = useState<string[]>([
    "7:00–7:30 🌅 Morning walk & stretch",
    "8:00–11:00 💻 Focus work/study (no phone)",
    "11:00–11:30 🎨 Creative hobby time",
    "12:00–13:00 🍽️ Lunch & offline socializing",
    "14:00–16:00 📚 Deep work / learning session",
    "16:00–17:00 🎮 Controlled gaming session",
    "17:00–19:00 🌿 Outdoor or meetup activity",
    "20:00–22:00 📖 Skill-building or reading",
    "22:00–23:00 🪔 Relax, journal, and sleep prep",
  ]);

  const addCustomTask = () => {
    if (customTask.trim()) {
      setSchedule([...schedule, `✨ ${customTask}`]);
      setCustomTask("");
    }
  };

  return (
    <div className="mt-10 p-6 rounded-3xl shadow-xl bg-gray-900 text-pink-300 border border-gray-700">
      <h2 className="text-3xl font-bold mb-4 text-center text-pink-400 drop-shadow-lg">
        📅 Your Personalized Detox Plan
      </h2>

      <p className="text-pink-200 mb-6 text-center">
        Based on your total screen time of <strong className="text-pink-400">{screenTime.total} hours</strong>, we created a detox plan
        that keeps your day <strong className="text-pink-400">fun, productive, and balanced</strong> 🎯
      </p>

      <div className="grid gap-4">
        {schedule.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition cursor-pointer border border-gray-700 text-pink-200"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2 text-pink-300">✍️ Add “I want to do this today”</h3>
        <div className="flex gap-2">
          <input
            value={customTask}
            onChange={(e) => setCustomTask(e.target.value)}
            placeholder="Learn guitar 🎸, meditate, etc."
            className="flex-1 p-3 rounded-xl border border-gray-600 bg-gray-800 text-pink-200 placeholder-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
          <button
            onClick={addCustomTask}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
