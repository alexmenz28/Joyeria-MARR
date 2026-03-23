import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import RevealSection from '../components/common/RevealSection';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id || Number.isNaN(Number(id))) {
        setError('Invalid product.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<Product>(`/api/products/${id}`);
        if (!cancelled) {
          setProduct(data);
          setQty(1);
        }
      } catch {
        if (!cancelled) setError('Product not found or could not be loaded.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const canAdd = product && product.isAvailable && product.stock > 0;
  const maxQty = product?.stock ?? 0;

  const handleAddToCart = () => {
    if (!product || !canAdd) return;
    const q = Math.min(Math.max(1, qty), product.stock);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl ?? undefined,
      stock: product.stock,
      quantity: q,
    });
  };

  return (
    <div className="min-h-full font-sans">
      <Helmet>
        <title>{product ? `${product.name} — Joyeria MARR` : 'Product — Joyeria MARR'}</title>
      </Helmet>
      <section className="relative h-48 md:h-56 flex items-center justify-center bg-gradient-to-br from-ivory via-white to-gold-50 dark:from-night-900 dark:via-night-800 dark:to-night-900 overflow-hidden px-6">
        <img src="/Logo-MARR.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <RevealSection className="relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-marrGold">Product details</h1>
          <p className="text-gray-700 dark:text-gray-300 mt-1">Every detail of your piece</p>
        </RevealSection>
      </section>

      <section className="max-w-5xl mx-auto py-16 px-6 md:px-8">
        {loading && (
          <div className="text-center text-marrGold animate-pulse py-12">Loading…</div>
        )}
        {!loading && error && (
          <RevealSection>
            <div className="bg-white dark:bg-night-800 rounded-2xl shadow-lg border border-gold-200/60 dark:border-gold-500/20 p-8 text-center">
              <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
              <Link to="/catalog" className="inline-block text-gold-600 dark:text-gold-400 font-medium hover:opacity-80">
                ← Back to catalog
              </Link>
            </div>
          </RevealSection>
        )}
        {!loading && product && (
          <RevealSection>
            <div className="bg-white dark:bg-night-800 rounded-2xl shadow-lg border border-gold-200/60 dark:border-gold-500/20 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0 md:gap-8">
                <div className="bg-porcelain dark:bg-night-900 flex items-center justify-center p-8 min-h-[280px]">
                  <img
                    src={product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl : '/logo192.png'}
                    alt={product.name}
                    className="max-h-80 w-full object-contain"
                  />
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <p className="text-sm text-gold-600 dark:text-gold-400 font-semibold uppercase tracking-wide mb-2">{product.category}</p>
                  <h2 className="text-3xl font-bold text-marrGold mb-4">{product.name}</h2>
                  <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">{product.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {product.material && (
                      <span>
                        <strong className="text-gray-900 dark:text-gray-200">Material:</strong> {product.material}
                      </span>
                    )}
                    {product.weight && (
                      <span>
                        <strong className="text-gray-900 dark:text-gray-200">Weight:</strong> {product.weight}
                      </span>
                    )}
                    <span>
                      <strong className="text-gray-900 dark:text-gray-200">Stock:</strong> {product.stock}
                    </span>
                    <span>
                      <strong className="text-gray-900 dark:text-gray-200">Availability:</strong>{' '}
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-marrGold mb-6">${Number(product.price).toFixed(2)}</p>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <label htmlFor="qty" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Quantity
                    </label>
                    <input
                      id="qty"
                      type="number"
                      min={1}
                      max={maxQty}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)))}
                      disabled={!canAdd}
                      className="w-24 rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!canAdd}
                      className="rounded-lg bg-gold-500 px-6 py-3 font-semibold text-white shadow hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                    >
                      Add to cart
                    </button>
                    <Link
                      to="/cart"
                      className="text-sm font-medium text-gold-600 dark:text-gold-400 hover:opacity-80"
                    >
                      View cart →
                    </Link>
                  </div>

                  <Link
                    to="/catalog"
                    className="inline-block text-gold-600 dark:text-gold-400 font-medium hover:opacity-80 transition-opacity w-fit"
                  >
                    ← Back to catalog
                  </Link>
                </div>
              </div>
            </div>
          </RevealSection>
        )}
      </section>
    </div>
  );
};

export default ProductDetail;
