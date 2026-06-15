import api from './api';
import type { Product } from '../types';
import type { CartItem } from '../context/CartContext';

export async function fetchProductsByIds(productIds: number[]): Promise<Product[]> {
  const unique = Array.from(new Set(productIds));
  if (unique.length === 0) return [];

  const results = await Promise.all(
    unique.map(async (id) => {
      try {
        const { data } = await api.get<Product>(`/api/products/${id}`);
        return data;
      } catch {
        return null;
      }
    })
  );

  return results.filter((p): p is Product => p != null);
}

export type CartStockSyncResult = {
  items: CartItem[];
  warnings: string[];
  removed: string[];
};

/** Align cart lines with live catalog stock (no WebSockets — refreshed on focus / checkout). */
export function mergeCartWithProducts(items: CartItem[], products: Product[]): CartStockSyncResult {
  const byId = new Map(products.map((p) => [p.id, p]));
  const warnings: string[] = [];
  const removed: string[] = [];
  const next: CartItem[] = [];

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) {
      removed.push(item.name);
      continue;
    }
    if (!product.isAvailable || product.stock < 1) {
      removed.push(product.name);
      continue;
    }

    const quantity = Math.min(item.quantity, product.stock);
    if (quantity < item.quantity) {
      warnings.push(`${product.name}: only ${product.stock} left in stock (quantity adjusted).`);
    }

    next.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl ?? undefined,
      stock: product.stock,
      quantity,
    });
  }

  if (removed.length > 0) {
    warnings.push(`Removed from cart (unavailable): ${removed.join(', ')}.`);
  }

  return { items: next, warnings, removed };
}
