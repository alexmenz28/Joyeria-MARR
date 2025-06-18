import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/common/ProtectedRoute';

// Importación de componentes de diseño
import Navbar from './components/layout/Navbar';

// Importación de páginas de usuario/cliente
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

// Importación de páginas de administración
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import SalesManagement from './pages/admin/SalesManagement';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/iniciar-sesion' || location.pathname === '/registro';
  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="min-h-screen w-screen bg-white dark:bg-gradient-to-br dark:from-[#181c2a] dark:via-[#23263a] dark:to-[#1a1d2b] transition-colors">
        <Routes>
          {/* Rutas de Usuario/Cliente */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/pedido-personalizado" element={<CustomOrder />} />
          <Route path="/carrito" element={<ShoppingCart />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/mis-pedidos" element={<UserOrders />} />
          <Route path="/contacto" element={<Contact />} />

          {/* Rutas de Administración */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/productos" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
          <Route path="/admin/ventas" element={<ProtectedRoute><SalesManagement /></ProtectedRoute>} />
          <Route path="/admin/usuarios" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/pedidos" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  // Lógica global de modo oscuro
  useEffect(() => {
    // Preferencia guardada
    const stored = localStorage.getItem('darkMode');
    let dark = false;
    if (stored === null) {
      // Si no hay preferencia, usar la del sistema
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      dark = stored === 'true';
    }
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
