"use client";
import { useState } from "react";

export interface ScreenTime {
  total: number;
  gaming: number;
  social: number;
  productive: number;
}

interface Props {
  onSubmit: (data: ScreenTime) => void;
}

export default function ScreenTimeInput({ onSubmit }: Props) {
  const [data, setData] = useState<ScreenTime>({
    total: 6,
    gaming: 3,
    social: 1.5,
    productive: 1.5,
  });

  const handleChange = (field: keyof ScreenTime, value: number) => {
    setData({ ...data, [field]: value });
  };

  return (
    <div className="p-6 rounded-3xl shadow-lg bg-gray-800 w-full max-w-lg mx-auto mt-8 text-pink-300 border border-gray-700 backdrop-blur-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-pink-400 drop-shadow-lg">
        📱 Enter Your Daily Screen Time
      </h2>

      <div className="space-y-4">
        {(Object.keys(data) as (keyof ScreenTime)[]).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="font-semibold capitalize mb-1 text-pink-300">{field} (hours)</label>
            <input
              type="number"
              step={0.25}
              min={0}
              max={24}
              className="border border-gray-600 p-3 rounded-xl mt-1 bg-gray-700 text-pink-200 placeholder-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              value={data[field]}
              onChange={(e) => handleChange(field, parseFloat(e.target.value))}
              placeholder="0"
            />
          </div>
        ))}

        <button
          onClick={() => onSubmit(data)}
          className="w-full mt-6 py-3 rounded-xl font-bold bg-pink-500 hover:bg-pink-600 transition transform hover:scale-105 shadow-lg text-white"
        >
          Generate Detox Plan 🚀
        </button>
      </div>
    </div>
  );
}
