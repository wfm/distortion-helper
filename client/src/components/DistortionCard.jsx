// Used in two contexts:
// - "reference" mode: shows static data from distortions.js
// - "result" mode: shows AI-matched distortion with explanation + severity badge

export default function DistortionCard({ distortion, mode = 'reference', onInfoClick }) {
  const severityBorder =
    mode === 'result'
      ? distortion.severity === 'primary'
        ? 'border-l-4 border-l-rose-400'
        : 'border-l-4 border-l-amber-400'
      : '';

  return (
    <div className={`rounded-xl border border-stone-200 bg-stone-50 px-4 py-4 shadow-sm ${severityBorder}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-stone-800">{distortion.name}</h3>
        {mode === 'result' && distortion.severity && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              distortion.severity === 'primary'
                ? 'bg-rose-100 text-rose-600'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            {distortion.severity}
          </span>
        )}
      </div>

      {mode === 'result' ? (
        <>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{distortion.explanation}</p>
          {onInfoClick && (
            <button
              onClick={onInfoClick}
              className="mt-3 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              Learn more about this distortion →
            </button>
          )}
        </>
      ) : (
        <>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{distortion.shortDescription}</p>
          {distortion.example && (
            <p className="mt-2.5 text-sm italic text-stone-400 border-l-2 border-stone-200 pl-3">
              {distortion.example}
            </p>
          )}
          {distortion.reframeTechnique && (
            <p className="mt-3 text-xs font-semibold text-amber-600">
              Reframe: {distortion.reframeTechnique}
            </p>
          )}
          {distortion.reframeTechniqueDescription && (
            <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
              {distortion.reframeTechniqueDescription}
            </p>
          )}
        </>
      )}
    </div>
  );
}
