"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setJoined(true);
    setEmail("");
  }

  return (
    <footer className="border-t border-cream bg-cream-light mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-lg mb-4">侘 wabi</h3>
            <p className="text-sm text-stone-dark leading-relaxed">
              Japanese artisanal pottery and kitchenware, crafted by hand with centuries of tradition.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-stone mb-4">Navigate</h4>
            <div className="space-y-2">
              <Link href="/shop" className="block text-sm text-stone-dark hover:text-charcoal transition-colors">
                Shop
              </Link>
              <Link href="/blog" className="block text-sm text-stone-dark hover:text-charcoal transition-colors">
                Blog
              </Link>
              <Link href="/about" className="block text-sm text-stone-dark hover:text-charcoal transition-colors">
                About
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-stone mb-4">Newsletter</h4>
            <p className="text-sm text-stone-dark mb-3">
              Stories of craft and making, delivered quietly.
            </p>
            {joined ? (
              <p className="text-sm text-stone-dark">Thank you for joining.</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-3 py-2 text-sm bg-warm-white border border-stone-light/50 focus:outline-none focus:border-stone"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-charcoal text-warm-white text-sm hover:bg-charcoal-light transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-16 pt-6 border-t border-stone-light/30 text-center text-xs text-stone">
          &copy; {new Date().getFullYear()} Wabi. All things imperfect.
        </div>
      </div>
    </footer>
  );
}
