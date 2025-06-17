import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

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

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
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
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/productos" element={<ProductManagement />} />
          <Route path="/admin/ventas" element={<SalesManagement />} />
          <Route path="/admin/usuarios" element={<UserManagement />} />
          <Route path="/admin/pedidos" element={<OrderManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
