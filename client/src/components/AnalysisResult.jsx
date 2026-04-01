import DistortionCard from './DistortionCard.jsx';

export default function AnalysisResult({ result }) {
  if (!result) return null;

  return (
    <div className="flex flex-col gap-4">
      {result.distortions.length === 0 ? (
        <p className="text-sm text-stone-600">
          No strong cognitive distortions detected in this thought.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Distortions found
          </h2>
          {result.distortions.map((d) => (
            <DistortionCard key={d.id} distortion={d} mode="result" />
          ))}
        </div>
      )}

      {result.reframe && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-amber-700">
            Reframe
          </h2>
          <p className="text-sm text-stone-700">{result.reframe}</p>
        </div>
      )}

      {result.disclaimer && (
        <p className="text-xs text-stone-400">{result.disclaimer}</p>
      )}
    </div>
  );
}
