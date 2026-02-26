"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import CartItemRow from "@/components/cart/CartItem";
import { formatPrice } from "@/lib/products";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-stone-light mb-6" />
        <h1 className="font-serif text-2xl text-charcoal mb-3">Your cart is empty</h1>
        <p className="text-stone-dark mb-8">
          Browse our collection of handcrafted Japanese artisanal goods.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-charcoal text-warm-white text-sm tracking-wide hover:bg-charcoal-light transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl text-charcoal mb-10">Cart</h1>

      <div className="space-y-0">
        {items.map((item) => (
          <CartItemRow key={item.product.slug} item={item} />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-cream">
        <div className="flex justify-between items-center mb-8">
          <span className="text-stone-dark">Subtotal</span>
          <span className="font-serif text-xl text-charcoal">
            {formatPrice(getTotal())}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="text-center px-6 py-3 border border-stone-light text-sm text-stone-dark hover:border-charcoal hover:text-charcoal transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/checkout"
            className="text-center px-6 py-3 bg-charcoal text-warm-white text-sm tracking-wide hover:bg-charcoal-light transition-colors flex-1"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
