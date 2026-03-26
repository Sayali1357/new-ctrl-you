"use client";

import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Define the type for the data as it exists in the application
type Entry = {
  id: string;
  wellBeingScore: number;
  journal: string;
  createdAt: Date;
};

// Define the type for the data as it is stored in localStorage (with a string date)
type StoredEntry = Omit<Entry, 'createdAt'> & {
  createdAt: string;
};

// This function simulates fetching data from a local source instead of Firebase
const fetchEntries = (): Entry[] => {
  try {
    const storedEntries = localStorage.getItem('progressEntries');
    if (storedEntries) {
      // Parse the stored data and assert its type
      const parsedEntries: StoredEntry[] = JSON.parse(storedEntries);

      // Map over the stored data and convert the date string back to a Date object
      return parsedEntries.map(entry => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
      }));
    }
  } catch (error) {
    console.error("Failed to load entries from local storage", error);
  }
  return [];
};

// This function simulates saving data to a local source
const saveEntry = (entry: Omit<Entry, 'id' | 'createdAt'>) => {
  const newEntry: Entry = {
    id: `entry-${Date.now()}`, // Simple unique ID
    ...entry,
    createdAt: new Date(),
  };

  const currentEntries = fetchEntries();
  const updatedEntries = [...currentEntries, newEntry];

  try {
    // Save the updated array to local storage
    localStorage.setItem('progressEntries', JSON.stringify(updatedEntries));
  } catch (error) {
    console.error("Failed to save entry to local storage", error);
  }
  return newEntry;
};

export default function ProgressPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [score, setScore] = useState<number>(5);
  const [journal, setJournal] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const sectionRef = useRef(null);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Fetch entries from local storage on load
  useEffect(() => {
    setEntries(fetchEntries());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = saveEntry({ wellBeingScore: score, journal });
    setEntries(prevEntries => [...prevEntries, newEntry]); // Add the new entry to state
    setSubmitted(true);
    
    // Reset form after showing success
    setTimeout(() => {
      setSubmitted(false);
      setJournal('');
    }, 3000);
  };

  // Prepare data for chart
  const chartData = entries.map(({ wellBeingScore, createdAt }, index) => ({
    wellBeingScore,
    date: createdAt.toLocaleDateString(),
    week: `Week ${index + 1}`,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 8) return '😊';
    if (score >= 6) return '🙂';
    if (score >= 4) return '😐';
    return '😔';
  };

  const averageScore = entries.length > 0 
    ? (entries.reduce((sum, entry) => sum + entry.wellBeingScore, 0) / entries.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div ref={sectionRef} className="relative z-10 min-h-screen p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Weekly Well-Being Tracker
            </h1>
            <p className="text-gray-300 text-lg">Monitor your progress and celebrate your growth</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
                  Your Stats
                </h2>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4">
                    <div className="text-3xl font-bold text-center text-purple-400">{entries.length}</div>
                    <div className="text-sm text-gray-300 text-center">Total Check-ins</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-4">
                    <div className="text-3xl font-bold text-center text-blue-400">{averageScore}</div>
                    <div className="text-sm text-gray-300 text-center">Average Score</div>
                  </div>
                  {entries.length > 0 && (
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4">
                      <div className="text-3xl text-center">{getScoreEmoji(entries[entries.length - 1].wellBeingScore)}</div>
                      <div className="text-sm text-gray-300 text-center">Latest Mood</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  Well-Being Trend
                </h2>
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/5 p-4 h-80">
                  {chartData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis 
                          dataKey="week" 
                          stroke="#9CA3AF" 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          domain={[0, 10]} 
                          stroke="#9CA3AF" 
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
                        />
                        <Line 
                          type="monotone" 
                          dataKey="wellBeingScore" 
                          stroke="url(#gradient)"
                          strokeWidth={3} 
                          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: '#a855f7' }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-6xl mb-4 opacity-20">📈</div>
                      <p className="text-gray-400 text-center">No data yet. Submit your first weekly check-in below.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form and History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-6">
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
                            Weekly Check-In
                          </h2>
                          <p className="text-gray-400">How are you feeling this week?</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
                            <label className="block mb-3 font-semibold text-lg bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                              Well-Being Score (1–10)
                            </label>
                            <div className="relative">
                              <input
                                type="range"
                                min={1}
                                max={10}
                                value={score}
                                onChange={e => setScore(Number(e.target.value))}
                                className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                                required
                              />
                              <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>1 (Low)</span>
                                <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                                  {score} {getScoreEmoji(score)}
                                </span>
                                <span>10 (High)</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block mb-3 font-semibold text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              Self-Reflection Journal
                            </label>
                            <textarea
                              value={journal}
                              onChange={e => setJournal(e.target.value)}
                              rows={5}
                              placeholder="What's one thing you enjoyed outside gaming this week? How did you feel about your screen time balance?"
                              className="w-full p-4 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 resize-none backdrop-blur-sm transition-all duration-300"
                              required
                            />
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={!journal.trim()}
                            className="w-full py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-blue-500/25 border-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Save Weekly Check-In 📝
                          </motion.button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center space-y-6 py-8"
                      >
                        <div className="text-6xl">🎉</div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          Check-in Saved!
                        </h2>
                        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                          <p className="text-green-300 text-lg">
                            Your weekly reflection has been recorded. Keep up the great work on your wellness journey!
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* History */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-6">
                  Your Journey
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {entries.length > 0 ? (
                    [...entries].reverse().map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-teal-500/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 group"
                        onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{getScoreEmoji(entry.wellBeingScore)}</div>
                            <div>
                              <div className="font-medium text-gray-200">
                                {entry.createdAt.toLocaleDateString()}
                              </div>
                              <div className={`text-sm font-bold ${getScoreColor(entry.wellBeingScore)}`}>
                                Score: {entry.wellBeingScore}/10
                              </div>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedEntry === entry.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-gray-400"
                          >
                            ▼
                          </motion.div>
                        </div>
                        
                        {expandedEntry === entry.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-white/10"
                          >
                            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {entry.journal}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-20">📔</div>
                      <p className="text-gray-400">Your check-in history will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }

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