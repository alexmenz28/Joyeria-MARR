import React, { useEffect, useState, useMemo } from 'react';
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
  disponible?: boolean;
}

const Catalog = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [orden, setOrden] = useState('relevancia');

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

  // Categorías únicas
  const categorias = useMemo(() => {
    const set = new Set(productos.map(p => p.categoria).filter(Boolean));
    return Array.from(set);
  }, [productos]);

  // Filtrado y ordenamiento
  const productosFiltrados = useMemo(() => {
    let filtrados = productos.filter(p =>
      (!search || p.nombre.toLowerCase().includes(search.toLowerCase()) || p.descripcion.toLowerCase().includes(search.toLowerCase())) &&
      (!categoria || p.categoria === categoria) &&
      (!precioMin || p.precio >= parseFloat(precioMin)) &&
      (!precioMax || p.precio <= parseFloat(precioMax)) &&
      (!soloDisponibles || p.cantidadDisponible > 0 || p.disponible)
    );
    switch (orden) {
      case 'precio-asc':
        filtrados = filtrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        filtrados = filtrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre-asc':
        filtrados = filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        filtrados = filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'reciente':
        filtrados = filtrados.sort((a, b) => (b as any).fechaCreacion?.localeCompare((a as any).fechaCreacion));
        break;
      default:
        break;
    }
    return filtrados;
  }, [productos, search, categoria, precioMin, precioMax, soloDisponibles, orden]);

  if (loading) {
    return <div className="text-center text-lg mt-10">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg mt-10">Error: {error}</div>;
  }

  return (
    <div className="w-full px-4 pt-8 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-3xl font-bold text-center mb-8 mt-8 text-marrGold">
        Nuestro Catálogo de Joyería
      </h2>
      {/* Filtros */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:space-x-4 gap-4 bg-marrGold/10 border border-marrGold rounded-lg p-4 shadow-sm dark:shadow-md">
        <div className="flex-1">
          <label className="block text-sm font-medium text-marrGold mb-1">Buscar</label>
          <input
            type="text"
            className="w-full rounded-md border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold"
            placeholder="Nombre o descripción..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-marrGold mb-1">Categoría</label>
          <select
            className="w-full rounded-md border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-marrGold mb-1">Precio mínimo</label>
          <input
            type="number"
            min="0"
            className="w-full rounded-md border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold"
            value={precioMin}
            onChange={e => setPrecioMin(e.target.value)}
            placeholder="$"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-marrGold mb-1">Precio máximo</label>
          <input
            type="number"
            min="0"
            className="w-full rounded-md border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold"
            value={precioMax}
            onChange={e => setPrecioMax(e.target.value)}
            placeholder="$"
          />
        </div>
        <div className="flex items-center mt-6 md:mt-0">
          <input
            id="disponibles"
            type="checkbox"
            className="h-4 w-4 text-marrGold focus:ring-marrGold border-marrGold rounded"
            checked={soloDisponibles}
            onChange={e => setSoloDisponibles(e.target.checked)}
          />
          <label htmlFor="disponibles" className="ml-2 block text-sm text-marrGold">
            Solo disponibles
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-marrGold mb-1">Ordenar por</label>
          <select
            className="w-full rounded-md border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold"
            value={orden}
            onChange={e => setOrden(e.target.value)}
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre-asc">Nombre: A-Z</option>
            <option value="nombre-desc">Nombre: Z-A</option>
            <option value="reciente">Más reciente</option>
          </select>
        </div>
      </div>
      {/* Fin filtros */}
      {productosFiltrados.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">No hay productos que coincidan con los filtros.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosFiltrados.map((producto) => (
            <ProductoCard
              key={producto.id}
              id={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              precio={producto.precio}
              imagenUrl={producto.imagenUrl}
              categoria={producto.categoria}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog; 