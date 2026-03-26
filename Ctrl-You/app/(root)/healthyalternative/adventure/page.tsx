"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "@/firebase/firebase";

interface Challenge { 
  title: string; 
  done: boolean; 
}

interface LeaderboardEntry { 
  uid: string; 
  name: string; 
  completed: number; 
  total: number; 
}

interface ApiResponse {
  challenges?: Challenge[];
  leaderboard?: LeaderboardEntry[];
  error?: string;
}

export default function LevelUpPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ uid: string; name: string } | null>(null);

  const auth = getAuth(app);

  // ✅ Listen for logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser({ 
          uid: firebaseUser.uid, 
          name: firebaseUser.displayName || firebaseUser.email || "Anonymous" 
        });
      } else {
        setUser(null);
        setLoading(false);
        setError("Please sign in to continue");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // ✅ Fetch challenges + leaderboard once user is ready
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        if (!user) throw new Error("User not found");
        const res = await fetch(`/api/healthyalternative/adventure?uid=${encodeURIComponent(user.uid)}`);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: `HTTP error! status: ${res.status}` }));
          throw new Error(errorData.error || `Failed to fetch challenges: ${res.status}`);
        }
        
        const data: ApiResponse = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setChallenges(data.challenges || []);
        setLeaderboard(data.leaderboard || []);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load data");
        setChallenges([]);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // ✅ Toggle challenge
  const toggleDone = async (index: number) => {
    if (!user) return;
    
    const newChallenges = [...challenges];
    newChallenges[index].done = !newChallenges[index].done;
    setChallenges(newChallenges);

    try {
      const res = await fetch("/api/healthyalternative/adventure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          uid: user.uid, 
          name: user.name, 
          challenges: newChallenges 
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `HTTP error! status: ${res.status}` }));
        throw new Error(errorData.error || "Failed to save changes");
      }

      // Refresh leaderboard
      const updated = await fetch(`/api/healthyalternative/adventure?uid=${encodeURIComponent(user.uid)}`);
      if (updated.ok) {
        const data: ApiResponse = await updated.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save changes");
      // Revert on error
      const revertChallenges = [...challenges];
      revertChallenges[index].done = !revertChallenges[index].done;
      setChallenges(revertChallenges);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <p className="text-xl">Loading challenges...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <p className="text-red-500 text-xl">Please sign in to continue</p>
      </div>
    );
  }

  const completedCount = challenges.filter(c => c.done).length;
  const progressPercentage = challenges.length > 0 ? (completedCount / challenges.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-800 p-8 flex flex-col items-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-4xl font-extrabold mb-6 text-center"
      >
        Today&apos;s Challenge Streak 🔥
      </motion.h1>

      {error && (
        <div className="w-full max-w-xl mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full max-w-xl mb-6">
        <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className="h-4 bg-yellow-400 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
        <p className="text-sm mt-1 text-gray-600 text-center">
          Streak: {completedCount} / {challenges.length} done
        </p>
      </div>

      {/* Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-xl">
        {challenges.length > 0 ? (
          challenges.map((challenge, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => toggleDone(index)}
              className={`p-4 rounded-lg shadow cursor-pointer flex items-center justify-between transition-all ${
                challenge.done 
                  ? "bg-green-400 text-white" 
                  : "bg-white text-gray-800"
              } hover:scale-105 active:scale-95`}
            >
              <span className={challenge.done ? "line-through" : ""}>
                {challenge.title}
              </span>
              {challenge.done && (
                <span className="text-white font-bold text-xl">✔</span>
              )}
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center p-4 bg-gray-100 rounded-lg">
            <p>No challenges available. Check back later!</p>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <h2 className="text-2xl font-bold mb-4">Leaderboard This Week</h2>
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-4 mb-8">
        {leaderboard.length > 0 ? (
          <ol className="list-decimal list-inside space-y-2">
            {leaderboard.map((entry) => (
              <li key={entry.uid} className="p-2 hover:bg-gray-50 rounded">
                <span className="font-semibold">{entry.name}</span> - {entry.completed} / {entry.total} Challenges
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-gray-500">No leaderboard data available</p>
        )}
      </div>

      <Link href="/healthyalternative">
        <button className="px-6 py-3 bg-yellow-400 text-gray-800 font-bold rounded-lg shadow hover:bg-yellow-300 transition-colors">
          ← Back to Hub
        </button>
      </Link>
    </div>
  );
}