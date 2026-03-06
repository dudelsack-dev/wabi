import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://wabi.store";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found", slug },
      { status: 404, headers: CORS }
    );
  }

  return NextResponse.json(
    {
      slug: product.slug,
      name: product.name,
      nameJp: product.nameJp,
      description: product.description,
      price: product.price,
      currency: "JPY",
      category: product.category,
      artisan: product.artisan,
      origin: product.origin,
      inStock: product.inStock,
      stock: product.stock,
      featured: product.featured,
      images: product.images,
      url: `${BASE_URL}/shop/${product.slug}`,
    },
    { headers: CORS }
  );
}
