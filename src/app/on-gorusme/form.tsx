"use client";

import { useRef, useState, useTransition } from "react";
import { submitIntroRequest } from "./actions";

export function OnGorusmeForm() {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    setError("");
    startTransition(async () => {
      const result = await submitIntroRequest(fd);
      if (result?.error) setError(result.error);
      else setDone(true);
    });
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
          📅
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Form</p>
          <h2 className="text-lg font-bold text-gray-900">Görüşme talebi</h2>
        </div>
      </div>

      {done ? (
        <div className="rounded-2xl bg-emerald-50 px-6 py-10 text-center">
          <p className="text-3xl mb-3">✓</p>
          <p className="font-semibold text-emerald-800">Talebiniz alındı!</p>
          <p className="mt-2 text-sm text-emerald-600">
            Danışmanımız en kısa sürede sizi arayacak.
          </p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-900">1. Kişisel bilgiler</p>
            <p className="mb-4 text-xs text-gray-400">
              Adın, sınıfın ve telefonun — birkaç dakikada tamamlanır.
            </p>
          </div>

          <input
            type="text"
            name="name"
            required
            placeholder="Ad Soyad"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          <select
            name="grade"
            required
            defaultValue=""
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="" disabled>Sınıf</option>
            <option value="9. Sınıf">9. Sınıf</option>
            <option value="10. Sınıf">10. Sınıf</option>
            <option value="11. Sınıf">11. Sınıf</option>
            <option value="12. Sınıf">12. Sınıf</option>
            <option value="Mezun">Mezun</option>
          </select>

          <select
            name="area"
            required
            defaultValue=""
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="" disabled>Alan</option>
            <option value="YKS">YKS</option>
            <option value="LGS">LGS</option>
            <option value="KPSS/AGS">KPSS/AGS</option>
            <option value="DGS">DGS</option>
          </select>

          <div>
            <input
              type="tel"
              name="phone"
              required
              placeholder="Telefon Numarası"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="mt-1.5 text-xs text-gray-400">Başında 0 olmadan 10 hane</p>
          </div>

          <div className="flex gap-3 rounded-xl bg-blue-50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lg">
              📱
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Telefonunu onayla</p>
              <p className="mt-0.5 text-xs text-gray-500">
                Görüşme için doğru numaradan ulaşalım. Bilgilerin yalnızca bu amaçla kullanılır.
              </p>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Gönderiliyor..." : "Talebi gönder"}
          </button>
        </form>
      )}
    </div>
  );
}
