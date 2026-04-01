import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useHistory from './useHistory.js';

const STORAGE_KEY = 'distortion-helper:history';
const MOCK_RESULT = { distortions: [], reframe: 'r', disclaimer: 'd' };

describe('useHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts with an empty entries array when localStorage is empty', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([]);
  });

  it('loads existing entries from localStorage on mount', () => {
    const stored = [{ id: 1, thought: 'stored thought', result: MOCK_RESULT }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual(stored);
  });

  it('addEntry prepends a new entry to the list', () => {
    const { result } = renderHook(() => useHistory());

    act(() => { result.current.addEntry('thought one', MOCK_RESULT); });
    act(() => { result.current.addEntry('thought two', MOCK_RESULT); });

    expect(result.current.entries).toHaveLength(2);
    expect(result.current.entries[0].thought).toBe('thought two');
    expect(result.current.entries[1].thought).toBe('thought one');
  });

  it('addEntry persists the entry to localStorage', () => {
    const { result } = renderHook(() => useHistory());

    act(() => { result.current.addEntry('a thought', MOCK_RESULT); });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(1);
    expect(stored[0].thought).toBe('a thought');
    expect(stored[0].result).toEqual(MOCK_RESULT);
  });

  it('addEntry returns the new entry with id and thought', () => {
    const { result } = renderHook(() => useHistory());

    let entry;
    act(() => { entry = result.current.addEntry('a thought', MOCK_RESULT); });

    expect(entry).toMatchObject({ thought: 'a thought', result: MOCK_RESULT });
    expect(entry.id).toBeDefined();
  });

  it('clearHistory empties the entries array', () => {
    const { result } = renderHook(() => useHistory());
    act(() => { result.current.addEntry('a thought', MOCK_RESULT); });

    act(() => { result.current.clearHistory(); });

    expect(result.current.entries).toEqual([]);
  });

  it('clearHistory removes the item from localStorage', () => {
    const { result } = renderHook(() => useHistory());
    act(() => { result.current.addEntry('a thought', MOCK_RESULT); });

    act(() => { result.current.clearHistory(); });

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json {{');
    const { result } = renderHook(() => useHistory());
    expect(result.current.entries).toEqual([]);
  });
});
