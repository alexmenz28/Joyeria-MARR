import React from 'react';
import { ShoppingCart, Users, Package, DollarSign, ArrowRight, Settings, Box, User, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';

// Datos de ejemplo
const salesData = [
  { name: 'Ene', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Abr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 8000 },
];

const recentOrders = [
  { id: '#1234', user: 'Juan Pérez', date: '2024-07-20', total: '$150.00', status: 'Enviado' },
  { id: '#1235', user: 'Ana Gómez', date: '2024-07-20', total: '$250.50', status: 'Procesando' },
  { id: '#1236', user: 'Luis Martínez', date: '2024-07-19', total: '$80.00', status: 'Entregado' },
];

const KPICard = ({ title, value, icon: Icon, change }: { title: string, value: string, icon: React.ElementType, change?: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
      <Icon className="h-8 w-8 text-marrGold" />
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
    {change && <p className="text-sm text-green-500 mt-1">{change}</p>}
  </div>
);

const QuickLink = ({ to, title, icon: Icon }: { to: string, title: string, icon: React.ElementType }) => (
    <Link to={to} className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
        <Icon className="h-10 w-10 text-marrGold mb-3" />
        <span className="font-semibold text-gray-800 dark:text-gray-200 text-center">{title}</span>
    </Link>
)

const Dashboard = () => {
  return (
    <>
      <AdminNavbar />
      <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Panel de Administración</h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="Ventas Totales" value="$75,392" icon={DollarSign} change="+12% vs mes anterior" />
          <KPICard title="Ganancias" value="$32,541" icon={DollarSign} change="+8% vs mes anterior" />
          <KPICard title="Pedidos Nuevos" value="1,204" icon={ShoppingCart} change="+5% hoy" />
          <KPICard title="Total de Clientes" value="8,421" icon={Users} />
        </div>

         {/* Accesos rápidos */}
         <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Accesos Rápidos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  <QuickLink to="/admin/productos" title="Gestionar Productos" icon={Box} />
                  <QuickLink to="/admin/pedidos" title="Gestionar Pedidos" icon={ShoppingCart} />
                  <QuickLink to="/admin/usuarios" title="Gestionar Usuarios" icon={Users} />
                   <QuickLink to="/admin/ventas" title="Reporte de Ventas" icon={BarChart} />
                   <QuickLink to="/admin/configuracion" title="Configuración" icon={Settings} />
                   <QuickLink to="/" title="Ver Tienda" icon={ArrowRight} />
              </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico de Ventas */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ventas Mensuales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#374151',
                    borderColor: '#4b5563',
                    color: '#ffffff',
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#bfa14a" name="Ventas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pedidos Recientes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pedidos Recientes</h2>
            <div className="flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order) => (
                  <li key={order.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{order.user}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{order.id} - {order.date}</p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{order.total}</div>
                    </div>
                    <div className="text-right text-xs text-blue-500 font-bold">{order.status}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link to="/admin/pedidos" className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-marrGold hover:bg-yellow-600">
                Ver todos los pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 