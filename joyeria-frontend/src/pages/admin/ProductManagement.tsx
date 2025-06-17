import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Producto } from '../../types'; // Asumiendo que ProductManagement necesita el tipo Producto, lo importo

const ProductManagement = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState<number | string>('');
  const [categoria, setCategoria] = useState('');
  const [stock, setStock] = useState<number | string>('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [products, setProducts] = useState<Producto[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  const fetchProducts = async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const response = await api.get<Producto[]>('/api/Productos');
      setProducts(response.data);
    } catch (err: any) {
      setFetchError(err.response?.data?.message || 'Error al cargar los productos.');
    }
    finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const clearForm = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria('');
    setStock('');
    setImagen(null);
    setEditingProduct(null);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', String(precio));
    formData.append('categoria', categoria);
    formData.append('stock', String(stock));
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      if (editingProduct) {
        // Si estamos editando, enviamos una solicitud PUT
        formData.append('id', String(editingProduct.id)); // El backend espera el ID en el form data para PUT
        const response = await api.put(`/api/Productos/${editingProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess(response.data.message || 'Producto actualizado exitosamente!');
      } else {
        // Si no estamos editando, creamos un nuevo producto (POST)
        const response = await api.post('/api/Productos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess(response.data.message || 'Producto registrado exitosamente!');
      }
      clearForm(); // Limpiar y resetear el formulario y estado de edición
      fetchProducts(); // Refrescar la lista de productos
    } catch (err: any) {
      setError(err.response?.data?.message || (editingProduct ? 'Error al actualizar el producto.' : 'Error al registrar el producto.'));
    }
    finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await api.delete(`/api/Productos/${id}`);
        setSuccess('Producto eliminado exitosamente!');
        fetchProducts(); // Refrescar la lista de productos
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar el producto.');
        setSuccess(null);
      }
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio);
    setCategoria(producto.categoria);
    setStock(producto.stock);
    setImagen(null); // No precargamos la imagen actual por seguridad/complejidad
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Desplazar al inicio del formulario
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Gestión de Productos</h2>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-8">
        <h3 className="text-2xl font-semibold mb-6 text-center">{editingProduct ? 'Editar Producto Existente' : 'Registrar Nuevo Producto'}</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="nombre"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              id="precio"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
              type="text"
              id="categoria"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock (Cantidad Disponible)</label>
            <input
              type="number"
              id="stock"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">Imagen del Producto {editingProduct && ' (dejar en blanco para mantener la actual)'}</label>
            <input
              type="file"
              id="imagen"
              className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm py-2 px-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Éxito: </strong>
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={loading}
            >
              {loading ? (editingProduct ? 'Actualizando...' : 'Registrando...') : (editingProduct ? 'Actualizar Producto' : 'Registrar Producto')}
            </button>
          </div>
          {editingProduct && (
            <button
              type="button"
              onClick={clearForm}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar Edición
            </button>
          )}
        </form>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-center">Productos Existentes</h3>
        {fetchLoading ? (
          <p className="text-center text-gray-600">Cargando productos...</p>
        ) : fetchError ? (
          <p className="text-center text-red-600">{fetchError}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600">No hay productos registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((producto) => (
                  <tr key={producto.id}>
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{producto.id}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{producto.nombre}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{producto.categoria}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">${producto.precio.toFixed(2)}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{producto.stock}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                      {producto.imagenUrl ? (
                        <img src={producto.imagenUrl} alt={producto.nombre} className="h-12 w-12 object-cover rounded-full" />
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(producto)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(producto.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement; 