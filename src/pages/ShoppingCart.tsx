import React from 'react';

const ShoppingCart: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800">Carrito de Compras</h1>
      <p className="mt-4 text-lg text-gray-600">Revisa los artículos que has añadido.</p>
      {/* Aquí se mostrarán los artículos del carrito */}
    </div>
  );
};

export default ShoppingCart; 