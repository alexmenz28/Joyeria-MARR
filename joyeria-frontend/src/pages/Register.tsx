import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';

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
      const message =
        err && typeof err === 'object' && 'response' in err && err.response && typeof (err.response as { data?: { message?: string } }).data?.message === 'string'
          ? (err.response as { data: { message: string } }).data.message
          : 'Could not complete registration.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ivory dark:bg-night-900 py-12 px-6 sm:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-night-800 rounded-2xl shadow-xl border border-gold-200/60 dark:border-gold-500/20 transition-colors">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold text-marrGold">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">Sign up to browse the catalog and place orders</p>
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
                className="block w-full px-4 py-3 rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors duration-200 sm:text-sm"
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
                className="block w-full px-4 py-3 rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors duration-200 sm:text-sm"
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
                className="block w-full px-4 py-3 rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors duration-200 sm:text-sm"
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
                className="block w-full px-4 py-3 rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors duration-200 sm:text-sm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-sm" role="alert">
              {success}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 dark:focus:ring-offset-night-800 font-medium shadow-md transition-all duration-200"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
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
