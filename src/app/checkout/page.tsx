"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/products";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Japan",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setOrderError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.product.slug,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
          subtotal: getTotal(),
          customer: form,
        }),
      });
      if (!res.ok) throw new Error("Failed to place order");
      clearCart();
      setSubmitted(true);
    } catch {
      setOrderError("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-charcoal mb-4">Thank you</h1>
        <p className="text-stone-dark leading-relaxed mb-3">
          Your order has been received. Payment integration is coming soon — we will
          reach out to confirm your order and arrange payment.
        </p>
        <p className="text-sm text-stone mb-8">
          We appreciate your patience as we build this experience with care.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-charcoal text-warm-white text-sm tracking-wide hover:bg-charcoal-light transition-colors"
        >
          Continue Browsing
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-2xl text-charcoal mb-3">Nothing to check out</h1>
        <p className="text-stone-dark mb-8">Your cart is empty.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-charcoal text-warm-white text-sm tracking-wide hover:bg-charcoal-light transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl text-charcoal mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <h2 className="text-sm uppercase tracking-widest text-stone mb-4">
            Shipping Information
          </h2>

          {[
            { label: "Full Name", field: "name", type: "text" },
            { label: "Email", field: "email", type: "email" },
            { label: "Address", field: "address", type: "text" },
            { label: "City", field: "city", type: "text" },
            { label: "Postal Code", field: "postalCode", type: "text" },
            { label: "Country", field: "country", type: "text" },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-sm text-stone-dark mb-1">{label}</label>
              <input
                type={type}
                required
                value={form[field as keyof typeof form]}
                onChange={(e) => updateField(field, e.target.value)}
                className="w-full px-4 py-3 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone transition-colors"
              />
            </div>
          ))}

          <div className="pt-4 border-t border-cream">
            {orderError && (
              <p className="text-sm text-earth-red bg-earth-red/10 px-4 py-3 mb-4">
                {orderError}
              </p>
            )}
            <p className="text-xs text-stone mb-4">
              Payment integration coming soon. Your order will be saved as pending.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-charcoal text-warm-white text-sm tracking-wide hover:bg-charcoal-light transition-colors disabled:opacity-50"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>

        <div className="lg:col-span-2">
          <h2 className="text-sm uppercase tracking-widest text-stone mb-4">
            Order Summary
          </h2>
          <div className="bg-cream-light p-6 space-y-4">
            {items.map((item) => (
              <div key={item.product.slug} className="flex justify-between text-sm">
                <span className="text-charcoal">
                  {item.product.name} &times; {item.quantity}
                </span>
                <span className="text-stone-dark">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-stone-light/30 pt-4 flex justify-between">
              <span className="text-charcoal font-medium">Total</span>
              <span className="font-serif text-lg text-charcoal">
                {formatPrice(getTotal())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
