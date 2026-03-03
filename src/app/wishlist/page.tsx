"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/products";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <Heart size={48} className="mx-auto text-stone-light mb-6" />
        <h1 className="font-serif text-2xl text-charcoal mb-3">Your wishlist is empty</h1>
        <p className="text-stone-dark mb-8">
          Save pieces you love and revisit them whenever you like.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-charcoal text-warm-white text-sm tracking-wide hover:bg-charcoal-light transition-colors"
        >
          Browse the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl text-charcoal mb-2">Wishlist</h1>
      <p className="text-stone-dark mb-10 text-sm">
        {items.length} {items.length === 1 ? "piece" : "pieces"} saved
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((product) => {
          const outOfStock = product.stock === 0;

          return (
            <div key={product.slug} className="group">
              <Link href={`/shop/${product.slug}`} className="block">
                <div className="relative aspect-square bg-cream overflow-hidden mb-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {outOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-charcoal/20">
                      <span className="text-xs uppercase tracking-wide bg-warm-white/90 text-charcoal px-3 py-1">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 mb-4">
                  <h3 className="text-sm font-medium text-charcoal group-hover:text-charcoal-light transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone">{product.nameJp}</p>
                  <p className="text-sm text-stone-dark">{formatPrice(product.price)}</p>
                </div>
              </Link>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addItem(product);
                    removeItem(product.slug);
                  }}
                  disabled={outOfStock}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-charcoal text-warm-white text-xs tracking-wide hover:bg-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={14} />
                  {outOfStock ? "Out of Stock" : "Move to Cart"}
                </button>
                <button
                  onClick={() => removeItem(product.slug)}
                  aria-label="Remove from wishlist"
                  className="p-2 border border-stone-light text-stone-dark hover:border-earth-red hover:text-earth-red transition-colors"
                >
                  <Heart size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
