"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import app from "@/firebase/firebase"; // your firebase.ts
     
const counselors = [
  { name: "Dr. Priya Sharma", email: "priya.sharma@counsel.com" },
  { name: "Mr. John Lee", email: "john.lee@counsel.com" },
  { name: "Ms. Fatima Noor", email: "fatima.noor@counsel.com" },
];

const steps = [
  "Name & Username",
  "Contact & Age",
  "Location",
  "About You",
  "Avatar & Counselor",
];

const bioOptions = [
  "I love solving puzzles and riddles!",
  "I enjoy team games and making new friends.",
  "I’m working on balancing my gaming and studies.",
  "I like exploring new adventures and stories.",
  "Write your own",
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    age: "",
    location: "",
    bio: "",
    avatar: "",
    counselor: counselors[0].email,
  });
  const [step, setStep] = useState(0);
  const [bioChoice, setBioChoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const progress = ((step + 1) / steps.length) * 100;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  
async function handleNext(e?: React.FormEvent) {
  if (e) e.preventDefault();

  if (step === 3) {
    if (bioChoice === "Write your own") {
      if (!form.bio.trim()) return;
    } else {
      setForm((prev) => ({ ...prev, bio: bioChoice }));
    }
  }

  if (step < steps.length - 1) {
    setStep(step + 1);
  } else {
    setLoading(true);
    setError("");

    try {
      // ✅ Get current Firebase user
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");

      const uid = user.uid;

      // ✅ Send both uid and profile
      const res = await fetch("/api/profile-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, profile: form }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Request failed with ${res.status}`);
      }

      console.log("Profile saved:", data.profile);
      if (parseInt(form.age) < 18) {
        router.push("/parental-control");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      console.error("Profile setup error:", err);
      setError( "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-gray-850 rounded-3xl shadow-2xl p-8 relative"
      >
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-700 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 via-yellow-400 to-red-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <h1 className="text-3xl font-extrabold text-yellow-300 mb-2 text-center">
          Lets Set Up Your Profile
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Step {step + 1} of {steps.length}: {steps[step]}
        </p>

        {error && (
          <div className="mb-4 text-red-400 font-semibold text-center">{error}</div>
        )}

        <form onSubmit={handleNext} className="flex flex-col gap-4">
          {/* Step 1 */}
          {step === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              <label className="block text-pink-400 font-semibold mb-1">
                What is your name?
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-pink-400 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </label>
              <label className="block text-yellow-400 font-semibold mb-1">
                Choose a username
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-yellow-400 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </label>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              <label className="block text-pink-400 font-semibold mb-1">
                Your email address
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-pink-400 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="block text-yellow-400 font-semibold mb-1">
                How old are you?
                <input
                  type="number"
                  min={10}
                  max={99}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-yellow-400 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </label>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              <label className="block text-pink-400 font-semibold mb-1">
                Where are you from?
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-pink-400 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </label>
            </motion.div>
          )}

          {/* Step 4 */}
          {step === 3 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              <div className="text-yellow-300 font-semibold mb-2">
                Which of these describes you best?
              </div>
              <div className="flex flex-col gap-2">
                {bioOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border-2 transition ${
                      bioChoice === option
                        ? "border-pink-500 bg-pink-900/30 text-pink-200"
                        : "border-gray-700 bg-gray-900 text-gray-100 hover:border-yellow-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="bioChoice"
                      value={option}
                      checked={bioChoice === option}
                      onChange={() => {
                        setBioChoice(option);
                        if (option !== "Write your own") setForm({ ...form, bio: "" });
                      }}
                      className="accent-pink-500"
                    />
                    {option}
                  </label>
                ))}
                {bioChoice === "Write your own" && (
                  <textarea
                    className="w-full mt-2 px-3 py-2 rounded-lg border border-yellow-400 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    name="bio"
                    value={form.bio}
                    onChange={(e) => {
                      setForm({ ...form, bio: e.target.value });
                      setBioChoice("Write your own");
                    }}
                    rows={2}
                    maxLength={120}
                    placeholder="Write something unique about yourself!"
                    required
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5 */}
          {step === 4 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              <label className="block text-pink-400 font-semibold mb-1">
                Upload your avatar
                <input
                  type="file"
                  accept="image/*"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-pink-400 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm({ ...form, avatar: reader.result as string }); // save base64
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  required
                />
                {form.avatar && (
                  <img
                    src={form.avatar}
                    alt="avatar preview"
                    className="w-16 h-16 rounded-full mt-3 border-2 border-yellow-400 shadow"
                  />
                )}
              </label>

              <label className="block text-yellow-400 font-semibold mb-1">
                Choose your counselor
                <select
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-yellow-400 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  name="counselor"
                  value={form.counselor}
                  onChange={handleChange}
                  required
                >
                  {counselors.map((c) => (
                    <option key={c.email} value={c.email}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-bold transition ${
                step === 0
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              }`}
              onClick={handleBack}
              disabled={step === 0 || loading}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-pink-600 via-yellow-400 to-red-500 text-gray-900 font-bold rounded-xl shadow hover:from-pink-700 hover:to-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                loading ||
                (step === 3 && (!bioChoice || (bioChoice === "Write your own" && !form.bio.trim())))
              }
            >
              {loading ? "Saving..." : step === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );}