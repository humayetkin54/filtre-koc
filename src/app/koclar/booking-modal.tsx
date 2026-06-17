"use client";

import { useRef, useState, useTransition } from "react";
import { bookAppointment } from "./actions";
import type { Coach } from "./types";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "19:00",
];

function todayMin() {
  return new Date().toISOString().split("T")[0];
}

export function BookingModal({
  coach,
  onClose,
}: {
  coach: Coach;
  onClose: () => void;
}) {
  const [selectedTime, setSelectedTime] = useState("");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    if (!selectedTime) { setError("Lütfen bir saat seçin."); return; }
    fd.set("time", selectedTime);
    setError("");

    startTransition(async () => {
      const result = await bookAppointment(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setDone(true);
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: coach.avatar_color, color: coach.avatar_text_color }}
            >
              {coach.avatar_initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{coach.name}</p>
              <p className="text-xs text-gray-500">{coach.university}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
              ✓
            </div>
            <p className="text-lg font-semibold text-gray-900">Randevu talebiniz alındı!</p>
            <p className="mt-2 text-sm text-gray-500">
              Koçunuz en kısa sürede size dönüş yapacak.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl bg-[#3a4cff] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2f3fd4]"
            >
              Tamam
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            <input type="hidden" name="coach_id" value={coach.id} />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Tarih
              </label>
              <input
                type="date"
                name="date"
                required
                min={todayMin()}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Saat
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                      selectedTime === t
                        ? "border-[#3a4cff] bg-[#3a4cff] text-white"
                        : "border-gray-200 text-gray-600 hover:border-[#3a4cff]/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Not <span className="text-gray-400">(isteğe bağlı)</span>
              </label>
              <textarea
                name="note"
                rows={3}
                placeholder="Hedefini, hangi sınavı hazırladığını kısaca yaz..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-[#3a4cff] py-3 text-sm font-semibold text-white transition hover:bg-[#2f3fd4] disabled:bg-[#3a4cff]/50"
            >
              {isPending ? "Gönderiliyor..." : "Randevu talep et"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
