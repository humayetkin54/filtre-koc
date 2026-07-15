"use client";

import { useMemo, useState } from "react";
import type { Availability, Coach, CoachType, FilterType } from "./types";
import Link from "next/link";
import { BookingModal } from "./booking-modal";
import { StartCoachingButton } from "./start-coaching-button";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "YKS", label: "YKS" },
  { value: "LGS", label: "LGS" },
  { value: "KPSS/AGS", label: "KPSS/AGS" },
  { value: "DGS", label: "DGS" },
  { value: "PDR", label: "PDR" },
];

const typeColors: Record<CoachType, string> = {
  YKS: "bg-[#eef3f5] text-[#123A57]",
  LGS: "bg-violet-50 text-violet-700",
  "KPSS/AGS": "bg-orange-50 text-orange-700",
  DGS: "bg-teal-50 text-teal-700",
  PDR: "bg-pink-50 text-pink-700",
};

function StarRating({ rating, count }: { rating: number; count: number }) {
  if (count === 0) {
    return (
      <div className="flex items-center justify-center">
        <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-600">🆕 Yeni koç</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-1.5 text-sm">
      <span className="text-amber-400">★</span>
      <span className="font-bold text-gray-800">{rating.toFixed(1)}/5</span>
      <span className="text-gray-400">({count})</span>
    </div>
  );
}

function CoachCard({
  coach,
  purchased,
  hasPurchase,
}: {
  coach: Coach;
  purchased: boolean;   // bu koçu satın almış mı
  hasPurchase: boolean; // herhangi bir satın alma var mı
}) {
  const isFull = coach.availability === "full";
  const [showModal, setShowModal] = useState(false);

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-[#0E8FA3]/30 overflow-hidden">

      {/* Üst bölüm — avatar + isim + puan */}
      <div className="flex flex-col items-center px-6 pt-8 pb-5 text-center">

        {/* Yuvarlak avatar */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden text-2xl font-bold ring-4 ring-white shadow-md mb-4 flex-shrink-0"
          style={{ backgroundColor: coach.avatar_color, color: coach.avatar_text_color }}
        >
          {coach.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coach.avatar_url} alt={coach.name} className="h-full w-full object-cover" />
          ) : (
            coach.avatar_initials
          )}
        </div>

        {/* İsim */}
        <Link href={`/koclar/${coach.id}`}>
          <h2 className="text-lg font-bold text-gray-900 hover:text-[#0E8FA3] transition-colors leading-tight">
            {coach.name}
          </h2>
        </Link>

        {/* Yıldız */}
        <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
          <StarRating rating={coach.rating} count={coach.rating_count} />
        </div>

        {/* Üniversite & bölüm */}
        <p className="mt-2 text-sm font-semibold text-gray-600">
          {coach.university}{coach.department ? ` - ${coach.department}` : ""}
        </p>

        {/* Türkiye sıralaması rozeti */}
        {coach.rank_type && coach.rank_value ? (
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-sm font-bold text-amber-700">
            🏆 {coach.rank_type} - {coach.rank_value.toLocaleString("tr-TR")}
          </span>
        ) : null}

        {/* Sınav türleri */}
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {coach.types.map((type) => (
            <span
              key={type}
              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${typeColors[type]}`}
            >
              {type}
            </span>
          ))}
          {coach.availability === "open" && (
            <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700">
              ✦ Müsait
            </span>
          )}
          {coach.availability === "low" && (
            <span className="rounded-full bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-700">
              Az Yer
            </span>
          )}
        </div>

        {/* Bio */}
        {coach.bio && (
          <p className="mt-4 text-sm text-gray-500 leading-relaxed line-clamp-3 text-center">
            {coach.bio}
          </p>
        )}
      </div>

      {/* Alt butonlar */}
      <div className="mt-auto border-t border-gray-100 p-4 space-y-2.5">
        <Link
          href={`/koclar/${coach.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#0E8FA3] hover:text-[#0E8FA3]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
            <circle cx="12" cy="8" r="4" />
            <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          Profili Görüntüle
        </Link>

        {isFull ? (
          <button disabled className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed">
            Kontenjan Dolu
          </button>
        ) : purchased || hasPurchase ? (
          /* Ödeme yapılmış: koçu ata ve randevularıma git */
          <StartCoachingButton coachId={coach.id} coachName={coach.name} />
        ) : (
          /* Ödeme yapılmamış: tanışma randevusu */
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full rounded-xl bg-[#0E8FA3] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0c7689] hover:-translate-y-0.5 hover:shadow-md"
          >
            Koçla Tanış
          </button>
        )}
      </div>

      {showModal && (
        <BookingModal coach={coach} onClose={() => setShowModal(false)} />
      )}
    </article>
  );
}

export function CoachList({
  coaches,
  purchasedCoachIds = [],
  hasPurchase = false,
  initialTip,
}: {
  coaches: Coach[];
  purchasedCoachIds?: string[];
  hasPurchase?: boolean;
  initialTip?: FilterType;
}) {
  const [filter, setFilter] = useState<FilterType>(initialTip ?? "all");
  const [search, setSearch] = useState("");

  const filteredCoaches = useMemo(() => {
    const query = search.trim().toLowerCase();
    return coaches.filter((coach) => {
      const matchesType = filter === "all" || coach.types.includes(filter as CoachType);
      const matchesSearch = !query ||
        coach.name.toLowerCase().includes(query) ||
        (coach.university ?? "").toLowerCase().includes(query) ||
        (coach.department ?? "").toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });
  }, [coaches, filter, search]);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Hero */}
      <header className="bg-gradient-to-br from-zinc-900 via-[#1a1f5c] to-[#123A57] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Koçlarımız
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/70">
            Hedefinize uygun koçu seçin, tanışın ve koçluğa hemen başlayın.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Filtreler + Arama */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === value
                    ? "bg-[#123A57] text-white shadow-sm"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Koç, üniversite, bölüm ara..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/20"
            />
          </div>
        </div>

        {/* Sonuç sayısı */}
        <p className="mb-5 text-sm text-gray-500">
          <span className="font-semibold text-[#0E8FA3]">{filteredCoaches.length}</span> koç bulundu
        </p>

        {filteredCoaches.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-gray-900">Koç bulunamadı</p>
            <p className="mt-2 text-sm text-gray-500">Filtreleri veya arama terimini değiştirmeyi deneyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCoaches.map((coach) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                purchased={purchasedCoachIds.includes(coach.id)}
                hasPurchase={hasPurchase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
