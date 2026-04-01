import { useState } from 'react';

export default function HistoryPanel({ entries, onSelect, onClear }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="text-sm font-bold text-stone-600 hover:text-stone-900 transition-colors"
          aria-expanded={isOpen}
        >
          History {isOpen ? '▾' : '▸'}
        </button>
        {isOpen && entries.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-stone-400 hover:text-rose-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {isOpen && (
        <div className="flex flex-col gap-0.5">
          {entries.length === 0 ? (
            <p className="px-2 py-1 text-xs text-stone-400 italic">No history yet.</p>
          ) : (
            entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="rounded-lg px-2 py-2 text-left text-xs text-stone-600 hover:bg-amber-50 hover:text-stone-900 truncate transition-colors"
              >
                {entry.thought}
              </button>
            ))
          )}
        </div>
      )}
    </aside>
  );
}
