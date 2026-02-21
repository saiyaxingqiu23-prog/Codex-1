'use client';

import { useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function ConversationPage() {
  const [role, setRole] = useState('interviewer');
  const [difficulty, setDifficulty] = useState('medium');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const startSession = async () => {
    setError('');
    const response = await fetch('/api/conversation/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, difficulty })
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? 'Failed to start session');
      return;
    }

    setSessionId(data.id);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!sessionId || !input) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const response = await fetch('/api/conversation/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message: userMessage.content })
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? 'Failed to send message');
      return;
    }

    setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Role-based Conversation Simulation</h1>
      <div className="flex gap-3">
        <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded border border-slate-300 p-2">
          <option value="interviewer">Interviewer</option>
          <option value="professor">Professor</option>
          <option value="friend">Friend</option>
          <option value="boss">Boss</option>
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded border border-slate-300 p-2">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button className="rounded bg-brand px-4 py-2 text-white" onClick={startSession}>
          Start Session
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="space-y-2 rounded border border-slate-200 bg-white p-4">
        {messages.map((message, index) => (
          <p key={index} className="text-sm">
            <strong>{message.role}:</strong> {message.content}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="w-full rounded border border-slate-300 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
        />
        <button className="rounded bg-brand px-4 py-2 text-white" onClick={sendMessage}>
          Send
        </button>
      </div>
    </section>
  );
}
