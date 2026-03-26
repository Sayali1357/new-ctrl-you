import React from "react";
import FeatureCard from "@/components/FeatureCard";

const features = [
  {
    title: "Early Detection",
    desc: "AI detects risky behavior early",
    img: "magnifier.png",
  },
  {
    title: "AI Chatbot Therapist",
    desc: "Friendly Hinglish/English support",
    img: "/chatbot.png",
  },
  {
    title: "Gaming Pattern Tracker",
    desc: "Visualize your playtime",
    img: "/chart.png",
  },
  {
    title: "Progress Journal",
    desc: "Track moods and goals",
    img: "/journal.png",
  },
  {
    title: "Detox Planner",
    desc: "Get your screen-free routine",
    img: "/detox.png",
  },
  {
    title: "Gamified Rewards",
    desc: "Unlock achievements and earn badges",
    img: "/trophy.png",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-100">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
        Features
      </h1>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            desc={feature.desc}
            img={feature.img}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;