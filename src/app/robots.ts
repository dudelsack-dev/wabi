import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://wabi.store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin",
      },
      // Explicitly welcome AI crawlers for agentic discovery
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: "/admin",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: "/admin",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: "/admin",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: "/admin",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
