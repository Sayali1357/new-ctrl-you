/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/firebase/firebase";

interface Stats {
  riddlesSolved: number;
  adventuresCompleted: number;
  badges: number;
  streak: number;
  level: number;
  sessions: number;
  improvement: string;
}

interface Badge {
  name: string;
  icon: string;
}

interface RecentActivity {
  type: string;
  desc: string;
  date: string;
}

interface Counselor {
  name: string;
  email: string;
  phone?: string;
}

interface User {
  uid: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  joined: string;
  email: string;
  age: number;
  stats?: Stats;
  badges?: Badge[];
  recent?: RecentActivity[];
  counselor?: Counselor;
}

interface FormData {
  name: string;
  bio: string;
  location: string;
  email: string;
  age: number;
  avatar: string;
  counselor: string;
}

interface ProgressData {
  week: string;
  score: number;
}

const progressData: ProgressData[] = [
  { week: "Week 1", score: 60 },
  { week: "Week 2", score: 65 },
  { week: "Week 3", score: 70 },
  { week: "Week 4", score: 75 },
  { week: "Week 5", score: 80 },
  { week: "Week 6", score: 85 },
];

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<"activity" | "badges" | "sessions">("activity");
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    bio: "",
    location: "",
    email: "",
    age: 0,
    avatar: "",
    counselor: "",
  });

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        try {
          const res = await fetch(`/api/profile-setup?uid=${userAuth.uid}`);
          const data = await res.json();
          if (data.success && data.profile) {
            setUser(data.profile);
            setForm({
              name: data.profile.name || "",
              bio: data.profile.bio || "",
              location: data.profile.location || "",
              email: data.profile.email || "",
              age: data.profile.age || 0,
              avatar: data.profile.avatar || "",
              counselor: data.profile.counselor?.name || "",
            });
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/profile-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          profile: { ...form, counselor: { name: form.counselor } },
        }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setUser(data.profile);
        setEdit(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-semibold">Loading profile...</p>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-850 p-6 flex flex-col gap-6 min-h-screen border-r border-gray-800">
        <div className="flex items-center gap-3 mb-8">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-12 h-12 rounded-full border-2 border-yellow-400"
          />
          <div>
            <div className="font-bold text-lg">{user.username}</div>
            <div className="text-xs text-gray-400">
              {user.stats?.level ? `Level ${user.stats.level}` : ""}
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-4">
          <SidebarLink label="Profile" active />
          <SidebarLink label="Reports" />
          <SidebarLink label="Progress" />
          <SidebarLink label="Sessions" />
          <SidebarLink label="Settings" />
        </nav>
        <div className="mt-auto">
          <Link href="/(root)/support">
            <button className="w-full px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow hover:bg-yellow-300 transition">
              Get Support
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        {/* Profile Header */}
        <div className="w-full max-w-4xl bg-gray-850 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow"
            />
            <div className="flex-1">
              {edit ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="bg-gray-800 text-gray-100 rounded px-3 py-1"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <textarea
                    className="bg-gray-800 text-gray-100 rounded px-3 py-1"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                  />
                  <input
                    className="bg-gray-800 text-gray-100 rounded px-3 py-1"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                  />
                  <input
                    className="bg-gray-800 text-gray-100 rounded px-3 py-1"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                  <input
                    className="bg-gray-800 text-gray-100 rounded px-3 py-1"
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                  />
                  <div className="flex gap-2 mt-2">
                    <button className="px-4 py-1 bg-green-500 rounded" onClick={handleSave}>
                      Save
                    </button>
                    <button
                      className="px-4 py-1 bg-gray-700 rounded"
                      onClick={() => setEdit(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold">{form.name}</h2>
                  <p className="text-yellow-400 text-lg">@{user.username}</p>
                  <p className="text-gray-400 mt-2">{form.bio}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    <span>📍 {form.location}</span>
                    <span>Joined {user.joined}</span>
                    <span>📧 {form.email}</span>
                    <span>🎂 Age: {form.age}</span>
                  </div>
                  <button
                    className="mt-2 px-4 py-1 bg-yellow-400 text-gray-900 rounded font-bold hover:bg-yellow-300"
                    onClick={() => setEdit(true)}
                  >
                    Edit Data
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between mt-8 flex-wrap gap-4">
            <Stat label="Riddles Solved" value={user.stats?.riddlesSolved || 0} />
            <Stat label="Adventures" value={user.stats?.adventuresCompleted || 0} />
            <Stat label="Badges" value={user.stats?.badges || 0} />
            <Stat label="Streak" value={`${user.stats?.streak || 0} days`} />
            <Stat label="Sessions" value={user.stats?.sessions || 0} />
          </div>
        </div>

        {/* Progress Graph */}
        <div className="w-full max-w-4xl bg-gray-850 rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">Your Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={progressData}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="week" stroke="#aaa" />
              <YAxis domain={[50, 100]} stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#facc15"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-green-400 font-semibold">
            {user.stats?.improvement === "Moderate"
              ? "You're making steady progress! Keep it up!"
              : "Let's work together for more improvement!"}
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full max-w-4xl bg-gray-850 rounded-2xl shadow-lg p-6">
          <div className="flex gap-6 border-b border-gray-700 mb-4">
            <TabButton
              label="Recent Activity"
              active={tab === "activity"}
              onClick={() => setTab("activity")}
            />
            <TabButton
              label="Badges"
              active={tab === "badges"}
              onClick={() => setTab("badges")}
            />
            <TabButton
              label="Session History"
              active={tab === "sessions"}
              onClick={() => setTab("sessions")}
            />
          </div>
          {tab === "activity" && (
            <ul>
              {user.recent?.map((item, idx) => (
                <li key={idx} className="mb-4 flex items-center gap-4">
                  <span className="text-xl">
                    {item.type === "Solved Riddle"
                      ? "🧩"
                      : item.type === "Completed Adventure"
                      ? "🗺️"
                      : "🏅"}
                  </span>
                  <div>
                    <div className="font-medium">{item.type}</div>
                    <div className="text-gray-400 text-sm">{item.desc}</div>
                    <div className="text-gray-600 text-xs">{item.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {tab === "badges" && (
            <div className="flex flex-wrap gap-4">
              {user.badges?.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-gray-800 rounded-xl px-4 py-3 shadow"
                >
                  <span className="text-3xl mb-1">{badge.icon}</span>
                  <span className="font-semibold text-yellow-300">{badge.name}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "sessions" && (
            <div>
              <div className="mb-2 font-semibold">Session History</div>
              <ul className="text-gray-400 text-sm">
                <li>2025-09-09: Attended counseling session with {user.counselor?.name}</li>
                <li>2025-09-02: Completed self-assessment</li>
                <li>2025-08-25: Joined group therapy session</li>
              </ul>
            </div>
          )}
        </div>

        {/* Wellness Tips & Counselor */}
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 mt-8">
          <div className="flex-1 bg-gray-850 rounded-2xl shadow-lg p-6">
            <h4 className="font-bold text-lg mb-2">Wellness Tip</h4>
            <p className="text-gray-300">
              Take regular breaks from screens, try mindfulness exercises, and connect with friends offline to maintain a healthy balance!
            </p>
          </div>
          <div className="flex-1 bg-gray-850 rounded-2xl shadow-lg p-6">
            <h4 className="font-bold text-lg mb-2">Your Counselor</h4>
            <div className="text-gray-300 mb-1">{user.counselor?.name}</div>
            <div className="text-gray-400 text-sm">Email: {user.counselor?.email}</div>
            <div className="text-gray-400 text-sm">Phone: {user.counselor?.phone}</div>
            <Link href="/(root)/support">
              <button className="mt-3 px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow hover:bg-yellow-300 transition">
                Contact Counselor
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-[90px]">
      <span className="text-2xl font-bold text-yellow-300">{value}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

function SidebarLink({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`text-left px-3 py-2 rounded font-semibold transition ${
        active
          ? "bg-yellow-400 text-gray-900"
          : "text-gray-300 hover:bg-gray-800 hover:text-yellow-300"
      }`}
    >
      {label}
    </button>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`pb-2 font-semibold transition ${
        active ? "border-b-2 border-yellow-400 text-yellow-300" : "text-gray-400"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
