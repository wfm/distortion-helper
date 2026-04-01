import { useState } from 'react';
import ThoughtInput from './components/ThoughtInput.jsx';
import AnalysisResult from './components/AnalysisResult.jsx';
import DistortionCard from './components/DistortionCard.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import useAnalysis from './hooks/useAnalysis.js';
import useHistory from './hooks/useHistory.js';
import distortions from './data/distortions.js';

const TABS = ['Analyze', 'Reference'];

export default function App() {
  const [tab, setTab] = useState('Analyze');
  const { loading, error, result, setResult, analyze } = useAnalysis();
  const { entries, addEntry, clearHistory } = useHistory();

  async function handleSubmit(thought) {
    const data = await analyze(thought);
    if (data) {
      addEntry(thought, data);
    }
  }

  function handleHistorySelect(entry) {
    setResult(entry.result);
    setTab('Analyze');
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-stone-800">Distortion Helper</h1>
      </header>

      <div className="mx-auto flex max-w-5xl gap-6 p-6">
        {/* Sidebar */}
        <div className="w-52 shrink-0">
          <HistoryPanel
            entries={entries}
            onSelect={handleHistorySelect}
            onClear={clearHistory}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-stone-200">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium ${
                  tab === t
                    ? 'border-b-2 border-amber-500 text-amber-700'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Analyze' && (
            <div className="flex flex-col gap-6">
              <ThoughtInput onSubmit={handleSubmit} loading={loading} />
              {error && (
                <p className="text-sm text-rose-600">{error}</p>
              )}
              <AnalysisResult result={result} />
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
