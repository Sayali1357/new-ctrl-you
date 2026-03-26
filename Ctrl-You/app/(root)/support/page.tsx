"use client";

import { useState, useEffect, useRef } from "react";
import { FaVideo, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/firebase/firebase"; // ✅ your firebase config

export default function CounsellorPage() {
  const [activeOption, setActiveOption] = useState<"none" | "face" | "video" | "chat">("none");
  const [formData, setFormData] = useState<any>({
    uid: "",
    name: "",
    date: "",
    time: "",
    notes: "",
    meetingUrl: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showLink, setShowLink] = useState(false); // ✅ for meeting link visibility
  const sectionRef = useRef(null);

  // ✅ Address & Maps link
  const counsellorAddress = "Sunshine Counseling and Therapy Center, College Road, Nashik";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    counsellorAddress
  )}`;

  const whatsappNumber = "918080264565";

  // ✅ Get Firebase UID
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData((prev: any) => ({ ...prev, uid: user.uid, name: user.displayName || "" }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const appointmentDate = formData.date && formData.time
  ? new Date(`${formData.date}T${formData.time}`)
  : null;

  // ✅ WhatsApp with timestamp
  const openWhatsApp = () => {
    const now = new Date();
    const formatted = now.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const message = `Hello! I would like to connect with a counsellor. 📅 Sent on ${formatted}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // ✅ Control video link visibility (10 min before → 1 hr after)
  useEffect(() => {
    if (!formData.date || !formData.time) return;

    const start = new Date(`${formData.date}T${formData.time}`);
    const showFrom = new Date(start.getTime() - 10 * 60 * 1000); // 10 min before
    const hideAt = new Date(start.getTime() + 60 * 60 * 1000); // 1 hr after

    const checkVisibility = () => {
      const now = new Date();
      if (now >= showFrom && now <= hideAt) {
        setShowLink(true);
      } else {
        setShowLink(false);
      }
    };

    checkVisibility(); // run once immediately
    const interval = setInterval(checkVisibility, 30 * 1000); // check every 30s

    return () => clearInterval(interval);
  }, [formData.date, formData.time]);

  const counsellingOptions = [
    {
      id: "face",
      icon: FaMapMarkerAlt,
      title: "Face-to-Face Session",
      description: "Meet our professional counsellor in person.",
      address: counsellorAddress,
      color: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-500/10 to-cyan-500/10",
      borderColor: "border-teal-500/30",
    },
    {
      id: "video",
      icon: FaVideo,
      title: "Video Call",
      description: "Connect with the counsellor online from anywhere.",
      color: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-500/10 to-indigo-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      id: "chat",
      icon: FaWhatsapp,
      title: "Chat via WhatsApp",
      description: "Reach out directly through WhatsApp for quick assistance.",
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/30",
      onClick: openWhatsApp,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800 text-white relative overflow-hidden">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div ref={sectionRef} className="relative z-10 flex flex-col items-center p-6 lg:p-8">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="text-6xl lg:text-8xl mb-6">💚🧠</div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Connect with a Counsellor
            </h1>
            <p className="text-gray-300 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Choose the best way to get professional support today — whether in person, via video,
              or chat.
            </p>
          </motion.header>

          {/* Options */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto"
          >
            {counsellingOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br ${option.bgGradient} backdrop-blur-xl border ${option.borderColor} rounded-3xl p-6 lg:p-8 shadow-2xl cursor-pointer`}
                onClick={() => {
                  if (option.onClick) option.onClick();
                  else setActiveOption(activeOption === option.id ? "none" : (option.id as any));
                }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${option.color} flex items-center justify-center shadow-lg`}
                  >
                    <option.icon className="text-2xl text-white" />
                  </div>
                  <h2 className="text-xl font-bold">{option.title}</h2>
                  <p className="text-gray-300 text-sm">{option.description}</p>
                  {option.id === "face" && (
                    <p className="text-gray-400 text-xs">
                      📍{" "}
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        className="underline text-blue-400"
                      >
                        Get Directions
                      </a>
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* Video Appointment Form */}
          <AnimatePresence>
            {activeOption === "video" && (
              <motion.section
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
              >
                {!submitted ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const res = await fetch("/api/support", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...formData, type: "video", uid: "USER_UID" }),
                      });
                      const data = await res.json();

                      if (data.success) {
                        setSubmitted(true);
                        setFormData(data.appointment); // ✅ full object including meetingUrl

                      } else {
                        alert(data.message || "Booking failed");
                      }
                    }}
                    className="space-y-6"
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="w-full p-4 rounded-lg bg-white/10"
                    />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full p-4 rounded-lg bg-white/10"
                    />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full p-4 rounded-lg bg-white/10"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="submit"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                    >
                      Book Video Call 🎥
                    </motion.button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-blue-400">
                      Video Appointment Confirmed!
                    </h2>
                  <p className="text-gray-200 text-sm space-y-1">
                    📅 {appointmentDate ? appointmentDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : formData.date} 
                    at ⏰ {appointmentDate ? appointmentDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : formData.time}
                  </p>
                    {showLink ? (
                      <a
                        href={formData.meetingUrl}
                        target="_blank"
                        className="underline text-blue-400"
                      >
                        Join Meeting
                      </a>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        🔒 Meeting link will unlock 10 minutes before your session.
                      </p>
                    )}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {/* Face-to-Face Appointment Form */}
          <AnimatePresence>
            {activeOption === "face" && (
              <motion.section
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl"
              >
                {!submitted ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const res = await fetch("/api/support", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...formData, type: "face" }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setSubmitted(true);
                      } else {
                        alert(data.message || "Booking failed");
                      }
                    }}
                    className="space-y-6"
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="w-full p-4 rounded-lg bg-white/10"
                    />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full p-4 rounded-lg bg-white/10"
                    />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full p-4 rounded-lg bg-white/10"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      type="submit"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                    >
                      Book Face-to-Face Session 📍
                    </motion.button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-teal-400">
                      Face-to-Face Appointment Confirmed!
                    </h2>
                    <p>
                      {formData.date} at {formData.time}
                    </p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      className="underline text-blue-400"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
