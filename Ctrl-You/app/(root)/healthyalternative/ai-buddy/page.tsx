"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Message = {
  from: "bot" | "user";
  text: string;
};

export default function AIBuddyPage() {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! How’s your day going today? 😊" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [activeMenu, setActiveMenu] = useState<null | "break" | "relax" | "music">(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeMenu, loading]);

  // ✅ Function to simulate or fetch GPT answer
  const fetchBotReply = async (msg: string) => {
    setLoading(true);

    try {
      // Replace with your OpenAI GPT API call
      // For demo, we'll use dynamic responses
      let botReply = "";
      const txt = msg.toLowerCase();

      if (txt.includes("tired")) {
        botReply =
          "You seem tired! 🌙 How about a 5-min stretch or a quick nap? Also, drinking water can boost your energy.";
      } else if (txt.includes("bored")) {
        botReply =
          "Feeling bored? Here are two ideas: try a mini puzzle 🧩 or pick up your favorite hobby for 10 minutes.";
      } else if (txt.includes("stress") || txt.includes("stressed")) {
        botReply =
          "Stress is tough. 😌 Try deep breathing for 3 minutes and maybe listen to calming nature sounds.";
      } else {
        botReply =
          "That’s interesting! Tell me more about how you're feeling. I’m here to help with tips, breaks, or even music!";
      }

      // ✅ Simulate API delay
      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
        setLoading(false);
      }, 1200);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Oops! Something went wrong. Try again later." },
      ]);
      setLoading(false);
    }
  };

  const sendMessage = (text?: string) => {
    const msg = text || userInput;
    if (!msg.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setUserInput("");
    setActiveMenu(null);

    // Fetch bot response
    fetchBotReply(msg);
  };

  const handleQuickClick = (type: string) => {
    if (type === "Break Ideas") setActiveMenu("break");
    else if (type === "Relax Tips") setActiveMenu("relax");
    else if (type === "Music Suggestions") setActiveMenu("music");
    else sendMessage(type);
  };

  const menuOptions: Record<string, string[]> = {
    break: ["5-min stretching", "Drink water & relax", "Step outside for fresh air"],
    relax: ["Meditation 5-min", "Deep breathing", "Short yoga routine"],
    music: ["Calm instrumental", "Nature sounds", "Focus playlist"],
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-extrabold mb-4 text-black"
      >
        MindMate AI 🤖
      </motion.h1>

      {/* Chat Box */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-4 flex flex-col gap-4 h-[450px] overflow-y-auto">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: msg.from === "bot" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
              msg.from === "bot"
                ? "bg-pink-200 self-start"
                : "bg-pink-400 self-end"
            }`}
          >
            <span className="text-black">{msg.text}</span>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 italic"
          >
            MindMate is typing...
          </motion.div>
        )}

        {/* Active menu popup */}
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-pink-100 self-start rounded-lg p-3 space-y-2"
          >
            {menuOptions[activeMenu].map((option, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(option)}
                className="w-full text-left px-3 py-2 bg-white rounded shadow hover:bg-pink-200 text-black"
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Quick suggestion buttons */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center mt-4">
        {["Break Ideas", "Relax Tips", "Music Suggestions"].map((btn) => (
          <button
            key={btn}
            onClick={() => handleQuickClick(btn)}
            className="px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-300 transition"
          >
            {btn}
          </button>
        ))}
      </div>

      {/* User input */}
      <div className="flex w-full max-w-2xl gap-2 mt-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 p-3 border rounded text-black focus:ring-2 focus:ring-pink-300"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={() => sendMessage()}
          className="px-6 py-3 bg-pink-400 text-white font-semibold rounded hover:bg-pink-300 transition"
        >
          Send
        </button>
      </div>

      <Link href="/healthyalternative">
        <button className="mt-6 px-6 py-3 bg-pink-400 text-white font-bold rounded shadow hover:bg-pink-300">
          ← Back to Hub
        </button>
      </Link>
    </div>
  );
}
