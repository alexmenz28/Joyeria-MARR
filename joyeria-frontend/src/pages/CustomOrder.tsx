import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import RevealSection from '../components/common/RevealSection';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { getJwtRole, isCustomer } from '../utils/jwtRole';

const CustomOrder = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [metal, setMetal] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const role = useMemo(() => {
    if (!token) return undefined;
    try {
      return getJwtRole(jwtDecode<Record<string, unknown>>(token));
    } catch {
      return undefined;
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('Please describe the piece you have in mind.');
      return;
    }

    if (!token) {
      navigate('/login?from=/custom-order');
      return;
    }

    if (!isCustomer(role)) {
      setError('Custom orders can only be submitted with a customer account.');
      return;
    }

    const extra = [metal.trim() && `Preferred metal: ${metal.trim()}`, budget.trim() && `Budget: ${budget.trim()}`]
      .filter(Boolean)
      .join('\n');
    const orderNotes = [notes.trim(), extra].filter(Boolean).join('\n\n') || undefined;

    setSubmitting(true);
    try {
      await api.post('/api/orders', {
        notes: orderNotes,
        lines: [
          {
            quantity: 1,
            customDescription: description.trim(),
          },
        ],
      });
      navigate('/orders');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(typeof msg === 'string' ? msg : 'Could not submit your request. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full font-sans">
      <Helmet>
        <title>Custom order — Joyeria MARR</title>
      </Helmet>
      <section className="max-w-3xl mx-auto py-16 px-6 md:px-8">
        <RevealSection>
          <h2 className="text-3xl font-bold text-marrGold mb-4">Custom order</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            Describe your idea. We&apos;ll review it and contact you with a quote. No payment is taken until the design is
            agreed.
          </p>
        </RevealSection>

        <div className="rounded-2xl border border-gold-200/60 dark:border-gold-500/20 bg-white dark:bg-night-800 p-6 md:p-8 shadow-lg">
          {!token && (
            <p className="mb-6 rounded-lg bg-gold-50 dark:bg-gold-900/20 px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
              <Link to="/login?from=/custom-order" className="font-semibold text-gold-600 dark:text-gold-400">
                Sign in
              </Link>{' '}
              or{' '}
              <Link to="/register" className="font-semibold text-gold-600 dark:text-gold-400">
                register
              </Link>{' '}
              to submit a custom order (customer accounts only).
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="co-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Describe your piece <span className="text-red-500">*</span>
              </label>
              <textarea
                id="co-desc"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Style, stones, occasion, size, inspiration…"
                className="w-full rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 px-3 py-2 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label htmlFor="co-metal" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Preferred metal (optional)
              </label>
              <input
                id="co-metal"
                type="text"
                value={metal}
                onChange={(e) => setMetal(e.target.value)}
                placeholder="e.g. 18k yellow gold, sterling silver"
                className="w-full rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 px-3 py-2 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label htmlFor="co-budget" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Budget range (optional)
              </label>
              <input
                id="co-budget"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. $500 – $1,200"
                className="w-full rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 px-3 py-2 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label htmlFor="co-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Additional notes (optional)
              </label>
              <textarea
                id="co-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 px-3 py-2 text-gray-900 dark:text-gray-100"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-gold-500 px-6 py-3 font-semibold text-white shadow hover:bg-gold-600 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Submitting…' : 'Submit request'}
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-lg border border-gold-200 dark:border-gold-500/30 px-6 py-3 text-sm font-medium text-gold-700 dark:text-gold-300 hover:bg-gold-50 dark:hover:bg-night-700"
              >
                Contact instead
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CustomOrder;
