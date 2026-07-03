import { Suspense } from "react";
import Link from "next/link";
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

      {/* Taksit notu + Sözleşme */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-5">

          {/* Taksit notu */}
          <div className="rounded-xl border border-[#f5e8c0] bg-[#fffbeb] px-5 py-4 flex items-start gap-3 text-sm text-[#92400e]">
            <span className="text-base mt-0.5">💡</span>
            <p>
              <strong>Not:</strong> Tüm paketlerde taksit imkânı mevcuttur.
              Ödeme sayfasında taksit seçeneklerinizi görebilirsiniz.
            </p>
          </div>

          {/* Sözleşme onayı */}
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center">
                <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                  <path d="M1 5l3 3 7-7" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-snug">
                  Kişisel Verilerin Korunması Aydınlatma Metni, Bilgilendirmeleri ve
                  Mesafeli Satış Sözleşmesi&apos;ni okudum, kabul ediyorum.{" "}
                  <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    Zorunlu
                  </span>
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-[#0E8FA3]">
                  <Link href="/kvkk" className="hover:underline">KVKK Aydınlatma</Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/gizlilik" className="hover:underline">Gizlilik Sözleşmesi</Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/mesafeli-satis-sozlesmesi" className="hover:underline">Mesafeli Satış Sözleşmesi</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
