import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Producto } from '../../types';

const ProductManagement = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProducto, setCurrentProducto] = useState<Partial<Producto>>({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
  });
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/productos');
      setProductos(response.data);
    } catch (err) {
      setError('Error al cargar los productos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (producto: Producto) => {
    setCurrentProducto({
      ...producto,
    });
    setCurrentImageUrl(producto.imagenUrl || null);
    setSelectedImage(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await api.delete(`/api/productos/${id}`);
        await fetchProducts();
      } catch (err) {
        setError('Error al eliminar el producto');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCurrentImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Agregar campos básicos
      formData.append('nombre', currentProducto.nombre || '');
      formData.append('descripcion', currentProducto.descripcion || '');
      formData.append('precio', String(currentProducto.precio || 0));
      formData.append('stock', String(currentProducto.stock || 0));
      formData.append('categoria', currentProducto.categoria || '');

      // Si estamos editando, asegúrate de enviar el ID del producto en el formulario
      if (isEditing && currentProducto.id) {
        formData.append('id', String(currentProducto.id));
      }

      // Agregar imagen solo si se seleccionó una nueva
      if (selectedImage) {
        formData.append('imagen', selectedImage);
      } else if (currentProducto.imagenUrl) {
        // Si no se seleccionó una nueva imagen pero existe una URL de imagen actual,
        // enviarla para que el backend la conserve.
        formData.append('imagenUrl', currentProducto.imagenUrl);
      }

      if (isEditing && currentProducto.id) {
        await api.put(`/api/productos/${currentProducto.id}`, formData);
      } else {
        await api.post('/api/productos', formData);
      }

      await fetchProducts();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentProducto({
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoria: '',
    });
    setCurrentImageUrl(null);
    setSelectedImage(null);
    setError(null);
  };

  return (
    <div className="w-full px-4 pt-8 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="text-3xl font-bold text-center mb-8 text-marrGold">Gestión de Productos</h2>

      <div className="mb-8 text-center">
        <button
          onClick={() => {
            setIsEditing(false);
            handleCloseModal();
            setIsModalOpen(true);
          }}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Registrar Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg overflow-hidden transition-colors">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Categoría</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Precio</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Imagen</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{producto.id}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">{producto.nombre}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">{producto.categoria}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">${producto.precio.toFixed(2)}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">{producto.stock}</td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">
                  {producto.imagenUrl && producto.imagenUrl.length > 0 ? (
                    <img src={producto.imagenUrl} alt={producto.nombre} className="h-12 w-12 object-cover rounded-full" />
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors p-6 md:p-8">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-2xl font-bold focus:outline-none"
              aria-label="Cerrar"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={currentProducto.nombre || ''}
                  onChange={(e) => setCurrentProducto({ ...currentProducto, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={currentProducto.descripcion || ''}
                  onChange={(e) => setCurrentProducto({ ...currentProducto, descripcion: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    id="precio"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={currentProducto.precio || 0}
                    onChange={(e) => setCurrentProducto({ ...currentProducto, precio: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    id="categoria"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={currentProducto.categoria || ''}
                    onChange={(e) => setCurrentProducto({ ...currentProducto, categoria: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={currentProducto.stock || 0}
                    onChange={(e) => setCurrentProducto({ ...currentProducto, stock: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
                />
                {currentImageUrl && currentImageUrl.length > 0 ? (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-300">Imagen actual:</p>
                    <img
                      src={currentImageUrl}
                      alt="Imagen actual"
                      className="mt-1 h-32 w-32 object-cover rounded shadow-md border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                ) : (
                  isEditing && <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">No hay imagen actual seleccionada.</p>
                )}
              </div>
              {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 