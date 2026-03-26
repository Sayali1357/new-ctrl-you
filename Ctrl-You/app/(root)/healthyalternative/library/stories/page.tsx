"use client";
import { motion } from "framer-motion";

interface Story {
  id: number;
  title: string;
  source: string;
  url: string;
  excerpt: string;
}

export default function StoriesPage() {
  // Section 1: Book Recommendations / Popular Reads
  const bookRecommendations: Story[] = [
    {
      id: 1,
      title: "Atomic Habits",
      source: "James Clear",
      url: "https://jamesclear.com/atomic-habits",
      excerpt: "A proven framework for building good habits and breaking bad ones.",
    },
    {
      id: 2,
      title: "Ikigai: The Japanese Secret to a Long and Happy Life",
      source: "Héctor García & Francesc Miralles",
      url: "https://www.penguinrandomhouse.com/books/546694/ikigai-by-hector-garcia-and-francesc-miralles/",
      excerpt: "Discover your reason for being and the art of living with purpose.",
    },
    {
      id: 3,
      title: "The Power of Now",
      source: "Eckhart Tolle",
      url: "https://www.eckharttolle.com/power-of-now-excerpt/",
      excerpt: "A guide to spiritual enlightenment through present moment awareness.",
    },
    {
      id: 4,
      title: "Deep Work",
      source: "Cal Newport",
      url: "https://www.calnewport.com/books/deep-work/",
      excerpt: "Rules for focused success in a distracted world.",
    },
  ];

  // Section 2: Wellness Stories (articles online)
  const wellnessStories: Story[] = [
    {
      id: 101,
      title: "How Journaling Improves Mental Health",
      source: "Psychology Today",
      url: "https://www.psychologytoday.com/us/blog/the-right-mindset/202104/how-journaling-improves-mental-health",
      excerpt: "Writing regularly can reduce stress, boost mindfulness, and help balance emotions.",
    },
    {
      id: 102,
      title: "The Science of Yoga: Why It Works",
      source: "Harvard Health",
      url: "https://www.health.harvard.edu/staying-healthy/yoga-benefits-beyond-the-mat",
      excerpt: "From lowering blood pressure to improving focus, yoga has proven benefits beyond fitness.",
    },
    {
      id: 103,
      title: "Digital Detox: Why Unplugging Works Wonders",
      source: "BBC Future",
      url: "https://www.bbc.com/future/article/20211007-how-a-digital-detox-boosts-your-brain",
      excerpt: "Constant screen time drains attention. Discover how a weekend detox helps reset the mind.",
    },
    {
      id: 104,
      title: "Gardening Can Reduce Stress and Improve Mood",
      source: "The Guardian",
      url: "https://www.theguardian.com/lifeandstyle/2021/may/29/gardening-mental-health-benefits",
      excerpt: "Caring for plants has been shown to lower cortisol levels and bring joy.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 via-sky-50 to-emerald-50 text-gray-800 p-10">
      <section className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center text-emerald-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📖 Stories & Recommendations
        </motion.h1>
        <p className="text-center text-lg text-gray-600">
          Discover great books and inspiring wellness stories.
        </p>

        {/* Section 1: Book Recommendations */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
            📚 Popular Reads & Book Recommendations
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {bookRecommendations.map((book) => (
              <motion.a
                key={book.id}
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                className="min-w-[260px] bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="font-bold text-lg text-emerald-700 mb-2">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-2">By {book.source}</p>
                <p className="text-gray-600 text-sm">{book.excerpt}</p>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Section 2: Wellness Stories */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">
            🌱 Wellness Stories
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {wellnessStories.map((story) => (
              <motion.a
                key={story.id}
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                className="min-w-[260px] bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="font-bold text-lg text-emerald-700 mb-2">{story.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{story.source}</p>
                <p className="text-gray-600 text-sm">{story.excerpt}</p>
              </motion.a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}