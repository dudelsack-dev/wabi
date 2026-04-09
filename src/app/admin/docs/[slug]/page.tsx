import { createServerClient } from "@/lib/supabase";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: doc } = await supabase
    .from("docs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!doc) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/docs"
        className="inline-flex items-center gap-2 text-sm text-stone-dark hover:text-charcoal mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        All docs
      </Link>

      <p className="text-xs font-medium uppercase tracking-widest text-stone-dark mb-2">
        {doc.category}
      </p>

      <article className="prose-doc">
        <MDXRemote source={doc.content} />
      </article>

      <p className="mt-12 text-xs text-stone-dark">
        Last updated:{" "}
        {new Date(doc.updated_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
