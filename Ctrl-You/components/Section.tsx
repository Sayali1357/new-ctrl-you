interface SectionProps {
  title: string;
  points: string[];
}

export default function Section({ title, points }: SectionProps) {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto bg-black">
      {/* Section Title */}
      <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>

      {/* List */}
      <ul className="space-y-4">
        {points.map((point, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <span>{point}</span>
            <span className="text-gray-400 text-lg">»»»</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
