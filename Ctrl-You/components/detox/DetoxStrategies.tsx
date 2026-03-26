"use client";

const strategies = [
  {
    title: "🌿 Micro Detox",
    desc: "Take a 20-minute no-screen break every 2 hours to reset your dopamine.",
  },
  {
    title: "🚪 Dopamine Reset",
    desc: "Try a 24-hour no-gaming challenge to refresh your reward system.",
  },
  {
    title: "🎨 Creative Swap",
    desc: "Replace 1 hour of screen time with a hands-on hobby like painting or cooking.",
  },
  {
    title: "🤝 Social Challenge",
    desc: "Plan one real-world meetup or activity each day to reduce online reliance.",
  },
];

export default function DetoxStrategies() {
  return (
    <div className="mt-10 p-6 rounded-3xl shadow-xl bg-gray-900 text-pink-300 border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-center text-pink-400 drop-shadow-lg">
        🧠 Daily Detox Strategies
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((s, i) => (
          <div
            key={i}
            className="p-5 bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition border border-gray-700 text-pink-200"
          >
            <h3 className="font-semibold text-xl mb-2 text-pink-300">{s.title}</h3>
            <p className="text-pink-200">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
