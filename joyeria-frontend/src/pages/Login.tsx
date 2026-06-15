import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { getJwtRole, isAdminOrEmployee } from '../utils/jwtRole';
import { getApiErrorMessage } from '../utils/apiErrors';
import { isStaffOnlyPath } from '../utils/loginPaths';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, role: existingRole, isAuthenticated } = useAuth();
  const returnTo = searchParams.get('from') || searchParams.get('returnUrl') || '';

  React.useEffect(() => {
    if (!isAuthenticated) return;
    if (isAdminOrEmployee(existingRole)) {
      navigate('/admin/dashboard', { replace: true });
    } else if (returnTo.startsWith('/') && !returnTo.startsWith('//') && !isStaffOnlyPath(returnTo)) {
      navigate(returnTo, { replace: true });
    } else {
      navigate(isAdminOrEmployee(existingRole) ? '/admin/dashboard' : '/', { replace: true });
    }
  }, [isAuthenticated, existingRole, navigate, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post('/api/auth/login', { email, password });

      if (!response.data.token) {
        setError('No authentication token was returned.');
        return;
      }

      login(response.data.token);

      const userRole = getJwtRole(jwtDecode<Record<string, unknown>>(response.data.token));
      if (isAdminOrEmployee(userRole)) {
        navigate('/admin/dashboard', { replace: true });
      } else if (returnTo.startsWith('/') && !returnTo.startsWith('//') && !isStaffOnlyPath(returnTo)) {
        navigate(returnTo, { replace: true });
      } else {
        navigate(isAdminOrEmployee(userRole) ? '/admin/dashboard' : '/', { replace: true });
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Sign-in failed. Please check your credentials.'));
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center py-12 px-6 sm:px-8">
      <div className="surface-panel max-w-md w-full space-y-8 p-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold text-marrGold">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-muted">Access your profile and orders</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                autoComplete="current-password"
                required
                className="input-marr sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="alert-error" role="alert">
              {error}
            </div>
          )}

          <div>
            <button type="submit" className="btn-marr w-full flex justify-center">
              Sign in
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link
            to={searchParams.toString() ? `/register?${searchParams.toString()}` : '/register'}
            className="font-medium text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 transition-colors duration-200"
          >
            Register here
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

export default Login;
