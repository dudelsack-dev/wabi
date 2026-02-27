"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

interface ProductFormData {
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
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductForm({
  initialData,
  mode,
}: {
  initialData?: ProductFormData;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProductFormData>(
    initialData || {
      name: "",
      nameJp: "",
      slug: "",
      description: "",
      price: 0,
      category: "pottery",
      artisan: "",
      origin: "",
      stock: 10,
      featured: false,
      images: [],
    }
  );

  function updateField(field: keyof ProductFormData, value: string | number | boolean | string[]) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "name" && mode === "create") {
        updated.slug = generateSlug(value as string);
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${form.slug}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="text-sm text-earth-red bg-earth-red/10 px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-stone-dark mb-1">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone transition-colors rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-stone-dark mb-1">Name (Japanese)</label>
          <input
            type="text"
            required
            value={form.nameJp}
            onChange={(e) => updateField("nameJp", e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone transition-colors rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-stone-dark mb-1">Slug</label>
        <input
          type="text"
          required
          value={form.slug}
          onChange={(e) => updateField("slug", e.target.value)}
          disabled={mode === "edit"}
          className="w-full px-4 py-2.5 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone transition-colors rounded-md disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm text-stone-dark mb-1">Description</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full px-4 py-2.5 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone transition-colors rounded-md"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-stone-dark mb-1">Price (¥)</label>
          <input
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) => updateField("price", parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2.5 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone transition-colors rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-stone-dark mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone transition-colors rounded-md"
          >
            <option value="pottery">Pottery</option>
            <option value="kitchenware">Kitchenware</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-stone-dark mb-1">Stock</label>
          <input
            type="number"
            required
            min={0}
            value={form.stock}
            onChange={(e) => updateField("stock", parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2.5 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone transition-colors rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-stone-dark mb-1">Artisan</label>
          <input
            type="text"
            required
            value={form.artisan}
            onChange={(e) => updateField("artisan", e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone transition-colors rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-stone-dark mb-1">Origin</label>
          <input
            type="text"
            required
            value={form.origin}
            onChange={(e) => updateField("origin", e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone transition-colors rounded-md"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => updateField("featured", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="featured" className="text-sm text-stone-dark">
          Featured product
        </label>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm text-stone-dark mb-2">Images</label>
        <ImageUploader
          images={form.images}
          onChange={(images) => updateField("images", images)}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-charcoal text-warm-white text-sm hover:bg-charcoal-light transition-colors rounded-md disabled:opacity-50"
        >
          {saving ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-2.5 border border-stone-light text-sm text-stone-dark hover:border-charcoal hover:text-charcoal transition-colors rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
