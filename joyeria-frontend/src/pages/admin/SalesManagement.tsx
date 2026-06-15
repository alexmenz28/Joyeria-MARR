import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminNavbar from '../../components/layout/AdminNavbar';
import api from '../../utils/api';
import type { SalesSummary } from '../../types';
import { formatUsd, formatUsdAxisTick } from '../../utils/usdFormat';
import { getApiErrorMessage } from '../../utils/apiErrors';

const MONTH_OPTIONS = [6, 12, 18, 24, 36];

const SalesManagement = () => {
  const [months, setMonths] = useState(12);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<SalesSummary>('/api/admin/sales/summary', { params: { months } });
        if (!cancelled) setSummary(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Could not load the report. Check permissions (Admin or Employee) and the API.'));
          setSummary(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [months]);

  const chartData =
    summary?.monthly.map((m) => ({
      name: m.label,
      revenue: Number(m.revenue),
      orders: m.orderCount,
    })) ?? [];

  return (
    <>
      <AdminNavbar />
      <div className="admin-page">
        <section className="page-hero h-40">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-bold text-marrGold md:text-4xl">Sales report</h1>
            <p className="mt-1 text-muted">Revenue and orders by month</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-10 px-6 md:px-8 space-y-8">
          {error && <div className="alert-error">{error}</div>}

          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
              Months:
              <select
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="input-marr !py-2"
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    Last {m}
                  </option>
                ))}
              </select>
            </label>
            {!loading && summary && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total in range: <strong className="text-marrGold">{formatUsd(summary.totalRevenueInRange)}</strong>{' '}
                · {summary.totalOrdersInRange} orders
              </p>
            )}
          </div>

          <div className="surface-panel p-6">
            <h2 className="text-xl font-bold text-marrGold mb-4">Monthly revenue</h2>
            {loading ? (
              <p className="text-marrGold animate-pulse py-24 text-center">Loading…</p>
            ) : chartData.length ? (
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 148, 148, 0.2)" />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9ca3af" tickFormatter={(v) => formatUsdAxisTick(v)} width={72} />
                  <Tooltip
                    formatter={(value: number, name: string) =>
                      name === 'revenue' ? [formatUsd(value), 'Revenue'] : [value, 'Orders']
                    }
                    contentStyle={{
                      backgroundColor: '#374151',
                      borderColor: '#4b5563',
                      color: '#ffffff',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#bfa14a" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 py-12 text-center">No data for the selected range.</p>
            )}
          </div>

          {!loading && summary && (summary.byCategory?.length > 0 || summary.byMaterial?.length > 0) && (
            <div className="grid gap-8 lg:grid-cols-2">
              {summary.byCategory?.length > 0 && (
                <div className="surface-panel p-6">
                  <h2 className="mb-4 text-xl font-bold text-marrGold">Revenue by category</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={summary.byCategory.map((r) => ({ name: r.name, revenue: Number(r.revenue) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 148, 148, 0.2)" />
                      <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#9ca3af" tickFormatter={(v) => formatUsdAxisTick(v)} width={72} />
                      <Tooltip formatter={(value: number) => [formatUsd(value), 'Revenue']} />
                      <Bar dataKey="revenue" fill="#bfa14a" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {summary.byMaterial?.length > 0 && (
                <div className="surface-panel p-6">
                  <h2 className="mb-4 text-xl font-bold text-marrGold">Revenue by material</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={summary.byMaterial.map((r) => ({ name: r.name, revenue: Number(r.revenue) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 148, 148, 0.2)" />
                      <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#9ca3af" tickFormatter={(v) => formatUsdAxisTick(v)} width={72} />
                      <Tooltip formatter={(value: number) => [formatUsd(value), 'Revenue']} />
                      <Bar dataKey="revenue" fill="#8b7355" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {!loading && summary && summary.topProducts?.length > 0 && (
            <div className="surface-panel overflow-x-auto p-6">
              <h2 className="mb-4 text-xl font-bold text-marrGold">Top products</h2>
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gold-200/50 text-marrGold dark:border-gold-500/20">
                    <th className="py-2 pr-4 font-semibold">Product</th>
                    <th className="py-2 pr-4 font-semibold">Units sold</th>
                    <th className="py-2 font-semibold">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.topProducts.map((p) => (
                    <tr key={p.productId} className="border-b border-gray-100 text-gray-800 dark:border-gold-500/10 dark:text-gray-200">
                      <td className="py-2 pr-4">{p.name}</td>
                      <td className="py-2 pr-4 tabular-nums">{p.quantitySold}</td>
                      <td className="py-2 tabular-nums">{formatUsd(Number(p.revenue))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="surface-panel overflow-x-auto p-6">
            <h2 className="text-xl font-bold text-marrGold mb-4">Monthly breakdown</h2>
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gold-200/50 dark:border-gold-500/20 text-marrGold">
                  <th className="py-2 pr-4 font-semibold">Month</th>
                  <th className="py-2 pr-4 font-semibold">Revenue</th>
                  <th className="py-2 font-semibold">Orders</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center animate-pulse text-marrGold">
                      …
                    </td>
                  </tr>
                ) : summary?.monthly.length ? (
                  summary.monthly.map((m) => (
                    <tr
                      key={`${m.year}-${m.month}`}
                      className="border-b border-gray-100 dark:border-gold-500/10 text-gray-800 dark:text-gray-200"
                    >
                      <td className="py-2 pr-4">{m.label}</td>
                      <td className="py-2 pr-4 tabular-nums">{formatUsd(Number(m.revenue))}</td>
                      <td className="py-2 tabular-nums">{m.orderCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      No rows.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default SalesManagement;
