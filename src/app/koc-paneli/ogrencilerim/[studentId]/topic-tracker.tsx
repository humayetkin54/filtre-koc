"use client";

import { useMemo, useState, useTransition } from "react";
import { CURRICULUM, TOPIC_STATUSES, statusMeta, type ExamGroup } from "@/lib/curriculum";
import { setTopicProgress } from "../../actions";

export interface TopicRow {
  subject_key: string;
  topic: string;
  status: string;
  solved_count: number;
  resources: string | null;
}

/** Denemede tespit edilen konu performansı: anahtar normalize edilmiş konu adı */
export type ExamWeakness = Record<string, { d: number; y: number }>;

const rowKey = (subjectKey: string, topic: string) => `${subjectKey}||${topic}`;

export function TopicTracker({
  studentId,
  rows,
  examWeakness = {},
}: {
  studentId: string;
  rows: TopicRow[];
  examWeakness?: ExamWeakness;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<Record<string, TopicRow>>(() => {
    const m: Record<string, TopicRow> = {};
    for (const r of rows) m[rowKey(r.subject_key, r.topic)] = r;
    return m;
  });
  const [group, setGroup] = useState<ExamGroup | "hepsi">("hepsi");
  const [statusFilter, setStatusFilter] = useState<string>("hepsi");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  function get(subjectKey: string, topic: string): TopicRow {
    return (
      state[rowKey(subjectKey, topic)] ?? {
        subject_key: subjectKey,
        topic,
        status: "baslanmadi",
        solved_count: 0,
        resources: null,
      }
    );
  }

  function save(next: TopicRow) {
    const k = rowKey(next.subject_key, next.topic);
    setState((s) => ({ ...s, [k]: next }));
    setSavingKey(k);
    const fd = new FormData();
    fd.set("student_id", studentId);
    fd.set("subject_key", next.subject_key);
    fd.set("topic", next.topic);
    fd.set("status", next.status);
    fd.set("solved_count", String(next.solved_count));
    fd.set("resources", next.resources ?? "");
    startTransition(async () => {
      await setTopicProgress(fd);
      setSavingKey((cur) => (cur === k ? null : cur));
    });
  }

  /* ── Filtrelenmiş görünüm ── */
  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return CURRICULUM.filter((s) => group === "hepsi" || s.group === group)
      .map((s) => ({
        ...s,
        topics: s.topics.filter((t) => {
          if (q && !t.toLocaleLowerCase("tr").includes(q)) return false;
          if (statusFilter !== "hepsi" && get(s.key, t).status !== statusFilter) return false;
          return true;
        }),
      }))
      .filter((s) => s.topics.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, statusFilter, query, state]);

  /* ── Özet (filtreden bağımsız, tüm müfredat üzerinden) ── */
  const summary = useMemo(() => {
    const counts: Record<string, number> = { baslanmadi: 0, devam: 0, bitti: 0, tekrar: 0 };
    let total = 0;
    let solved = 0;
    for (const s of CURRICULUM) {
      for (const t of s.topics) {
        total++;
        const r = get(s.key, t);
        counts[r.status] = (counts[r.status] ?? 0) + 1;
        solved += r.solved_count;
      }
    }
    return { counts, total, solved, pct: total ? Math.round((counts.bitti / total) * 100) : 0 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="space-y-4">
      {/* Özet */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-gray-900">Müfredat İlerlemesi</p>
            <p className="text-xs text-gray-500">
              {summary.counts.bitti} / {summary.total} konu bitti · toplam {summary.solved.toLocaleString("tr-TR")} soru çözüldü
            </p>
          </div>
          <p className="text-2xl font-bold text-[#0E8FA3]">%{summary.pct}</p>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-[#0E8FA3] transition-all" style={{ width: `${summary.pct}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPIC_STATUSES.map((s) => (
            <span
              key={s.key}
              className="rounded-lg px-2.5 py-1 text-xs font-semibold"
              style={{ background: s.bg, color: s.color }}
            >
              {s.label}: {summary.counts[s.key] ?? 0}
            </span>
          ))}
        </div>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex gap-1.5">
          {(["hepsi", "TYT", "AYT"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                group === g ? "bg-[#123A57] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {g === "hepsi" ? "Tümü" : g}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#0E8FA3]"
        >
          <option value="hepsi">Tüm durumlar</option>
          {TOPIC_STATUSES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Konu ara..."
          className="min-w-[180px] flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-[#0E8FA3]"
        />
        {isPending && <span className="text-xs font-semibold text-[#0E8FA3]">kaydediliyor...</span>}
      </div>

      {/* Dersler */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center">
          <p className="text-sm text-gray-500">Bu filtreye uyan konu yok.</p>
        </div>
      ) : (
        visible.map((s) => {
          const bitti = s.topics.filter((t) => get(s.key, t).status === "bitti").length;
          const acik = open[s.key] ?? false;
          return (
            <div key={s.key} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [s.key]: !acik }))}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {s.label}{" "}
                      <span className="ml-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                        {s.group}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">{bitti} / {s.topics.length} konu bitti</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden h-2 w-24 overflow-hidden rounded-full bg-gray-100 sm:block">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${s.topics.length ? (bitti / s.topics.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-gray-400">{acik ? "▲" : "▼"}</span>
                </div>
              </button>

              {acik && (
                <div className="divide-y divide-gray-100 border-t border-gray-100">
                  {s.topics.map((t) => {
                    const r = get(s.key, t);
                    const meta = statusMeta(r.status);
                    const k = rowKey(s.key, t);
                    const weak = examWeakness[normalizeTopic(t)];
                    return (
                      <div key={t} className="flex flex-wrap items-center gap-2 px-5 py-3">
                        <div className="min-w-[180px] flex-1">
                          <p className="text-sm font-medium text-gray-800">{t}</p>
                          {weak && (
                            <p className="mt-0.5 text-[11px] font-semibold text-amber-600">
                              📝 Denemede: {weak.d} doğru / {weak.y} yanlış
                            </p>
                          )}
                        </div>

                        {/* Durum */}
                        <div className="flex gap-1">
                          {TOPIC_STATUSES.map((st) => (
                            <button
                              key={st.key}
                              type="button"
                              title={st.label}
                              onClick={() => save({ ...r, status: st.key })}
                              className={`rounded-md px-2 py-1 text-[11px] font-bold transition ${
                                r.status === st.key ? "ring-2 ring-offset-1" : "opacity-45 hover:opacity-100"
                              }`}
                              style={{
                                background: st.bg,
                                color: st.color,
                                ...(r.status === st.key ? { boxShadow: `0 0 0 2px ${st.color}` } : {}),
                              }}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>

                        {/* Çözülen soru */}
                        <input
                          type="number"
                          min={0}
                          defaultValue={r.solved_count}
                          onBlur={(e) => {
                            const v = parseInt(e.target.value || "0", 10);
                            if (v !== r.solved_count) save({ ...r, solved_count: Number.isFinite(v) ? v : 0 });
                          }}
                          title="Çözülen soru sayısı"
                          className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none focus:border-[#0E8FA3]"
                          placeholder="soru"
                        />

                        {/* Kaynak */}
                        <input
                          type="text"
                          defaultValue={r.resources ?? ""}
                          onBlur={(e) => {
                            const v = e.target.value.trim();
                            if (v !== (r.resources ?? "")) save({ ...r, resources: v });
                          }}
                          title="Kullanılan kaynak"
                          className="w-36 rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none focus:border-[#0E8FA3]"
                          placeholder="kaynak"
                        />

                        <span className="w-4 text-xs text-[#0E8FA3]">{savingKey === k ? "•" : ""}</span>
                        <span className="sr-only">{meta.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

/** AI Analiz'in serbest metin konu adlarıyla müfredatı eşleştirmek için sadeleştirme */
export function normalizeTopic(s: string) {
  return s
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]/g, (c) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[c] ?? c)
    .replace(/[^a-z0-9]/g, "");
}
