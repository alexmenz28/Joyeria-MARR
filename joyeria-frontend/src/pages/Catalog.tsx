import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import ProductoCard from '../components/productos/ProductoCard';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenUrl?: string;
  cantidadDisponible: number;
}

const Catalog = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get<Producto[]>('/api/Productos');
        setProductos(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar los productos.');
      }
      finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return <div className="text-center text-lg mt-10">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg mt-10">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Nuestro Catálogo de Joyería</h2>
      {productos.length === 0 ? (
        <p className="text-center text-gray-600">No hay productos disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              id={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              precio={producto.precio}
              imagenUrl={producto.imagenUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog; 