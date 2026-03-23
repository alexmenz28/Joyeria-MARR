import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductoCard from '../components/productos/ProductoCard';
import RevealSection from '../components/common/RevealSection';
import { Helmet } from 'react-helmet-async';
import type { Product, PagedResult } from '../types';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const ITEMS_PER_PAGE = 12;

function CatalogPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(1, page), totalPages);
  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), totalPages));

  const maxButtons = 5;
  let startPage = Math.max(1, safePage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Catalog pagination">
      <button
        type="button"
        onClick={() => go(safePage - 1)}
        disabled={safePage <= 1}
        className="px-3 py-2 rounded-lg border border-gold-200 dark:border-gold-500/30 text-gold-700 dark:text-gold-400 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold-50 dark:hover:bg-night-800 transition-colors duration-200"
      >
        Previous
      </button>
      <div className="flex items-center gap-1">
        {pageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => go(n)}
            className={`min-w-[2.5rem] py-2 rounded-lg font-medium transition-colors duration-200 ${
              safePage === n
                ? 'bg-gold-500 text-white'
                : 'border border-gold-200 dark:border-gold-500/30 text-gold-700 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-night-800'
            }`}
            aria-current={safePage === n ? 'page' : undefined}
          >
            {n}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => go(safePage + 1)}
        disabled={safePage >= totalPages}
        className="px-3 py-2 rounded-lg border border-gold-200 dark:border-gold-500/30 text-gold-700 dark:text-gold-400 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold-50 dark:hover:bg-night-800 transition-colors duration-200"
      >
        Next
      </button>
      <span className="w-full sm:w-auto text-center text-sm text-gray-600 dark:text-gray-400 tabular-nums">
        Page {safePage} of {totalPages}
      </span>
    </nav>
  );
}

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesError, setCategoriesError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 400);
  const debouncedMin = useDebouncedValue(minPrice, 400);
  const debouncedMax = useDebouncedValue(maxPrice, 400);

  const skipFetchAfterFilterResetRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get<string[]>('/api/categories')
      .then((r) => {
        if (!cancelled) setCategories(r.data);
      })
      .catch(() => {
        if (!cancelled) setCategoriesError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadCatalog = useCallback(async () => {
    try {
      setGridLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(ITEMS_PER_PAGE),
        sortBy: sortBy || 'relevance',
      });
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
      if (category) params.set('category', category);
      const minN = parseFloat(debouncedMin);
      if (debouncedMin.trim() !== '' && !Number.isNaN(minN)) params.set('minPrice', String(minN));
      const maxN = parseFloat(debouncedMax);
      if (debouncedMax.trim() !== '' && !Number.isNaN(maxN)) params.set('maxPrice', String(maxN));
      if (inStockOnly) params.set('inStockOnly', 'true');

      const { data } = await api.get<PagedResult<Product>>(`/api/products?${params.toString()}`);
      setProducts(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(Math.max(1, data.totalPages));
      if (data.page !== currentPage) setCurrentPage(data.page);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg || 'Could not load products.');
    } finally {
      setGridLoading(false);
      setLoading(false);
    }
  }, [
    currentPage,
    debouncedSearch,
    debouncedMin,
    debouncedMax,
    category,
    sortBy,
    inStockOnly,
  ]);

  useEffect(() => {
    setCurrentPage((p) => {
      if (p !== 1) {
        skipFetchAfterFilterResetRef.current = true;
        return 1;
      }
      return p;
    });
  }, [debouncedSearch, debouncedMin, debouncedMax, category, sortBy, inStockOnly]);

  useEffect(() => {
    if (skipFetchAfterFilterResetRef.current) {
      skipFetchAfterFilterResetRef.current = false;
      return;
    }
    void loadCatalog();
  }, [loadCatalog]);

  if (loading && products.length === 0 && !error) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen bg-ivory dark:bg-night-900">
        <span className="text-marrGold text-lg animate-pulse">Loading products…</span>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="text-center text-red-500 text-lg mt-10 px-6">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-full font-sans flex flex-col">
      <Helmet>
        <title>Catalog — Joyeria MARR</title>
      </Helmet>

      <section className="relative h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-ivory via-white to-gold-50 dark:from-night-900 dark:via-night-800 dark:to-night-900 overflow-hidden px-6">
        <img src="/Logo-MARR.png" alt="Jewelry catalog" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <RevealSection className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-marrGold drop-shadow mb-2 tracking-wide">Jewelry catalog</h2>
          <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100">Discover unique pieces for every occasion</p>
        </RevealSection>
      </section>

      <section className="w-full flex justify-center py-12 px-6 md:px-8">
        <RevealSection className="w-full max-w-5xl">
          <form className="flex flex-wrap gap-4 bg-white/95 dark:bg-night-800/95 rounded-2xl shadow-lg px-6 py-5 border border-gold-200/60 dark:border-gold-500/20 backdrop-blur-sm items-end">
            <div className="flex flex-col flex-1 min-w-[180px]">
              <label className="text-xs font-semibold text-marrGold mb-1 pl-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-lg border border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold pl-10 pr-4 py-2 text-base"
                  placeholder="Search by name or description…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-marrGold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex flex-col min-w-[140px]">
              <label className="text-xs font-semibold text-marrGold mb-1 pl-1">Category</label>
              <select
                className="w-full rounded-lg border border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold py-2 px-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {categoriesError && (
                <span className="text-xs text-amber-600 dark:text-amber-400 mt-1">Categories unavailable</span>
              )}
            </div>
            <div className="flex flex-col min-w-[110px]">
              <label className="text-xs font-semibold text-marrGold mb-1 pl-1">Min price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-marrGold">$</span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold pl-7 pr-2 py-2"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex flex-col min-w-[110px]">
              <label className="text-xs font-semibold text-marrGold mb-1 pl-1">Max price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-marrGold">$</span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold pl-7 pr-2 py-2"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex flex-col min-w-[150px]">
              <label className="text-xs font-semibold text-marrGold mb-1 pl-1">Sort by</label>
              <select
                className="w-full rounded-lg border border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold py-2 px-3"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <div className="flex flex-col items-center justify-end min-w-[120px]">
              <label className="text-xs font-semibold text-marrGold mb-1 pl-1">&nbsp;</label>
              <div className="flex items-center gap-2">
                <input
                  id="in-stock-only"
                  type="checkbox"
                  className="h-5 w-5 text-marrGold focus:ring-marrGold border-marrGold rounded bg-white dark:bg-gray-900"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <label htmlFor="in-stock-only" className="block text-sm text-marrGold select-none cursor-pointer">
                  In stock only
                </label>
              </div>
            </div>
          </form>
        </RevealSection>
      </section>

      <div className="max-w-5xl mx-auto flex-1 w-full px-6 md:px-8 pb-12 relative">
        {error && (
          <p className="text-center text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>
        )}
        {gridLoading && (
          <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
            <span className="text-marrGold text-sm bg-white/90 dark:bg-night-800/90 px-3 py-1 rounded-full shadow">Updating…</span>
          </div>
        )}
        {totalCount === 0 && !gridLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20 text-lg">No products match your filters.</div>
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 ${gridLoading ? 'opacity-60' : ''}`}>
              {products.map((product, i) => (
                <RevealSection key={product.id} delay={Math.min(i * 60, 360)}>
                  <ProductoCard
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    imageUrl={product.imageUrl ?? undefined}
                    category={product.category}
                    stock={product.stock}
                    isAvailable={product.isAvailable}
                  />
                </RevealSection>
              ))}
            </div>
            <CatalogPagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>

      <section className="max-w-4xl mx-auto text-center py-20 px-6">
        <RevealSection>
          <h3 className="text-2xl font-semibold text-marrGold mb-4">Looking for something one of a kind?</h3>
          <Link
            to="/custom-order"
            className="inline-block bg-gold-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-gold-600 transition-all duration-200 text-lg font-semibold"
          >
            Customize your jewelry
          </Link>
        </RevealSection>
      </section>
    </div>
  );
};

export default Catalog;
