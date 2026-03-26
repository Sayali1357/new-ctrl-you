"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FunFact {
  id: number;
  fact: string;
}

export default function FunFactCorner() {
  const allFunFacts: FunFact[] = [
    { id: 1, fact: "Bananas are berries, but strawberries aren’t." },
    { id: 2, fact: "Octopuses have three hearts." },
    { id: 3, fact: "Water can boil and freeze at the same time (triple point)." },
    { id: 4, fact: "Sharks existed before trees did." },
    { id: 5, fact: "Honey never spoils." },
    { id: 6, fact: "A day on Venus is longer than a year on Venus." },
    { id: 7, fact: "There’s a species of jellyfish that is biologically immortal." },
    { id: 8, fact: "Sloths can hold their breath longer than dolphins." },
    { id: 9, fact: "Your stomach gets a new lining every 3–4 days." },
    { id: 10, fact: "Water can dissolve more substances than any other liquid." },
    // Add more fun facts here...
  ];

  const [shownFacts, setShownFacts] = useState<number[]>([]);
  const [currentFact, setCurrentFact] = useState<FunFact | null>(null);

  const getNewFact = () => {
    const remainingFacts = allFunFacts.filter(f => !shownFacts.includes(f.id));
    if (remainingFacts.length === 0) {
      // Reset once all facts have been shown
      setShownFacts([]);
      setCurrentFact(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * remainingFacts.length);
    const fact = remainingFacts[randomIndex];
    setCurrentFact(fact);
    setShownFacts(prev => [...prev, fact.id]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50 text-gray-800 p-10 flex flex-col items-center">
      {/* Header */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center text-amber-700 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎉 Fun Fact Corner
      </motion.h1>
      <p className="text-center text-lg text-gray-700 mb-10">
        Learn 5 new fun facts and challenge your brain! Click “Next Fun Fact” to discover.
      </p>

      {/* Fun Fact Card */}
      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {currentFact && (
            <motion.div
              key={currentFact.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center text-xl md:text-2xl font-semibold text-amber-800 mb-6"
            >
              {currentFact.fact}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <button
          onClick={getNewFact}
          className="bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition transform hover:scale-105"
        >
          Next Fun Fact
        </button>
        <p className="text-gray-700 mt-2 md:mt-0">
          Facts learned: {shownFacts.length}/{allFunFacts.length}
        </p>
      </div>

      {/* Fun Fact Challenge */}
      {shownFacts.length > 0 && shownFacts.length % 5 === 0 && (
        <motion.div
          className="mt-10 bg-green-100 rounded-2xl p-6 text-center shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          🎊 Congrats! You&apos;ve discovered {shownFacts.length} fun facts! Keep going!
        </motion.div>
      )}
    </main>
  );
}
