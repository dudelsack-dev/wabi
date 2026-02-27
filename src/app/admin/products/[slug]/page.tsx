"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [initialData, setInitialData] = useState<{
    name: string;
    nameJp: string;
    slug: string;
    description: string;
    price: number;
    category: "pottery" | "kitchenware";
    artisan: string;
    origin: string;
    stock: number;
    featured: boolean;
    images: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (data) {
        setInitialData({
          name: data.name,
          nameJp: data.name_jp,
          slug: data.slug,
          description: data.description,
          price: data.price,
          category: data.category,
          artisan: data.artisan,
          origin: data.origin,
          stock: data.stock,
          featured: data.featured,
          images: data.images,
        });
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone">Loading...</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone-dark">Product not found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-8">Edit Product</h1>
      <ProductForm initialData={initialData} mode="edit" />
    </div>
  );
}
