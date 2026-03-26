"use client";

import React, { useEffect, useRef, useState } from "react";

type FeatureCardProps = {
  title: string;
  desc: string;
  img: string;
  index?: number;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, desc, img, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2, // Trigger when 10% of the card is visible
        rootMargin: "0px 0px -50px 0px",  // Start animation slightly before fully visible
      }
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 transform transition-all duration-700 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30 cursor-pointer ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-12'
      }`}
      style={{
        transitionDelay: isVisible ? `${index * 150}ms` : '0ms'
      }}
    >
      {/* Image container */}
      <div
        className="h-48 w-full bg-cover bg-center transition-transform duration-300 ease-in-out hover:scale-110"
        style={{ backgroundImage: `url(${img})` }}
      ></div>
      {/* Text portion */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-gray-900">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm mt-1 text-gray-300">{desc}</p>
      </div>
    </div>
  );
};

export default FeatureCard;