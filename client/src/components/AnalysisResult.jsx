import DistortionCard from './DistortionCard.jsx';

export default function AnalysisResult({ result }) {
  if (!result) return null;

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
            <DistortionCard key={d.id} distortion={d} mode="result" />
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
