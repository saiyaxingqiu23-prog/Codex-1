export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-bold text-brand-dark">FluentMind</h1>
      <p className="max-w-3xl text-lg text-slate-700">
        Improve your American English by writing, speaking in role simulations, and tracking your personal mistakes every day.
      </p>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Core Features</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
          <li>AI writing correction with explanations and style upgrades.</li>
          <li>Role-based simulation chats (interviewer, professor, friend, boss).</li>
          <li>Personal error tracking dashboard and analytics.</li>
          <li>Daily output challenge with multi-dimension AI scoring.</li>
        </ul>
      </div>
    </section>
  );
}
