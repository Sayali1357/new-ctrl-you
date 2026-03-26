export default function DetoxPlannerCard({ feedback }: { feedback: any }) {
  if (!feedback) return null;

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
      <h2 className="text-2xl font-bold mb-3">🧘 Personalized Detox Plan</h2>

      <p className="mb-5 italic">{feedback.totalSessionSummary}</p>

      <div className="space-y-4">
        <Section title="💭 Emotional Triggers" text={feedback.emotionalTriggers} />
        <Section title="🎮 Behavioral Patterns" text={feedback.behavioralPatterns} />
        <Section title="💪 Coping Strategies" text={feedback.copingStrategies} />
        <Section title="🌟 Motivation" text={feedback.motivationalFeedback} />
        <Section title="📅 Digital Detox Plan" text={feedback.personalizedPlan} />
      </div>
    </div>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white/10 p-3 rounded-lg">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p>{text}</p>
    </div>
  );
}
