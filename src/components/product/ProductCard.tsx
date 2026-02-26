import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-cream overflow-hidden mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
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
