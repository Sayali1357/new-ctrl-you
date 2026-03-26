"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaRobot, FaBrain, FaUserMd } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category"); // "Low", "Medium", "High"

  const [showCounsellingOptions, setShowCounsellingOptions] = useState(false);
  const [showBalanceOptions, setShowBalanceOptions] = useState(false);

  const getLayout = (category: string | null) => {
    switch (category) {
      case "Low":
        return {
          title: "🌳 Needs Extra Support",
          message: "You’re on the right track—let’s work on balance together.",
          accentColor: "text-red-400",
          tips: [
            { icon: "🛌", title: "Rest More", desc: "Take short breaks to refresh your mind." },
            { icon: "🤝", title: "Seek Support", desc: "Talk with friends or family about your gaming habits." },
          ],
        };
      case "Medium":
        return {
          title: "🌿 Needs Attention",
          message: "Small adjustments can make a big difference.",
          accentColor: "text-yellow-400",
          tips: [
            { icon: "✅", title: "Set Gentle Limits", desc: "Try setting a daily goal for both gaming and other hobbies." },
            { icon: "🕒", title: "Scheduled Breaks", desc: "Take a 10-min walk after gaming to refresh your mind." },
          ],
        };
      case "High":
        return {
          title: "🌱 Healthy Balance",
          message: "You’re maintaining a great balance!",
          accentColor: "text-green-400",
          tips: [
            { icon: "💚", title: "Keep It Up", desc: "Continue maintaining a healthy balance." },
            { icon: "🧘", title: "Mindful Gaming", desc: "Pause for a minute every hour to check how you feel." },
          ],
        };
      default:
        return {
          title: "🎮 No Data",
          message: "No results found. Please submit your responses.",
          accentColor: "text-gray-400",
          tips: [],
        };
    }
  };

  const layout = getLayout(category);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 text-white relative overflow-hidden">
      {/* background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center p-6 lg:p-8">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-6xl lg:text-8xl mb-6">🎮🧘</div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              {layout.title}
            </h1>
            <p className="text-gray-300 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              {layout.message}
            </p>
          </motion.header>

          {/* Category Badge */}
          {category && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center text-2xl font-bold mx-auto animate-pulse">
                {category}
              </div>
            </motion.div>
          )}

          {/* Tips */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Personalized Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {layout.tips.map((tip, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.2 }}
                  className="bg-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition flex gap-4 items-start"
                >
                  <span className="text-green-400 text-2xl">{tip.icon}</span>
                  <div>
                    <p className="font-semibold">{tip.title}</p>
                    <p className="text-gray-300 text-sm">{tip.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center flex flex-col md:flex-row gap-6 justify-center items-center max-w-2xl mx-auto"
          >
             
            
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBalanceOptions(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-2xl px-8 py-4 shadow-xl transition-all duration-300"
              >
                Explore Balance Challenges
              </motion.button>
          
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCounsellingOptions(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl px-8 py-4 shadow-xl flex items-center gap-3"
            >
              <FaUserMd className="text-xl" /> Start Counselling
            </motion.button>
          </motion.div>
        </div>
      </div>
       {/* Enhanced Counselling Options Modal */}
      <AnimatePresence>
        {showBalanceOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Modal background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
              
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl lg:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  Choose Your Support
                </motion.h2>
                
                <div className="space-y-4">
                  {[
                    { icon: FaRobot, label: "wellness-dashboard", desc: "Daily updates", color: "from-teal-500 to-cyan-500", delay: 0,href: "/wellness-dashboard" },
                    { icon: FaBrain, label: "healthyalternative", desc: "Do Task and earn coins", color: "from-blue-500 to-indigo-500", delay: 0.1 ,href: "/healthyalternative"},
                    { icon: FaUserMd, label: "check progress", desc: "check progress", color: "from-purple-500 to-pink-500", delay: 0.2,href: "/progress" }
                  ].map((option) => (
                    <Link key={option.label} href={option.href}>
                    <motion.button
                      key={option.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: option.delay }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`bg-gradient-to-r ${option.color} hover:opacity-90 text-white font-semibold rounded-2xl px-6 py-4 w-full flex items-center gap-4 shadow-xl transition-all duration-300 group`}
                    >
                      <option.icon className="text-2xl group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <div className="font-bold">{option.label}</div>
                        <div className="text-sm opacity-90">{option.desc}</div>
                      </div>
                    </motion.button>
                    </Link>
                  ))}
                </div>
                  <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setShowCounsellingOptions(false)}
                  className="mt-8 text-gray-400 hover:text-white transition-colors text-lg"
                >
                  Maybe later
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        {/* Enhanced Counselling Options Modal */}
      <AnimatePresence>
        {showCounsellingOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Modal background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
              
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl lg:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  Choose Your Support
                </motion.h2>
                
                <div className="space-y-4">
                  {[
                    { icon: FaRobot, label: "AI Chatbot", desc: "Quick support anytime", color: "from-teal-500 to-cyan-500", delay: 0,href: "/chatbot" },
                    { icon: FaBrain, label: "AI Counselling", desc: "Personalized guidance", color: "from-blue-500 to-indigo-500", delay: 0.1 ,href: "/councelling"},
                    { icon: FaUserMd, label: "Professional counsellor", desc: "Human expert support", color: "from-purple-500 to-pink-500", delay: 0.2,href: "/support" }
                  ].map((option) => (
                    <Link key={option.label} href={option.href}>
                    <motion.button
                      key={option.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: option.delay }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`bg-gradient-to-r ${option.color} hover:opacity-90 text-white font-semibold rounded-2xl px-6 py-4 w-full flex items-center gap-4 shadow-xl transition-all duration-300 group`}
                    >
                      <option.icon className="text-2xl group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <div className="font-bold">{option.label}</div>
                        <div className="text-sm opacity-90">{option.desc}</div>
                      </div>
                    </motion.button>
                    </Link>
                  ))}
                </div>
                  <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setShowCounsellingOptions(false)}
                  className="mt-8 text-gray-400 hover:text-white transition-colors text-lg"
                >
                  Maybe later
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}