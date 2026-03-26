"use client";
import { useState, useEffect } from "react";

interface MindfulnessActivity {
  id: number;
  title: string;
  description: string;
  duration: string;
  type: string;
  difficulty: string;
  steps: string[];
}

export default function MindfulnessPage() {
  const [activities, setActivities] = useState<MindfulnessActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<MindfulnessActivity | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("breatheIn");
  const [timeLeft, setTimeLeft] = useState(300);
  const [circleSize, setCircleSize] = useState(100);

  // Fetch activities from backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/healthyalternative/mindfulness');
        const result = await response.json();
        
        if (result.success) {
          setActivities(result.data);
          // Auto-select the first activity (breathing exercise)
          if (result.data.length > 0) {
            setSelectedActivity(result.data[0]);
          }
        } else {
          setError("Failed to load activities");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const phases = {
    breatheIn: { duration: 4000, text: "Breathe In 🌬️", next: "hold1", size: 150 },
    hold1: { duration: 2000, text: "Hold ✋", next: "breatheOut", size: 150 },
    breatheOut: { duration: 4000, text: "Breathe Out 🍃", next: "hold2", size: 100 },
    hold2: { duration: 2000, text: "Hold ✋", next: "breatheIn", size: 100 },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (!isActive) return;

    const phase = phases[currentPhase as keyof typeof phases];
    setCircleSize(phase.size);

    const timer = setTimeout(() => {
      setCurrentPhase(phase.next);
    }, phase.duration);

    return () => clearTimeout(timer);
  }, [currentPhase, isActive]);

  const startExercise = () => {
    setIsActive(true);
    setTimeLeft(300);
    setCurrentPhase("breatheIn");
    setCircleSize(100);
  };

  const resetExercise = () => {
    setIsActive(false);
    setTimeLeft(300);
    setCurrentPhase("breatheIn");
    setCircleSize(100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-emerald-900 text-white py-10 px-4 flex items-center justify-center">
        <div className="text-2xl text-teal-200">Loading mindfulness activities... 🧘‍♀️</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-emerald-900 text-white py-10 px-4 flex items-center justify-center">
        <div className="text-2xl text-rose-200">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-emerald-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-extrabold mb-6 text-teal-200 drop-shadow-lg text-center">
          🧘‍♀️ Mindfulness & Relaxation
        </h1>
        <p className="text-xl text-teal-100 mb-12 max-w-2xl mx-auto text-center">
          Choose from our curated mindfulness activities to find your calm and reduce stress.
        </p>

        {/* Activities Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border-2 cursor-pointer transition-all hover:scale-105 ${
                selectedActivity?.id === activity.id 
                  ? 'border-teal-400 bg-teal-900/20' 
                  : 'border-teal-500/20 hover:border-teal-400/40'
              }`}
              onClick={() => setSelectedActivity(activity)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-teal-300">{activity.title}</h3>
                <span className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full text-sm">
                  {activity.duration}
                </span>
              </div>
              <p className="text-teal-100 mb-3">{activity.description}</p>
              <div className="flex justify-between text-sm">
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                  {activity.type}
                </span>
                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                  {activity.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Activity Details */}
        {selectedActivity && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-teal-500/30 shadow-2xl mb-8">
            <h2 className="text-3xl font-bold mb-4 text-teal-300 text-center">
              {selectedActivity.title}
            </h2>
            
            {selectedActivity.type === "breathing" ? (
              /* Breathing Exercise */
              <>
                <div className="flex justify-center items-center mb-8">
                  <div
                    className="rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold transition-all duration-2000 ease-in-out shadow-2xl"
                    style={{
                      width: `${circleSize}px`,
                      height: `${circleSize}px`,
                      transition: 'all 4s ease-in-out'
                    }}
                  >
                    <span className="text-lg text-center px-4">
                      {phases[currentPhase as keyof typeof phases]?.text}
                    </span>
                  </div>
                </div>

                <div className="text-4xl font-mono font-bold text-teal-200 mb-6 text-center">
                  {formatTime(timeLeft)}
                </div>

                <div className="bg-gray-700/50 rounded-2xl p-6 mb-8">
                  <h3 className="text-2xl font-semibold text-teal-300 mb-4">Instructions:</h3>
                  <div className="grid gap-3">
                    {selectedActivity.steps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                        <span className="text-teal-100">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  {!isActive ? (
                    <button
                      onClick={startExercise}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition transform hover:scale-105"
                    >
                      Start {selectedActivity.title} 🌿
                    </button>
                  ) : (
                    <button
                      onClick={resetExercise}
                      className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition transform hover:scale-105"
                    >
                      Reset & Start Over 🔄
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Other Activity Types */
              <div className="text-center">
                <div className="bg-gray-700/50 rounded-2xl p-6 mb-6">
                  <h3 className="text-2xl font-semibold text-teal-300 mb-4">Instructions:</h3>
                  <div className="grid gap-3 max-w-2xl mx-auto">
                    {selectedActivity.steps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-gray-600/30 p-3 rounded-lg">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <span className="text-teal-100 text-left">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition transform hover:scale-105">
                  Start {selectedActivity.title} 🎯
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Relaxation Tips */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-teal-500/20">
            <div className="text-3xl mb-3">💆</div>
            <h3 className="text-xl font-semibold text-teal-300 mb-2">Quick Relaxation</h3>
            <p className="text-teal-100">Take 3 deep breaths whenever you feel stressed</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-teal-500/20">
            <div className="text-3xl mb-3">🎵</div>
            <h3 className="text-xl font-semibold text-teal-300 mb-2">Calming Sounds</h3>
            <p className="text-teal-100">Listen to nature sounds or gentle music</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-teal-500/20">
            <div className="text-3xl mb-3">🚶</div>
            <h3 className="text-xl font-semibold text-teal-300 mb-2">Mindful Walk</h3>
            <p className="text-teal-100">Take a 5-minute walk focusing on your surroundings</p>
          </div>
        </div>
      </div>
    </div>
  );
}