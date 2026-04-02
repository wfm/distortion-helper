import { useState } from 'react';

export default function useAnalysis(credentials) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function analyze(thought) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(credentials && {
            Authorization: `Basic ${btoa(`${credentials.user}:${credentials.password}`)}`,
          }),
        },
        body: JSON.stringify({ thought }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, result, setResult, analyze };
}
