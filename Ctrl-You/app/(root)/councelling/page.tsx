"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const router = useRouter();

  const handleStartCounseling = () => {
    const newSessionId = uuidv4(); // just a random chat room ID
    router.push(`/councelling/${newSessionId}`);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-purple-300">
      <h1 className="text-4xl font-bold text-purple-700 mb-4">
        Digital Detox AI Counselor
      </h1>
      <p className="text-lg text-gray-700 max-w-md text-center">
        Talk to your AI counselor about gaming habits and emotional balance.
      </p>
      <button
        onClick={handleStartCounseling}
        className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
      >
        Start Counseling
      </button>
    </main>
  );
}
