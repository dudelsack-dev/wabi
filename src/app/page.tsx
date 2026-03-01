import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import ProductCard from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";
import BlogCard from "@/components/blog/BlogCard";
import FadeIn from "@/components/ui/FadeIn";

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1725917482778-472d78c69278?w=1600&q=80"
          alt="Japanese pottery bowls"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="relative z-10 text-center px-6">
          <FadeIn>
            <h1 className="font-serif text-4xl md:text-6xl text-warm-white mb-4 tracking-wide">
              侘 wabi
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
              Japanese artisanal pottery and kitchenware, crafted with the quiet beauty of imperfection.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-8 px-8 py-3 border border-warm-white/60 text-warm-white text-sm tracking-widest uppercase hover:bg-warm-white/10 transition-colors"
            >
              Explore the Collection
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Philosophy teaser */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.3em] text-stone mb-6">Our Philosophy</p>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal leading-relaxed mb-6">
            Nothing lasts. Nothing is finished. Nothing is perfect.
          </h2>
          <p className="text-stone-dark leading-relaxed mb-8">
            Wabi-sabi teaches us to find beauty in the imperfect, the impermanent, and the incomplete.
            Each piece in our collection carries the marks of its maker — the trace of a hand, the breath
            of a kiln, the patience of centuries-old craft traditions.
          </p>
          <Link
            href="/about"
            className="text-sm text-earth-red hover:text-clay-dark transition-colors tracking-wide"
          >
            Read our story &rarr;
          </Link>
        </FadeIn>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <FadeIn>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone mb-2">Featured</p>
              <h2 className="font-serif text-2xl text-charcoal">Selected Pieces</h2>
            </div>
            <Link
              href="/shop"
              className="text-sm text-stone-dark hover:text-charcoal transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {featured.map((product, i) => (
            <FadeIn key={product.slug} delay={i * 100}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="bg-cream-light py-20">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-stone mb-2">Journal</p>
                <h2 className="font-serif text-2xl text-charcoal">Latest Stories</h2>
              </div>
              <Link
                href="/blog"
                className="text-sm text-stone-dark hover:text-charcoal transition-colors"
              >
                Read all &rarr;
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {latestPosts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 100}>
                <BlogCard post={post} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
