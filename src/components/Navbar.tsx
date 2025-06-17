import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-primary-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200">
          Joyería MARR
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/catalog" className="hover:text-gray-300 transition-colors duration-200">Catálogo</Link>
          <Link to="/custom-order" className="hover:text-gray-300 transition-colors duration-200">Pedido Personalizado</Link>
          <Link to="/contact" className="hover:text-gray-300 transition-colors duration-200">Contacto</Link>
          <Link to="/cart" className="hover:text-gray-300 transition-colors duration-200">Carrito</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-gray-300 transition-colors duration-200">Mi Perfil</Link>
              {user?.role === 'Admin' && (
                <Link to="/admin/dashboard" className="hover:text-gray-300 transition-colors duration-200">Admin</Link>
              )}
              <button
                onClick={logout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-accent-500 px-3 py-1 rounded hover:bg-accent-600 transition-colors duration-200">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 