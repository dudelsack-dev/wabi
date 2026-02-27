import { createServerClient } from "@/lib/supabase";
import { Product } from "@/types";

interface ProductRow {
  slug: string;
  name: string;
  name_jp: string;
  description: string;
  price: number;
  images: string[];
  category: "pottery" | "kitchenware";
  artisan: string;
  origin: string;
  stock: number;
  featured: boolean;
}

function mapRow(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    nameJp: row.name_jp,
    description: row.description,
    price: row.price,
    images: row.images,
    category: row.category,
    artisan: row.artisan,
    origin: row.origin,
    stock: row.stock,
    inStock: row.stock > 0,
    featured: row.featured,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("products").select("*").order("created_at");
  if (error) throw error;
  return (data as ProductRow[]).map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return undefined;
  return mapRow(data as ProductRow);
}

export async function getProductsByCategory(
  category: "pottery" | "kitchenware"
): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at");
  if (error) throw error;
  return (data as ProductRow[]).map(mapRow);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .limit(4);
  if (error) throw error;
  return (data as ProductRow[]).map(mapRow);
}

export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}
