import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-10">
        <p className="text-xs text-stone tracking-wide mb-3">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
          {post.title}
        </h1>
        <p className="text-stone-dark leading-relaxed">{post.excerpt}</p>
      </header>

      <div className="relative aspect-[2/1] bg-cream overflow-hidden mb-12">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>

      <div className="prose">
        <MDXRemote source={post.content} />
      </div>

      <div className="mt-12 flex gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 bg-cream text-stone-dark rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
