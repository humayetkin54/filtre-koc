import { createClient, createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Coach, CoachType } from "../types";
import { BookingSection } from "./booking-section";
import { ShareButton } from "./profile-actions";

const availabilityConfig = {
  open: { label: "Müsait", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  low:  { label: "Az Yer", className: "bg-amber-50 text-amber-700 border-amber-200" },
  full: { label: "Dolu",   className: "bg-red-50 text-red-600 border-red-200" },
};

const typeColors: Record<CoachType, string> = {
  YKS:       "bg-[#eef3f5] text-[#123A57]",
  LGS:       "bg-violet-50 text-violet-700",
  "KPSS/AGS":"bg-orange-50 text-orange-700",
  DGS:       "bg-teal-50 text-teal-700",
  PDR:       "bg-pink-50 text-pink-700",
};

const expertiseTags: Record<CoachType, string[]> = {
  YKS:       ["TYT Stratejisi", "AYT Hazırlık", "Hedef Üniversite", "Net Artışı"],
  LGS:       ["LGS Stratejisi", "Fen Lisesi", "Motivasyon", "Zaman Yönetimi"],
  "KPSS/AGS":["KPSS Genel Kültür", "AGS Stratejisi", "Konu Planı"],
  DGS:       ["DGS Matematik", "Sözel Mantık", "Hedef Bölüm"],
  PDR:       ["Sınav Kaygısı", "Motivasyon", "Odaklanma", "Tercih Rehberliği"],
};

// Yorumlar coach_reviews tablosundan gelir (öğrenciler panelden değerlendirir)
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

export default async function CoachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: coach } = await supabase.from("coaches").select("*").eq("id", id).single();
  if (!coach) notFound();

  const c = coach as Coach;

  // Başarı belgesi: yalnızca yüklü + yönetici doğrulamışsa gösterilir (gizli bucket, 1 saatlik imzalı link)
  let belgeUrl: string | null = null;
  if (c.result_doc_path && c.doc_verified) {
    const adminClient = createAdminClient();
    const { data: signed } = await adminClient.storage
      .from("belgeler")
      .createSignedUrl(c.result_doc_path, 3600);
    belgeUrl = signed?.signedUrl ?? null;
  }
  const avail = availabilityConfig[c.availability];
  const isFull = c.availability === "full";
  const schedule = (coach.availability_schedule as Record<string, string[]>) ?? {};

  /* Benzer koçlar */
  const { data: similar } = await supabase
    .from("coaches")
    .select("id, name, avatar_initials, avatar_color, avatar_text_color, net_increase, types")
    .eq("status", "approved")
    .neq("id", id)
    .limit(4);

  /* Gerçek öğrenci yorumları */
  const { data: reviews } = await supabase
    .from("coach_reviews")
    .select("student_name, rating, comment, created_at")
    .eq("coach_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  const allTags = Array.from(new Set(c.types.flatMap((t) => expertiseTags[t] ?? [])));

  return (
    <div className="min-h-full bg-gray-50">

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto max-w-4xl">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/koclar" className="hover:text-[#0E8FA3]">Koçlar</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">{c.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-5">

        {/* ── 1. HERO KARTI ── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div
              className="w-28 h-28 flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden text-3xl font-bold ring-4 ring-white shadow-lg"
              style={{ backgroundColor: c.avatar_color, color: c.avatar_text_color }}
            >
              {c.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.avatar_url} alt={c.name} className="h-full w-full object-cover" />
              ) : (
                c.avatar_initials
              )}
            </div>

            {/* Bilgiler */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{c.name}</h1>
                <span className={`self-center sm:self-start inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${avail.className}`}>
                  {avail.label}
                </span>
              </div>

              {/* Üniversite */}
              <div className="mt-3 space-y-0.5">
                <p className="font-bold text-gray-800">{c.university}</p>
                {c.department && <p className="text-sm text-gray-500">{c.department}</p>}
              </div>

              {/* Türkiye sıralaması rozeti */}
              {c.rank_type && c.rank_value ? (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-bold text-amber-700">
                  🏆 {c.rank_type} - {c.rank_value.toLocaleString("tr-TR")} <span className="font-medium text-amber-600/80">Türkiye Sıralaması</span>
                </span>
              ) : null}

              {/* Yıldız */}
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-1.5">
                {c.rating_count === 0 ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">🆕 Yeni koç</span>
                ) : (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.round(c.rating) ? "text-amber-400" : "text-gray-200"}`}>★</span>
                    ))}
                    <span className="ml-1 text-sm font-semibold text-gray-700">{c.rating.toFixed(1)}/5</span>
                    <span className="text-sm text-gray-400">({c.rating_count} değerlendirme)</span>
                  </>
                )}
              </div>

              {/* Sınav türleri */}
              <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                {c.types.map((t) => (
                  <span key={t} className={`rounded-full px-3 py-1 text-xs font-bold ${typeColors[t]}`}>{t}</span>
                ))}
              </div>

              {/* CTA butonları */}
              <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-3">
                {!isFull ? (
                  <a
                    href={`/paketler?coach_id=${c.id}&coach_name=${encodeURIComponent(c.name)}`}
                    className="flex items-center gap-2 rounded-xl bg-[#0E8FA3] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0c7689] hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Koçluk Al
                  </a>
                ) : (
                  <button disabled className="rounded-xl bg-gray-200 px-6 py-3 text-sm font-bold text-gray-400 cursor-not-allowed">
                    Kontenjan Dolu
                  </button>
                )}
                <ShareButton />
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. BAŞARI BELGESİ (yalnızca doğrulanmışsa) ── */}
        {belgeUrl && (
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#0E8FA3] rounded-l-2xl" />
          <div className="flex items-start gap-4 pl-2">
            <div className="w-11 h-11 rounded-xl bg-[#0E8FA3]/10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0E8FA3" strokeWidth={1.8} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7 3H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2M9 3h6M9 3a2 2 0 000 4h6a2 2 0 000-4"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Başarı Belgesi</p>
              <p className="text-sm text-gray-500 mt-0.5">ÖSYM sonuç belgesi doğrulandı{c.rank_type && c.rank_value ? ` — ${c.rank_type} ${c.rank_value.toLocaleString("tr-TR")}` : ""}</p>
              <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0E8FA3]/30 bg-[#eef9f9] px-3 py-1 text-xs font-semibold text-[#0E8FA3]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  Doğrulanmış Belge
                </span>
                <a href={belgeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"/>
                  </svg>
                  Belgeyi büyütmek için tıklayın
                </a>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ── 3. DEĞERLENDİRMELER ── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Değerlendirmeler</h2>

          {/* Özet */}
          <div className="flex items-center gap-6 mb-8">
            {c.rating_count > 0 && (
              <div className="flex flex-col items-center justify-center flex-shrink-0">
                <p className="text-6xl font-bold text-gray-900">{c.rating.toFixed(1)}</p>
                <div className="flex mt-2 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-xl ${i < Math.round(c.rating) ? "text-amber-400" : "text-gray-200"}`}>★</span>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-400">{c.rating_count} değerlendirme</p>
              </div>
            )}
            <p className="text-sm text-gray-400 leading-relaxed">
              Değerlendirmeler yalnızca bu koçla aktif olarak çalışan öğrenciler tarafından, öğrenci panelinden yapılabilir.
            </p>
          </div>

          {/* Yorumlar */}
          <div className="space-y-5 border-t border-gray-100 pt-5">
            {(!reviews || reviews.length === 0) && (
              <p className="text-sm text-gray-400">
                Henüz yazılı yorum yok — bu koçla çalışan öğrenciler değerlendirme bıraktıkça burada görünecek.
              </p>
            )}
            {(reviews ?? []).map((rev, ri) => (
              <div key={ri} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0E8FA3] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {initialsOf(rev.student_name ?? "Ö")}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-sm">{rev.student_name ?? "Öğrenci"}</span>
                      <p className="text-[11px] text-gray-400">
                        {new Date(rev.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < rev.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
                    ))}
                  </div>
                </div>
                {rev.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed pl-12">{rev.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. HAKKINDA ── */}
        {c.bio && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hakkında</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{c.bio}</p>

            {/* İstatistikler */}
            {c.rating_count > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0E8FA3]">{c.rating_count}</p>
                  <p className="mt-1 text-sm text-gray-500">Yorum sayısı</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0E8FA3]">{c.rating.toFixed(1)}</p>
                  <p className="mt-1 text-sm text-gray-500">Ortalama Puan</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 5. UZMANLIK ALANLARI ── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Uzmanlık Alanları</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span key={tag} className="rounded-full border border-[#0E8FA3]/20 bg-[#eef9f9] px-4 py-1.5 text-sm font-medium text-[#0E8FA3]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── 6. RANDEVU ── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Ücretsiz Tanışma Randevusu</h2>
          <BookingSection coach={c} schedule={schedule} />
        </div>

        {/* ── 7. BENZER KOÇLAR ── */}
        {similar && similar.length > 0 && (
          <div className="pt-2">
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Benzer Koçlar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {similar.map((s) => (
                <div key={s.id} className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col items-center text-center gap-3">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ring-2 ring-white shadow"
                    style={{ backgroundColor: s.avatar_color, color: s.avatar_text_color }}
                  >
                    {s.avatar_initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{s.name}</p>
                  </div>
                  <Link
                    href={`/koclar/${s.id}`}
                    className="w-full rounded-xl bg-[#0E8FA3] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0c7689]"
                  >
                    Profili Görüntüle
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
