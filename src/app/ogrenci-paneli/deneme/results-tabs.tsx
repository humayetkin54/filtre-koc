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

function NetChart({ data }: { data: { date: string; net: number }[] }) {
  if (data.length < 2) return null;
  const maxNet = Math.max(...data.map((d) => d.net), 1);
  const w = 600, h = 200, pad = 40;
  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - (d.net / maxNet) * (h - pad * 2),
    ...d,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} x2={w - pad} y1={pad + t * (h - pad * 2)} y2={pad + t * (h - pad * 2)} stroke="#f0f0f0" strokeWidth={1} />
      ))}
      <path d={pathD} fill="none" stroke="#0E8FA3" strokeWidth={2.5} strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={5} fill="#0E8FA3" />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={10} fill="#374151">{p.net.toFixed(1)}</text>
          <text x={p.x} y={h - 8} textAnchor="middle" fontSize={9} fill="#9ca3af">
            {new Date(p.date).toLocaleDateString("tr-TR", { month: "short", day: "numeric" })}
          </text>
        </g>
      ))}
    </svg>
  );
}

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

export function ResultsTabs({ results, readOnly = false }: { results: DenemeResult[]; readOnly?: boolean }) {
  const [activeTab, setActiveTabState] = useState("TYT");
  const [chartMode, setChartMode] = useState<"total" | "subject">("total");
  const [selectedSubject, setSelectedSubject] = useState<string>("turkce");
  const [isPending, startTransition] = useTransition();
  const config = EXAM_CONFIGS[activeTab];
  const filtered = results.filter((r) => r.exam_name === activeTab);
  const grouped = groupFields(config.fields);

  function setActiveTab(key: string) {
    setActiveTabState(key);
    setChartMode("total");
    setSelectedSubject(EXAM_CONFIGS[key].fields[0].key);
  }

  function handleDelete(id: string) {
    startTransition(() => deleteDenemeResult(id));
  }

  const sortedByDate = [...filtered].sort(
    (a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
  );
  const chartData =
    chartMode === "total"
      ? sortedByDate.map((r) => ({ date: r.exam_date, net: r.net_total ?? 0 }))
      : sortedByDate
          .filter((r) => r.nets?.[selectedSubject] !== undefined)
          .map((r) => ({ date: r.exam_date, net: r.nets![selectedSubject] }));
  const selectedField = config.fields.find((f) => f.key === selectedSubject);

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

      {/* Seçili türün net grafiği */}
      {filtered.length >= 2 && (
        <div className="border-b border-gray-100 px-5 pt-5 pb-2">
          {/* Grafik modu: Toplam Net | Dersler */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setChartMode("total")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                chartMode === "total"
                  ? "bg-[#123A57] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Toplam Net Grafiği
            </button>
            <button
              type="button"
              onClick={() => setChartMode("subject")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                chartMode === "subject"
                  ? "bg-[#123A57] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Dersler
            </button>
          </div>

          {/* Ders seçimi */}
          {chartMode === "subject" && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {config.fields.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setSelectedSubject(f.key)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                    selectedSubject === f.key
                      ? "bg-[#0E8FA3] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#0E8FA3] hover:text-[#0E8FA3]"
                  }`}
                >
                  {f.group ? `${f.group} ${f.label}` : f.label}
                </button>
              ))}
            </div>
          )}

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            {chartMode === "total"
              ? `${TAB_LABELS[activeTab]} Toplam Net Grafiği`
              : `${selectedField?.group ? selectedField.group + " " : ""}${selectedField?.label ?? ""} Net Değişimi`}
          </h3>
          {chartData.length >= 2 ? (
            <NetChart data={chartData} />
          ) : (
            <p className="pb-4 text-xs text-gray-400">Bu ders için yeterli veri yok (en az 2 deneme gerekli).</p>
          )}
        </div>
      )}

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
                  {!readOnly && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(r.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition disabled:opacity-50"
                    >
                      Sil
                    </button>
                  )}
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
