"use client";

import { useState, useTransition } from "react";
import { updateCoachTypes } from "./bio-actions";

const TYPES = ["YKS", "LGS", "KPSS/AGS", "DGS", "PDR"];

export function CoachTypesCard({ initialTypes }: { initialTypes: string[] }) {
  const [selected, setSelected] = useState<string[]>(initialTypes);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(t: string) {
    setSelected((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
    setMsg(null);
    setErr(null);
  }

  function save() {
    if (pending) return;
    setMsg(null);
    setErr(null);
    startTransition(async () => {
      const res = await updateCoachTypes(selected);
      if (res?.error) setErr(res.error);
      else setMsg("Koçluk alanların kaydedildi — koçlar sayfasındaki filtrelerde görünüyorsun. ✅");
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900">Koçluk Alanların</h2>
      <p className="mt-1 text-sm text-gray-500">
        Hangi sınavlara koçluk yapıyorsun? Seçimlerin koç kartındaki rozetleri ve koçlar
        sayfasındaki filtreleri belirler — <strong>en az bir alan seçili olmalı</strong>,
        yoksa filtrelerde görünmezsin.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {TYPES.map((t) => {
          const on = selected.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                on
                  ? "border-[#0E8FA3] bg-[#eef9f9] text-[#0E8FA3]"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {on ? "✓ " : ""}{t}
            </button>
          );
        })}
      </div>

      {err && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{err}</p>}
      {msg && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{msg}</p>}

      <button
        type="button"
        onClick={save}
        disabled={pending || selected.length === 0}
        className="mt-4 rounded-xl bg-[#0E8FA3] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c7d8f] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Kaydediliyor…" : "Alanları Kaydet"}
      </button>
    </div>
  );
}
