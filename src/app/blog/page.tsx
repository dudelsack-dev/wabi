import { getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";
import FadeIn from "@/components/ui/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories of craft, tradition, and the art of making — from the workshops of Japan.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">Blog</h1>
        <p className="text-stone-dark mb-12">
          Stories of craft, tradition, and the art of making.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {posts.map((post, i) => (
          <FadeIn key={post.slug} delay={i * 100}>
            <BlogCard post={post} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
