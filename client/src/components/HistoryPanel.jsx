import { useState } from 'react';

export default function HistoryPanel({ entries, onSelect, onClear }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="text-sm font-semibold text-stone-600 hover:text-stone-900"
          aria-expanded={isOpen}
        >
          History {isOpen ? '▾' : '▸'}
        </button>
        {isOpen && entries.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-stone-400 hover:text-rose-500"
          >
            Clear
          </button>
        )}
      </div>

      {isOpen && (
        <div className="flex flex-col gap-1">
          {entries.length === 0 ? (
            <p className="text-xs text-stone-400">No history yet.</p>
          ) : (
            entries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="rounded-md px-2 py-1.5 text-left text-xs text-stone-600 hover:bg-stone-100 truncate"
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
