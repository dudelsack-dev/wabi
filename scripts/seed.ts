import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  console.error("Run with: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed.ts");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface JsonProduct {
  slug: string;
  name: string;
  nameJp: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  artisan: string;
  origin: string;
  inStock: boolean;
}

const featuredSlugs = [
  "tokoname-kyusu-teapot",
  "arita-porcelain-tea-cup",
  "tosa-hocho-santoku-knife",
  "nanbu-tetsubin-cast-iron-kettle",
];

async function seed() {
  const raw = readFileSync(join(__dirname, "../src/data/products.json"), "utf-8");
  const products: JsonProduct[] = JSON.parse(raw);

  const rows = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    name_jp: p.nameJp,
    description: p.description,
    price: p.price,
    images: p.images,
    category: p.category,
    artisan: p.artisan,
    origin: p.origin,
    stock: 10,
    featured: featuredSlugs.includes(p.slug),
  }));

  const { error } = await supabase.from("products").upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }

  console.log(`Seeded ${rows.length} products successfully.`);
}

seed();
