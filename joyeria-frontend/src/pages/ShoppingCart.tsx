import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import RevealSection from '../components/common/RevealSection';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { getJwtRole, isCustomer } from '../utils/jwtRole';

const ShoppingCart = () => {
  const { items, setQuantity, removeItem, clearCart, subtotal } = useCart();
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const role = useMemo(() => {
    if (!token) return undefined;
    try {
      return getJwtRole(jwtDecode<Record<string, unknown>>(token));
    } catch {
      return undefined;
    }
  }, [token]);

  const handleCheckout = async () => {
    setError(null);
    if (items.length === 0) return;

    if (!token) {
      navigate('/login?from=/cart');
      return;
    }

    if (!isCustomer(role)) {
      setError(
        'Catalog checkout is only available for customer accounts. Sign in with a customer account or register a new one.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/orders', {
        notes: notes.trim() || undefined,
        lines: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });
      clearCart();
      setNotes('');
      navigate('/orders');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(typeof msg === 'string' ? msg : 'Could not place order. Check stock and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full font-sans">
      <Helmet>
        <title>Shopping cart — Joyeria MARR</title>
      </Helmet>
      <section className="max-w-5xl mx-auto py-16 px-6 md:px-8">
        <RevealSection>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-marrGold mb-2">Shopping cart</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Review your items and place your order.
              </p>
            </div>
            {items.length > 0 && (
              <Link
                to="/catalog"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-marrGold/70 bg-white px-4 py-2.5 text-sm font-semibold text-marrGold shadow-sm transition-colors hover:bg-gold-50 dark:border-gold-500/50 dark:bg-night-800 dark:hover:bg-night-700"
              >
                <Store className="h-4 w-4" aria-hidden />
                Continue shopping
              </Link>
            )}
          </div>
        </RevealSection>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-gold-200/60 dark:border-gold-500/20 bg-white dark:bg-night-800 p-8 text-center shadow-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your cart is empty.</p>
            <Link
              to="/catalog"
              className="inline-block rounded-lg bg-gold-500 px-6 py-3 font-semibold text-white hover:bg-gold-600 transition-colors"
            >
              Browse catalog
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((line) => (
                <div
                  key={line.productId}
                  className="flex flex-wrap gap-4 rounded-xl border border-gold-200/60 dark:border-gold-500/20 bg-white dark:bg-night-800 p-4 shadow-md"
                >
                  <img
                    src={line.imageUrl && line.imageUrl.length > 0 ? line.imageUrl : '/logo192.png'}
                    alt=""
                    className="h-24 w-24 flex-shrink-0 rounded-lg object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${line.productId}`} className="font-semibold text-marrGold hover:underline">
                      {line.name}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      ${Number(line.price).toFixed(2)} each · {line.stock} in stock
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="text-sm text-gray-700 dark:text-gray-200">Qty</label>
                      <input
                        type="number"
                        min={1}
                        max={line.stock}
                        value={line.quantity}
                        onChange={(e) => setQuantity(line.productId, Number(e.target.value) || 1)}
                        className="w-20 rounded border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 px-2 py-1 text-gray-900 dark:text-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="w-full text-right font-semibold text-gray-900 dark:text-gray-100 sm:w-auto sm:self-center tabular-nums">
                    ${(line.price * line.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-gold-200/60 dark:border-gold-500/20 bg-white dark:bg-night-800 p-6 shadow-lg">
                <h3 className="text-lg font-bold text-marrGold mb-4">Order summary</h3>
                <p className="flex justify-between text-gray-700 dark:text-gray-300 mb-2">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-semibold">${subtotal.toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Taxes and shipping can be coordinated after we confirm your order.</p>

                <Link
                  to="/catalog"
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gold-300 bg-ivory/80 py-2.5 text-sm font-semibold text-marrGold transition-colors hover:bg-gold-50 dark:border-gold-500/40 dark:bg-night-900/50 dark:hover:bg-night-700"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Add more from catalog
                </Link>

                <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Order notes (optional)
                </label>
                <textarea
                  id="order-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery preferences, gift message…"
                  className="mb-4 w-full rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                />

                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                )}

                {!token && (
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <Link to="/login?from=/cart" className="font-medium text-gold-600 dark:text-gold-400">
                      Sign in
                    </Link>{' '}
                    to place your order, or{' '}
                    <Link to="/register?from=/cart" className="font-medium text-gold-600 dark:text-gold-400">
                      create an account
                    </Link>
                    .
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={submitting}
                  className="w-full rounded-lg bg-gold-500 py-3 font-semibold text-white shadow hover:bg-gold-600 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Placing order…' : 'Place order'}
                </button>

                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="mt-3 w-full text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  Clear cart
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ShoppingCart;
