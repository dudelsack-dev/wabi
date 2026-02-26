import productsData from "@/data/products.json";
import { Product } from "@/types";

const products: Product[] = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(
  category: "pottery" | "kitchenware"
): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((_, i) => [0, 6, 8, 4].includes(i));
}

export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}
