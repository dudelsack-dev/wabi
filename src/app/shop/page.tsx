import { getAllProducts } from "@/lib/products";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getAllProducts();
  return <ShopClient products={products} />;
}
