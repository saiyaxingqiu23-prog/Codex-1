'use client';

import { useEffect, useState } from 'react';

type DashboardData = {
  totalSubmissions: number;
  avgScores: {
    grammarScore: number | null;
    naturalnessScore: number | null;
    nativeLikenessScore: number | null;
  };
  topErrors: Array<{ id: string; category: string; pattern: string; count: number }>;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/dashboard').then(async (res) => {
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? 'Failed to load dashboard');
        return;
      }

      setData(body);
    });
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Learning Dashboard</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Submissions" value={data?.totalSubmissions ?? 0} />
        <Metric title="Grammar" value={Math.round(data?.avgScores.grammarScore ?? 0)} />
        <Metric title="Naturalness" value={Math.round(data?.avgScores.naturalnessScore ?? 0)} />
        <Metric title="Native-likeness" value={Math.round(data?.avgScores.nativeLikenessScore ?? 0)} />
      </div>
      <div className="rounded border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Top recurring errors</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {data?.topErrors.map((entry) => (
            <li key={entry.id}>
              {entry.category}: {entry.pattern} ({entry.count})
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4 text-center shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-brand-dark">{value}</p>
    </div>
  );
}
