'use client';

import { useState } from 'react';

type CorrectionResult = {
  corrections?: string[];
  explanations?: string[];
  naturalVersion?: string;
  advancedVersion?: string;
};

export default function WritingPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    const response = await fetch('/api/writing/correct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? 'Failed to correct writing');
      return;
    }

    setResult(data);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">AI Writing Correction</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <textarea
        className="h-48 w-full rounded border border-slate-300 p-3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your writing here..."
      />
      <button className="rounded bg-brand px-4 py-2 text-white" onClick={submit}>
        Correct Writing
      </button>
      {result && <pre className="overflow-x-auto rounded bg-slate-900 p-4 text-sm text-slate-100">{JSON.stringify(result, null, 2)}</pre>}
    </section>
  );
}
