"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/firebase/firebase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Reflection {
  habits: string[];
  notes: string;
  mood: string;
  date: string;
}

export default function GamifiedEngagement() {
  const auth = getAuth(app);
  const [uid, setUid] = useState<string | null>(null);
  const [habits, setHabits] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<Reflection[]>([]);
  const [streak, setStreak] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  const habitOptions = [
    "📵 Limited screen time",
    "🏃‍♂️ Did physical activity",
    "🛏️ Slept on time",
    "🍎 Ate healthy meals",
    "💧 Drank enough water",
    "👨‍👩‍👦 Spent time with family/friends",
    "🎮 Balanced gaming with studies/work",
  ];

  // Get Firebase UID and load history
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        await fetchReflections(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

      const fetchReflections = async (firebaseUid: string) => {
      try {
        const res = await fetch(`/api/reflections?firebaseUid=${firebaseUid}`);
        const data = await res.json();
        if (data.success) {
          setHistory(data.reflections);
          setStreak(data.streak);
        }
      } catch (err) {
        console.error(err);
      }
    };


  const toggleHabit = (habit: string) => {
    setHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  // ✅ Submit reflection to backend
  const submitReflection = async () => {
    if (!uid || (habits.length === 0 && !notes && !mood)) return;

    const today = new Date().toISOString().split("T")[0];

    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseUid: uid, habits, notes, mood, date: today }),
      });
      const data = await res.json();
      if (data.success) {
        // Update frontend
        setHistory([data.reflection, ...history]);
        setSubmitted(true);
        setHabits([]);
        setNotes("");
        setMood("");

        // Update streak (simple version)
        const lastDate = history[0]?.date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let newStreak = 1;
        if (lastDate === yesterdayStr) newStreak = streak + 1;
        else if (lastDate === today) newStreak = streak;
        setStreak(newStreak);
      }
    } catch (err) {
      console.error("Error submitting reflection:", err);
    }
  };

  // Graph data
  const graphData = history
    .map((ref) => ({ date: ref.date, completed: ref.habits.length }))
    .slice(0, 7)
    .reverse();

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 text-white p-4 lg:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Daily Reflection Hub
          </h1>
          <p className="text-gray-300 text-lg">Track your journey to a healthier digital life</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: Graph + Previous Reflections */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/2 space-y-6"
          >
            {/* Progress Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  📊 Your Progress
                </h2>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
                  <span className="text-2xl">🔥</span>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{streak}</div>
                    <div className="text-xs text-gray-300">day streak</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Graph */}
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/5 h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl"></div>
                {graphData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#9ca3af', fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fill: '#9ca3af', fontSize: 12 }} 
                        allowDecimals={false} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          borderRadius: '12px', 
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          color: 'white',
                          backdropFilter: 'blur(10px)'
                        }}
                        itemStyle={{ color: '#a855f7' }}
                      />
                      <Bar
                        dataKey="completed"
                        radius={[12, 12, 0, 0]}
                        animationDuration={1000}
                      >
                        {graphData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`url(#grad-${index})`}
                          />
                        ))}
                      </Bar>
                      <defs>
                        {graphData.map((entry, index) => (
                          <linearGradient id={`grad-${index}`} key={index} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                            <stop offset="50%" stopColor="#a855f7" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.6} />
                          </linearGradient>
                        ))}
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-6xl mb-4 opacity-20">📊</div>
                    <p className="text-gray-400 text-center">No data yet. Start your first reflection!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Previous Reflections */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                🕰️ Previous Reflections
              </h2>
              <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {history.length > 0 ? (
                  history.map((ref, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white/5 hover:bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-purple-500/30 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                      onClick={() => setExpanded(expanded === idx ? null : idx)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300 flex items-center space-x-2">
                          <span>📅</span>
                          <span className="font-medium">{ref.date}</span>
                          {ref.mood && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400">🌈 {ref.mood}</span>
                            </>
                          )}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                            {ref.habits.length} habits
                          </span>
                          <motion.div
                            animate={{ rotate: expanded === idx ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            ▼
                          </motion.div>
                        </div>
                      </div>
                      {expanded === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-2"
                        >
                          <div className="space-y-1">
                            {ref.habits.map((h, i) => (
                              <div key={i} className="flex items-center space-x-2 text-gray-200 text-sm bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                                <span>✅</span>
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                          {ref.notes && (
                            <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-lg">
                              <p className="text-gray-300 italic text-sm flex items-start space-x-2">
                                <span>📝</span>
                                <span>{ref.notes}</span>
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4 opacity-20">📚</div>
                    <p className="text-gray-400">Your reflection history will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right column: Today's reflection */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:w-1/2"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
              
              <div className="relative z-10 space-y-6">
                {!submitted ? (
                  <>
                    {/* Today's Habits */}
                    <div className="text-center mb-6">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        ✅ Todays Healthy Habits
                      </h1>
                      <p className="text-gray-400">Select the habits you completed today</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {habitOptions.map((habit, index) => (
                        <motion.label
                          key={habit}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center space-x-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                            habits.includes(habit)
                              ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30'
                          }`}
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={habits.includes(habit)}
                              onChange={() => toggleHabit(habit)}
                              className="h-5 w-5 accent-purple-500 rounded"
                            />
                            {habits.includes(habit) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -inset-1 bg-purple-500/30 rounded-full blur-sm"
                              />
                            )}
                          </div>
                          <span className={`text-lg transition-colors ${
                            habits.includes(habit) ? 'text-white' : 'text-gray-300'
                          }`}>
                            {habit}
                          </span>
                        </motion.label>
                      ))}
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-3">
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent flex items-center space-x-2">
                        <span>📝</span>
                        <span>Additional Reflections</span>
                      </h2>
                      <textarea
                        placeholder="Write about other positive things you did today..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full min-h-[100px] p-4 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none backdrop-blur-sm transition-all duration-300"
                      />
                    </div>

                    {/* Mood Input */}
                    <div className="space-y-3">
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center space-x-2">
                        <span>🌈</span>
                        <span>How was your day?</span>
                      </h2>
                      <input
                        placeholder="e.g. Relaxing, Productive, Balanced..."
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        className="w-full p-4 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm transition-all duration-300"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={submitReflection}
                      className="w-full py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-2xl shadow-purple-500/25 border-0 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl hover:shadow-purple-500/30"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Submit Reflection</span>
                        <span>🌟</span>
                      </span>
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Success Screen */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-6"
                    >
                      <div className="text-6xl mb-4">🎉</div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
                        Fantastic Work Today!
                      </h1>
                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                        <p className="text-xl text-gray-300 mb-4">
                          You completed <span className="text-purple-400 font-bold text-2xl">{habits.length}</span> healthy habits today!
                        </p>
                        <div className="grid grid-cols-1 gap-3 mt-6">
                          {habits.map((h, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-3 flex items-center space-x-2"
                            >
                              <span className="text-green-400">✅</span>
                              <span>{h}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {notes && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4"
                        >
                          <p className="text-gray-200 italic flex items-start space-x-2">
                            <span className="text-blue-400">📝</span>
                            <span>{notes}</span>
                          </p>
                        </motion.div>
                      )}

                      {mood && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4"
                        >
                          <p className="text-yellow-300 flex items-center justify-center space-x-2 text-lg">
                            <span>🌈</span>
                            <span>You felt: <strong>{mood}</strong></span>
                          </p>
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-6"
                      >
                        <div className="text-2xl mb-2">💪</div>
                        <p className="text-pink-400 font-semibold text-lg">
                          Your determination is incredible! Every small step counts towards building a healthier digital life. Keep up this amazing momentum! 🚀
                        </p>
                      </motion.div>

                      <Button
                        onClick={() => setSubmitted(false)}
                        className="w-full py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-2xl shadow-green-500/25 border-0 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>Reflect Again</span>
                          <span>🔄</span>
                        </span>
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
}