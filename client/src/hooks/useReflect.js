import { useState } from 'react';

export default function useReflect(credentials) {
  const [reflectLoading, setReflectLoading] = useState(false);
  const [reflectError, setReflectError] = useState(null);
  const [reflectResult, setReflectResult] = useState(null);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceError, setPracticeError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const authHeader = credentials
    ? { Authorization: `Basic ${btoa(`${credentials.user}:${credentials.password}`)}` }
    : {};

  async function reflect(entries) {
    setReflectLoading(true);
    setReflectError(null);
    setReflectResult(null);
    setFeedback(null);
    setPracticeError(null);
    try {
      const payload = entries.slice(0, 20).map(({ thought, result }) => ({
        thought,
        result: {
          distortions: result.distortions.map(({ id, name, severity }) => ({ id, name, severity })),
          reframe: result.reframe,
        },
      }));
      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ entries: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setReflectResult(data);
      return data;
    } catch (err) {
      setReflectError(err.message);
      return null;
    } finally {
      setReflectLoading(false);
    }
  }

  async function submitPractice(userAttempt) {
    if (!reflectResult) return;
    setPracticeLoading(true);
    setPracticeError(null);
    setFeedback(null);
    try {
      const res = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          distortionName: reflectResult.topDistortion.name,
          practicePrompt: reflectResult.practicePrompt,
          userAttempt,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setFeedback(data.feedback);
    } catch (err) {
      setPracticeError(err.message);
    } finally {
      setPracticeLoading(false);
    }
  }

  function reset() {
    setReflectLoading(false);
    setReflectError(null);
    setReflectResult(null);
    setPracticeLoading(false);
    setPracticeError(null);
    setFeedback(null);
  }

  return {
    reflectLoading, reflectError, reflectResult,
    practiceLoading, practiceError, feedback,
    reflect, submitPractice, reset,
  };
}
