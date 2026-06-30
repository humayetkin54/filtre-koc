"use client";

import { useState, useTransition, useRef } from "react";
import { bookAppointment } from "../actions";
import type { Coach } from "../types";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "19:00",
];

function todayMin() {
  return new Date().toISOString().split("T")[0];
}

export function BookingSection({ coach }: { coach: Coach }) {
  const [selectedTime, setSelectedTime] = useState("");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const isFull = coach.availability === "full";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTime) { setError("Lütfen bir saat seçin."); return; }
    const fd = new FormData(formRef.current!);
    fd.set("time", selectedTime);
    setError("");
    startTransition(async () => {
      const result = await bookAppointment(fd);
      if (result?.error) setError(result.error);
      else setDone(true);
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-400">Aylık ücret</p>
          <p className="text-3xl font-bold text-gray-900">
            {coach.price.toLocaleString("tr-TR")} ₺
            <span className="text-sm font-normal text-gray-400">/ay</span>
          </p>
        </div>
        <span className="text-xs text-gray-400">14 gün iade garantisi</span>
      </div>

      {done ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-6 text-center">
          <p className="text-2xl mb-2">✓</p>
          <p className="font-semibold text-emerald-800">Randevu talebiniz alındı!</p>
          <p className="mt-1 text-sm text-emerald-600">Koçunuz en kısa sürede dönüş yapacak.</p>
        </div>
      ) : isFull ? (
        <div className="rounded-xl bg-gray-50 px-4 py-6 text-center">
          <p className="font-semibold text-gray-500">Bu koç şu an dolu</p>
          <p className="mt-1 text-sm text-gray-400">Başka bir koç seçebilirsiniz.</p>
          <a href="/koclar" className="mt-3 inline-block text-sm font-medium text-[#123A57] hover:underline">
            Diğer koçlara bak →
          </a>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="coach_id" value={coach.id} />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Tarih</label>
            <input
              type="date"
              name="date"
              required
              min={todayMin()}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#123A57] focus:ring-2 focus:ring-[#123A57]/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Saat</label>
            <div className="grid grid-cols-3 gap-1.5">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                    selectedTime === t
                      ? "border-[#123A57] bg-[#123A57] text-white"
                      : "border-gray-200 text-gray-600 hover:border-[#123A57]/50"
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
              placeholder="Hedefini kısaca yaz..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#123A57] focus:ring-2 focus:ring-[#123A57]/20"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-2.5">
              <p className="text-sm text-red-600">{error}</p>
              {error.includes("ön görüşme hakkınızı doldurdunuz") && (
                <a
                  href="/paketler"
                  className="btn-primary mt-2 px-4 py-2 text-xs"
                >
                  Paket satın al →
                </a>
              )}
            </div>
          )}

          {!error.includes("ön görüşme hakkınızı doldurdunuz") && (
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full py-3 text-sm disabled:opacity-50"
            >
              {isPending ? "Gönderiliyor..." : "Randevu talep et"}
            </button>
          )}

          <p className="text-center text-xs text-gray-400">
            Ücretsiz ön görüşme — taahhüt yok
          </p>
        </form>
      )}
    </div>
  );
}
