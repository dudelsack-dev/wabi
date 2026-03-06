import { getAllProducts } from "@/lib/products";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://wabi.store";

export default async function ShopPage() {
  const products = await getAllProducts();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Wabi — Japanese Artisanal Pottery & Kitchenware",
    url: `${BASE_URL}/shop`,
    numberOfItems: products.length,
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: p.name,
      url: `${BASE_URL}/shop/${p.slug}`,
      item: {
        "@type": "Product",
        name: p.name,
        description: p.description,
        image: p.images[0],
        offers: {
          "@type": "Offer",
          price: p.price.toString(),
          priceCurrency: "JPY",
          availability: p.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <ShopClient products={products} />
    </>
  );
}
