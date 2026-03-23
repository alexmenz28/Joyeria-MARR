import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  stock: number;
  quantity: number;
};

/** Shown as a toast when adding from catalog or product page (quantity + which product). */
export type CartToastPayload =
  | {
      kind: 'added';
      productId: number;
      name: string;
      imageUrl?: string;
      /** Units added in this action */
      quantityAdded: number;
      /** Total units of this product now in cart */
      quantityInCart: number;
      /** Sum of all line quantities in cart */
      cartTotalPieces: number;
      /** Distinct products in cart */
      cartLineCount: number;
    }
  | {
      kind: 'maxStock';
      name: string;
      imageUrl?: string;
      quantityInCart: number;
    };

export type CartToastState = CartToastPayload & { toastId: number };

const STORAGE_KEY = 'joyeria_marr_cart';

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  /** Non-null while the “added to cart” toast is visible */
  cartToast: CartToastState | null;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadInitial(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x) =>
        x &&
        typeof x.productId === 'number' &&
        typeof x.name === 'string' &&
        typeof x.price === 'number' &&
        typeof x.stock === 'number' &&
        typeof x.quantity === 'number'
    );
  } catch {
    return [];
  }
}

function mergeAddToCart(
  prev: CartItem[],
  item: Omit<CartItem, 'quantity'> & { quantity?: number },
  qty: number
): { next: CartItem[]; feedback: CartToastPayload | null } {
  const idx = prev.findIndex((x) => x.productId === item.productId);
  const prevPieces = prev.reduce((s, x) => s + x.quantity, 0);

  if (idx >= 0) {
    const prevQ = prev[idx].quantity;
    const merged = Math.min(prevQ + qty, item.stock);
    const added = merged - prevQ;

    if (added === 0) {
      return {
        next: prev,
        feedback: {
          kind: 'maxStock',
          name: item.name,
          imageUrl: item.imageUrl,
          quantityInCart: prevQ,
        },
      };
    }

    const next = [...prev];
    next[idx] = {
      ...next[idx],
      quantity: merged,
      price: item.price,
      name: item.name,
      stock: item.stock,
      imageUrl: item.imageUrl,
    };
    return {
      next,
      feedback: {
        kind: 'added',
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        quantityAdded: added,
        quantityInCart: merged,
        cartTotalPieces: prevPieces - prevQ + merged,
        cartLineCount: next.length,
      },
    };
  }

  const line: CartItem = { ...item, quantity: qty };
  const next = [...prev, line];
  return {
    next,
    feedback: {
      kind: 'added',
      productId: item.productId,
      name: item.name,
      imageUrl: item.imageUrl,
      quantityAdded: qty,
      quantityInCart: qty,
      cartTotalPieces: prevPieces + qty,
      cartLineCount: next.length,
    },
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitial);
  const [cartToast, setCartToast] = useState<CartToastState | null>(null);
  const toastIdRef = useRef(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!cartToast) return;
    const ms = cartToast.kind === 'maxStock' ? 3200 : 4800;
    const t = window.setTimeout(() => setCartToast(null), ms);
    return () => window.clearTimeout(t);
  }, [cartToast]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const want = item.quantity ?? 1;
    const qty = Math.min(Math.max(1, want), Math.max(0, item.stock));
    if (qty < 1 || item.stock < 1) return;

    const holder: { feedback: CartToastPayload | null } = { feedback: null };
    setItems((prev) => {
      const { next, feedback } = mergeAddToCart(prev, item, qty);
      holder.feedback = feedback;
      return next;
    });

    const fb = holder.feedback;
    if (fb) {
      toastIdRef.current += 1;
      setCartToast({ ...fb, toastId: toastIdRef.current });
    }
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) => {
      const row = prev.find((x) => x.productId === productId);
      if (!row) return prev;
      const q = Math.max(1, Math.min(quantity, row.stock));
      return prev.map((x) => (x.productId === productId ? { ...x, quantity: q } : x));
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      itemCount: items.reduce((s, x) => s + x.quantity, 0),
      subtotal: items.reduce((s, x) => s + x.price * x.quantity, 0),
      cartToast,
    }),
    [items, addItem, setQuantity, removeItem, clearCart, cartToast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
