"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import app from "@/firebase/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ---- Types ----
interface DailyData {
  date: string;
  sleep: number;
  study: number;
  exercise: number;
  gaming: number;
  challenge: string;
}

interface InputData {
  sleep: string;
  study: string;
  exercise: string;
  gaming: string;
}

// ---- Component ----
export default function WellnessDashboard() {
  const [data, setData] = useState<DailyData[]>([]);
  const isVisible = true; // Always visible - animations trigger on mount
  const [inputData, setInputData] = useState<InputData>({
    sleep: "",
    study: "",
    exercise: "",
    gaming: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [filledData, setFilledData] = useState<DailyData[]>([]); // backend entries for stats/insights
  const sectionRef = useRef<HTMLDivElement>(null);

  // ---- Challenge Logic ----
  const challenges = [
    "🕹️ Reduce gaming by 30 mins, grab a quick walk 🚶‍♂️",
    "💡 Swap a gaming session for a short study break 📚",
    "📖 Try an extra 15 min of study today!",
    "🏋️‍♂️ Stretch for 10 mins, feel the difference!",
    "🎉 You're balanced today! Keep it up!",
  ];

  const assignChallenge = (day: DailyData) => {
    if (day.gaming > day.study + day.exercise) {
      day.challenge = challenges[Math.floor(Math.random() * 4)];
    } else {
      day.challenge = challenges[4];
    }
  };

  // ---- Insights ----
  const getInsight = (day: DailyData) => {
    if (day.gaming > day.study + day.exercise) {
      return { text: "⚠️ Gaming was high today.", color: "#f43f5e" };
    }
    if (day.sleep >= 6 && day.study >= 2 && day.exercise >= 0.5 && day.gaming <= 3) {
      return { text: "✅ Balanced day!", color: "#22c55e" };
    }
    return { text: "⚖️ Keep working towards balance!", color: "#ffad60" };
  };

  // ---- Normalize to 7 days ----
  const normalizeData = (filled: DailyData[]) => {
    const today = new Date();
    const last7: DailyData[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const existing = filled.find((entry) => entry.date === dateStr);
      last7.push(
        existing || {
          date: dateStr,
          sleep: 0,
          study: 0,
          exercise: 0,
          gaming: 0,
          challenge: "No data added yet 📌",
        }
      );
    }
    return last7;
  };

  // ---- Input Handler ----
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  // ---- Save Daily Data ----
  const saveUserData = async () => {
    const today = new Date().toISOString().split("T")[0];
    const newDay: DailyData = {
      date: today,
      sleep: Number(inputData.sleep) || 0,
      study: Number(inputData.study) || 0,
      exercise: Number(inputData.exercise) || 0,
      gaming: Number(inputData.gaming) || 0,
      challenge: "",
    };
    assignChallenge(newDay);

    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");

      const uid = user.uid;

      const res = await fetch("/api/wellness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, wellness: newDay }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) throw new Error(resData.message || "Failed");

      // Update backend data in state
      const updatedFilled = [...filledData.filter((d) => d.date !== today), newDay];
      updatedFilled.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const last7Filled = updatedFilled.slice(-7);

      setFilledData(last7Filled);
      setData(normalizeData(last7Filled));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setInputData({ sleep: "", study: "", exercise: "", gaming: "" });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ---- Weekly Stats ----
  const calculateWeeklyStats = () => {
    if (!filledData.length) {
      return { avgSleep: "0.0", avgStudy: "0.0", avgExercise: "0.0", avgGaming: "0.0", balancedDays: 0 };
    }

    const totals = filledData.reduce(
      (acc, day) => ({
        sleep: acc.sleep + (Number(day.sleep) || 0),
        study: acc.study + (Number(day.study) || 0),
        exercise: acc.exercise + (Number(day.exercise) || 0),
        gaming: acc.gaming + (Number(day.gaming) || 0),
      }),
      { sleep: 0, study: 0, exercise: 0, gaming: 0 }
    );

    const count = filledData.length;
    const balancedDays = filledData.filter((day) => getInsight(day).text.includes("Balanced day")).length;

    return {
      avgSleep: (totals.sleep / count).toFixed(1),
      avgStudy: (totals.study / count).toFixed(1),
      avgExercise: (totals.exercise / count).toFixed(1),
      avgGaming: (totals.gaming / count).toFixed(1),
      balancedDays,
    };
  };

  const stats = calculateWeeklyStats();

  // ---- Fetch from backend ----
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const uid = user.uid;
          const res = await fetch(`/api/wellness?uid=${uid}`);
          const resData = await res.json();
  
          if (!res.ok || !resData.success) {
            console.error("Failed to fetch wellness:", resData.message);
            return;
          }
  
          const parsed: DailyData[] = (resData.data || []).map((d: any) => ({
            date: d.date,
            sleep: Number(d.sleep) || 0,
            study: Number(d.study) || 0,
            exercise: Number(d.exercise) || 0,
            gaming: Number(d.gaming) || 0,
            challenge: d.challenge || "No data added yet 📌",
          }));
  
          parsed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const last7Filled = parsed.slice(-7);
  
          setFilledData(last7Filled);
          setData(normalizeData(last7Filled));
        } catch (err) {
          console.error("Fetch wellness error:", err);
        }
      }
    });
  
    return () => unsubscribe(); // Cleanup
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div ref={sectionRef} className="relative z-10 flex flex-col items-center p-6 lg:p-8">
        <div className="w-full max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              🏆 Your Weekly Wellness Dashboard
            </h1>
            <p className="text-gray-300 text-lg">Track your daily habits and maintain healthy balance</p>
          </motion.div>

          {/* User Input Form */}
          <div className="mb-2 max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 flex flex-col lg:flex-row gap-2">
            {["sleep", "study", "exercise", "gaming"].map((field) => (
              <input
                key={field}
                type="number"
                min="0"
                step="0.1"
                name={field}
                value={inputData[field as keyof typeof inputData]}
                onChange={handleInputChange}
                placeholder={`${field[0].toUpperCase() + field.slice(1)} (hrs)`}
                className="flex-1 p-2 rounded-lg bg-black/20 text-white placeholder-gray-400 border border-white/20 text-sm"
              />
            ))}
            <Button
              onClick={saveUserData}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg text-sm"
            >
              Save
            </Button>
          </div>
             
          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8 max-w-4xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.avgSleep}h</div>
              <div className="text-sm text-gray-300">Avg Sleep</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.avgStudy}h</div>
              <div className="text-sm text-gray-300">Avg Study</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.avgExercise}h</div>
              <div className="text-sm text-gray-300">Avg Exercise</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.avgGaming}h</div>
              <div className="text-sm text-gray-300">Avg Gaming</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center col-span-2 lg:col-span-1">
              <div className="text-2xl font-bold text-emerald-400">{stats.balancedDays}/7</div>
              <div className="text-sm text-gray-300">Balanced Days</div>
            </div>
          </motion.div>

          {/* Challenge Card */}
          {data.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto mb-8"
            >
              <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl"></div>
                <div className="relative z-10">
                  <h2 className="text-xl font-semibold text-purple-300 mb-2">Todays Challenge</h2>
                  <p className="text-lg lg:text-xl font-medium text-white">
                    {data[data.length - 1].challenge}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Chart Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
                  Weekly Activity Breakdown
                </h3>
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/5 p-4">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: "#9ca3af", fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fill: "#9ca3af", fontSize: 12 }} 
                        domain={[0, 12]} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "rgba(15, 23, 42, 0.9)", 
                          borderRadius: "12px", 
                          border: "1px solid rgba(139, 92, 246, 0.3)",
                          backdropFilter: "blur(10px)"
                        }} 
                        itemStyle={{ color: "white" }}
                        formatter={(value: number) => [`${value}h`, ""]}
                      />
                      <Legend 
                        verticalAlign="top" 
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: "20px" }}
                      />
                      <Bar dataKey="sleep" stackId="a" fill="url(#sleepGradient)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="study" stackId="a" fill="url(#studyGradient)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="exercise" stackId="a" fill="url(#exerciseGradient)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="gaming" stackId="a" fill="url(#gamingGradient)" radius={[2, 2, 0, 0]} />
                      <defs>
                        <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                        </linearGradient>
                        <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#22c55e" stopOpacity={0.6}/>
                        </linearGradient>
                        <linearGradient id="exerciseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#facc15" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#facc15" stopOpacity={0.6}/>
                        </linearGradient>
                        <linearGradient id="gamingGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.6}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Daily Insights */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-6 text-center">
                  Daily Insights
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {data.map((d, index) => {
                    const insight = getInsight(d);
                    return (
                      <motion.div
                        key={d.date}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.8 + (index * 0.1) }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg flex items-center gap-4 transition-all duration-300"
                        style={{
                          backgroundColor: `${insight.color}15`,
                          borderColor: `${insight.color}30`,
                        }}
                      >
                        <div className="text-3xl">{insight.text.split(" ")[0]}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1">{d.date}</div>
                          <div className="text-sm text-gray-300">
                            {insight.text.replace(/^\S+\s/, '')}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Sleep: {d.sleep}h • Study: {d.study}h • Exercise: {d.exercise}h • Gaming: {d.gaming}h
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border border-green-400/30 z-50"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✅</span>
              <span className="font-semibold">Data added successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

