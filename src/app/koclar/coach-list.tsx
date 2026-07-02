"use client";

import { useMemo, useState } from "react";
import type { Availability, Coach, CoachType, FilterType } from "./types";
import Link from "next/link";
import { BookingModal } from "./booking-modal";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "YKS", label: "YKS" },
  { value: "LGS", label: "LGS" },
  { value: "KPSS/AGS", label: "KPSS/AGS" },
  { value: "DGS", label: "DGS" },
];

const availabilityConfig: Record<
  Availability,
  { label: string; className: string }
> = {
  open: {
    label: "Müsait",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-500/25",
  },
  low: {
    label: "Az Yer",
    className: "bg-amber-50 text-amber-700 ring-amber-500/25",
  },
  full: {
    label: "Dolu",
    className: "bg-red-50 text-red-700 ring-red-500/25",
  },
};

const typeStyles: Record<CoachType, string> = {
  YKS: "bg-blue-50 text-blue-700 ring-blue-500/20",
  LGS: "bg-violet-50 text-violet-700 ring-violet-500/20",
  "KPSS/AGS": "bg-orange-50 text-orange-700 ring-orange-500/20",
  DGS: "bg-teal-50 text-teal-700 ring-teal-500/20",
};

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-sm ${
              i < Math.round(rating) ? "text-amber-400" : "text-zinc-200"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-sm font-semibold text-zinc-800">
          {rating.toFixed(1)}
        </span>
      </div>
      <span className="text-sm text-zinc-500">({count} yorum)</span>
    </div>
  );
}

function CoachCard({ coach }: { coach: Coach }) {
  const availability = availabilityConfig[coach.availability];
  const spotsLeft = coach.max_students - coach.current_students;
  const isFull = coach.availability === "full";
  const [showModal, setShowModal] = useState(false);

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:border-[#123A57]/20 hover:shadow-md">

      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold"
          style={{
            backgroundColor: coach.avatar_color,
            color: coach.avatar_text_color,
          }}
        >
          {coach.avatar_initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link href={`/koclar/${coach.id}`}>
            <h2
              className="truncate text-lg font-semibold text-zinc-900 hover:text-[#123A57] transition-colors"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {coach.name}
            </h2>
          </Link>
              <p className="mt-0.5 truncate text-sm text-zinc-500">
                {coach.university}
              </p>
            </div>
            <Badge className={availability.className}>
              {availability.label}
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {coach.types.map((type) => (
              <Badge key={type} className={typeStyles[type]}>
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <StarRating rating={coach.rating} count={coach.rating_count} />

        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Boş yer</span>
          <span className="font-semibold text-zinc-800">
            {spotsLeft > 0 ? spotsLeft : 0} kişi
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Net artış</span>
          <span className="font-semibold text-emerald-600">
            {coach.net_increase}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3 border-t border-zinc-100 pt-4">
        <button
          type="button"
          disabled={isFull}
          onClick={() => setShowModal(true)}
          className="rounded-xl border-2 border-[#0E8FA3] px-4 py-2.5 text-sm font-semibold text-[#0E8FA3] transition-all hover:bg-[#0E8FA3] hover:text-white disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400"
        >
          Koçla Tanış
        </button>
        <button
          type="button"
          disabled={isFull}
          onClick={() => window.location.href = `/paketler?coach_id=${coach.id}&coach_name=${encodeURIComponent(coach.name)}`}
          className="rounded-xl bg-gradient-to-br from-[#123A57] to-[#E2600F] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-none disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none"
        >
          Koçluk Başlat
        </button>
      </div>

      {showModal && (
        <BookingModal coach={coach} onClose={() => setShowModal(false)} />
      )}
    </article>
  );
}

export function CoachList({ coaches }: { coaches: Coach[] }) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const filteredCoaches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return coaches.filter((coach) => {
      const matchesType =
        filter === "all" || coach.types.includes(filter as CoachType);
      const matchesSearch =
        !query || coach.name.toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  }, [coaches, filter, search]);

  return (
    <div className="min-h-full bg-zinc-50">
      <header className="bg-gradient-to-br from-zinc-900 via-[#1a1f5c] to-[#123A57] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Koçlar
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/70">
            Hedefinize uygun koçu seçin, filtreleyin ve koçluğa hemen başlayın.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === value
                    ? "bg-[#123A57] text-white shadow-sm"
                    : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Koç adına göre ara..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-shadow placeholder:text-zinc-400 focus:border-[#123A57] focus:ring-2 focus:ring-[#123A57]/20"
            />
          </div>
        </div>

        {filteredCoaches.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center">
            <p
              className="text-lg font-semibold text-zinc-900"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Koç bulunamadı
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Filtreleri veya arama terimini değiştirmeyi deneyin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCoaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
