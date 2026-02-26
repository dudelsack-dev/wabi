import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[3/2] bg-cream overflow-hidden mb-4">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-stone tracking-wide">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h3 className="font-serif text-lg text-charcoal group-hover:text-charcoal-light transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-stone-dark leading-relaxed">{post.excerpt}</p>
      </div>
    </Link>
  );
}
