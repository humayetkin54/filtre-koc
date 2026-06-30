import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Coach, Availability, CoachType } from "../types";
import { BookingSection } from "./booking-section";

const availabilityConfig: Record<Availability, { label: string; className: string }> = {
  open: { label: "Müsait", className: "bg-emerald-50 text-emerald-700 ring-emerald-500/25" },
  low: { label: "Az Yer", className: "bg-amber-50 text-amber-700 ring-amber-500/25" },
  full: { label: "Dolu", className: "bg-red-50 text-red-700 ring-red-500/25" },
};

const typeStyles: Record<CoachType, string> = {
  YKS: "bg-blue-50 text-blue-700",
  LGS: "bg-violet-50 text-violet-700",
  "KPSS/AGS": "bg-orange-50 text-orange-700",
  DGS: "bg-teal-50 text-teal-700",
};

const typeDescriptions: Record<CoachType, string> = {
  YKS: "TYT ve AYT'de net artışı hedefleyen, hedef bölümü okuyan koçlarla çalış.",
  LGS: "LGS'de ilk 100'e girmek ve fen lisesi kazanmak için stratejik hazırlık.",
  "KPSS/AGS": "KPSS ve AGS'de üst sıralara girmek için deneyimli, sınavı kazanmış koçlar.",
  DGS: "DGS'de yüksek puan almak ve hedef bölümü kazanmak için birebir strateji.",
};

export default async function CoachDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: coach } = await supabase
    .from("coaches")
    .select("*")
    .eq("id", id)
    .single();

  if (!coach) notFound();

  const c = coach as Coach;
  const availability = availabilityConfig[c.availability];
  const spotsLeft = c.max_students - c.current_students;
  const capacityPct = Math.min((c.current_students / c.max_students) * 100, 100);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/koclar" className="hover:text-gray-600">Koçlar</Link>
            <span>/</span>
            <span className="text-gray-700">{c.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Sol — profil */}
          <div className="lg:col-span-2 space-y-5">

            {/* Kart başlığı */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-start gap-5">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold"
                  style={{ backgroundColor: c.avatar_color, color: c.avatar_text_color }}
                >
                  {c.avatar_initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{c.name}</h1>
                      <p className="mt-0.5 text-gray-500">{c.university}</p>
                      <p className="text-sm text-gray-400">{c.department}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${availability.className}`}>
                      {availability.label}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.types.map((t) => (
                      <span key={t} className={`rounded-full px-3 py-1 text-xs font-bold ${typeStyles[t]}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* İstatistikler */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-4">
                <Stat label="Rating" value={c.rating.toFixed(1)} sub={`${c.rating_count} yorum`} star />
                <Stat label="Net artış" value={c.net_increase} sub="ortalama" green />
                <Stat label="Öğrenci" value={`${c.current_students}/${c.max_students}`} sub="mevcut/max" />
                <Stat label="Ücret" value={`${c.price.toLocaleString("tr-TR")} ₺`} sub="/ay" />
              </div>
            </div>

            {/* Kapasite çubuğu */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-3 font-semibold text-gray-900">Öğrenci kapasitesi</h2>
              <div className="mb-2 flex justify-between text-sm text-gray-500">
                <span>{c.current_students} öğrenci kayıtlı</span>
                <span>{spotsLeft > 0 ? `${spotsLeft} boş yer` : "Dolu"}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    c.availability === "full" ? "bg-red-400" :
                    c.availability === "low" ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                  style={{ width: `${capacityPct}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Koç başına maksimum {c.max_students} öğrenci — kalite güvencemizin temel kuralı.
              </p>
            </div>

            {/* Uzmanlık alanları */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-gray-900">Uzmanlık alanları</h2>
              <div className="space-y-4">
                {c.types.map((t) => (
                  <div key={t} className="flex gap-3">
                    <span className={`mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${typeStyles[t]}`}>
                      {t}
                    </span>
                    <p className="text-sm text-gray-600">{typeDescriptions[t]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Çalışma süreci */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-gray-900">Nasıl çalışıyoruz?</h2>
              <ol className="space-y-4">
                {[
                  { num: "1", text: "30 dakikalık ücretsiz ön görüşme ile hedefini ve mevcut seviyeni konuşuyoruz." },
                  { num: "2", text: "Kişisel haftalık çalışma planı hazırlanıyor — konular, saatler, strateji." },
                  { num: "3", text: "Günlük WhatsApp takibi ve haftalık birebir görüşmelerle ilerleme izleniyor." },
                  { num: "4", text: "Deneme sonuçlarına göre plan güncelleniyor, net artışın somut olarak ölçülüyor." },
                ].map((s) => (
                  <li key={s.num} className="flex gap-3 text-sm text-gray-600">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#123A57]/10 text-xs font-bold text-[#123A57]">
                      {s.num}
                    </span>
                    {s.text}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sağ — randevu */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingSection coach={c} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label, value, sub, star = false, green = false,
}: {
  label: string; value: string; sub: string; star?: boolean; green?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`mt-1 text-xl font-bold ${green ? "text-emerald-600" : "text-gray-900"}`}>
        {star && <span className="mr-0.5 text-amber-400">★</span>}
        {value}
      </p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}
