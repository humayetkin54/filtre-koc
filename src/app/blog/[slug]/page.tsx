import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { POSTS, getPost, readingTime } from "../posts";
import { renderContent } from "../render";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "tr-TR",
    author: { "@type": "Organization", name: "Rekor Zeka", url: "https://www.rekorzeka.com" },
    publisher: { "@type": "Organization", name: "Rekor Zeka", url: "https://www.rekorzeka.com" },
    mainEntityOfPage: `https://www.rekorzeka.com/blog/${post.slug}`,
  };

  return (
    <main className="min-h-full bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Başlık */}
      <section className="bg-gradient-to-br from-[#123A57] to-[#0E8FA3] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm font-semibold text-white/60 hover:text-white">
            ← Blog
          </Link>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">{post.category}</span>
            <span>{new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>☕ {readingTime(post.content)} dk okuma</span>
          </div>
        </div>
      </section>

      {/* İçerik */}
      <article className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-10">
          {renderContent(post.content)}

          {/* CTA kutusu */}
          <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#123A57] to-[#0E8FA3] p-6 text-center sm:p-8">
            <h2 className="text-lg font-bold text-white">Hedefin için bir sonraki adımı at</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
              Derece yapmış koçlar, PDR uzmanları ve yapay zeka destekli araçlarla tanış — ilk görüşme ücretsiz.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/on-gorusme" className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-[#123A57] transition hover:-translate-y-0.5 hover:shadow-lg">
                Ücretsiz Ön Görüşme
              </Link>
              <Link href="/paketler" className="rounded-xl border-2 border-white/60 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
                Paketleri İncele
              </Link>
            </div>
          </div>
        </div>

        {/* İlgili yazılar */}
        <div className="mx-auto mt-10 max-w-3xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Diğer Yazılar</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="rounded-2xl border border-gray-200 bg-white p-4 text-sm font-semibold leading-snug text-gray-700 transition-all hover:-translate-y-0.5 hover:border-[#0E8FA3] hover:text-[#0E8FA3]"
              >
                {r.title}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
