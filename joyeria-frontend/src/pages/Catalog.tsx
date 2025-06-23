import React, { useEffect, useState, useMemo } from 'react';
import api from '../utils/api';
import ProductoCard from '../components/productos/ProductoCard';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronDown, Check } from 'lucide-react';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenUrl?: string;
  cantidadDisponible: number;
  disponible?: boolean;
  stock: number;
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
    return (
      <div className="w-full flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <span className="text-marrGold text-lg animate-pulse">Cargando productos...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg mt-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-full font-sans flex flex-col">
      <Helmet>
        <title>Catálogo - Joyería MARR</title>
      </Helmet>

      {/* HERO DEL CATÁLOGO */}
      <section className="relative h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden mb-10">
        <img src="/Logo-MARR.png" alt="Catálogo de joyas" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-marrGold drop-shadow mb-2 tracking-wide">Catálogo de Joyería</h2>
          <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100">Descubre piezas únicas y exclusivas para cada ocasión</p>
        </div>
      </section>

      {/* FILTROS REDISEÑADOS */}
      <section className="w-full flex justify-center mb-12">
        <form className="flex flex-wrap gap-4 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl px-6 py-4 border border-marrGold max-w-5xl w-full items-end">
          {/* Buscar */}
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label className="text-xs font-semibold text-marrGold mb-1 pl-1">Buscar</label>
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-lg border border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold pl-10 pr-4 py-2 text-base"
                placeholder="Buscar joya, colección..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-marrGold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </span>
            </div>
          </div>
          {/* Categoría */}
          <div className="flex flex-col min-w-[140px]">
            <label className="text-xs font-semibold text-marrGold mb-1 pl-1">Categoría</label>
            <select
              className="w-full rounded-lg border border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold py-2 px-3"
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {/* Precio mínimo */}
          <div className="flex flex-col min-w-[110px]">
            <label className="text-xs font-semibold text-marrGold mb-1 pl-1">Precio mínimo</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-marrGold">$</span>
              <input
                type="number"
                min="0"
                className="w-full rounded-lg border border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold pl-7 pr-2 py-2"
                value={precioMin}
                onChange={e => setPrecioMin(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          {/* Precio máximo */}
          <div className="flex flex-col min-w-[110px]">
            <label className="text-xs font-semibold text-marrGold mb-1 pl-1">Precio máximo</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-marrGold">$</span>
              <input
                type="number"
                min="0"
                className="w-full rounded-lg border border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold pl-7 pr-2 py-2"
                value={precioMax}
                onChange={e => setPrecioMax(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          {/* Ordenar por */}
          <div className="flex flex-col min-w-[150px]">
            <label className="text-xs font-semibold text-marrGold mb-1 pl-1">Ordenar por</label>
            <select
              className="w-full rounded-lg border border-marrGold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-marrGold focus:border-marrGold py-2 px-3"
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
          {/* Solo disponibles */}
          <div className="flex flex-col items-center justify-end min-w-[120px]">
            <label className="text-xs font-semibold text-marrGold mb-1 pl-1">&nbsp;</label>
            <div className="flex items-center gap-2">
              <input
                id="disponibles"
                type="checkbox"
                className="h-5 w-5 text-marrGold focus:ring-marrGold border-marrGold rounded bg-white dark:bg-gray-900"
                checked={soloDisponibles}
                onChange={e => setSoloDisponibles(e.target.checked)}
              />
              <label htmlFor="disponibles" className="block text-sm text-marrGold select-none cursor-pointer">
                Solo disponibles
              </label>
            </div>
          </div>
        </form>
      </section>
      {/* FIN FILTROS REDISEÑADOS */}

      {/* PRODUCTOS */}
      <div className="max-w-6xl mx-auto flex-1">
        {productosFiltrados.length === 0 ? (
          <div className="text-center text-gray-300 py-20 text-lg">No hay productos que coincidan con los filtros.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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

      {/* LLAMADA A LA ACCIÓN */}
      <section className="max-w-4xl mx-auto text-center mt-16 mb-0 pb-8">
        <h3 className="text-2xl font-semibold text-marrGold mb-2">¿Buscas algo único?</h3>
        <a href="/customorder" className="inline-block bg-marrGold text-white px-8 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition text-lg font-semibold">Personaliza tu joya</a>
      </section>
    </div>
  );
};

export default Catalog; 