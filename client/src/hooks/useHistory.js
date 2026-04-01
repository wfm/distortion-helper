import { useState } from 'react';

const STORAGE_KEY = 'distortion-helper:history';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function useHistory() {
  const [entries, setEntries] = useState(loadFromStorage);

  function addEntry(thought, result) {
    const entry = { id: Date.now(), thought, result };
    const updated = [entry, ...entries];
    setEntries(updated);
    saveToStorage(updated);
    return entry;
  }

  function clearHistory() {
    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return { entries, addEntry, clearHistory };
}
