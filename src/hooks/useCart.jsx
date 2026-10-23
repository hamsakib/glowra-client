"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const CartContext = createContext(null);
const STORAGE_KEY = "glowra_cart";
const MAX_QTY = 10;

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage once on the client (it doesn't exist during SSR).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or blocked: the cart still works for this visit.
    }
  }, [items, ready]);

  const add = useCallback((product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === product._id);
      const limit = Math.min(MAX_QTY, product.stock);
      if (existing) {
        return current.map((i) => (i.id === product._id ? { ...i, quantity: Math.min(limit, i.quantity + quantity) } : i));
      }
      return [
        ...current,
        { id: product._id, slug: product.slug, title: product.title, image: product.images?.[0], price: product.price, stock: product.stock, quantity: Math.min(limit, quantity) },
      ];
    });
    toast.success("Added to cart", { description: product.title });
  }, []);

  const update = useCallback((id, quantity) => {
    setItems((current) => current.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(MAX_QTY, i.stock, quantity)) } : i)));
  }, []);

  const remove = useCallback((id) => setItems((current) => current.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    return { items, count, subtotal, ready, add, update, remove, clear };
  }, [items, ready, add, update, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
