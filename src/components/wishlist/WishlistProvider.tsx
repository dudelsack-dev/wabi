"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Product } from "@/types";

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  toggle: (product: Product) => void;
  getCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wabi-wishlist");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        // ignore invalid data
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("wabi-wishlist", JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) =>
      prev.find((p) => p.slug === product.slug) ? prev : [...prev, product]
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const isWishlisted = useCallback(
    (slug: string) => items.some((p) => p.slug === slug),
    [items]
  );

  const toggle = useCallback(
    (product: Product) => {
      setItems((prev) =>
        prev.find((p) => p.slug === product.slug)
          ? prev.filter((p) => p.slug !== product.slug)
          : [...prev, product]
      );
    },
    []
  );

  const getCount = useCallback(() => items.length, [items]);

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, isWishlisted, toggle, getCount }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
