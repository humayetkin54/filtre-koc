import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/ogrenci-paneli/",
        "/ogrenci/",
        "/koc-paneli/",
        "/veli-paneli",
        "/admin/",
        "/profil",
        "/satin-al",
        "/randevularim",
        "/onboarding",
        "/auth/",
      ],
    },
    sitemap: "https://www.rekorzeka.com/sitemap.xml",
  };
}
