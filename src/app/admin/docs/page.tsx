import { createServerClient } from "@/lib/supabase";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface DocSummary {
  slug: string;
  title: string;
  category: string;
  order_index: number;
}

export default async function AdminDocsPage() {
  const supabase = createServerClient();
  const { data: docs } = await supabase
    .from("docs")
    .select("slug, title, category, order_index")
    .order("order_index");

  const grouped = (docs ?? []).reduce<Record<string, DocSummary[]>>(
    (acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = [];
      acc[doc.category].push(doc);
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl text-charcoal mb-1">Admin Documentation</h1>
      <p className="text-sm text-stone-dark mb-8">
        Guides for managing products, orders, and site settings.
      </p>

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xs font-medium uppercase tracking-widest text-stone-dark mb-3">
              {category}
            </h2>
            <div className="border border-cream rounded-lg overflow-hidden bg-warm-white">
              {items.map((doc, i) => (
                <Link
                  key={doc.slug}
                  href={`/admin/docs/${doc.slug}`}
                  className={`flex items-center justify-between px-5 py-4 text-sm text-charcoal hover:bg-cream transition-colors ${
                    i < items.length - 1 ? "border-b border-cream" : ""
                  }`}
                >
                  <span>{doc.title}</span>
                  <ChevronRight size={16} className="text-stone-dark" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
