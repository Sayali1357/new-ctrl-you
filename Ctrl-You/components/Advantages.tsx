"use client";

import React, { useEffect, useRef, useState } from "react";

const advantages = [
  {
    title: "Focus & Productivity",
    description:
      "Struggling to stay focused on studies or tasks? Ctrl+You helps reduce distractions, balance screen time, and rebuild strong study habits.",
  },
  {
    title: "Mental Well-being",
    description:
      "Excessive gaming can affect sleep, mood, and confidence. Our platform provides AI-guided support and mindfulness techniques for a healthier mind.",
  },
  {
    title: "Social Connections",
    description:
      "Gaming addiction often reduces real-life interactions. Ctrl+You encourages better communication and helps rebuild strong bonds with friends and family.",
  },
  {
    title: "Academic Growth",
    description:
      "Stay on track with your goals. Ctrl+You gives personalized strategies, reminders, and tools to boost your academic performance.",
  },
  {
    title: "Healthy Screen Habits",
    description:
      "We help students balance online and offline life by building healthy screen routines, reducing overuse, and encouraging mindful tech usage.",
  },
  {
    title: "Career Guidance",
    description:
      "Ctrl+You provides personalized academic and career recommendations, helping students make confident decisions about their future path.",
  },
];

const Advantages = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the component is visible
        rootMargin: "0px 0px -50px 0px", // Start animation slightly before fully visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-100"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 
          className={`text-3xl md:text-4xl font-bold text-center mb-12 text-white transition-all duration-800 ease-out ${
            isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-8'
          }`}
        >
          How Ctrl+You Helps Students
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((adv, index) => (
            <div
              key={index}
              className={`bg-gray-800 rounded-2xl shadow-lg p-6 text-center transform transition-all duration-700 ease-out hover:scale-105 hover:shadow-2xl hover:bg-gray-700 hover:-translate-y-2 group ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : '0ms'
              }}
            >
              <h3 className="text-xl font-semibold mb-3 text-white transition-colors duration-300 group-hover:text-blue-300">
                {adv.title}
              </h3>
              <p className="text-gray-300 mb-4 transition-colors duration-300 group-hover:text-gray-200">
                {adv.description}
              </p>
              <a
                href="#"
                className="text-blue-400 font-medium transition-all duration-300 hover:text-blue-300 hover:underline transform hover:scale-110 inline-block"
              >
                Read More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;