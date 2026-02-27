"use client";

import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-8">New Product</h1>
      <ProductForm mode="create" />
    </div>
  );
}
