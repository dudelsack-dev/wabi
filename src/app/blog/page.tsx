import { getAllPosts, getAllTags } from "@/lib/blog";
import BlogClient from "@/components/blog/BlogClient";
import FadeIn from "@/components/ui/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories of craft, tradition, and the art of making — from the workshops of Japan.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">Blog</h1>
        <p className="text-stone-dark mb-12">
          Stories of craft, tradition, and the art of making.
        </p>
      </FadeIn>

      <BlogClient posts={posts} allTags={allTags} />
    </div>
  );
}
