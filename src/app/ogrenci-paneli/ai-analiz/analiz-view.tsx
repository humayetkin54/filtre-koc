"use client";

import { useState, useTransition } from "react";
import { deleteExamScan } from "./actions";

const TAB_LABELS: Record<string, string> = { TYT: "TYT", SAY: "SAY", EA: "EA", SOZ: "SÖZ", DIL: "DİL" };
const DAY_NAMES: Record<number, string> = {
  1: "Pazartesi", 2: "Salı", 3: "Çarşamba", 4: "Perşembe", 5: "Cuma", 6: "Cumartesi", 0: "Pazar",
};

interface ScanQuestion {
  ders: string;
  konu: string;
  sonuc: "dogru" | "yanlis";
}

interface ProgramEntry {
  gun: number;
  saat: string;
  ders: string;
  konu: string;
}

interface ExamScan {
  id: string;
  exam_name: string;
  exam_date: string;
  status: string;
  photo_count: number;
  questions: ScanQuestion[] | null;
  analysis_text: string | null;
  program_suggestion: ProgramEntry[] | null;
  error_message: string | null;
  created_at: string;
}

export function AnalizView({ scans, initialScanId }: { scans: ExamScan[]; initialScanId: string | null }) {
  const initialScan = scans.find((s) => s.id === initialScanId);
  const [activeTab, setActiveTab] = useState(initialScan?.exam_name ?? "TYT");
  const [selectedId, setSelectedId] = useState<string | null>(initialScanId);
  const [isPending, startTransition] = useTransition();

  const filtered = scans.filter((s) => s.exam_name === activeTab);
  const selected = filtered.find((s) => s.id === selectedId) ?? filtered[0] ?? null;

  // Ders bazlı doğru/yanlış özeti
  const subjectSummary: Record<string, { dogru: number; yanlis: number; topics: Record<string, { dogru: number; yanlis: number }> }> = {};
  for (const q of selected?.questions ?? []) {
    const s = (subjectSummary[q.ders] ??= { dogru: 0, yanlis: 0, topics: {} });
    const t = (s.topics[q.konu] ??= { dogru: 0, yanlis: 0 });
    if (q.sonuc === "dogru") { s.dogru++; t.dogru++; } else { s.yanlis++; t.yanlis++; }
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <div className="space-y-4">
      {/* Sınav türü sekmeleri */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(TAB_LABELS).map((key) => {
          const count = scans.filter((s) => s.exam_name === key).length;
          const active = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => { setActiveTab(key); setSelectedId(null); }}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                active ? "bg-[#0E8FA3] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#0E8FA3] hover:text-[#0E8FA3]"
              }`}
            >
              {TAB_LABELS[key]}
              {count > 0 && <span className={`ml-1.5 ${active ? "text-white/70" : "text-gray-400"}`}>({count})</span>}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
          <p className="text-4xl mb-3">🤖</p>
          <p className="font-semibold text-gray-700">{TAB_LABELS[activeTab]} için yüklenmiş deneme yok</p>
          <p className="text-sm text-gray-400 mt-1">&ldquo;Yeni Deneme Yükle&rdquo; ile kitapçık fotoğraflarını yükle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sınav listesi */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden h-fit">
            <p className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-400 border-b border-gray-100 bg-gray-50/50">
              Yüklenen Denemeler
            </p>
            <div className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
                    selected?.id === s.id ? "bg-[#eef9f9]" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{fmtDate(s.exam_date)}</p>
                    <p className="text-[11px] text-gray-400">
                      {s.photo_count} fotoğraf ·{" "}
                      {s.status === "done" ? `${(s.questions ?? []).length} soru` :
                       s.status === "analyzing" ? "analiz ediliyor..." : "hata"}
                    </p>
                  </div>
                  {s.status === "done" && <span className="text-emerald-500 text-xs font-bold">✓</span>}
                  {s.status === "error" && <span className="text-red-400 text-xs font-bold">!</span>}
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      startTransition(() => deleteExamScan(s.id));
                    }}
                    className="text-xs text-red-300 hover:text-red-500 transition disabled:opacity-50"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Analiz detayı */}
          <div className="lg:col-span-2 space-y-4">
            {!selected ? null : selected.status === "error" ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="font-bold text-red-700 mb-1">Analiz başarısız</p>
                <p className="text-sm text-red-600">{selected.error_message}</p>
              </div>
            ) : selected.status !== "done" ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                ⏳ Bu deneme hâlâ analiz ediliyor...
              </div>
            ) : (
              <>
                {/* AI analiz paragrafı */}
                <div className="rounded-2xl bg-gradient-to-br from-[#123A57] to-[#0E8FA3] p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                    🤖 AI Analiz Özeti — {fmtDate(selected.exam_date)}
                  </p>
                  <p className="text-sm leading-relaxed">{selected.analysis_text}</p>
                </div>

                {/* Ders bazlı özet */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Ders &amp; Konu Dağılımı</h3>
                  <div className="space-y-3">
                    {Object.entries(subjectSummary).map(([ders, s]) => (
                      <div key={ders} className="rounded-xl border border-gray-100 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-gray-900">{ders}</p>
                          <div className="flex gap-2 text-xs font-bold">
                            <span className="text-emerald-600">✓ {s.dogru}</span>
                            <span className="text-red-500">✗ {s.yanlis}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(s.topics).map(([konu, t]) => (
                            <span
                              key={konu}
                              className={`rounded-lg px-2 py-1 text-[11px] font-medium ${
                                t.yanlis > t.dogru
                                  ? "bg-red-50 text-red-600 border border-red-100"
                                  : t.yanlis > 0
                                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              }`}
                            >
                              {konu} ({t.dogru}✓ {t.yanlis}✗)
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Önerilen program */}
                {(selected.program_suggestion ?? []).length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-bold text-gray-700">Önerilen Haftalık Program</h3>
                      <span className="rounded-full bg-[#eef9f9] px-2 py-0.5 text-[10px] font-bold text-[#0E8FA3]">
                        Koçuna gönderildi
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">
                      Bu öneri koçunun panelinde görünür; koçun onaylarsa ders programına eklenir.
                    </p>
                    <div className="space-y-1.5">
                      {[...(selected.program_suggestion ?? [])]
                        .sort((a, b) => (a.gun === 0 ? 7 : a.gun) - (b.gun === 0 ? 7 : b.gun) || a.saat.localeCompare(b.saat))
                        .map((p, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 text-xs">
                            <span className="w-20 font-bold text-gray-600">{DAY_NAMES[p.gun] ?? p.gun}</span>
                            <span className="font-mono text-gray-400">{p.saat}</span>
                            <span className="font-semibold text-[#0E8FA3]">{p.ders}</span>
                            <span className="text-gray-500 truncate">{p.konu}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
