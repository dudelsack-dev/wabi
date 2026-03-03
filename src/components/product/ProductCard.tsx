import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/products";
import WishlistButton from "@/components/wishlist/WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0;

  return (
    <Link href={`/shop/${product.slug}`} className={`group block ${outOfStock ? "opacity-50" : ""}`}>
      <div className="relative aspect-square bg-cream overflow-hidden mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/20">
            <span className="text-xs uppercase tracking-wide bg-warm-white/90 text-charcoal px-3 py-1">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton
            product={product}
            className="bg-warm-white/90 shadow-sm"
          />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-charcoal group-hover:text-charcoal-light transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-stone">{product.nameJp}</p>
        <p className="text-sm text-stone-dark">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
