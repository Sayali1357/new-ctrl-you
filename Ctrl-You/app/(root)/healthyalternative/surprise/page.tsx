"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "@/firebase/firebase";

const activities = [
  { text: "List 3 things you're grateful for", icon: "🙏" },
  { text: "Stretch for 2 minutes", icon: "🧘" },
  { text: "Smile at yourself in the mirror", icon: "😊" },
  { text: "Drink a glass of water", icon: "💧" },
  { text: "Do 10 jumping jacks", icon: "🏃" },
  { text: "Compliment someone", icon: "💬" },
  { text: "Listen to your favorite song", icon: "🎵" },
  { text: "Visualize your goals", icon: "🎯" },
  { text: "Take a short walk", icon: "🚶" },
  { text: "Write a short poem", icon: "✍" },
  { text: "Take 5 deep breaths", icon: "🌬" },
  { text: "Do a quick doodle", icon: "🎨" },
];

const colors = [
  "#FF6F61", "#6B5B95", "#88B04B", "#FFA07A", "#20B2AA", "#FFB347",
  "#B19CD9", "#FF7F50", "#90EE90", "#FFD700", "#FF69B4", "#40E0D0"
];

interface SpinHistory {
  _id: string;
  activity: string;
  points: number;
  timestamp: string;
  completed: boolean;
  icon: string;
}

interface UserPoints {
  totalPoints: number;
  spinHistory: SpinHistory[];
  error?: string;
}

export default function SpinWheelPage() {
  const [rotation, setRotation] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<{ text: string; icon: string } | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinHistory, setSpinHistory] = useState<SpinHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth(app);

  // Listen for user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setLoading(false);
        setError("Please sign in to spin the wheel");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch user points and history
  useEffect(() => {
    if (!user) return;

    const fetchUserPoints = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/healthyalternative/spinwheel?uid=${encodeURIComponent(user.uid)}`);
        
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error response:', errorText);
          throw new Error(`Failed to fetch points: ${res.status} ${errorText}`);
        }
        
        const data: UserPoints = await res.json();
        console.log('Fetched data:', data);
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setTotalPoints(data.totalPoints || 0);
        setSpinHistory(data.spinHistory || []);
      } catch (err: any) {
        console.error("Error fetching points:", err);
        setError(err.message || "Failed to load your points");
        // Set default values if fetch fails
        setTotalPoints(0);
        setSpinHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, [user]);

  const radius = 150;
  const center = radius;
  const sectionAngle = 360 / activities.length;

  const getSlicePath = (index: number) => {
    const startAngle = (index * sectionAngle * Math.PI) / 180;
    const endAngle = ((index + 1) * sectionAngle * Math.PI) / 180;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    return `M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;
  };

  const spinWheel = () => {
    if (spinning || !user) return;
    setSpinning(true);
    setSelectedActivity(null);
    setError(null);
    
    const randomExtra = Math.floor(Math.random() * 360);
    const newRotation = rotation + 360 * 5 + randomExtra;
    setRotation(newRotation);

    setTimeout(() => {
      const normalizedRotation = (newRotation % 360 + 360) % 360;
      const index = Math.floor((normalizedRotation / sectionAngle)) % activities.length;
      const winningActivity = activities[activities.length - 1 - index];
      setSelectedActivity(winningActivity);
      setSpinning(false);
    }, 4000);
  };

  const completeActivity = async () => {
    if (!user || !selectedActivity) return;

    try {
      const pointsEarned = 10;
      
      const res = await fetch("/api/healthyalternative/spinwheel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          activity: selectedActivity.text,
          points: pointsEarned,
          icon: selectedActivity.icon,
          completed: true,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `HTTP error! status: ${res.status}` }));
        throw new Error(errorData.error || "Failed to save points");
      }

      const result = await res.json();
      console.log('Save result:', result);
      
      // Update local state
      setTotalPoints(result.totalPoints);
      setSpinHistory(prev => [{
        _id: result.spinId,
        activity: selectedActivity.text,
        points: pointsEarned,
        timestamp: new Date().toISOString(),
        completed: true,
        icon: selectedActivity.icon
      }, ...prev]);
      
      setSelectedActivity(null);
      
    } catch (err: any) {
      console.error("Error saving points:", err);
      setError(err.message || "Failed to save points");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-xl text-green-800">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-xl text-red-500">Please sign in to spin the wheel</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-2 text-green-800 text-center">🎡 Spin the Fun Wheel</h1>
      <p className="text-green-700 mb-6 text-center">Hover on an icon to see the task. Spin the wheel to earn points!</p>

      {/* Points Display */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-700 text-center">
          Total Points: <span className="text-yellow-600">{totalPoints}</span>
        </h2>
        <p className="text-green-600 text-center">Complete activities to earn more points!</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded max-w-md">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Wheel Container */}
      <div className="relative flex flex-col items-center">
        {/* Arrow */}
        <div className="absolute -top-6 w-0 h-0 border-l-8 border-r-8 border-b-[20px] border-transparent border-b-green-600 z-10"></div>

        {/* Wheel */}
        <motion.svg
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: "easeOut" }}
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          className="rounded-full border-4 border-green-600 shadow-lg"
        >
          {activities.map((activity, index) => (
            <g
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <path d={getSlicePath(index)} fill={colors[index]} stroke="#fff" strokeWidth="2" />
              <text
                x={center + (radius - 50) * Math.cos((index + 0.5) * sectionAngle * Math.PI / 180)}
                y={center + (radius - 50) * Math.sin((index + 0.5) * sectionAngle * Math.PI / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="28"
              >
                {activity.icon}
              </text>
            </g>
          ))}
        </motion.svg>

        {/* Hover Task Tooltip */}
        {hoveredIndex !== null && (
          <div className="absolute top-full mt-4 p-3 bg-white/80 backdrop-blur-md rounded shadow text-green-900 font-semibold w-64 text-center">
            {activities[hoveredIndex].text}
          </div>
        )}
      </div>

      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        className="mt-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {spinning ? "Spinning..." : "🎲 Spin the Wheel"}
      </button>

      {/* Result Section */}
      {selectedActivity && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-green-700 mb-2">Your Task:</h2>
          <p className="text-green-800 mb-4 text-lg flex items-center justify-center gap-2">
            <span className="text-2xl">{selectedActivity.icon}</span>
            {selectedActivity.text}
          </p>
          <button
            onClick={completeActivity}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors"
          >
            ✅ Complete Activity (+10 Points)
          </button>
        </div>
      )}

      {/* Spin History */}
      {spinHistory.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-xl font-bold text-green-700 mb-4 text-center">Recent Activities</h3>
          <div className="bg-white rounded-lg shadow p-4 max-h-64 overflow-y-auto">
            {spinHistory.map((spin) => (
              <div key={spin._id} className="flex justify-between items-center py-2 border-b border-green-100 last:border-b-0">
                <div className="text-green-800 flex items-center gap-2">
                  <span className="text-xl">{spin.icon}</span>
                  <div>
                    <p className="font-medium">{spin.activity}</p>
                    <p className="text-sm text-green-600">
                      {new Date(spin.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                  +{spin.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}