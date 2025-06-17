import React from 'react';

const UserOrders: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800">Mis Pedidos</h1>
      <p className="mt-4 text-lg text-gray-600">Revisa el estado y los detalles de tus pedidos.</p>
      {/* Aquí se mostrarán los pedidos del usuario */}
    </div>
  );
};

export default UserOrders; 