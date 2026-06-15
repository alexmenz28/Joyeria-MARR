import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RevealSection from '../components/common/RevealSection';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { isCustomer } from '../utils/jwtRole';
import { getApiErrorMessage } from '../utils/apiErrors';

const CustomOrder = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [description, setDescription] = useState('');
  const [metal, setMetal] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('Please describe the piece you have in mind.');
      return;
    }

    if (!isAuthenticated) {
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
        lines: [{ quantity: 1, customDescription: description.trim() }],
      });
      navigate('/orders');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not submit your request. Try again later.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full font-sans">
      <Helmet>
        <title>Custom order — Joyeria MARR</title>
      </Helmet>
      <section className="page-hero h-48 md:h-56">
        <RevealSection className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-marrGold md:text-4xl">Custom order</h2>
          <p className="mt-2 text-muted">Describe your idea — we&apos;ll contact you with a quote</p>
        </RevealSection>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 md:px-8">
        <div className="surface-panel p-6 md:p-8">
          {!isAuthenticated && (
            <p className="alert-warning mb-6">
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
              <label htmlFor="co-desc" className="label-marr">
                Describe your piece <span className="text-red-500">*</span>
              </label>
              <textarea id="co-desc" required rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Style, stones, occasion, size, inspiration…" className="input-marr resize-none" />
            </div>
            <div>
              <label htmlFor="co-metal" className="label-marr">
                Preferred metal (optional)
              </label>
              <input id="co-metal" type="text" value={metal} onChange={(e) => setMetal(e.target.value)} placeholder="e.g. 18k yellow gold, sterling silver" className="input-marr" />
            </div>
            <div>
              <label htmlFor="co-budget" className="label-marr">
                Budget range (optional)
              </label>
              <input id="co-budget" type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $500 – $1,200" className="input-marr" />
            </div>
            <div>
              <label htmlFor="co-notes" className="label-marr">
                Additional notes (optional)
              </label>
              <textarea id="co-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="input-marr resize-none" />
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={submitting} className="btn-marr">
                {submitting ? 'Submitting…' : 'Submit request'}
              </button>
              <Link to="/contact" className="btn-marr-outline inline-flex items-center">
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
