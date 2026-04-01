// Used in two contexts:
// - "reference" mode: shows static data from distortions.js
// - "result" mode: shows AI-matched distortion with explanation + severity badge

export default function DistortionCard({ distortion, mode = 'reference' }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-stone-800">{distortion.name}</h3>
        {mode === 'result' && distortion.severity && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              distortion.severity === 'primary'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {distortion.severity}
          </span>
        )}
      </div>

      {mode === 'result' ? (
        <p className="mt-1 text-sm text-stone-600">{distortion.explanation}</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-stone-600">{distortion.shortDescription}</p>
          {distortion.example && (
            <p className="mt-2 text-sm italic text-stone-500">{distortion.example}</p>
          )}
          {distortion.reframeTechnique && (
            <p className="mt-2 text-xs font-medium text-amber-700">
              Reframe: {distortion.reframeTechnique}
            </p>
          )}
        </>
      )}
    </div>
  );
}
