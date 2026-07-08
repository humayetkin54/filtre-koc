"use client";

import { useState, useTransition } from "react";
import { EXAM_CONFIGS } from "./exam-config";
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

export function ResultsTabs({ results }: { results: DenemeResult[] }) {
  const [activeTab, setActiveTab] = useState("TYT");
  const [isPending, startTransition] = useTransition();
  const config = EXAM_CONFIGS[activeTab];
  const filtered = results.filter((r) => r.exam_name === activeTab);

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
              {key === "SOZ" ? "SÖZ" : key === "DIL" ? "DİL" : key}
              {count > 0 && (
                <span className={`ml-1.5 ${active ? "text-white/70" : "text-gray-400"}`}>({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-gray-400">
            {config.label} için kayıtlı sonuç yok.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap">Tarih</th>
                {config.fields.map((f) => (
                  <th key={f.key} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap">{f.label}</th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap">Toplam Net</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap">Diploma</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap">
                  {activeTab === "SOZ" ? "SÖZ" : activeTab === "DIL" ? "DİL" : activeTab} Puanı
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(r.exam_date).toLocaleDateString("tr-TR")}
                  </td>
                  {config.fields.map((f) => (
                    <td key={f.key} className="px-3 py-3 text-gray-600">
                      {r.nets?.[f.key] !== undefined ? r.nets[f.key].toFixed(2) : "—"}
                    </td>
                  ))}
                  <td className="px-4 py-3 font-bold text-[#0E8FA3]">{r.net_total?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-500">{r.obp ?? "—"}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">
                    {r.tyt_score ? r.tyt_score.toFixed(2) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(r.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition disabled:opacity-50"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
