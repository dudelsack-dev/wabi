import { notFound } from "next/navigation";
import { getProductBySlug, formatPrice } from "@/lib/products";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Badge from "@/components/ui/Badge";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://wabi.store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
      type: "website",
      url: `${BASE_URL}/shop/${product.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    url: `${BASE_URL}/shop/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "Wabi",
    },
    manufacturer: {
      "@type": "Person",
      name: product.artisan,
    },
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "JPY",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Wabi",
        url: BASE_URL,
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

          {/* Stock status */}
          <div className="text-sm">
            {product.stock === 0 ? (
              <span className="text-earth-red">Out of Stock</span>
            ) : product.stock != null && product.stock <= 3 ? (
              <span className="text-earth-red">Low Stock ({product.stock} left)</span>
            ) : (
              <span className="text-stone-dark">In Stock</span>
            )}
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
