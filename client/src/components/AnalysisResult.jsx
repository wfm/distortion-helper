import DistortionCard from './DistortionCard.jsx';

function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Loading analysis" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="h-3 w-32 animate-pulse rounded bg-stone-200" />
        {[1, 2].map((n) => (
          <div key={n} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="h-4 w-40 animate-pulse rounded bg-stone-200" />
              <div className="h-4 w-14 animate-pulse rounded-full bg-stone-200" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-stone-100" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4 shadow-sm">
        <div className="mb-3 h-3 w-36 animate-pulse rounded bg-amber-200" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-amber-100" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-amber-100" />
        </div>
      </div>
    </div>
  );
}

export default function AnalysisResult({ result, loading, onDistortionClick }) {
  if (loading) return <Skeleton />;

  if (!result) return (
    <div className="rounded-xl border border-dashed border-stone-300 px-5 py-8 text-center">
      <p className="text-sm text-stone-400">
        Your analysis will appear here once you submit a thought.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {result.distortions.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white px-5 py-4 text-sm text-stone-500 shadow-sm">
          No strong cognitive distortions detected in this thought.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
            Distortions found
          </h2>
          {result.distortions.map((d) => (
            <DistortionCard
              key={d.id}
              distortion={d}
              mode="result"
              onInfoClick={onDistortionClick ? () => onDistortionClick(d) : null}
            />
          ))}
        </div>
      )}

      {result.reframe && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-600">
            A kinder perspective
          </h2>
          <p className="text-stone-700 leading-relaxed">{result.reframe}</p>
        </div>
      )}

      {result.disclaimer && (
        <p className="text-xs leading-relaxed text-stone-600 border-t border-stone-200 pt-4">
          {result.disclaimer}
        </p>
      )}
    </div>
  );
}
