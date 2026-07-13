import { Suspense } from "react";
import Link from "next/link";
import { guarantees, plans, comparison, comparisonPriceRow } from "./data";
import { PlansGrid } from "./plans-grid";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// Karşılaştırma tablosu hücresi: true → yeşil ✓, false → kırmızı ✗, metin → düz yazı
function Cell({ v }: { v: string | boolean }) {
  if (v === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-500">
        ✓
      </span>
    );
  }
  if (v === false) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-400">
        ✗
      </span>
    );
  }
  return <span className="text-[13px] text-gray-600">{v}</span>;
}

export default async function PaketlerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasActivePurchase = false;
  if (user) {
    const admin = createAdminClient();
    const { count } = await admin
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active");
    hasActivePurchase = (count ?? 0) > 0;
  }

  return (
    <div className="min-h-full bg-white">
      {hasActivePurchase && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-4">
          <div className="mx-auto max-w-3xl flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-800">Zaten aktif bir paketiniz var</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Mevcut paketiniz devam ederken yeni paket satın almanıza gerek yok. Koçunuzla çalışmaya devam edebilirsiniz.
              </p>
              <div className="mt-3 flex gap-3">
                <Link href="/ogrenci-paneli" className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition">
                  Panelime Git
                </Link>
                <Link href="/randevularim" className="rounded-lg border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition">
                  Randevularım
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
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
            Tüm paketlerde 7 gün koşulsuz iade garantisi ve doğrulanmış koçlar.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            💳 Tüm paketlerde 12 aya varan taksit imkânı
          </span>
        </div>
      </section>

      {/* Plan kartları */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <div className="mx-auto max-w-7xl">
            <PlansGrid />
          </div>
        </Suspense>
      </section>

      {/* Kıst iade sloganı */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 rounded-2xl bg-gradient-to-r from-[#123A57] to-[#0E8FA3] px-6 py-7 text-center sm:flex-row sm:gap-5 sm:text-left">
          <span className="text-4xl">💳</span>
          <div>
            <p className="text-xl font-bold text-white">Kullandığın kadar öde!</p>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              Uzun paketlerde (3-6 aylık ve sınava kadar) dilediğin an iptal edebilirsin —
              yalnızca kullandığın aylar ücretlendirilir, kalan ayların ücreti iade edilir.
            </p>
          </div>
        </div>
      </section>

      {/* Paketleri Karşılaştır */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            <span className="text-[#0E8FA3]">Paketleri</span> Karşılaştır
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-4 text-left font-semibold text-gray-500">Özellikler</th>
                  {plans.map((p) => (
                    <th
                      key={p.name}
                      className={`px-4 py-4 text-center font-bold ${
                        p.popular ? "rounded-t-xl bg-[#eef9f9] text-[#0E8FA3]" : "text-gray-800"
                      }`}
                    >
                      {p.name}
                      {p.popular && (
                        <div className="mt-0.5 text-[11px] font-semibold text-[#0E8FA3]/80">
                          En Çok Tercih Edilen
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-50">
                    <td className="px-5 py-3.5 font-medium text-gray-700">{row.feature}</td>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className={`px-4 py-3.5 text-center ${plans[i]?.popular ? "bg-[#eef9f9]/60" : ""}`}
                      >
                        <Cell v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="px-5 py-4 font-bold text-gray-900">Aylık Ortalama Ücret</td>
                  {comparisonPriceRow.map((v, i) => (
                    <td
                      key={i}
                      className={`px-4 py-4 text-center font-bold ${
                        plans[i]?.popular
                          ? "rounded-b-xl bg-[#eef9f9] text-[#0E8FA3]"
                          : "text-gray-800"
                      }`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
                <p className="text-sm font-semibold text-gray-800 leading-snug flex items-center gap-2 flex-nowrap">
                  <span className="whitespace-nowrap">KVKK, Bilgilendirme ve Mesafeli Satış Sözleşmesi&apos;ni okudum, kabul ediyorum.</span>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 whitespace-nowrap flex-shrink-0">
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
