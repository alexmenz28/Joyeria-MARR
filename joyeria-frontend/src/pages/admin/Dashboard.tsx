import React, { useEffect, useState } from 'react';
import { ShoppingCart, Users, DollarSign, ArrowRight, Settings, Box, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '../../components/layout/AdminNavbar';
import api from '../../utils/api';
import { getJwtRole, isAdmin } from '../../utils/jwtRole';
import type { AdminDashboardStats, SalesSummary } from '../../types';
import { formatUsd, formatUsdAxisTick } from '../../utils/usdFormat';

const KPICard = ({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  subtitle?: string;
}) => (
  <div className="bg-white dark:bg-night-800 rounded-xl shadow-lg border border-gold-200/60 dark:border-gold-500/20 p-6 flex flex-col justify-between transition-colors">
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
      <Icon className="h-8 w-8 text-marrGold" />
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2 tabular-nums">{value}</p>
    {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
  </div>
);

const QuickLink = ({ to, title, icon: Icon }: { to: string; title: string; icon: React.ElementType }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center bg-white dark:bg-night-800 rounded-xl shadow-lg border border-gold-200/60 dark:border-gold-500/20 p-6 hover:bg-gold-50 dark:hover:bg-night-700 transition-all duration-200"
  >
    <Icon className="h-10 w-10 text-marrGold mb-3" />
    <span className="font-semibold text-gray-800 dark:text-gray-200 text-center">{title}</span>
  </Link>
);

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

const Dashboard = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAdminUser(false);
      return;
    }
    try {
      const decoded = jwtDecode<Record<string, unknown>>(token);
      setIsAdminUser(isAdmin(getJwtRole(decoded)));
    } catch {
      setIsAdminUser(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [statsRes, salesRes] = await Promise.allSettled([
          api.get<AdminDashboardStats>('/api/admin/stats'),
          api.get<SalesSummary>('/api/admin/sales/summary', { params: { months: 6 } }),
        ]);
        if (cancelled) return;
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
        else setError('Could not load dashboard stats. Check permissions and API URL.');
        if (salesRes.status === 'fulfilled') setSalesSummary(salesRes.value.data);
        else setSalesSummary(null);
      } catch {
        if (!cancelled) setError('Could not load dashboard stats. Check permissions and API URL.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const salesChartData =
    salesSummary?.monthly.map((m) => ({
      name: m.label,
      sales: Number(m.revenue),
    })) ?? [];

  return (
    <>
      <AdminNavbar />
      <div className="pt-24 p-4 md:p-8 bg-ivory dark:bg-night-900 min-h-full transition-colors">
        <h1 className="text-3xl font-bold text-marrGold mb-6">Admin dashboard</h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Products"
            value={loading ? '…' : String(stats?.productCount ?? 0)}
            icon={Box}
            subtitle="In catalog"
          />
          <KPICard
            title="Orders"
            value={loading ? '…' : String(stats?.orderCount ?? 0)}
            icon={ShoppingCart}
            subtitle="All time"
          />
          <KPICard
            title="Customers"
            value={loading ? '…' : String(stats?.customerCount ?? 0)}
            icon={Users}
            subtitle={loading ? undefined : `${stats?.userCount ?? 0} users total`}
          />
          <KPICard
            title="Revenue (orders)"
            value={loading ? '…' : formatUsd(stats?.ordersRevenueTotal ?? 0)}
            icon={DollarSign}
            subtitle="Sum of order totals"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quick links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <QuickLink to="/admin/products" title="Manage products" icon={Box} />
            <QuickLink to="/admin/orders" title="Manage orders" icon={ShoppingCart} />
            {isAdminUser && <QuickLink to="/admin/users" title="Manage users" icon={Users} />}
            <QuickLink to="/admin/sales" title="Sales report" icon={TrendingUp} />
            <QuickLink to="/admin/settings" title="Settings" icon={Settings} />
            <QuickLink to="/" title="View storefront" icon={ArrowRight} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-night-800 rounded-xl shadow-lg border border-gold-200/60 dark:border-gold-500/20 p-6 transition-colors">
            <h2 className="text-xl font-bold text-marrGold mb-1">Monthly sales</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Last 6 months from orders (same source as Sales report).
            </p>
            {salesChartData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9ca3af" tickFormatter={(v) => formatUsdAxisTick(v)} width={68} />
                  <Tooltip
                    formatter={(value: number) => [formatUsd(value), 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#374151',
                      borderColor: '#4b5563',
                      color: '#ffffff',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#bfa14a" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-16 text-center">
                {loading ? 'Loading chart…' : 'No sales in this period yet.'}
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-night-800 rounded-xl shadow-lg border border-gold-200/60 dark:border-gold-500/20 p-6 transition-colors">
            <h2 className="text-xl font-bold text-marrGold mb-4">Recent orders</h2>
            <div className="flow-root">
              {loading ? (
                <p className="text-marrGold animate-pulse text-sm">Loading…</p>
              ) : stats?.recentOrders?.length ? (
                <ul className="-my-5 divide-y divide-gray-200 dark:divide-gold-500/20">
                  {stats.recentOrders.map((order) => (
                    <li key={order.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{order.customerName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            #{order.id} — {formatDate(order.orderedAt)}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                          {formatUsd(order.total)}
                        </div>
                      </div>
                      <div className="text-right text-xs text-gold-600 dark:text-gold-400 font-bold">{order.status ?? '—'}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet.</p>
              )}
            </div>
            <div className="mt-6">
              <Link
                to="/admin/orders"
                className="w-full flex justify-center items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gold-500 hover:bg-gold-600 transition-all duration-200"
              >
                View all orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
