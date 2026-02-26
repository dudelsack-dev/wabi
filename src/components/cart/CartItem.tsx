"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/products";

export default function CartItemRow({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-6 border-b border-cream">
      <div className="relative w-24 h-24 bg-cream flex-shrink-0">
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-charcoal">{item.product.name}</h3>
        <p className="text-xs text-stone-dark mt-1">{item.product.nameJp}</p>
        <p className="text-sm text-charcoal mt-2">
          {formatPrice(item.product.price)}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
            className="p-1 hover:bg-cream rounded transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
            className="p-1 hover:bg-cream rounded transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(item.product.slug)}
          className="p-1 text-stone hover:text-charcoal transition-colors"
        >
          <X size={16} />
        </button>
        <p className="text-sm font-medium">
          {formatPrice(item.product.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
