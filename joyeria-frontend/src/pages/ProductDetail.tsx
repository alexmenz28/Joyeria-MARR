import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import RevealSection from '../components/common/RevealSection';
import ProductGallery from '../components/productos/ProductGallery';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { usePageVisibility } from '../hooks/usePageVisibility';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  const loadProduct = useCallback(async () => {
    if (!id || Number.isNaN(Number(id))) {
      setError('Invalid product.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Product>(`/api/products/${id}`);
      setProduct(data);
      setQty(1);
    } catch {
      setError('Product not found or could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  usePageVisibility(() => {
    if (id && !loading) void loadProduct();
  });

  const canAdd = product && product.isAvailable && product.stock > 0;
  const maxQty = product?.stock ?? 0;
  const galleryImages =
    product?.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : product?.imageUrl
        ? [product.imageUrl]
        : [];

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
      <section className="page-hero h-48 md:h-56">
        <img src="/Logo-MARR.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-10" />
        <RevealSection className="relative z-10 text-center">
          <h1 className="text-3xl font-bold text-marrGold md:text-4xl">Product details</h1>
          <p className="mt-1 text-muted">Every detail of your piece</p>
        </RevealSection>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:px-8">
        {loading && <div className="animate-pulse py-12 text-center text-marrGold">Loading…</div>}
        {!loading && error && (
          <RevealSection>
            <div className="surface-panel p-8 text-center">
              <p className="alert-error mb-6 inline-block">{error}</p>
              <Link to="/catalog" className="font-medium text-gold-600 hover:opacity-80 dark:text-gold-400">
                ← Back to catalog
              </Link>
            </div>
          </RevealSection>
        )}
        {!loading && product && (
          <RevealSection>
            <div className="surface-panel overflow-hidden">
              <div className="grid gap-0 md:grid-cols-2 md:gap-8">
                <div className="p-6 md:p-8">
                  <ProductGallery images={galleryImages} alt={product.name} />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gold-600 dark:text-gold-400">{product.category}</p>
                  <h2 className="mb-4 text-3xl font-bold text-marrGold">{product.name}</h2>
                  <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">{product.description}</p>
                  <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted">
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
                      <strong className="text-gray-900 dark:text-gray-200">Availability:</strong> {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="mb-6 text-3xl font-bold text-marrGold">${Number(product.price).toFixed(2)}</p>

                  <div className="mb-6 flex flex-wrap items-center gap-4">
                    <label htmlFor="qty" className="label-marr !mb-0">
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
                      className="input-marr w-24 !py-2"
                    />
                    <button type="button" onClick={handleAddToCart} disabled={!canAdd} className="btn-marr">
                      Add to cart
                    </button>
                    <Link to="/cart" className="text-sm font-medium text-gold-600 hover:opacity-80 dark:text-gold-400">
                      View cart →
                    </Link>
                  </div>

                  <Link to="/catalog" className="inline-block w-fit font-medium text-gold-600 hover:opacity-80 dark:text-gold-400">
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
