"use client";
import { useState } from "react";
import ScreenTimeInput, { ScreenTime } from "./ScreenTimeInput";
import DetoxPlanner from "./DetoxPlanner";

export default function DigitalDetoxPage() {
  const [screenTime, setScreenTime] = useState<ScreenTime | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-pink-300 py-10 px-4">
      <h1 className="text-5xl font-extrabold text-center mb-8 text-pink-400 drop-shadow-lg">
        🧘 Digital Detox Planner
      </h1>

      {!screenTime ? (
        <ScreenTimeInput onSubmit={(data) => setScreenTime(data)} />
      ) : (
        <DetoxPlanner screenTime={screenTime} />
      )}
    </div>
  );
}