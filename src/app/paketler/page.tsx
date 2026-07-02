import { Suspense } from "react";
import { categories, guarantees } from "./data";
import { CategoryCard } from "./category-card";

export default function PaketlerPage() {
  return (
    <div className="min-h-full bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-[#1a1f5c] to-[#123A57] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Fiyatlandırma
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Paketler
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Tüm paketlerde 14 gün iade garantisi ve doğrulanmış koçlar.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.tag} cat={cat} />
            ))}
          </div>
        </Suspense>
      </section>

      {/* Guarantees */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {guarantees.map((g) => (
              <div
                key={g}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600"
              >
                <span className="text-emerald-500">✓</span> {g}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
