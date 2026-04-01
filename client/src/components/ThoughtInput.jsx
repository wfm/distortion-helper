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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="thought-input" className="text-sm font-medium text-stone-700">
        What thought is bothering you?
      </label>
      <textarea
        id="thought-input"
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        disabled={loading}
        rows={4}
        placeholder="e.g. I always mess everything up…"
        className="rounded-lg border border-stone-300 bg-white p-3 text-sm text-stone-800 placeholder-stone-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || thought.trim() === ''}
        className="self-end rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>
    </form>
  );
}
