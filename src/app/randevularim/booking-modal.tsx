"use client";

import { useState } from "react";
import { createAppointment } from "./actions";

const DAY_NAMES: Record<string, string> = {
  "1": "Pazartesi", "2": "Salı", "3": "Çarşamba",
  "4": "Perşembe", "5": "Cuma", "6": "Cumartesi", "0": "Pazar",
};

interface Coach {
  id: string;
  name: string;
  avatar_initials: string;
  avatar_color: string;
  avatar_text_color: string;
  availability_schedule: Record<string, string[]>;
}

function getAvailableSlots(schedule: Record<string, string[]>, dateStr: string): string[] {
  if (!dateStr) return [];
  const day = new Date(dateStr).getDay().toString();
  return schedule[day] ?? [];
}

function isTodayOrFuture(dateStr: string) {
  return new Date(dateStr) >= new Date(new Date().toDateString());
}

export function BookingModal({ coach, onClose }: { coach: Coach; onClose: () => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const schedule = coach.availability_schedule ?? {};
  const hasSchedule = Object.keys(schedule).some((k) => schedule[k].length > 0);
  const availableSlots = getAvailableSlots(schedule, date);

  // Müsait günlerin JS day numaraları
  const availableDays = Object.entries(schedule)
    .filter(([, slots]) => slots.length > 0)
    .map(([day]) => day);

  const availableDayNames = availableDays.map((d) => DAY_NAMES[d]).join(", ");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) { setError("Lütfen tarih ve saat seçin."); return; }
    setLoading(true);
    setError("");
    const result = await createAppointment({ coachId: coach.id, date, time, note });
    setLoading(false);
    if (result?.error) { setError(result.error); return; }
    setSuccess(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: coach.avatar_color, color: coach.avatar_text_color }}
          >
            {coach.avatar_initials}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{coach.name}</p>
            <p className="text-xs text-gray-500">Randevu talebi oluştur</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Talep Gönderildi!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Koç talebinizi inceleyip onaylayacak. Onay geldiğinde randevunuz aktif olacak.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#0E8FA3] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0c7689]"
            >
              Kapat
            </button>
          </div>
        ) : !hasSchedule ? (
          <div className="px-6 py-10 text-center">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-sm text-gray-500">
              Bu koç henüz müsaitlik takvimini belirlememiş. Daha sonra tekrar deneyin.
            </p>
            <button type="button" onClick={onClose} className="mt-4 text-sm text-[#0E8FA3] hover:underline">
              Kapat
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Müsait günler bilgisi */}
            <div className="rounded-xl bg-[#eef9f9] px-4 py-3 text-xs text-[#0E8FA3]">
              <span className="font-semibold">Müsait günler:</span> {availableDayNames}
            </div>

            {/* Tarih */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tarih seçin</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => { setDate(e.target.value); setTime(""); }}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/20"
                required
              />
              {date && availableSlots.length === 0 && (
                <p className="mt-1.5 text-xs text-red-500">
                  Bu gün koç müsait değil. Lütfen başka bir gün seçin. ({availableDayNames})
                </p>
              )}
            </div>

            {/* Saat seçimi */}
            {date && availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Saat seçin</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`rounded-lg border py-2 text-xs font-semibold transition ${
                        time === slot
                          ? "border-[#0E8FA3] bg-[#0E8FA3] text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-[#0E8FA3] hover:text-[#0E8FA3]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Not */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Not <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Görüşmek istediğiniz konuyu belirtin..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none resize-none focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/20"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !date || !time}
              className="w-full rounded-xl bg-[#0E8FA3] py-3 text-sm font-bold text-white transition hover:bg-[#0c7689] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Gönderiliyor..." : "Randevu Talebi Gönder"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
