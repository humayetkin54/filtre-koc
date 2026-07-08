"use client";

import { useState, useTransition } from "react";
import { EXAM_CONFIGS, type ExamField } from "./exam-config";
import { deleteDenemeResult } from "../actions";

interface DenemeResult {
  id: string;
  exam_date: string;
  exam_name: string;
  net_total: number | null;
  obp: number | null;
  tyt_score: number | null;
  nets: Record<string, number> | null;
  notes: string | null;
}

const TAB_LABELS: Record<string, string> = { TYT: "TYT", SAY: "SAY", EA: "EA", SOZ: "SÖZ", DIL: "DİL" };

function groupFields(fields: ExamField[]) {
  const groups: { name: string | null; fields: ExamField[] }[] = [];
  for (const f of fields) {
    const name = f.group ?? null;
    const last = groups[groups.length - 1];
    if (last && last.name === name) last.fields.push(f);
    else groups.push({ name, fields: [f] });
  }
  return groups;
}

export function ResultsTabs({ results }: { results: DenemeResult[] }) {
  const [activeTab, setActiveTab] = useState("TYT");
  const [isPending, startTransition] = useTransition();
  const config = EXAM_CONFIGS[activeTab];
  const filtered = results.filter((r) => r.exam_name === activeTab);
  const grouped = groupFields(config.fields);

  function handleDelete(id: string) {
    startTransition(() => deleteDenemeResult(id));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Sınav türü sekmeleri */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 bg-gray-50/50 px-4 py-3">
        {Object.keys(EXAM_CONFIGS).map((key) => {
          const count = results.filter((r) => r.exam_name === key).length;
          const active = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                active
                  ? "bg-[#0E8FA3] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#0E8FA3] hover:text-[#0E8FA3]"
              }`}
            >
              {TAB_LABELS[key]}
              {count > 0 && (
                <span className={`ml-1.5 ${active ? "text-white/70" : "text-gray-400"}`}>({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-gray-400">{config.label} için kayıtlı sonuç yok.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filtered.map((r) => (
            <div key={r.id} className="p-5">
              {/* Üst satır: tarih + özet + sil */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">
                  📅 {new Date(r.exam_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#eef9f9] px-3 py-1 text-xs font-bold text-[#0E8FA3]">
                    Toplam Net: {r.net_total?.toFixed(2)}
                  </span>
                  {r.obp != null && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      Diploma: {r.obp}
                    </span>
                  )}
                  {r.tyt_score != null && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {TAB_LABELS[activeTab]} Puanı: {r.tyt_score.toFixed(2)}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(r.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition disabled:opacity-50"
                  >
                    Sil
                  </button>
                </div>
              </div>

              {/* Netler — bölüm başlıklarıyla */}
              <div className="mt-3 space-y-2">
                {grouped.map((g, gi) => (
                  <div key={gi} className="flex flex-wrap items-center gap-1.5">
                    {g.name && (
                      <span className="rounded-md bg-[#123A57] px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wide">
                        {g.name}
                      </span>
                    )}
                    {g.fields.map((f) => (
                      <span
                        key={f.key}
                        className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
                      >
                        {f.label}: <span className="font-bold text-gray-900">{r.nets?.[f.key] !== undefined ? r.nets[f.key].toFixed(2) : "—"}</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              {r.notes && <p className="mt-2 text-xs italic text-gray-400">&ldquo;{r.notes}&rdquo;</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
