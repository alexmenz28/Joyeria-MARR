import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import ProtectedRoute from './components/common/ProtectedRoute';
import BackToTop from './components/common/BackToTop';
import Navbar from './components/layout/Navbar';
import { CartProvider } from './context/CartContext';
import CartToast from './components/cart/CartToast';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import CustomOrder from './pages/CustomOrder';
import ShoppingCart from './pages/ShoppingCart';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import UserOrders from './pages/UserOrders';
import Contact from './pages/Contact';

import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import SalesManagement from './pages/admin/SalesManagement';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';
import AdminSettings from './pages/admin/AdminSettings';

/** Redirect /producto/:id → /product/:id */
function LegacyProductRedirect() {
  const { id } = useParams();
  return <Navigate to={`/product/${id}`} replace />;
}

function AppRoutes() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/iniciar-sesion' ||
    location.pathname === '/register' ||
    location.pathname === '/registro' ||
    location.pathname.startsWith('/admin');
  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="min-h-screen w-full bg-ivory dark:bg-night-900 transition-colors overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
          <Route path="/admin/sales" element={<ProtectedRoute><SalesManagement /></ProtectedRoute>} />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/orders" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

          {/* Legacy Spanish URLs → English */}
          <Route path="/catalogo" element={<Navigate to="/catalog" replace />} />
          <Route path="/contacto" element={<Navigate to="/contact" replace />} />
          <Route path="/iniciar-sesion" element={<Navigate to="/login" replace />} />
          <Route path="/registro" element={<Navigate to="/register" replace />} />
          <Route path="/perfil" element={<Navigate to="/profile" replace />} />
          <Route path="/mis-pedidos" element={<Navigate to="/orders" replace />} />
          <Route path="/carrito" element={<Navigate to="/cart" replace />} />
          <Route path="/pedido-personalizado" element={<Navigate to="/custom-order" replace />} />
          <Route path="/producto/:id" element={<LegacyProductRedirect />} />

          <Route path="/admin/productos" element={<Navigate to="/admin/products" replace />} />
          <Route path="/admin/pedidos" element={<Navigate to="/admin/orders" replace />} />
          <Route path="/admin/usuarios" element={<Navigate to="/admin/users" replace />} />
          <Route path="/admin/ventas" element={<Navigate to="/admin/sales" replace />} />
          <Route path="/admin/configuracion" element={<Navigate to="/admin/settings" replace />} />
        </Routes>
      </div>
      <BackToTop />
    </>
  );
}

function App() {
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    const dark = stored === 'true';
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <CartProvider>
          <AppRoutes />
          <CartToast />
        </CartProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
