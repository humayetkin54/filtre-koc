"use client";

import { useState, useTransition } from "react";
import { setVeliTakip } from "./actions";

export function VeliTakipToggle({ initial, hasPackage }: { initial: boolean; hasPackage: boolean }) {
  const [on, setOn] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function toggle() {
    if (!hasPackage || pending) return;
    const next = !on;
    setOn(next); // iyimser
    setErr(null);
    startTransition(async () => {
      const res = await setVeliTakip(next);
      if (res?.error) {
        setOn(!next); // geri al
        setErr(res.error);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 font-semibold text-gray-900">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0E8FA3" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" />
            </svg>
            Veli Takip Sistemi
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Eğitim durumunuzun veliniz tarafından takip edilmesine izin verin.
          </p>
        </div>

        {/* Anahtar */}
        <button
          type="button"
          role="switch"
          aria-checked={on}
          disabled={!hasPackage || pending}
          onClick={toggle}
          className={`relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
            on ? "bg-[#0E8FA3]" : "bg-gray-300"
          } ${!hasPackage ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              on ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {!hasPackage && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span className="mt-0.5">⚠️</span>
          <p>Veli Takip Sistemini kullanabilmek için aktif bir koçluk veya hızlı okuma paketiniz olmalıdır.</p>
        </div>
      )}

      {err && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {err}
        </div>
      )}

      {hasPackage && on && (
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✓ Veli takibi açık. Veli ekleme adımı yakında bu bölüme eklenecek.
        </div>
      )}
    </div>
  );
}
