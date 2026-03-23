import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RevealSection from '../components/common/RevealSection';
import api from '../utils/api';
import type { Order, PagedResult } from '../types';
import TablePagination, { ADMIN_TABLE_PAGE_SIZE } from '../components/admin/TablePagination';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const loadOrders = useCallback(async () => {
    if (!token) return;
    try {
      setListLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(ADMIN_TABLE_PAGE_SIZE),
      });
      const { data } = await api.get<PagedResult<Order>>(`/api/orders/my?${params.toString()}`);
      setOrders(data.items);
      setTotalCount(data.totalCount);
      if (data.page !== page) setPage(data.page);
    } catch {
      setError('Could not load your orders. Try signing in again.');
    } finally {
      setListLoading(false);
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    void loadOrders();
  }, [token, loadOrders]);

  if (!token) {
    return (
      <div className="min-h-full font-sans">
        <section className="max-w-5xl mx-auto py-16 px-6 md:px-8">
          <RevealSection>
            <h2 className="text-3xl font-bold text-marrGold mb-4">My orders</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Sign in to see your order history.</p>
            <Link to="/login" className="inline-block bg-gold-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-gold-600">
              Sign in
            </Link>
          </RevealSection>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-full font-sans">
      <section className="max-w-5xl mx-auto py-16 px-6 md:px-8">
        <RevealSection>
          <h2 className="text-3xl font-bold text-marrGold mb-4">My orders</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">Your order history from the store.</p>
        </RevealSection>

        {loading && orders.length === 0 && <p className="text-marrGold animate-pulse">Loading…</p>}
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

        {!loading && !error && totalCount === 0 && (
          <div className="p-6 bg-white dark:bg-night-800 rounded-2xl border border-gold-200/60 dark:border-gold-500/20 shadow-lg">
            <p className="text-gray-600 dark:text-gray-400">You have no orders yet.</p>
            <Link to="/catalog" className="inline-block mt-4 text-gold-600 dark:text-gold-400 font-medium hover:opacity-80">
              Browse catalog
            </Link>
          </div>
        )}

        {!loading && !error && totalCount > 0 && (
          <div className="rounded-2xl border border-gold-200/60 dark:border-gold-500/20 shadow-lg bg-white dark:bg-night-800 overflow-hidden relative">
            {listLoading && (
              <div className="absolute inset-0 z-10 flex items-start justify-center pt-8 bg-white/50 dark:bg-night-800/50 pointer-events-none">
                <span className="text-marrGold text-sm animate-pulse">Updating…</span>
              </div>
            )}
            <ul className={`space-y-0 divide-y divide-gold-200/40 dark:divide-gold-500/20 p-4 md:p-6 ${listLoading ? 'opacity-60' : ''}`}>
              {orders.map((order) => (
                <li key={order.id} className="py-6 first:pt-0 last:pb-0">
                  <RevealSection>
                    <div className="flex flex-wrap justify-between gap-2 mb-4">
                      <span className="font-bold text-marrGold">Order #{order.id}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.orderedAt)}</span>
                      <span className="text-sm font-semibold text-gold-700 dark:text-gold-400">{order.status ?? '—'}</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">${Number(order.total).toFixed(2)}</span>
                    </div>
                    {order.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <strong>Notes:</strong> {order.notes}
                      </p>
                    )}
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 border-t border-gold-200/40 dark:border-gold-500/20 pt-3">
                      {order.lines?.map((line) => (
                        <li key={line.id}>
                          {line.customDescription ??
                            line.product?.name ??
                            (line.productId != null ? `Product #${line.productId}` : 'Custom item')}{' '}
                          × {line.quantity} @ ${Number(line.unitPrice).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </RevealSection>
                </li>
              ))}
            </ul>
            <TablePagination page={page} pageSize={ADMIN_TABLE_PAGE_SIZE} totalItems={totalCount} onPageChange={setPage} itemNoun="order" />
          </div>
        )}
      </section>
    </div>
  );
};

export default UserOrders;
