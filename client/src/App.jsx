import { useState } from 'react';
import ThoughtInput from './components/ThoughtInput.jsx';
import AnalysisResult from './components/AnalysisResult.jsx';
import DistortionCard from './components/DistortionCard.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import LoginForm from './components/LoginForm.jsx';
import useAnalysis from './hooks/useAnalysis.js';
import useHistory from './hooks/useHistory.js';
import useReflect from './hooks/useReflect.js';
import distortions from './data/distortions.js';
import ReflectResult from './components/ReflectResult.jsx';

const TABS = ['Analyze', 'Reference', 'Patterns'];

export default function App() {
  const [credentials, setCredentials] = useState(null);
  const [tab, setTab] = useState('Analyze');
  const [submittedThought, setSubmittedThought] = useState('');
  const [inputKey, setInputKey] = useState(0);
  const [reflectKey, setReflectKey] = useState(0);
  const { loading, error, result, setResult, analyze } = useAnalysis(credentials);
  const { entries, addEntry, clearHistory } = useHistory();
  const { reflectLoading, reflectError, reflectResult, practiceLoading, practiceError, feedback, reflect, submitPractice, reset } = useReflect(credentials);

  async function handleSubmit(thought) {
    setSubmittedThought(thought);
    const data = await analyze(thought);
    if (data) {
      addEntry(thought, data);
      setInputKey((k) => k + 1);
    }
  }

  function handleHistorySelect(entry) {
    setSubmittedThought(entry.thought);
    setResult(entry.result);
    setTab('Analyze');
  }

  async function handleReflect() {
    setTab('Patterns');
    setReflectKey((k) => k + 1);
    await reflect(entries);
  }

  if (!credentials) return <LoginForm onSuccess={setCredentials} />;

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-amber-50 px-6 py-5">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-xl font-bold text-stone-800">Distortion Helper</h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Spot the thought patterns that keep you stuck — and find a kinder way through.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl gap-6 p-4 sm:p-6 flex flex-col sm:flex-row">
        {/* Sidebar */}
        <div className="sm:w-52 sm:shrink-0">
          <HistoryPanel
            entries={entries}
            onSelect={handleHistorySelect}
            onClear={() => { clearHistory(); setResult(null); setSubmittedThought(''); reset(); }}
            onReflect={handleReflect}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex gap-1 border-b-2 border-stone-200">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
                  tab === t
                    ? 'border-b-2 -mb-0.5 border-amber-500 text-amber-700'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Analyze' && (
            <div className="flex flex-col gap-6">
              <ThoughtInput key={inputKey} onSubmit={handleSubmit} loading={loading} />
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
              {submittedThought && (loading || result) && (
                <div className="rounded-xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-stone-400">Your thought</p>
                  <p className="whitespace-pre-wrap text-stone-700 leading-relaxed">{submittedThought}</p>
                </div>
              )}
              <AnalysisResult result={result} loading={loading} />
            </div>
          )}

          {tab === 'Patterns' && (
            <div className="flex flex-col gap-6">
              {reflectError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {reflectError}
                </div>
              )}
              {!reflectError && !reflectLoading && !reflectResult && (
                <p className="text-sm text-stone-400 italic">Add at least 3 entries, then click "Review My Patterns" in your history to get started.</p>
              )}
              {!reflectError && (
                <ReflectResult
                  key={reflectKey}
                  result={reflectResult}
                  loading={reflectLoading}
                  onSubmitPractice={submitPractice}
                  practiceLoading={practiceLoading}
                  practiceError={practiceError}
                  feedback={feedback}
                />
              )}
            </div>
          )}

          {tab === 'Reference' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {distortions.map((d) => (
                <DistortionCard key={d.id} distortion={d} mode="reference" />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
