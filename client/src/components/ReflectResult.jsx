import { useState } from 'react';

function Skeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
        <div className="h-3 w-24 rounded bg-stone-200 mb-3" />
        <div className="h-4 w-full rounded bg-stone-200 mb-2" />
        <div className="h-4 w-3/4 rounded bg-stone-200" />
      </div>
      <div className="rounded-xl border border-stone-200 bg-white px-5 py-4">
        <div className="h-3 w-36 rounded bg-stone-200 mb-3" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full rounded bg-stone-100" />
          <div className="h-3 w-4/5 rounded bg-stone-100" />
          <div className="h-3 w-3/5 rounded bg-stone-100" />
        </div>
      </div>
    </div>
  );
}

export default function ReflectResult({ result, loading, onSubmitPractice, practiceLoading, practiceError, feedback }) {
  const [practiceAttempt, setPracticeAttempt] = useState('');

  if (loading) return <Skeleton />;
  if (!result) return null;

  const maxCount = result.rankedDistortions[0]?.count || 1;

  function handleSubmit(e) {
    e.preventDefault();
    if (practiceAttempt.trim()) onSubmitPractice(practiceAttempt.trim());
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Theme */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-stone-400">What we notice</p>
        <p className="text-stone-700 leading-relaxed">{result.theme}</p>
      </div>

      {/* Ranked distortions */}
      <div className="rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-400">Recurring patterns</p>
        <ul className="flex flex-col gap-2">
          {result.rankedDistortions.map((d, i) => (
            <li key={d.id} className="flex items-center gap-3">
              <span className={`text-sm flex-1 min-w-0 truncate ${i === 0 ? 'font-semibold text-stone-800' : 'text-stone-600'}`}>
                {d.name}
              </span>
              <span className="text-xs text-stone-400 shrink-0">×{d.count}</span>
              <div className="w-24 shrink-0">
                <div
                  className="h-1.5 rounded-full bg-rose-300"
                  style={{ width: `${(d.count / maxCount) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Practice section */}
      <div className="rounded-xl border border-rose-100 bg-rose-50 px-5 py-4 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-rose-400">Practice this reframe</p>
        <p className="mb-3 text-stone-700 leading-relaxed">{result.practicePrompt}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={practiceAttempt}
            onChange={(e) => setPracticeAttempt(e.target.value)}
            rows={4}
            placeholder="Write your reframe here…"
            disabled={practiceLoading}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={practiceLoading || practiceAttempt.trim() === ''}
            className="self-start rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            {practiceLoading ? 'Submitting…' : 'Submit my reframe'}
          </button>
        </form>
        {practiceError && (
          <div className="mt-3 rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm text-rose-700">
            {practiceError}
          </div>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-600">Encouragement</p>
          <p className="text-stone-700 leading-relaxed">{feedback}</p>
        </div>
      )}
    </div>
  );
}
