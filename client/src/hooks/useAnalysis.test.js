import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAnalysis from './useAnalysis.js';

const MOCK_RESULT = {
  distortions: [{ id: 'all-or-nothing', name: 'All-or-Nothing Thinking', explanation: 'x', severity: 'primary' }],
  reframe: 'Try to see the nuance.',
  disclaimer: 'This tool is for self-reflection only.',
};

function mockFetchSuccess(body = MOCK_RESULT) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(body),
  }));
}

function mockFetchError(body = { error: 'AI service unavailable' }, status = 502) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  }));
}

function mockFetchNetworkFailure() {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Network failure')));
}

describe('useAnalysis', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts with loading=false, error=null, result=null', () => {
    const { result } = renderHook(() => useAnalysis());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.result).toBe(null);
  });

  it('sets loading=true while the fetch is in flight', async () => {
    let resolveFetch;
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(
      new Promise((resolve) => { resolveFetch = resolve; })
    ));

    const { result } = renderHook(() => useAnalysis());
    act(() => { result.current.analyze('I always fail'); });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveFetch({ ok: true, json: () => Promise.resolve(MOCK_RESULT) });
    });
  });

  it('transitions loading → success: sets result and clears loading/error', async () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useAnalysis());

    await act(async () => {
      await result.current.analyze('I always fail');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.result).toEqual(MOCK_RESULT);
  });

  it('returns the result data from analyze()', async () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useAnalysis());

    let returned;
    await act(async () => {
      returned = await result.current.analyze('I always fail');
    });

    expect(returned).toEqual(MOCK_RESULT);
  });

  it('transitions loading → error on non-ok response: sets error and clears loading/result', async () => {
    mockFetchError();
    const { result } = renderHook(() => useAnalysis());

    await act(async () => {
      await result.current.analyze('I always fail');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBe(null);
    expect(result.current.error).toBe('AI service unavailable');
  });

  it('transitions loading → error on network failure', async () => {
    mockFetchNetworkFailure();
    const { result } = renderHook(() => useAnalysis());

    await act(async () => {
      await result.current.analyze('I always fail');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBe(null);
    expect(result.current.error).toBe('Network failure');
  });

  it('returns null from analyze() on error', async () => {
    mockFetchError();
    const { result } = renderHook(() => useAnalysis());

    let returned;
    await act(async () => {
      returned = await result.current.analyze('I always fail');
    });

    expect(returned).toBe(null);
  });

  it('clears error from a previous call on a new analyze()', async () => {
    mockFetchError();
    const { result } = renderHook(() => useAnalysis());
    await act(async () => { await result.current.analyze('first'); });
    expect(result.current.error).not.toBe(null);

    mockFetchSuccess();
    await act(async () => { await result.current.analyze('second'); });
    expect(result.current.error).toBe(null);
  });
});
