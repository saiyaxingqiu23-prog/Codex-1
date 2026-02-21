'use client';

import { useEffect, useState } from 'react';

type Prompt = { id: string; prompt: string };

type Score = {
  grammarScore: number;
  naturalnessScore: number;
  nativeLikenessScore: number;
  feedback: string;
};

export default function ChallengePage() {
  const [dailyPrompt, setDailyPrompt] = useState<Prompt | null>(null);
  const [response, setResponse] = useState('');
  const [score, setScore] = useState<Score | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/challenge/daily').then(async (res) => setDailyPrompt(await res.json()));
  }, []);

  const submit = async () => {
    if (!dailyPrompt) return;

    setError('');
    const res = await fetch('/api/challenge/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId: dailyPrompt.id, response })
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Failed to submit challenge');
      return;
    }

    setScore(data);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Daily Output Challenge</h1>
      <p className="rounded bg-white p-4 shadow-sm">{dailyPrompt?.prompt ?? 'No prompt yet. Seed one in DB.'}</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <textarea className="h-40 w-full rounded border border-slate-300 p-3" value={response} onChange={(e) => setResponse(e.target.value)} />
      <button className="rounded bg-brand px-4 py-2 text-white" onClick={submit}>
        Submit for Scoring
      </button>
      {score && <pre className="rounded bg-slate-900 p-4 text-sm text-slate-100">{JSON.stringify(score, null, 2)}</pre>}
    </section>
  );
}
