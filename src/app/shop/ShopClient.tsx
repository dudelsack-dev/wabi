"use client";

import { useState } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import CategoryFilter from "@/components/product/CategoryFilter";
import FadeIn from "@/components/ui/FadeIn";

type Category = "all" | "pottery" | "kitchenware";

export default function ShopClient({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Category>("all");

  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">Shop</h1>
        <p className="text-stone-dark mb-10">
          Each piece is made by hand, carrying the spirit of its maker and place of origin.
        </p>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="mb-10">
          <CategoryFilter active={category} onChange={setCategory} />
        </div>
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {filtered.map((product, i) => (
          <FadeIn key={product.slug} delay={i * 50}>
            <ProductCard product={product} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
