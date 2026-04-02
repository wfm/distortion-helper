import { useState } from 'react';

export default function LoginForm({ onSuccess }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ping', {
        headers: {
          Authorization: `Basic ${btoa(`${user}:${password}`)}`,
        },
      });

      if (res.ok) {
        onSuccess({ user, password });
      } else {
        setError('Invalid username or password.');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-stone-800">Distortion Helper</h1>
          <p className="mt-1 text-sm text-stone-500">Sign in to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200 bg-white px-8 py-8 shadow-sm flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-user" className="text-sm font-semibold text-stone-700">
              Username
            </label>
            <input
              id="login-user"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              disabled={loading}
              autoComplete="username"
              className="rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-sm font-semibold text-stone-700">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              className="rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-sm text-rose-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !user || !password}
            className="rounded-xl bg-amber-500 px-6 py-2.5 font-bold text-white shadow-sm transition hover:bg-amber-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
