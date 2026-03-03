"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { BlogPost } from "@/types";
import BlogCard from "./BlogCard";
import FadeIn from "@/components/ui/FadeIn";

export default function BlogClient({
  posts,
  allTags,
}: {
  posts: BlogPost[];
  allTags: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = posts.filter((post) => {
    const matchesTag = !activeTag || post.tags.includes(activeTag);
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    return matchesTag && matchesQuery;
  });

  return (
    <>
      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-cream border border-stone-light/50 text-sm text-charcoal placeholder:text-stone focus:outline-none focus:border-stone"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-charcoal"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setActiveTag(null)}
          className={`text-xs px-4 py-1.5 border transition-colors ${
            !activeTag
              ? "bg-charcoal text-warm-white border-charcoal"
              : "bg-transparent text-stone-dark border-stone-light hover:border-stone hover:text-charcoal"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`text-xs px-4 py-1.5 border transition-colors ${
              activeTag === tag
                ? "bg-charcoal text-warm-white border-charcoal"
                : "bg-transparent text-stone-dark border-stone-light hover:border-stone hover:text-charcoal"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-stone-dark text-sm">No posts match your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {filtered.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 100}>
              <BlogCard post={post} />
            </FadeIn>
          ))}
        </div>
      )}
    </>
  );
}
