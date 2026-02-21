'use client';

import { useEffect, useState } from 'react';

type ErrorLog = {
  id: string;
  category: string;
  pattern: string;
  explanation: string;
  count: number;
};

export default function ErrorsPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/errors')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Failed to load errors');
          return;
        }
        setErrors(data);
      })
      .catch(() => setError('Failed to load errors'));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Personal Error Tracking</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="rounded border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-100">
            <tr>
              <th className="p-3">Category</th>
              <th className="p-3">Pattern</th>
              <th className="p-3">Explanation</th>
              <th className="p-3">Count</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((log) => (
              <tr key={log.id} className="border-b border-slate-100">
                <td className="p-3">{log.category}</td>
                <td className="p-3">{log.pattern}</td>
                <td className="p-3">{log.explanation}</td>
                <td className="p-3">{log.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
