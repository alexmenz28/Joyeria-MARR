import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import CustomOrder from './pages/CustomOrder';
import Login from './pages/Login';
import Register from './pages/Register';
import ShoppingCart from './pages/ShoppingCart';
import UserProfile from './pages/UserProfile';
import UserOrders from './pages/UserOrders';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import SalesManagement from './pages/admin/SalesManagement';
import ClientManagement from './pages/admin/ClientManagement';
import OrderManagement from './pages/admin/OrderManagement';
import ProtectedRoute from './components/common/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<ProductDetail />} />
            <Route path="/custom-order" element={<CustomOrder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<ShoppingCart />} />

            {/* Rutas de Usuario Protegidas (requieren autenticación) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/my-orders" element={<UserOrders />} />
            </Route>

            {/* Rutas de Administración Protegidas (requieren rol Admin) */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/sales" element={<SalesManagement />} />
              <Route path="/admin/clients" element={<ClientManagement />} />
              <Route path="/admin/orders" element={<OrderManagement />} />
            </Route>

            {/* Ruta 404 - No Encontrado */}
            <Route path="*" element={<h1 className="text-center text-4xl font-bold text-gray-800">404 - Página No Encontrada</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
