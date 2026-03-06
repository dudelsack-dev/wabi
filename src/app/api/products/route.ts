import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://wabi.store";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const inStock = searchParams.get("inStock");

  let products = await getAllProducts();

  if (category === "pottery" || category === "kitchenware") {
    products = products.filter((p) => p.category === category);
  }
  if (featured === "true") {
    products = products.filter((p) => p.featured);
  }
  if (inStock === "true") {
    products = products.filter((p) => p.inStock);
  }

  const data = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    nameJp: p.nameJp,
    description: p.description,
    price: p.price,
    currency: "JPY",
    category: p.category,
    artisan: p.artisan,
    origin: p.origin,
    inStock: p.inStock,
    stock: p.stock,
    featured: p.featured,
    images: p.images,
    url: `${BASE_URL}/shop/${p.slug}`,
  }));

  return NextResponse.json(
    { data, meta: { total: data.length } },
    { headers: CORS }
  );
}
