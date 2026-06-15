import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import axios from 'axios';
import api from '../../utils/api';
import type { Order, OrderStatusOption, PagedResult } from '../../types';
import TablePagination, { ADMIN_TABLE_PAGE_SIZE } from '../../components/admin/TablePagination';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { useAuth } from '../../context/AuthContext';
import { isAdmin } from '../../utils/jwtRole';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const OrderManagement = () => {
  const { role } = useAuth();
  const canDelete = isAdmin(role);

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tablePage, setTablePage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const skipFetchAfterSearchResetRef = useRef(false);

  const [statusOptions, setStatusOptions] = useState<OrderStatusOption[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusDraft, setStatusDraft] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    void api
      .get<OrderStatusOption[]>('/api/order-statuses')
      .then((r) => setStatusOptions(r.data))
      .catch(() => setStatusOptions([]));
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setListLoading(true);
      setError(null);
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
      if (status === 403) {
        setError('You do not have permission to view all orders (Admin or Employee only).');
      } else if (status === 0 || !status) {
        setError('Could not reach the API. Check that the backend is running and REACT_APP_API_BASE_URL.');
      } else {
        setError(getApiErrorMessage(e, `Could not load orders (error ${status}).`));
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

  const openOrderDetail = async (orderId: number) => {
    setActionError(null);
    setDeleteConfirm(false);
    setDetailLoading(true);
    setSelectedOrder(null);
    try {
      const { data } = await api.get<Order>(`/api/orders/${orderId}`);
      setSelectedOrder(data);
      setStatusDraft(data.status ?? '');
    } catch (e: unknown) {
      setError(getApiErrorMessage(e, 'Could not load order details.'));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    setActionError(null);
    setDeleteConfirm(false);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder || !statusDraft.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const { data } = await api.patch<Order>(`/api/orders/${selectedOrder.id}/status`, {
        status: statusDraft,
      });
      setSelectedOrder(data);
      setStatusDraft(data.status ?? statusDraft);
      await loadOrders();
    } catch (e: unknown) {
      setActionError(getApiErrorMessage(e, 'Could not update status.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder || !canDelete) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await api.delete(`/api/orders/${selectedOrder.id}`);
      closeDetail();
      await loadOrders();
    } catch (e: unknown) {
      setActionError(getApiErrorMessage(e, 'Could not delete order.'));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="w-full min-h-screen bg-ivory dark:bg-night-900 transition-colors pt-24">
        <section className="relative h-40 flex items-center justify-center bg-gradient-to-br from-ivory via-white to-gold-50 dark:from-night-900 dark:via-night-800 dark:to-night-900 overflow-hidden px-6">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-marrGold">Order management</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1">View, update status and manage customer orders</p>
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
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-200/40 dark:divide-gold-500/20 text-gray-800 dark:text-gray-200">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
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
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => void openOrderDetail(o.id)}
                              className="bg-gold-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gold-600 transition-colors"
                            >
                              View
                            </button>
                          </td>
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

      {(detailLoading || selectedOrder) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-detail-title"
        >
          <div className="bg-white dark:bg-night-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gold-200/60 dark:border-gold-500/20 p-6 md:p-8">
            {detailLoading && !selectedOrder ? (
              <p className="text-marrGold animate-pulse text-center py-8">Loading order…</p>
            ) : selectedOrder ? (
              <>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h2 id="order-detail-title" className="text-xl font-bold text-marrGold">
                    Order #{selectedOrder.id}
                  </h2>
                  <button
                    type="button"
                    onClick={closeDetail}
                    className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                  >
                    Close
                  </button>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-6">
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Customer</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedOrder.user
                        ? `${selectedOrder.user.firstName} ${selectedOrder.user.lastName}`
                        : `User #${selectedOrder.userId}`}
                    </dd>
                    {selectedOrder.user?.email && (
                      <dd className="text-gray-600 dark:text-gray-400">{selectedOrder.user.email}</dd>
                    )}
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Date</dt>
                    <dd className="font-medium">{formatDate(selectedOrder.orderedAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400">Total</dt>
                    <dd className="font-semibold text-marrGold tabular-nums">
                      ${Number(selectedOrder.total).toFixed(2)}
                    </dd>
                  </div>
                  {selectedOrder.notes && (
                    <div className="sm:col-span-2">
                      <dt className="text-gray-500 dark:text-gray-400">Notes</dt>
                      <dd className="whitespace-pre-wrap">{selectedOrder.notes}</dd>
                    </div>
                  )}
                </dl>

                <h3 className="text-sm font-bold text-marrGold uppercase tracking-wide mb-2">Line items</h3>
                <ul className="divide-y divide-gold-200/40 dark:divide-gold-500/20 border border-gold-200/40 dark:border-gold-500/20 rounded-lg mb-6">
                  {(selectedOrder.lines ?? []).length === 0 ? (
                    <li className="px-4 py-3 text-gray-500 text-sm">No line items.</li>
                  ) : (
                    (selectedOrder.lines ?? []).map((line) => (
                      <li key={line.id} className="px-4 py-3 text-sm flex justify-between gap-4">
                        <div>
                          {line.product ? (
                            <span className="font-medium">{line.product.name}</span>
                          ) : (
                            <span className="font-medium italic">Custom order</span>
                          )}
                          {line.customDescription && (
                            <p className="text-gray-600 dark:text-gray-400 mt-0.5">{line.customDescription}</p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">Qty: {line.quantity}</p>
                        </div>
                        <span className="tabular-nums font-medium shrink-0">
                          ${(line.unitPrice * line.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))
                  )}
                </ul>

                <div className="flex flex-wrap items-end gap-3 mb-4">
                  <div className="flex-1 min-w-[180px]">
                    <label htmlFor="order-status" className="block text-xs font-semibold text-marrGold mb-1">
                      Status
                    </label>
                    <select
                      id="order-status"
                      value={statusDraft}
                      onChange={(e) => setStatusDraft(e.target.value)}
                      className="w-full rounded-lg border border-gold-200 dark:border-gold-500/30 bg-white dark:bg-night-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                    >
                      {statusOptions.length === 0 ? (
                        <option value={statusDraft}>{statusDraft || '—'}</option>
                      ) : (
                        statusOptions.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSaveStatus()}
                    disabled={actionLoading || statusDraft === (selectedOrder.status ?? '')}
                    className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600 disabled:opacity-50"
                  >
                    {actionLoading ? 'Saving…' : 'Save status'}
                  </button>
                </div>

                {actionError && (
                  <p className="text-red-600 dark:text-red-400 text-sm mb-4">{actionError}</p>
                )}

                {canDelete && (
                  <div className="border-t border-gold-200/40 dark:border-gold-500/20 pt-4 mt-4">
                    {!deleteConfirm ? (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(true)}
                        className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete order…
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Delete this order permanently? Stock will be restored if not cancelled.
                        </p>
                        <button
                          type="button"
                          onClick={() => void handleDeleteOrder()}
                          disabled={actionLoading}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Confirm delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(false)}
                          className="text-sm text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderManagement;
