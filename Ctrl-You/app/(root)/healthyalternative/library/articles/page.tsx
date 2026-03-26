"use client";
import { motion } from "framer-motion";

interface Article {
  id: number;
  title: string;
  source: string;
  url: string;
  excerpt: string;
}

export default function ArticlesPage() {
  // Section 1: Most Read Articles
  const mostRead: Article[] = [
    {
      id: 1,
      title: "10 Simple Tips for Better Time Management",
      source: "MindTools",
      url: "https://www.mindtools.com/a5wo118/time-management",
      excerpt: "Practical strategies to prioritize, plan, and make the most of your day.",
    },
    {
      id: 2,
      title: "Healthy Eating Plate & Diet Guide",
      source: "Harvard Nutrition",
      url: "https://www.hsph.harvard.edu/nutritionsource/healthy-eating-plate/",
      excerpt: "A visual guide to building balanced meals for energy and wellness.",
    },
    {
      id: 3,
      title: "The Importance of Sleep for Learning",
      source: "Sleep Foundation",
      url: "https://www.sleepfoundation.org/children-and-sleep/sleep-and-learning",
      excerpt: "How proper sleep helps memory, focus, and creativity.",
    },
    {
      id: 4,
      title: "Why Exercise Boosts Mental Health",
      source: "American Psychological Association",
      url: "https://www.apa.org/topics/exercise-fitness/stress",
      excerpt: "Exercise reduces stress hormones and improves emotional well-being.",
    },
  ];

  // Section 2: Healthy Lifestyle Articles
  const lifestyle: Article[] = [
    {
      id: 101,
      title: "Mindfulness for Beginners",
      source: "Headspace",
      url: "https://www.headspace.com/mindfulness/mindfulness-for-beginners",
      excerpt: "A simple guide to start practicing mindfulness in daily life.",
    },
    {
      id: 102,
      title: "The Pomodoro Technique Explained",
      source: "Todoist Blog",
      url: "https://todoist.com/productivity-methods/pomodoro-technique",
      excerpt: "Break work into focused sprints with refreshing breaks.",
    },
    {
      id: 103,
      title: "The Benefits of Journaling",
      source: "Positive Psychology",
      url: "https://positivepsychology.com/benefits-of-journaling/",
      excerpt: "Journaling boosts gratitude, reflection, and mental clarity.",
    },
    {
      id: 104,
      title: "Morning Routines of Successful People",
      source: "Medium",
      url: "https://medium.com/illumination/morning-routines-of-successful-people-6d1e35f1aa5e",
      excerpt: "Learn how leaders start their day with habits that energize them.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-teal-50 text-gray-800 p-10">
      <section className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center text-emerald-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📰 Wellness Articles
        </motion.h1>
        <p className="text-center text-lg text-gray-600">
          Explore insightful articles on healthy lifestyle, learning, and productivity.
        </p>

        {/* Section 1: Most Read Articles */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
            ⭐ Most Read Articles
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {mostRead.map((article) => (
              <motion.a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                className="min-w-[280px] bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="font-bold text-lg text-emerald-700 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{article.source}</p>
                <p className="text-gray-600 text-sm">{article.excerpt}</p>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Section 2: Healthy Lifestyle */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
            🌱 Healthy Lifestyle Reads
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {lifestyle.map((article) => (
              <motion.a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                className="min-w-[280px] bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="font-bold text-lg text-emerald-700 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{article.source}</p>
                <p className="text-gray-600 text-sm">{article.excerpt}</p>
              </motion.a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}