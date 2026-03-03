"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "./WishlistProvider";
import { Product } from "@/types";
import clsx from "clsx";

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

export default function WishlistButton({ product, className }: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={clsx(
        "p-2 rounded-full transition-colors duration-200",
        wishlisted
          ? "text-earth-red"
          : "text-stone-light hover:text-earth-red",
        className
      )}
    >
      <Heart
        size={18}
        className={clsx("transition-all duration-200", wishlisted && "fill-earth-red")}
      />
    </button>
  );
}
