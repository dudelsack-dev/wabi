"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createBrowserClient } from "@/lib/supabase";
import { formatPrice } from "@/lib/products";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface ProductRow {
  slug: string;
  name: string;
  name_jp: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("products")
      .select("slug, name, name_jp, price, category, stock, images")
      .order("created_at");
    setProducts((data as ProductRow[]) || []);
    setLoading(false);
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-charcoal">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-charcoal text-warm-white text-sm hover:bg-charcoal-light transition-colors rounded-md"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="bg-warm-white border border-cream rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream text-left">
              <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Product</th>
              <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Category</th>
              <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Price</th>
              <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Stock</th>
              <th className="px-4 py-3 text-xs uppercase tracking-wide text-stone font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.slug} className="border-b border-cream last:border-0 hover:bg-cream-light transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] && (
                      <div className="relative w-10 h-10 bg-cream rounded overflow-hidden flex-shrink-0">
                        <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                      </div>
                    )}
                    <div>
                      <p className="text-charcoal font-medium">{product.name}</p>
                      <p className="text-xs text-stone">{product.name_jp}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-dark capitalize">{product.category}</td>
                <td className="px-4 py-3 text-charcoal">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <span className={product.stock < 3 ? "text-earth-red font-medium" : "text-charcoal"}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.slug}`}
                      className="p-1.5 text-stone hover:text-charcoal transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.slug)}
                      className="p-1.5 text-stone hover:text-earth-red transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
