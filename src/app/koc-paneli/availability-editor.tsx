"use client";

import { useState, useTransition } from "react";
import { saveAvailability } from "./actions";

const DAYS = [
  { key: "1", label: "Pazartesi" },
  { key: "2", label: "Salı" },
  { key: "3", label: "Çarşamba" },
  { key: "4", label: "Perşembe" },
  { key: "5", label: "Cuma" },
  { key: "6", label: "Cumartesi" },
  { key: "0", label: "Pazar" },
];

const ALL_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30","19:00","19:30","20:00",
];

type Schedule = Record<string, string[]>; // { "1": ["09:00","10:00"], ... }

export function AvailabilityEditor({
  coachId,
  initial,
}: {
  coachId: string;
  initial: Schedule;
}) {
  const [schedule, setSchedule] = useState<Schedule>(initial ?? {});
  const [activeDay, setActiveDay] = useState<string | null>(
    Object.keys(initial ?? {}).find((k) => (initial[k]?.length ?? 0) > 0) ?? "1"
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function isDayActive(day: string) {
    return (schedule[day]?.length ?? 0) > 0;
  }

  function toggleDay(day: string) {
    setSchedule((prev) => {
      if (isDayActive(day)) {
        const next = { ...prev };
        delete next[day];
        return next;
      }
      return { ...prev, [day]: ["09:00", "10:00", "11:00"] };
    });
    setActiveDay(day);
    setSaved(false);
  }

  function toggleSlot(day: string, slot: string) {
    setSchedule((prev) => {
      const current = prev[day] ?? [];
      const next = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot].sort();
      return { ...prev, [day]: next };
    });
    setSaved(false);
  }

  function selectAll(day: string) {
    setSchedule((prev) => ({ ...prev, [day]: [...ALL_SLOTS] }));
    setSaved(false);
  }

  function clearAll(day: string) {
    setSchedule((prev) => {
      const next = { ...prev };
      delete next[day];
      return next;
    });
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await saveAvailability(coachId, schedule);
      setSaved(true);
    });
  }

  const daySlots = activeDay ? (schedule[activeDay] ?? []) : [];

  return (
    <div className="space-y-5">

      {/* Gün seçimi */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Müsait Günler
        </p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => {
            const active = isDayActive(d.key);
            const selected = activeDay === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => {
                  if (!active) toggleDay(d.key);
                  setActiveDay(d.key);
                }}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                  active && selected
                    ? "border-[#0E8FA3] bg-[#0E8FA3] text-white shadow-md"
                    : active
                    ? "border-[#0E8FA3] bg-[#eef9f9] text-[#0E8FA3]"
                    : selected
                    ? "border-gray-300 bg-gray-100 text-gray-500"
                    : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Aktif olmayan günlere tıklayarak o günü açabilirsiniz.
        </p>
      </div>

      {/* Seçili günün saatleri */}
      {activeDay && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-800 text-sm">
              {DAYS.find((d) => d.key === activeDay)?.label} — Müsait Saatler
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectAll(activeDay)}
                className="text-xs text-[#0E8FA3] hover:underline font-medium"
              >
                Tümünü seç
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => clearAll(activeDay)}
                className="text-xs text-red-400 hover:underline font-medium"
              >
                Temizle
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {ALL_SLOTS.map((slot) => {
              const selected = daySlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(activeDay, slot)}
                  className={`rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                    selected
                      ? "border-[#0E8FA3] bg-[#0E8FA3] text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-500 hover:border-[#0E8FA3]/50 hover:text-[#0E8FA3]"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>

          {daySlots.length === 0 && isDayActive(activeDay) && (
            <p className="mt-3 text-xs text-amber-600 text-center">
              ⚠ Bu gün için saat seçilmedi — öğrenciler randevu alamaz.
            </p>
          )}

          {/* Gün aktif/pasif toggle */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-xs text-gray-500">
              {isDayActive(activeDay)
                ? `${daySlots.length} saat seçili`
                : "Bu gün kapalı"}
            </span>
            <button
              type="button"
              onClick={() => toggleDay(activeDay)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                isDayActive(activeDay)
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              {isDayActive(activeDay) ? "Günü kapat" : "Günü aç"}
            </button>
          </div>
        </div>
      )}

      {/* Özet */}
      <div className="rounded-xl bg-white border border-gray-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Haftalık Özet</p>
        <div className="space-y-1.5">
          {DAYS.map((d) => {
            const slots = schedule[d.key] ?? [];
            return (
              <div key={d.key} className="flex items-center gap-3 text-xs">
                <span className={`w-20 font-medium ${slots.length ? "text-gray-700" : "text-gray-300"}`}>
                  {d.label}
                </span>
                {slots.length > 0 ? (
                  <span className="text-[#0E8FA3]">
                    {slots[0]} – {slots[slots.length - 1]} ({slots.length} saat)
                  </span>
                ) : (
                  <span className="text-gray-300">Kapalı</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Kaydet */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-xl bg-[#123A57] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0f2f47] disabled:opacity-60"
        >
          {isPending ? "Kaydediliyor..." : "Müsaitliği Kaydet"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Kaydedildi
          </span>
        )}
      </div>
    </div>
  );
}
