import React, { useCallback, useEffect, useState } from 'react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import TablePagination, { ADMIN_TABLE_PAGE_SIZE } from '../../components/admin/TablePagination';
import api from '../../utils/api';
import type { PagedResult } from '../../types';
import { getApiErrorMessage } from '../../utils/apiErrors';

export interface ContactMessageItem {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const AdminSettings = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PagedResult<ContactMessageItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await api.get<PagedResult<ContactMessageItem>>('/api/admin/contact-messages', {
        params: { page, pageSize: ADMIN_TABLE_PAGE_SIZE },
      });
      setData(res);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not load contact messages.'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = async (id: number) => {
    try {
      await api.patch(`/api/admin/contact-messages/${id}/read`);
      void load();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not update message.'));
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-page">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-marrGold mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Store configuration and inbound contact messages.</p>

          <section className="rounded-2xl border border-gold-200/60 dark:border-gold-500/20 bg-white dark:bg-night-800 shadow-lg overflow-hidden">
            <div className="border-b border-gold-200/60 dark:border-gold-500/20 px-6 py-4">
              <h2 className="text-xl font-semibold text-marrGold">Contact messages</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submitted from the public contact form.</p>
            </div>

            {error && (
              <div className="mx-6 mt-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {loading && !data ? (
              <p className="p-8 text-center text-marrGold animate-pulse">Loading messages…</p>
            ) : !data || data.items.length === 0 ? (
              <p className="p-8 text-center text-gray-500 dark:text-gray-400">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-gold-100 dark:divide-gold-500/20">
                {data.items.map((m) => (
                  <li key={m.id} className={`px-6 py-4 ${m.isRead ? 'opacity-75' : 'bg-gold-50/40 dark:bg-gold-900/10'}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {m.name}{' '}
                          <span className="font-normal text-sm text-gray-500 dark:text-gray-400">
                            &lt;{m.email}&gt;
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(m.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                          {!m.isRead && (
                            <span className="ml-2 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                              New
                            </span>
                          )}
                        </p>
                      </div>
                      {!m.isRead && (
                        <button
                          type="button"
                          onClick={() => void markRead(m.id)}
                          className="text-sm font-medium text-gold-600 dark:text-gold-400 hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{m.message}</p>
                  </li>
                ))}
              </ul>
            )}

            {data && data.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gold-200/60 dark:border-gold-500/20">
                <TablePagination
                  page={data.page}
                  pageSize={ADMIN_TABLE_PAGE_SIZE}
                  totalItems={data.totalCount}
                  onPageChange={setPage}
                  itemNoun="message"
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
