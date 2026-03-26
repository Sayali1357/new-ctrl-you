/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";


export default function LibraryPage() {
  const [mindmaps, setMindmaps] = useState<string[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setMindmaps((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Connected sections with Next.js Link
  const sections = [
  { title: "📖 Stories", desc: "Wellness journeys & inspirations", link: "/healthyalternative/library/stories" },
  { title: "⭐ Most Read Articles", desc: "Popular healthy lifestyle reads", link: "/healthyalternative/library/articles" },
  { title: "📰 News Corner", desc: "Latest health & wellness updates", link: "/healthyalternative/library/news" },
  { title: "🎉 Fun Fact Corner", desc: "Quick bites for the curious mind", link: "/healthyalternative/library/funfacts" },
];

  const videos = [
    { title: "Morning Yoga", url: "https://www.youtube.com/embed/v7AYKMP6rOE" },
    { title: "Home Exercises", url: "https://www.youtube.com/embed/UItWltVZZmE" },
    { title: "Healthy Diet Tips", url: "https://www.youtube.com/embed/kqF9vZLIpF0" },
    { title: "Time Management", url: "https://www.youtube.com/embed/oTugjssqOT0" },
    { title: "Stress Relief", url: "https://www.youtube.com/embed/SEfs5TJZ6Nk" },
  ];

  const infographics = [
    { title: "Daily Wellness Checklist", img: "https://via.placeholder.com/300x200?text=Wellness+Checklist" },
    { title: "Pomodoro Technique", img: "https://via.placeholder.com/300x200?text=Pomodoro+Method" },
    { title: "Balanced Diet Plate", img: "https://via.placeholder.com/300x200?text=Balanced+Diet" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 via-sky-50 to-emerald-50 text-gray-800 p-10">
      <section className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center text-emerald-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🌱 Mini Wellness Library
        </motion.h1>
        <p className="text-center text-lg text-gray-600">
          A peaceful place for stories, learning, and creativity.
        </p>

        {/* Vertical Sections (Library Navigation) */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-6">📚 Explore Sections</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {sections.map((s, i) => (
              <Link key={i} href={s.link} passHref>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition border-l-4 border-emerald-400"
                >
                  <h3 className="font-bold text-xl text-emerald-700">{s.title}</h3>
                  <p className="text-gray-600 mt-2">{s.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Videos Section (Horizontal Scroll) */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">🎥 Learn Something New</h2>
          <p className="text-gray-600 mb-4">Yoga, exercises, healthy diet, and more.</p>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {videos.map((v, i) => (
              <div key={i} className="min-w-[280px] bg-white rounded-xl shadow-md overflow-hidden">
                <iframe
                  className="w-full h-40"
                  src={v.url}
                  title={v.title}
                  allowFullScreen
                ></iframe>
                <div className="p-3">
                  <h4 className="font-semibold text-emerald-700">{v.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Infographics Section */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">🖼 Classy Infographics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {infographics.map((info, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-white to-emerald-50 shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition"
              >
                <img src={info.img} alt={info.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-emerald-700">{info.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mindmap Exhibition Section */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">🧠 Mindmap Exhibition</h2>
          <p className="text-gray-600 mb-6">
            Explore creative mindmaps from others, or add your own at the bottom.
          </p>

          {/* Display uploaded mindmaps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {mindmaps.length === 0 && (
              <p className="text-gray-500 italic">No mindmaps yet — be the first to upload!</p>
            )}
            {mindmaps.map((src, i) => (
              <div key={i} className="bg-white shadow-md rounded-2xl overflow-hidden">
                <img src={src} alt={`Mindmap ${i}`} className="w-full h-48 object-contain bg-emerald-50" />
              </div>
            ))}
          </div>

          {/* Upload option (bottom corner) */}
          <div className="flex justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="block w-full max-w-sm border border-emerald-300 rounded-lg p-2 bg-white shadow-sm cursor-pointer"
            />
          </div>
        </section>
      </section>
    </main>
  );
}