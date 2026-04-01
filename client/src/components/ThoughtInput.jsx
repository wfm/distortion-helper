import { useState } from 'react';

export default function ThoughtInput({ onSubmit, loading }) {
  const [thought, setThought] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (thought.trim()) {
      onSubmit(thought.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="thought-input" className="font-semibold text-stone-700">
          What thought is bothering you?
        </label>
        <p className="text-sm text-stone-400">
          Write it out as it comes — no editing needed.
        </p>
      </div>
      <textarea
        id="thought-input"
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        disabled={loading}
        rows={5}
        placeholder="e.g. I always mess everything up…"
        className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder-stone-300 resize-none shadow-sm transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || thought.trim() === ''}
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>
    </form>
  );
}
