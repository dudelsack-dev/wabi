"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import { Product } from "@/types";
import clsx from "clsx";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!product.inStock}
      className={clsx(
        "flex items-center gap-2 px-6 py-3 text-sm tracking-wide transition-all duration-300",
        added
          ? "bg-stone-dark text-warm-white"
          : "bg-charcoal text-warm-white hover:bg-charcoal-light",
        !product.inStock && "opacity-50 cursor-not-allowed"
      )}
    >
      {added ? (
        <>
          <Check size={18} />
          Added
        </>
      ) : (
        <>
          <ShoppingBag size={18} />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </>
      )}
    </button>
  );
}
