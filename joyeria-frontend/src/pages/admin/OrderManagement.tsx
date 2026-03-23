import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import axios from 'axios';
import api from '../../utils/api';
import type { Order, PagedResult } from '../../types';
import TablePagination, { ADMIN_TABLE_PAGE_SIZE } from '../../components/admin/TablePagination';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tablePage, setTablePage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const skipFetchAfterSearchResetRef = useRef(false);

  const loadOrders = useCallback(async () => {
    try {
      setListLoading(true);
      const params = new URLSearchParams({
        page: String(tablePage),
        pageSize: String(ADMIN_TABLE_PAGE_SIZE),
      });
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
      const { data } = await api.get<PagedResult<Order>>(`/api/orders?${params.toString()}`);
      setOrders(data.items);
      setTotalCount(data.totalCount);
      if (data.page !== tablePage) setTablePage(data.page);
    } catch (e: unknown) {
      const status = axios.isAxiosError(e) ? e.response?.status : undefined;
      if (status === 401) {
        setError('Session expired or not signed in. Please sign in again.');
      } else if (status === 403) {
        setError('You do not have permission to view all orders (Admin or Employee only).');
      } else if (status === 0 || !status) {
        setError('Could not reach the API. Check that the backend is running and REACT_APP_API_BASE_URL.');
      } else {
        setError(`Could not load orders (error ${status}).`);
      }
    } finally {
      setListLoading(false);
      setLoading(false);
    }
  }, [tablePage, debouncedSearch]);

  useEffect(() => {
    setTablePage((p) => {
      if (p !== 1) {
        skipFetchAfterSearchResetRef.current = true;
        return 1;
      }
      return p;
    });
  }, [debouncedSearch]);

  useEffect(() => {
    if (skipFetchAfterSearchResetRef.current) {
      skipFetchAfterSearchResetRef.current = false;
      return;
    }
    void loadOrders();
  }, [loadOrders]);

  return (
    <>
      <AdminNavbar />
      <div className="w-full min-h-screen bg-ivory dark:bg-night-900 transition-colors pt-24">
        <section className="relative h-40 flex items-center justify-center bg-gradient-to-br from-ivory via-white to-gold-50 dark:from-night-900 dark:via-night-800 dark:to-night-900 overflow-hidden px-6">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-marrGold">Order management</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1">All customer orders</p>
          </div>
        </section>
        <section className="max-w-6xl mx-auto py-12 px-6 md:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <label className="sr-only" htmlFor="order-search">
              Search orders
            </label>
            <input
              id="order-search"
              type="search"
              placeholder="Search by order ID, email or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:max-w-md px-4 py-2 rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          {loading && orders.length === 0 && <p className="text-marrGold animate-pulse">Loading…</p>}
          {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
          {!loading && !error && (
            <div className="rounded-2xl border border-gold-200/60 dark:border-gold-500/20 shadow-lg bg-white dark:bg-night-800 overflow-hidden relative">
              {listLoading && (
                <div className="absolute inset-0 z-10 flex items-start justify-center pt-8 bg-white/50 dark:bg-night-800/50 pointer-events-none">
                  <span className="text-marrGold text-sm animate-pulse">Updating…</span>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gold-50 dark:bg-night-700 text-marrGold uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-200/40 dark:divide-gold-500/20 text-gray-800 dark:text-gray-200">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                          {totalCount === 0 && !debouncedSearch.trim()
                            ? 'No orders in the database.'
                            : 'No orders match your search.'}
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gold-50/50 dark:hover:bg-night-700/50">
                          <td className="py-3 px-4 font-semibold text-marrGold">#{o.id}</td>
                          <td className="py-3 px-4">
                            {o.user
                              ? `${o.user.firstName} ${o.user.lastName} (${o.user.email})`
                              : `User #${o.userId}`}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">{formatDate(o.orderedAt)}</td>
                          <td className="py-3 px-4">{o.status ?? '—'}</td>
                          <td className="py-3 px-4 text-right font-semibold">${Number(o.total).toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <TablePagination
                page={tablePage}
                pageSize={ADMIN_TABLE_PAGE_SIZE}
                totalItems={totalCount}
                onPageChange={setTablePage}
                itemNoun="order"
              />
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default OrderManagement;
