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

const SERIES_COLORS = ["#0E8FA3", "#E2600F", "#7c3aed"];

interface ChartSeries {
  label: string;
  color: string;
  data: { date: string; net: number }[];
}

function NetChart({ series }: { series: ChartSeries[] }) {
  const valid = series.filter((s) => s.data.length >= 1);
  if (valid.length === 0) return null;

  const maxNet = Math.max(...valid.flatMap((s) => s.data.map((d) => d.net)), 1);
  const n = Math.max(...valid.map((s) => s.data.length));
  const w = 600, h = 200, pad = 40;
  const xFor = (i: number) => (n <= 1 ? w / 2 : pad + (i / (n - 1)) * (w - pad * 2));
  const yFor = (net: number) => h - pad - (net / maxNet) * (h - pad * 2);
  const dates = valid[0].data.map((d) => d.date);
  const multi = series.length > 1;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={pad} x2={w - pad} y1={pad + t * (h - pad * 2)} y2={pad + t * (h - pad * 2)} stroke="#f0f0f0" strokeWidth={1} />
        ))}
        {valid.map((s, si) => {
          const pts = s.data.map((d, i) => ({ x: xFor(i), y: yFor(d.net), net: d.net }));
          const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
          return (
            <g key={si}>
              <path d={pathD} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" />
              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={4.5} fill={s.color} />
                  <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize={10} fontWeight="bold" fill={s.color}>{p.net.toFixed(1)}</text>
                </g>
              ))}
            </g>
          );
        })}
        {dates.map((d, i) => (
          <text key={i} x={xFor(i)} y={h - 8} textAnchor="middle" fontSize={9} fill="#9ca3af">
            {new Date(d).toLocaleDateString("tr-TR", { month: "short", day: "numeric" })}
          </text>
        ))}
      </svg>
      {multi && (
        <div className="flex flex-wrap justify-center gap-5 pt-1 pb-3">
          {valid.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <span className="inline-block h-2.5 w-5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label} Net
            </span>
          ))}
        </div>
      )}
    </div>
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
  const selectedField = config.fields.find((f) => f.key === selectedSubject);

  // Grafik serileri: Toplam modunda TYT tek çizgi, SAY/EA/SÖZ/DİL'de TYT + AYT ayrı çizgi
  let chartSeries: ChartSeries[];
  if (chartMode === "subject") {
    chartSeries = [{
      label: selectedField?.label ?? "",
      color: "#0E8FA3",
      data: sortedByDate
        .filter((r) => r.nets?.[selectedSubject] !== undefined)
        .map((r) => ({ date: r.exam_date, net: r.nets![selectedSubject] })),
    }];
  } else if (grouped.length > 1) {
    chartSeries = grouped.map((g, gi) => ({
      label: g.name ?? "Toplam",
      color: SERIES_COLORS[gi % SERIES_COLORS.length],
      data: sortedByDate
        .filter((r) => r.nets && Object.keys(r.nets).length > 0)
        .map((r) => ({ date: r.exam_date, net: g.fields.reduce((s, f) => s + (r.nets?.[f.key] ?? 0), 0) })),
    }));
  } else {
    chartSeries = [{
      label: "Toplam",
      color: "#0E8FA3",
      data: sortedByDate.map((r) => ({ date: r.exam_date, net: r.net_total ?? 0 })),
    }];
  }
  const chartMaxLen = Math.max(0, ...chartSeries.map((s) => s.data.length));

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
          {chartMaxLen >= 2 ? (
            <NetChart series={chartSeries} />
          ) : (
            <p className="pb-4 text-xs text-gray-400">Bu grafik için yeterli veri yok (en az 2 deneme gerekli).</p>
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
                  {(() => {
                    const hasNets = r.nets && Object.keys(r.nets).length > 0;
                    if (!hasNets) {
                      return (
                        <span className="rounded-full bg-[#eef9f9] px-3 py-1 text-xs font-bold text-[#0E8FA3]">
                          Toplam Net: {r.net_total?.toFixed(2)}
                        </span>
                      );
                    }
                    return grouped.map((g, gi) => {
                      const sum = g.fields.reduce((acc, f) => acc + (r.nets?.[f.key] ?? 0), 0);
                      return (
                        <span key={gi} className="rounded-full bg-[#eef9f9] px-3 py-1 text-xs font-bold text-[#0E8FA3]">
                          {g.name ?? "Toplam"} Net: {sum.toFixed(2)}
                        </span>
                      );
                    });
                  })()}
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
