import type { MetadataRoute } from "next";
import { POSTS } from "./blog/posts";

const BASE = "https://www.rekorzeka.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/paketler`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/koclar`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/hizli-okuma`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/nasil-calisir`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/hakkimizda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/on-gorusme`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/iletisim`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const blogPages: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
