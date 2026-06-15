import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store } from 'lucide-react';
import RevealSection from '../components/common/RevealSection';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { isCustomer } from '../utils/jwtRole';
import { getApiErrorMessage } from '../utils/apiErrors';
import { fetchProductsByIds, mergeCartWithProducts } from '../utils/cartStock';
import { EMPTY_SHIPPING, useCheckoutQuote, type ShippingAddress } from '../hooks/useCheckoutQuote';

const COUNTRY_OPTIONS = [
  { code: 'MX', label: 'Mexico' },
  { code: 'US', label: 'United States' },
  { code: 'ES', label: 'Spain' },
];

const ShoppingCart = () => {
  const { items, setQuantity, removeItem, clearCart, replaceItems, subtotal } = useCart();
  const [notes, setNotes] = useState('');
  const [shipping, setShipping] = useState<ShippingAddress>(EMPTY_SHIPPING);
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [stockNotice, setStockNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const { quote, loading: quoteLoading } = useCheckoutQuote(subtotal, shipping, items.length > 0);

  const syncCartStock = useCallback(async (): Promise<CartItem[]> => {
    if (items.length === 0) return [];
    setSyncing(true);
    try {
      const products = await fetchProductsByIds(items.map((i) => i.productId));
      const { items: synced, warnings } = mergeCartWithProducts(items, products);
      replaceItems(synced);
      setStockNotice(warnings.length > 0 ? warnings.join(' ') : null);
      return synced;
    } finally {
      setSyncing(false);
    }
  }, [items, replaceItems]);

  useEffect(() => {
    if (items.length > 0) void syncCartStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.productId).join(',')]);

  const updateShipping = (field: keyof ShippingAddress, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    setError(null);
    setStockNotice(null);
    if (items.length === 0) return;

    if (!isAuthenticated) {
      navigate('/login?from=/cart');
      return;
    }

    if (!isCustomer(role)) {
      setError('Catalog checkout is only available for customer accounts. Sign in with a customer account or register a new one.');
      return;
    }

    if (!shipping.street.trim() || !shipping.city.trim() || !shipping.postalCode.trim() || shipping.country.length !== 2) {
      setError('Please complete the shipping address.');
      return;
    }

    setSubmitting(true);
    try {
      const synced = await syncCartStock();
      if (synced.length === 0) {
        setError('Your cart is empty or items are no longer available.');
        return;
      }

      await api.post('/api/orders', {
        notes: notes.trim() || undefined,
        shipping: {
          street: shipping.street.trim(),
          city: shipping.city.trim(),
          state: shipping.state.trim() || undefined,
          postalCode: shipping.postalCode.trim(),
          country: shipping.country.trim().toUpperCase(),
        },
        lines: synced.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });
      clearCart();
      setNotes('');
      setShipping(EMPTY_SHIPPING);
      navigate('/orders');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Could not place order. Check stock and try again.');
      setError(msg);
      if (/stock|retry|another request/i.test(msg)) {
        void syncCartStock();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const displayTotal = quote?.total ?? subtotal;

  return (
    <div className="min-h-full font-sans">
      <Helmet>
        <title>Shopping cart — Joyeria MARR</title>
      </Helmet>
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-8">
        <RevealSection>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-marrGold">Shopping cart</h2>
              <p className="text-muted">Review your items and place your order.</p>
            </div>
            {items.length > 0 && (
              <Link to="/catalog" className="btn-marr-outline inline-flex shrink-0 items-center justify-center gap-2 !rounded-xl">
                <Store className="h-4 w-4" aria-hidden />
                Continue shopping
              </Link>
            )}
          </div>
        </RevealSection>

        {items.length === 0 ? (
          <div className="surface-panel p-8 text-center">
            <p className="mb-4 text-muted">Your cart is empty.</p>
            <Link to="/catalog" className="btn-marr inline-block">
              Browse catalog
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((line) => (
                <div key={line.productId} className="surface-card flex flex-wrap gap-4 p-4">
                  <img
                    src={line.imageUrl && line.imageUrl.length > 0 ? line.imageUrl : '/logo192.png'}
                    alt=""
                    className="h-24 w-24 flex-shrink-0 rounded-lg object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${line.productId}`} className="font-semibold text-marrGold hover:underline">
                      {line.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
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
                        className="input-marr w-20 !py-1"
                      />
                      <button type="button" onClick={() => removeItem(line.productId)} className="text-sm font-medium text-red-600 hover:underline dark:text-red-400">
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="w-full self-center text-right font-semibold tabular-nums text-gray-900 dark:text-gray-100 sm:w-auto">
                    ${(line.price * line.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="surface-panel p-6">
                <h3 className="mb-4 text-lg font-bold text-marrGold">Shipping address</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="ship-street" className="label-marr">
                      Street
                    </label>
                    <input id="ship-street" value={shipping.street} onChange={(e) => updateShipping('street', e.target.value)} className="input-marr" placeholder="Street and number" />
                  </div>
                  <div>
                    <label htmlFor="ship-city" className="label-marr">
                      City
                    </label>
                    <input id="ship-city" value={shipping.city} onChange={(e) => updateShipping('city', e.target.value)} className="input-marr" />
                  </div>
                  <div>
                    <label htmlFor="ship-state" className="label-marr">
                      State / region
                    </label>
                    <input id="ship-state" value={shipping.state} onChange={(e) => updateShipping('state', e.target.value)} className="input-marr" />
                  </div>
                  <div>
                    <label htmlFor="ship-postal" className="label-marr">
                      Postal code
                    </label>
                    <input id="ship-postal" value={shipping.postalCode} onChange={(e) => updateShipping('postalCode', e.target.value)} className="input-marr" />
                  </div>
                  <div>
                    <label htmlFor="ship-country" className="label-marr">
                      Country
                    </label>
                    <select id="ship-country" value={shipping.country} onChange={(e) => updateShipping('country', e.target.value)} className="input-marr">
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="surface-panel sticky top-20 p-6">
                <h3 className="mb-4 text-lg font-bold text-marrGold">Order summary</h3>
                <p className="mb-2 flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums">${subtotal.toFixed(2)}</span>
                </p>
                {quote && (
                  <>
                    <p className="mb-2 flex justify-between text-sm text-muted">
                      <span>Tax ({(quote.taxRate * 100).toFixed(0)}%)</span>
                      <span className="tabular-nums">${quote.taxAmount.toFixed(2)}</span>
                    </p>
                    <p className="mb-2 flex justify-between text-sm text-muted">
                      <span>Shipping</span>
                      <span className="tabular-nums">{quote.shippingAmount === 0 ? 'Free' : `$${quote.shippingAmount.toFixed(2)}`}</span>
                    </p>
                  </>
                )}
                <p className="mb-4 flex justify-between border-t border-gold-200/60 pt-3 font-bold text-marrGold dark:border-gold-500/20">
                  <span>Total</span>
                  <span className="tabular-nums">${displayTotal.toFixed(2)}</span>
                </p>
                {quoteLoading && <p className="mb-3 text-xs text-muted">Calculating taxes…</p>}

                <Link to="/catalog" className="btn-marr-outline mb-4 flex w-full items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Add more from catalog
                </Link>

                <label htmlFor="order-notes" className="label-marr">
                  Order notes (optional)
                </label>
                <textarea
                  id="order-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery preferences, gift message…"
                  className="input-marr mb-4 resize-none text-sm"
                />

                {stockNotice && <div className="alert-warning mb-4">{stockNotice}</div>}
                {error && <div className="alert-error mb-4">{error}</div>}

                {!isAuthenticated && (
                  <p className="mb-4 text-sm text-muted">
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

                <button type="button" onClick={handleCheckout} disabled={submitting || syncing || quoteLoading} className="btn-marr w-full">
                  {submitting ? 'Placing order…' : syncing ? 'Checking stock…' : 'Place order'}
                </button>

                <button type="button" onClick={() => clearCart()} className="mt-3 w-full text-sm text-muted hover:text-red-600 dark:hover:text-red-400">
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
