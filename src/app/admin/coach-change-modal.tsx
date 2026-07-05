"use client";

import { useState } from "react";
import { changePurchaseCoach, removeCoachFromPurchase } from "./actions";

interface Coach {
  id: string;
  name: string;
  university: string | null;
  department: string | null;
  types: string[] | null;
  avatar_initials: string;
  avatar_color: string;
  avatar_text_color: string;
}

interface Purchase {
  id: string;
  student_name: string | null;
  coach_id: string | null;
  coach_name: string | null;
  created_at: string;
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export function CoachChangeModal({
  purchase,
  coaches,
  onClose,
}: {
  purchase: Purchase;
  coaches: Coach[];
  onClose: () => void;
}) {
  const [view, setView] = useState<"main" | "select">("main");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const currentCoach = coaches.find(c => c.id === purchase.coach_id);

  const filtered = coaches.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.university ?? "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleRemove() {
    if (!confirm(`${purchase.student_name ?? "Öğrenci"} adlı öğrencinin koç bağlantısı kaldırılsın mı? Öğrenci koçlar sayfasından yeni koç seçebilecek.`)) return;
    setLoading(true);
    await removeCoachFromPurchase(purchase.id);
    setLoading(false);
    onClose();
  }

  async function handleAssign(coach: Coach) {
    setLoading(true);
    await changePurchaseCoach(purchase.id, coach.id, coach.name);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="font-bold text-gray-900">
              {view === "main" ? "Koç Yönetimi" : "Koç Seç"}
            </h2>
            <p className="text-xs text-gray-500">{purchase.student_name ?? "Öğrenci"}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {view === "main" ? (
          <div className="px-6 py-5 space-y-5">
            {/* Mevcut koç bilgisi */}
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Mevcut Koç</p>
              {currentCoach ? (
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                    style={{ backgroundColor: currentCoach.avatar_color, color: currentCoach.avatar_text_color }}
                  >
                    {currentCoach.avatar_initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{currentCoach.name}</p>
                    <p className="text-xs text-gray-500">
                      {[currentCoach.university, currentCoach.department].filter(Boolean).join(" · ")}
                    </p>
                    {currentCoach.types && currentCoach.types.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {currentCoach.types.map(t => (
                          <span key={t} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">{t}</span>
                        ))}
                      </div>
                    )}
                    <p className="mt-1.5 text-xs text-[#0E8FA3] font-medium">
                      📅 Koçluğa başladığı tarih: {fmt(purchase.created_at)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                      <circle cx="12" cy="8" r="4" />
                      <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Koç atanmamış</p>
                    <p className="text-xs text-gray-400">Öğrenci henüz bir koça bağlı değil</p>
                  </div>
                </div>
              )}
            </div>

            {/* Butonlar */}
            <div className="flex gap-3">
              {currentCoach && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={loading}
                  className="flex-1 rounded-xl border-2 border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Koç Kaldır
                </button>
              )}
              <button
                type="button"
                onClick={() => setView("select")}
                className="flex-1 rounded-xl bg-[#123A57] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f47]"
              >
                Koçu Manuel Ata
              </button>
            </div>

            {!currentCoach && (
              <p className="text-xs text-center text-gray-400">
                Bu öğrenci koçlar sayfasından koç seçebilir.
              </p>
            )}
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            {/* Geri + Arama */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setView("main")}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Koç veya üniversite ara..."
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#0E8FA3]"
              />
            </div>

            {/* Koç tablosu */}
            <div className="max-h-80 overflow-y-auto rounded-xl border border-gray-200 divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">Koç bulunamadı.</p>
              ) : filtered.map(coach => (
                <button
                  key={coach.id}
                  type="button"
                  onClick={() => handleAssign(coach)}
                  disabled={loading}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#eef9f9] disabled:opacity-50"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: coach.avatar_color, color: coach.avatar_text_color }}
                  >
                    {coach.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{coach.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {[coach.university, coach.department].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {coach.id === purchase.coach_id && (
                    <span className="rounded-full bg-[#0E8FA3] px-2 py-0.5 text-[10px] font-semibold text-white">Mevcut</span>
                  )}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-300 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>

            <p className="text-xs text-center text-gray-400">
              Seçilen koç öğrenciye hemen atanır.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
