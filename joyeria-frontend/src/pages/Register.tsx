import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { getApiErrorMessage } from '../utils/apiErrors';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
        confirmPassword,
      });
      setSuccess(response.data.message || 'Registration successful. Redirecting to sign in…');
      setTimeout(() => {
        const q = location.search;
        navigate(q ? `/login${q}` : '/login');
      }, 2000);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not complete registration.'));
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center py-12 px-6 sm:px-8">
      <div className="surface-panel max-w-md w-full space-y-8 p-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold text-marrGold">Create your account</h2>
          <p className="mt-2 text-center text-sm text-muted">Sign up to browse the catalog and place orders</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="input-marr sm:text-sm"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-marr sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input-marr sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="input-marr sm:text-sm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="alert-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert-success" role="status">
              {success}
            </div>
          )}

          <div>
            <button type="submit" className="btn-marr w-full flex justify-center">
              Register
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link
            to={location.search ? `/login${location.search}` : '/login'}
            className="font-medium text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 transition-colors duration-200"
          >
            Sign in here
          </Link>
        </p>
        <p className="text-center pt-4 border-t border-gold-200/40 dark:border-gold-500/20">
          <Link to="/" className="text-sm text-gold-600 dark:text-gold-400 font-medium hover:opacity-80 transition-opacity duration-200">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
