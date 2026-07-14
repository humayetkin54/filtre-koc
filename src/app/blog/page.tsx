import Link from "next/link";
import type { Metadata } from "next";
import { POSTS, readingTime } from "./posts";

export const metadata: Metadata = {
  title: "Blog — YKS, LGS ve Sınav Koçluğu Rehberleri",
  description:
    "YKS koçluğu, TYT net artırma, LGS hazırlık, sınav kaygısı ve hızlı okuma üzerine uzman rehberleri. Rekor Zeka blog.",
  alternates: { canonical: "/blog" },
};

const CATEGORY_COLORS: Record<string, string> = {
  YKS: "bg-[#eef3f5] text-[#123A57]",
  TYT: "bg-[#eef9f9] text-[#0E8FA3]",
  LGS: "bg-violet-50 text-violet-700",
  PDR: "bg-pink-50 text-pink-700",
  "Hızlı Okuma": "bg-emerald-50 text-emerald-700",
};

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="min-h-full bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#123A57] to-[#0E8FA3] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Rekor Zeka Blog</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sınav Yolculuğunda Rehberin
          </h1>
          <p className="mt-3 max-w-xl text-white/70">
            YKS, LGS, sınav psikolojisi ve hızlı okuma üzerine uzman içerikler — hepsi sahadan, hepsi uygulanabilir.
          </p>
        </div>
      </section>

      {/* Yazılar */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#0E8FA3] hover:shadow-lg"
            >
              <span className={`inline-block w-fit rounded-full px-3 py-1 text-[11px] font-bold ${CATEGORY_COLORS[p.category] ?? "bg-gray-100 text-gray-600"}`}>
                {p.category}
              </span>
              <h2 className="mt-3 text-lg font-bold leading-snug text-gray-900 group-hover:text-[#0E8FA3]">
                {p.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{p.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>
                  {new Date(p.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span>☕ {readingTime(p.content)} dk okuma</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto mt-12 max-w-5xl rounded-2xl bg-gradient-to-r from-[#123A57] to-[#0E8FA3] px-6 py-8 text-center">
          <h2 className="text-xl font-bold text-white">Okumak güzel, uygulamak daha güzel 🚀</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">
            Bu rehberlerdeki her şeyi senin için uygulayan bir koç ve yapay zeka ekibi var.
          </p>
          <Link
            href="/on-gorusme"
            className="mt-5 inline-block rounded-xl bg-white px-8 py-3 text-sm font-bold text-[#123A57] transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Ücretsiz Ön Görüşme Planla →
          </Link>
        </div>
      </section>
    </main>
  );
}
