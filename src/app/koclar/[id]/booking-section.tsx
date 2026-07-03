"use client";

import { useState, useTransition, useRef } from "react";
import { bookAppointment } from "../actions";
import type { Coach } from "../types";

// JS getDay(): 0=Pazar,1=Pzt,...,6=Cmt
function getDayKey(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00"); // noon to avoid timezone shift
  return String(d.getDay());
}

function todayMin() {
  return new Date().toISOString().split("T")[0];
}

export function BookingSection({
  coach,
  schedule,
}: {
  coach: Coach;
  schedule: Record<string, string[]>;
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const isFull = coach.availability === "full";

  const availableSlots: string[] = selectedDate
    ? (schedule[getDayKey(selectedDate)] ?? [])
    : [];

  function handleDateChange(val: string) {
    setSelectedDate(val);
    setSelectedTime("");
    setError("");
  }

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

  if (done) {
    return (
      <div className="rounded-xl bg-emerald-50 px-4 py-8 text-center">
        <p className="text-3xl mb-2">✓</p>
        <p className="font-semibold text-emerald-800">Randevu talebiniz alındı!</p>
        <p className="mt-1 text-sm text-emerald-600">Koçunuz en kısa sürede dönüş yapacak.</p>
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="rounded-xl bg-gray-50 px-4 py-8 text-center">
        <p className="font-semibold text-gray-500">Bu koç şu an dolu</p>
        <p className="mt-1 text-sm text-gray-400">Başka bir koç seçebilirsiniz.</p>
        <a href="/koclar" className="mt-3 inline-block text-sm font-medium text-[#0E8FA3] hover:underline">
          Diğer koçlara bak →
        </a>
      </div>
    );
  }

  const hasAnySchedule = Object.values(schedule).some((s) => s.length > 0);

  if (!hasAnySchedule) {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-8 text-center">
        <p className="text-2xl mb-2">📅</p>
        <p className="font-semibold text-amber-800">Henüz müsaitlik belirlenmemiş</p>
        <p className="mt-1 text-sm text-amber-600">Koç, müsait günlerini yakında ekleyecek.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="coach_id" value={coach.id} />

      {/* Tarih */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Tarih Seçin</label>
        <input
          type="date"
          name="date"
          required
          min={todayMin()}
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/20"
        />
      </div>

      {/* Saat slotları */}
      {selectedDate && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Saat Seçin
            {availableSlots.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({availableSlots.length} müsait saat)
              </span>
            )}
          </label>

          {availableSlots.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-6 text-center">
              <p className="text-sm text-gray-400">Bu gün için müsait saat bulunmuyor.</p>
              <p className="text-xs text-gray-400 mt-1">Lütfen başka bir gün seçin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                    selectedTime === slot
                      ? "border-[#0E8FA3] bg-[#0E8FA3] text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#0E8FA3]/60 hover:text-[#0E8FA3]"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Not */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Not <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
        </label>
        <textarea
          name="note"
          rows={3}
          placeholder="Hedefini veya sorunu kısaca yaz..."
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none placeholder:text-gray-400 transition focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/20"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
          {error.includes("ön görüşme hakkınızı doldurdunuz") && (
            <a href="/paketler" className="btn-primary mt-2 inline-block px-4 py-2 text-xs">
              Paket satın al →
            </a>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !selectedTime}
        className="w-full rounded-xl bg-[#0E8FA3] py-3.5 text-sm font-bold text-white transition hover:bg-[#0c7689] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Gönderiliyor..." : "Randevu Talep Et"}
      </button>

      <p className="text-center text-xs text-gray-400">Ücretsiz tanışma görüşmesi — taahhüt yok</p>
    </form>
  );
}
