/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "framer-motion";

interface NewsItem {
  id: number;
  title: string;
  source: string;
  url: string;
  excerpt: string;
}

interface Newspaper {
  id: number;
  name: string;
  url: string;
  logo: string; // Optional: could use placeholder or real logos
}

export default function NewsCorner() {
  const news: NewsItem[] = [
    {
      id: 1,
      title: "New Guidelines on Daily Exercise",
      source: "Healthline",
      url: "https://www.healthline.com/health/fitness-exercise-guidelines",
      excerpt: "Experts recommend at least 30 minutes of daily physical activity for adults.",
    },
    {
      id: 2,
      title: "Mindfulness Practices Gain Popularity",
      source: "BBC Health",
      url: "https://www.bbc.com/news/health-56789123",
      excerpt: "Mindfulness and meditation are becoming a staple in wellness routines worldwide.",
    },
    {
      id: 3,
      title: "Top Superfoods to Include in Your Diet",
      source: "Harvard Nutrition",
      url: "https://www.hsph.harvard.edu/nutritionsource/superfoods/",
      excerpt: "A guide to nutrient-rich foods that promote long-term health.",
    },
    {
      id: 4,
      title: "How Sleep Affects Mental Health",
      source: "Psychology Today",
      url: "https://www.psychologytoday.com/us/basics/sleep",
      excerpt: "Sleep quality is directly linked to mood, focus, and stress management.",
    },
  ];

  const newspapers: Newspaper[] = [
    { id: 1, name: "The Times of India", url: "https://timesofindia.indiatimes.com/", logo: "https://via.placeholder.com/150x80?text=TOI" },
    { id: 2, name: "The Hindu", url: "https://www.thehindu.com/", logo: "https://via.placeholder.com/150x80?text=The+Hindu" },
    { id: 3, name: "The Guardian", url: "https://www.theguardian.com/international", logo: "https://via.placeholder.com/150x80?text=Guardian" },
    { id: 4, name: "BBC News", url: "https://www.bbc.com/news", logo: "https://via.placeholder.com/150x80?text=BBC" },
    { id: 5, name: "Hindustan Times", url: "https://www.hindustantimes.com/", logo: "https://via.placeholder.com/150x80?text=HT" },
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
          📰 News Corner
        </motion.h1>
        <p className="text-center text-lg text-gray-600">
          Stay updated with the latest health and wellness news.
        </p>

        {/* Daily English Newspapers (Horizontal Scroll) */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">🗞 Daily Newspapers</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {newspapers.map((paper) => (
              <motion.a
                key={paper.id}
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="min-w-[150px] bg-white rounded-xl shadow-md p-3 flex flex-col items-center justify-center hover:shadow-lg transition"
              >
                <img src={paper.logo} alt={paper.name} className="w-full h-20 object-contain mb-2" />
                <p className="text-sm text-gray-700 font-semibold text-center">{paper.name}</p>
              </motion.a>
            ))}
          </div>
        </section>

        {/* News Grid */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">📰 Latest Health News</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer flex flex-col justify-between h-60"
              >
                <h3 className="font-bold text-lg text-emerald-700 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.source}</p>
                <p className="text-gray-600 text-sm flex-1">{item.excerpt}</p>
              </motion.a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}