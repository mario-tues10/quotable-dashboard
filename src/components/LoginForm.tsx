import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ErrorAlert } from './ErrorAlert';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState(import.meta.env.VITE_TEST_EMAIL || '');
  const [password, setPassword] = useState(import.meta.env.VITE_TEST_PASSWORD || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card login-form" onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <label>
        Email
        <input
          type="email"
          value={email}
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {error && <ErrorAlert message={error} />}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};
