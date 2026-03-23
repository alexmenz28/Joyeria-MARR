import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminNavbar from '../../components/layout/AdminNavbar';
import api from '../../utils/api';
import type { SalesSummary } from '../../types';

function formatMoney(n: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
}

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
      } catch {
        if (!cancelled) {
          setError('No se pudo cargar el informe. Comprueba permisos (Admin o Employee) y la API.');
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
      <div className="w-full min-h-screen bg-ivory dark:bg-night-900 transition-colors pt-24">
        <section className="relative h-40 flex items-center justify-center bg-gradient-to-br from-ivory via-white to-gold-50 dark:from-night-900 dark:via-night-800 dark:to-night-900 overflow-hidden px-6">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-marrGold">Informe de ventas</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1">Ingresos y pedidos por mes</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-10 px-6 md:px-8 space-y-8">
          {error && (
            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
              Meses:
              <select
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="rounded-lg border border-gold-200/80 dark:border-gold-500/30 bg-white dark:bg-night-800 px-3 py-2 text-gray-900 dark:text-gray-100"
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    Últimos {m}
                  </option>
                ))}
              </select>
            </label>
            {!loading && summary && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total en rango: <strong className="text-marrGold">{formatMoney(summary.totalRevenueInRange)}</strong>{' '}
                · {summary.totalOrdersInRange} pedidos
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-night-800 rounded-2xl shadow-lg border border-gold-200/60 dark:border-gold-500/20 p-6">
            <h2 className="text-xl font-bold text-marrGold mb-4">Ingresos mensuales</h2>
            {loading ? (
              <p className="text-marrGold animate-pulse py-24 text-center">Cargando…</p>
            ) : chartData.length ? (
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 148, 148, 0.2)" />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9ca3af" tickFormatter={(v) => formatMoney(Number(v))} width={72} />
                  <Tooltip
                    formatter={(value: number, name: string) =>
                      name === 'revenue' ? [formatMoney(value), 'Ingresos'] : [value, 'Pedidos']
                    }
                    contentStyle={{
                      backgroundColor: '#374151',
                      borderColor: '#4b5563',
                      color: '#ffffff',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#bfa14a" name="Ingresos" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 py-12 text-center">No hay datos en el rango seleccionado.</p>
            )}
          </div>

          <div className="bg-white dark:bg-night-800 rounded-2xl shadow-lg border border-gold-200/60 dark:border-gold-500/20 p-6 overflow-x-auto">
            <h2 className="text-xl font-bold text-marrGold mb-4">Detalle por mes</h2>
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gold-200/50 dark:border-gold-500/20 text-marrGold">
                  <th className="py-2 pr-4 font-semibold">Mes</th>
                  <th className="py-2 pr-4 font-semibold">Ingresos</th>
                  <th className="py-2 font-semibold">Pedidos</th>
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
                      <td className="py-2 pr-4 tabular-nums">{formatMoney(Number(m.revenue))}</td>
                      <td className="py-2 tabular-nums">{m.orderCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      Sin filas.
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
