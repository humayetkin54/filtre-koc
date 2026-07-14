import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rekor Zeka — Online Sınav Koçluğu",
    short_name: "Rekor Zeka",
    description:
      "PDR destekli, yapay zeka araçlarıyla güçlendirilmiş online YKS, LGS ve KPSS koçluğu.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#123A57",
    lang: "tr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
