import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../utils/api';
import type { Product, PagedResult } from '../../types';
import AdminNavbar from '../../components/layout/AdminNavbar';
import TablePagination, { ADMIN_TABLE_PAGE_SIZE } from '../../components/admin/TablePagination';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

const CATEGORY_OPTIONS = [
  'Rings',
  'Necklaces',
  'Bracelets',
  'Earrings',
  'Charms',
  'Sets',
  'Other',
] as const;

const emptyProduct: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  material: '',
  weight: '',
  isAvailable: true,
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>(emptyProduct);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  /** When search changes and we reset page, skip one fetch (next run uses page 1). */
  const skipFetchAfterSearchResetRef = useRef(false);

  const loadProducts = useCallback(async () => {
    try {
      setListLoading(true);
      const params = new URLSearchParams({
        page: String(tablePage),
        pageSize: String(ADMIN_TABLE_PAGE_SIZE),
      });
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
      const { data } = await api.get<PagedResult<Product>>(`/api/products?${params.toString()}`);
      setProducts(data.items);
      setTotalCount(data.totalCount);
      if (data.page !== tablePage) setTablePage(data.page);
    } catch {
      setError('Could not load products.');
    } finally {
      setListLoading(false);
    }
  }, [tablePage, debouncedSearch]);

  useEffect(() => {
    setTablePage((p) => {
      if (p !== 1) {
        skipFetchAfterSearchResetRef.current = true;
        return 1;
      }
      return p;
    });
  }, [debouncedSearch]);

  useEffect(() => {
    if (skipFetchAfterSearchResetRef.current) {
      skipFetchAfterSearchResetRef.current = false;
      return;
    }
    void loadProducts();
  }, [loadProducts]);

  const handleEdit = (product: Product) => {
    setCurrentProduct({
      ...product,
      category: product.category ?? '',
    });
    setCurrentImageUrl(product.imageUrl || null);
    setSelectedImage(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await api.delete(`/api/products/${productToDelete.id}`);
      await loadProducts();
      setProductToDelete(null);
    } catch {
      setError('Could not delete product (admins only).');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setProductToDelete(null);
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
      formData.append('name', currentProduct.name || '');
      formData.append('description', currentProduct.description || '');
      formData.append('price', String(currentProduct.price ?? 0));
      formData.append('stock', String(currentProduct.stock ?? 0));
      formData.append('category', currentProduct.category || '');
      formData.append('material', currentProduct.material || '');
      formData.append('weight', currentProduct.weight || '');
      formData.append('isAvailable', String(currentProduct.isAvailable !== false));

      if (isEditing && currentProduct.id) {
        formData.append('id', String(currentProduct.id));
      }

      if (selectedImage) {
        formData.append('imagen', selectedImage);
      } else if (currentProduct.imageUrl) {
        formData.append('imageUrl', currentProduct.imageUrl);
      }

      if (isEditing && currentProduct.id) {
        await api.put(`/api/products/${currentProduct.id}`, formData);
      } else {
        if (!selectedImage) {
          setError('An image is required to create a product.');
          setIsLoading(false);
          return;
        }
        await api.post('/api/products', formData);
      }

      await loadProducts();
      handleCloseModal();
    } catch {
      setError('Could not save product. Check permissions and image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentProduct({ ...emptyProduct });
    setCurrentImageUrl(null);
    setSelectedImage(null);
    setError(null);
  };

  return (
    <>
      <AdminNavbar />
      <div className="w-full px-4 pt-24 bg-ivory dark:bg-night-900 min-h-screen transition-colors">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-marrGold drop-shadow">Product management</h2>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gold-200 dark:border-gold-500/30 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white dark:bg-night-700 text-gray-900 dark:text-gray-100 w-full md:w-64 shadow"
            />
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                handleCloseModal();
                setCurrentProduct({ ...emptyProduct });
                setIsModalOpen(true);
              }}
              className="bg-gold-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-night-900 focus:ring-gold-500 font-semibold text-base transition-all duration-200"
            >
              Add product
            </button>
          </div>
        </div>

        {error && !isModalOpen && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-4 max-w-xl mx-auto shadow">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-gold-200/60 dark:border-gold-500/20 shadow-xl bg-white dark:bg-night-800 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
          <table className="min-w-full transition-colors">
            <thead className="bg-gold-50 dark:bg-night-700">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-bold text-marrGold uppercase tracking-wider">ID</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-marrGold uppercase tracking-wider">Name</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-marrGold uppercase tracking-wider">Category</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-marrGold uppercase tracking-wider">Price</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-marrGold uppercase tracking-wider">Stock</th>
                <th className="py-3 px-6 text-left text-xs font-bold text-marrGold uppercase tracking-wider">Image</th>
                <th className="py-3 px-6 text-center text-xs font-bold text-marrGold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gold-500/20">
              {listLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 px-6 text-center text-marrGold animate-pulse">
                    Loading products…
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 px-6 text-center text-gray-500 dark:text-gray-400">
                    {totalCount === 0 && !debouncedSearch.trim()
                      ? 'No products yet.'
                      : 'No products match your search.'}
                  </td>
                </tr>
              ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-marrGold/10 dark:hover:bg-marrGold/10 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-bold text-marrGold">{product.id}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-base text-gray-900 dark:text-gray-100 font-semibold">{product.name}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-base text-gray-700 dark:text-gray-200">{product.category}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-base text-gray-700 dark:text-gray-200">${product.price.toFixed(2)}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-base text-gray-700 dark:text-gray-200">{product.stock}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-base text-gray-700 dark:text-gray-200">
                    {product.imageUrl && product.imageUrl.length > 0 ? (
                      <img src={product.imageUrl} alt={product.name} className="h-14 w-14 object-cover rounded-full border-2 border-marrGold shadow" />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-center text-base font-medium">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-gold-600 transition-all duration-200 shadow"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(product)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 shadow"
                    >
                      Delete
                    </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
          </div>
          <TablePagination
            page={tablePage}
            pageSize={ADMIN_TABLE_PAGE_SIZE}
            totalItems={totalCount}
            onPageChange={setTablePage}
            itemNoun="product"
          />
        </div>

        {productToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
            <div className="bg-white dark:bg-night-800 rounded-2xl w-full max-w-md shadow-2xl border border-gold-200/60 dark:border-gold-500/20 p-6 md:p-8">
              <h2 id="delete-modal-title" className="text-xl font-bold text-marrGold mb-2">Delete product?</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-1">This will permanently remove:</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-6">{productToDelete.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone. The product will be removed from the database.</p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gold-200 dark:border-gold-500/30 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-night-700 hover:bg-gold-50 dark:hover:bg-night-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-night-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-gold-200/60 dark:border-gold-500/20 transition-colors p-6 md:p-8">
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-2xl font-bold focus:outline-none transition-colors"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6 text-marrGold flex items-center gap-2">
                {isEditing ? 'Edit product' : 'New product'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="product-name"
                    className="mt-1 block w-full border border-gold-200 dark:border-gold-500/30 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-night-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-colors"
                    value={currentProduct.name || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Description
                  </label>
                  <textarea
                    id="product-description"
                    rows={3}
                    className="mt-1 block w-full border border-gold-200 dark:border-gold-500/30 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-night-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-colors"
                    value={currentProduct.description || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      id="product-price"
                      step="0.01"
                      className="mt-1 block w-full border border-gold-200 dark:border-gold-500/30 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-night-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-colors"
                      value={currentProduct.price ?? 0}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Category
                    </label>
                    <select
                      id="product-category"
                      className="mt-1 block w-full border border-gold-200 dark:border-gold-500/30 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-night-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-colors"
                      value={currentProduct.category || ''}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                      required
                    >
                      <option value="">Select…</option>
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="product-stock" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      id="product-stock"
                      className="mt-1 block w-full border border-gold-200 dark:border-gold-500/30 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-night-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-colors"
                      value={currentProduct.stock ?? 0}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      id="product-available"
                      type="checkbox"
                      className="h-5 w-5 text-marrGold"
                      checked={currentProduct.isAvailable !== false}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, isAvailable: e.target.checked })}
                    />
                    <label htmlFor="product-available" className="text-sm text-gray-700 dark:text-gray-200">
                      Available
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="product-material" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      id="product-material"
                      className="mt-1 block w-full border border-gold-200 dark:border-gold-500/30 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-night-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500 sm:text-sm transition-colors"
                      value={currentProduct.material || ''}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, material: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="product-weight" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      id="product-weight"
                      className="mt-1 block w-full border border-gold-200 dark:border-gold-500/30 rounded-lg shadow-sm py-2 px-3 bg-white dark:bg-night-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500 sm:text-sm transition-colors"
                      value={currentProduct.weight || ''}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, weight: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-night-700 border border-gold-200 dark:border-gold-500/30 rounded-lg"
                  />
                  {currentImageUrl && currentImageUrl.length > 0 ? (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">Current image:</p>
                      <img
                        src={currentImageUrl}
                        alt="Preview"
                        className="mt-1 h-32 w-32 object-cover rounded-lg shadow-md border border-gold-200/60 dark:border-gold-500/20"
                      />
                    </div>
                  ) : (
                    isEditing && <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">No image selected.</p>
                  )}
                </div>
                {error && isModalOpen && (
                  <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gold-200 dark:border-gold-500/30 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-night-700 hover:bg-gold-50 dark:hover:bg-night-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-night-800 focus:ring-gold-500 shadow-md transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving…' : isEditing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductManagement;
