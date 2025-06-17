import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800">Detalle del Producto {id}</h1>
      <p className="mt-4 text-lg text-gray-600">Aquí se mostrarán los detalles de un producto específico.</p>
      {/* Aquí se mostrarán los detalles del producto y opción de añadir al carrito */}
    </div>
  );
};

export default ProductDetail; 