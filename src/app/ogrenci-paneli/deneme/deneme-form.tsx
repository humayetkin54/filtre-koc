"use client";

import { useState, useTransition } from "react";
import { EXAM_CONFIGS } from "./exam-config";
import { addDenemeResult } from "../actions";

export function DenemeForm() {
  const [examType, setExamType] = useState("TYT");
  const [isPending, startTransition] = useTransition();
  const config = EXAM_CONFIGS[examType];

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addDenemeResult(formData);
      // formu sıfırlamak için sayfa revalidate olur, alanlar korunur
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sınav Türü</label>
          <select
            name="exam_name"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]"
          >
            {Object.entries(EXAM_CONFIGS).map(([key, c]) => (
              <option key={key} value={key}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tarih</label>
          <input type="date" name="exam_date" required className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Diploma Notu <span className="font-normal text-gray-400">(0–100)</span>
        </label>
        <input
          type="number"
          name="obp"
          min="0"
          max="100"
          step="0.01"
          placeholder="Örn: 85.50"
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          Girilirse okul puanı dahil yerleştirme puanı (Y-{examType}) da hesaplanır.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-600">Netler <span className="font-normal text-gray-400">(2025 katsayılarıyla puan hesaplanır)</span></p>
        {(() => {
          const groups: { name: string | null; fields: typeof config.fields }[] = [];
          for (const f of config.fields) {
            const name = f.group ?? null;
            const last = groups[groups.length - 1];
            if (last && last.name === name) last.fields.push(f);
            else groups.push({ name, fields: [f] });
          }
          return groups.map((g, gi) => (
            <div key={gi}>
              {g.name && (
                <span className="mb-2 inline-block rounded-md bg-[#123A57] px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wide">
                  {g.name} Bölümü
                </span>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {g.fields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      {f.label} <span className="font-normal text-gray-400">/{f.max}</span>
                    </label>
                    <input
                      type="number"
                      name={`net_${f.key}`}
                      min={-Math.ceil(f.max / 4)}
                      max={f.max}
                      step="0.25"
                      defaultValue="0"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]"
                    />
                  </div>
                ))}
              </div>
            </div>
          ));
        })()}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Not (isteğe bağlı)</label>
        <input type="text" name="notes" placeholder="Bu denemede dikkat ettiğin bir şey?" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-[#0E8FA3] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0c7689] transition disabled:opacity-50"
      >
        {isPending ? "Kaydediliyor..." : "Sonucu Kaydet"}
      </button>
    </form>
  );
}
