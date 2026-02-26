import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, formatPrice } from "@/lib/products";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div className="space-y-6">
          <div>
            <Badge variant="category">{product.category}</Badge>
            <h1 className="font-serif text-2xl md:text-3xl text-charcoal mt-3">
              {product.name}
            </h1>
            <p className="text-stone text-sm mt-1">{product.nameJp}</p>
          </div>

          <p className="font-serif text-2xl text-charcoal">
            {formatPrice(product.price)}
          </p>

          <p className="text-stone-dark leading-relaxed">{product.description}</p>

          <div className="border-t border-cream pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone">Artisan</span>
              <span className="text-charcoal">{product.artisan}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone">Origin</span>
              <span className="text-charcoal">{product.origin}</span>
            </div>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
