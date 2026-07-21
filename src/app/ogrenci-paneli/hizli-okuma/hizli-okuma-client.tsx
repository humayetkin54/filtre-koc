"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { PASSAGES, wordCount, type Passage } from "./passages";
import { BADGES, type ExerciseKind, type ExerciseStats } from "./badges";
import { saveReadingSession, backfillReadingSessions, logReadingExercise } from "./actions";

// ---- localStorage ilerleme (DB'nin çevrimdışı yedeği) ----
const LS_KEY = "rekorzeka_wpm_history";
const BACKFILL_FLAG = "rekorzeka_wpm_backfilled";

// Ölçüm geçerliliği: bu hızın üstü fiziksel olarak okuma değil, atlama sayılır.
const MAX_CREDIBLE_WPM = 900;

type Result = { date: string; wpm: number; comprehension: number; effectiveWpm: number; title: string };

function loadHistory(): Result[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveResult(r: Result) {
  const list = loadHistory();
  list.push(r);
  localStorage.setItem(LS_KEY, JSON.stringify(list.slice(-50)));
}

// DB + localStorage geçmişini tarihe göre birleştirir (aynı kayıt iki kez sayılmaz).
function mergeHistory(a: Result[], b: Result[]): Result[] {
  const byDate = new Map<string, Result>();
  for (const r of [...a, ...b]) byDate.set(new Date(r.date).toISOString(), r);
  return [...byDate.values()].sort((x, y) => +new Date(x.date) - +new Date(y.date));
}

// ---- egzersiz sayaçları (rozetler için) ----
const STATS_KEY = "rekorzeka_exercise_stats";
const EMPTY_STATS: ExerciseStats = { takistoskop: 0, golgeleme: 0, blok: 0, schulte: 0 };

function loadStats(): ExerciseStats {
  if (typeof window === "undefined") return { ...EMPTY_STATS };
  try {
    return { ...EMPTY_STATS, ...JSON.parse(localStorage.getItem(STATS_KEY) || "{}") };
  } catch {
    return { ...EMPTY_STATS };
  }
}
function bumpExercise(kind: ExerciseKind, value?: number) {
  const s = loadStats();
  s[kind] += 1;
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
  // Koç panelinde görünmesi için kalıcı kayıt (hata olursa yerel sayaç yine de artmış olur)
  void logReadingExercise(kind, value).catch(() => {});
}

type Tab = "ozet" | "test" | "takistoskop" | "golgeleme" | "blok" | "gozacisi" | "gelisim";

export type WeeklyCounts = { test: number; takistoskop: number; pacer: number; schulte: number };

export function HizliOkumaClient({
  initialHistory = [],
  weekly = { test: 0, takistoskop: 0, pacer: 0, schulte: 0 },
  schulteBestDb = null,
}: {
  initialHistory?: Result[];
  weekly?: WeeklyCounts;
  schulteBestDb?: number | null;
}) {
  const [tab, setTab] = useState<Tab>("ozet");
  const [history, setHistory] = useState<Result[]>(initialHistory);

  // Mount: yerel geçmişi DB geçmişiyle birleştir, DB'de olmayanları tek seferde yükle.
  useEffect(() => {
    const local = loadHistory();
    const merged = mergeHistory(initialHistory, local);
    setHistory(merged);

    if (localStorage.getItem(BACKFILL_FLAG)) return;
    const known = new Set(initialHistory.map((r) => new Date(r.date).toISOString()));
    const missing = local.filter((r) => !known.has(new Date(r.date).toISOString()));
    localStorage.setItem(BACKFILL_FLAG, "1");
    if (missing.length) void backfillReadingSessions(missing).catch(() => {});
    // initialHistory sunucudan bir kez gelir; yalnızca mount'ta çalışsın.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addResult = useCallback((r: Result) => {
    setHistory((h) => mergeHistory(h, [r]));
  }, []);

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hızlı Okuma</h1>
        <p className="mt-1 text-sm text-gray-500">
          Okuma hızını ölç, göz egzersizleriyle geliştir. Sınavda paragraf sorularında kazandığın süre = fazladan çözülen soru.
        </p>
      </div>

      {/* Sekmeler */}
      <div className="flex flex-wrap gap-2">
        {([
          { id: "ozet", label: "Özet", icon: "🏠" },
          { id: "test", label: "Okuma Hızı Testi", icon: "⏱️" },
          { id: "takistoskop", label: "Takistoskop", icon: "👁️" },
          { id: "golgeleme", label: "Gölgeleme (Pacer)", icon: "🎯" },
          { id: "blok", label: "Blok Okuma", icon: "🔲" },
          { id: "gozacisi", label: "Göz Açısı", icon: "🔢" },
          { id: "gelisim", label: "Gelişimim", icon: "📈" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-[#0E8FA3] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span className="mr-1.5">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ozet" && <Dashboard goTo={setTab} history={history} weekly={weekly} schulteBestDb={schulteBestDb} />}
      {tab === "test" && <ReadingTest onSaved={addResult} />}
      {tab === "takistoskop" && <Takistoskop />}
      {tab === "golgeleme" && (
        <PacerReader
          title="Gölgeleme & Ritmik Göz"
          desc="Metnin üzerinde kayan vurguyu gözünle takip et. Geri dönmeden, sabit bir ritimde ilerlemek gözünü eğitir ve gereksiz geri sıçramaları azaltır. Vurgu hızını rahat takip edebildiğin en üst seviyeye çek."
          minWindow={1}
          maxWindow={2}
          defaultWindow={1}
          kind="golgeleme"
        />
      )}
      {tab === "blok" && (
        <PacerReader
          title="Blok Okuma"
          desc="Kelimeleri tek tek değil, 2-3'lü bloklar hâlinde algıla. Vurgulanan blok bir çırpıda kavranmalı — bu, gözünün bir bakışta daha fazla kelime görmesini sağlar ve okuma hızını katlar."
          minWindow={2}
          maxWindow={4}
          defaultWindow={3}
          kind="blok"
        />
      )}
      {tab === "gozacisi" && <SchulteTable initialBest={schulteBestDb} />}
      {tab === "gelisim" && <Gelisim history={history} />}
    </div>
  );
}

// ==================== ÖZET (DASHBOARD) ====================
const EXERCISE_META: { kind: ExerciseKind; icon: string; label: string }[] = [
  { kind: "takistoskop", icon: "👁️", label: "Takistoskop" },
  { kind: "golgeleme", icon: "🎯", label: "Gölgeleme" },
  { kind: "blok", icon: "🔲", label: "Blok Okuma" },
  { kind: "schulte", icon: "🔢", label: "Göz Açısı (Schulte)" },
];

// Haftalık program hedefleri — sabit, öğrenciye net bir ritim verir.
const WEEKLY_PLAN: { key: keyof WeeklyCounts; label: string; icon: string; target: number; tab: Tab }[] = [
  { key: "test", label: "Okuma hızı testi", icon: "⏱️", target: 2, tab: "test" },
  { key: "takistoskop", label: "Takistoskop turu", icon: "👁️", target: 3, tab: "takistoskop" },
  { key: "pacer", label: "Pacer turu (gölgeleme/blok)", icon: "🎯", target: 3, tab: "golgeleme" },
  { key: "schulte", label: "Göz açısı (Schulte)", icon: "🔢", target: 2, tab: "gozacisi" },
];

function Dashboard({
  goTo, history, weekly, schulteBestDb,
}: { goTo: (t: Tab) => void; history: Result[]; weekly: WeeklyCounts; schulteBestDb: number | null }) {
  const [stats, setStats] = useState<ExerciseStats>({ takistoskop: 0, golgeleme: 0, blok: 0, schulte: 0 });
  const [schulteBest, setSchulteBest] = useState<number | null>(schulteBestDb);
  const [showAllBadges, setShowAllBadges] = useState(false);

  useEffect(() => {
    setStats(loadStats());
    const b = localStorage.getItem(SCHULTE_KEY);
    const local = b ? Number(b) : null;
    const vals = [schulteBestDb, local].filter((v): v is number => v != null);
    if (vals.length) setSchulteBest(Math.min(...vals));
  }, [schulteBestDb]);

  // Haftalık hedef ilerlemesi
  const weekDone = WEEKLY_PLAN.reduce((a, p) => a + Math.min(weekly[p.key], p.target), 0);
  const weekTotal = WEEKLY_PLAN.reduce((a, p) => a + p.target, 0);
  const weekPct = Math.round((weekDone / weekTotal) * 100);

  const badgeInput = { history, stats, schulteBest };
  const earned = BADGES.filter((b) => b.earned(badgeInput));
  const totalTur = stats.takistoskop + stats.golgeleme + stats.blok + stats.schulte;

  const actions: { tab: Tab; icon: string; label: string }[] = [
    { tab: "test", icon: "⚡", label: "Hız Testi" },
    { tab: "takistoskop", icon: "👁️", label: "Takistoskop" },
    { tab: "golgeleme", icon: "🎯", label: "Gölgeleme" },
    { tab: "blok", icon: "🔲", label: "Blok Okuma" },
    { tab: "gozacisi", icon: "🔢", label: "Göz Açısı" },
    { tab: "gelisim", icon: "📈", label: "Gelişimim" },
  ];

  // Rozet şeridi: kazanılanlar önde, 6 tane göster
  const strip = [...BADGES].sort((a, b) => Number(b.earned(badgeInput)) - Number(a.earned(badgeInput))).slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sol sütun */}
        <div className="space-y-4 lg:col-span-2">
          {/* Bu Haftaki Hedefin */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">Bu Haftaki Hedefin</h2>
                <p className="mt-0.5 text-sm text-gray-400">Düzenli tekrar, hızlı okumanın tek sırrı. Küçük ama sürekli.</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#0E8FA3]">{weekPct}%</span>
                <p className="text-[11px] text-gray-400">{weekDone}/{weekTotal} hedef</p>
              </div>
            </div>
            {weekPct >= 100 && (
              <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                🎉 Bu haftanın hedefini tamamladın! Ritmi bozma.
              </div>
            )}
            <div className="mt-4 space-y-3">
              {WEEKLY_PLAN.map((p) => {
                const done = Math.min(weekly[p.key], p.target);
                const pct = Math.round((done / p.target) * 100);
                const full = done >= p.target;
                return (
                  <button key={p.key} onClick={() => goTo(p.tab)} className="block w-full text-left">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-700">
                        <span className="mr-1.5">{p.icon}</span>{p.label}
                      </span>
                      <span className={full ? "font-bold text-emerald-600" : "font-semibold text-gray-500"}>
                        {full ? "✓ " : ""}{done}/{p.target}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all ${full ? "bg-emerald-500" : "bg-[#0E8FA3]"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* İlerleme Özeti */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="font-bold text-gray-900">İlerleme Özeti</h2>
            <p className="mt-0.5 text-sm text-gray-400">Son 5 hız testi sonucunun özeti.</p>
            <div className="mt-4">
              {history.length === 0 ? (
                <div className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center">
                  <span className="text-3xl">📊</span>
                  <p className="mt-2 text-sm font-semibold text-gray-500">Henüz test sonucun yok</p>
                  <p className="text-xs text-gray-400">İlk hız testini çöz, grafiğin burada oluşsun.</p>
                </div>
              ) : (
                <ProgressChart data={history.slice(-5)} />
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => goTo("test")} className="rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c7d8f]">
                ⚡ Hız Testi Yap
              </button>
              <button onClick={() => goTo("gelisim")} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                🕐 Son Sonuçlar
              </button>
            </div>
          </div>

          {/* Egzersiz İlerlemen */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="font-bold text-gray-900">Egzersiz İlerlemen</h2>
            <p className="mt-0.5 text-sm text-gray-400">Egzersiz başına tamamladığın tur sayısı.</p>
            {totalTur === 0 ? (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#123A57] text-white">✏️</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Henüz egzersiz tamamlamadın</p>
                  <p className="text-xs text-gray-400">Hızlı Aksiyonlar&apos;dan bir egzersiz seçip başla.</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {EXERCISE_META.map((e) => (
                  <div key={e.kind} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                    <span className="text-sm font-semibold text-gray-700">
                      <span className="mr-2">{e.icon}</span>{e.label}
                    </span>
                    <span className="text-sm font-bold text-[#0E8FA3]">
                      {stats[e.kind]} tur
                      {e.kind === "schulte" && schulteBest != null && (
                        <span className="ml-1 font-medium text-gray-400">· en iyi {schulteBest.toFixed(1)}s</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sağ sütun */}
        <div className="space-y-4">
          {/* Hızlı Aksiyonlar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="font-bold text-gray-900">Hızlı Aksiyonlar</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {actions.map((a) => (
                <button
                  key={a.tab}
                  onClick={() => goTo(a.tab)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-left text-xs font-semibold text-gray-600 transition hover:border-[#0E8FA3] hover:text-[#0E8FA3]"
                >
                  <span className="text-base">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rozetlerim */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Rozetlerim</h2>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
                🏆 {earned.length}/{BADGES.length}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-400">Kazandığın başarı rozetleri burada sergilenir.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {strip.map((b) => {
                const has = b.earned(badgeInput);
                return (
                  <span
                    key={b.id}
                    title={`${b.title} — ${b.desc}`}
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ${
                      has ? "bg-amber-50 ring-2 ring-amber-300" : "bg-gray-100 opacity-40 grayscale"
                    }`}
                  >
                    {b.icon}
                  </span>
                );
              })}
            </div>
            <button
              onClick={() => setShowAllBadges((v) => !v)}
              className="mt-4 w-full rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              🏅 {showAllBadges ? "Rozetleri Gizle" : "Tüm Rozetleri Gör"}
            </button>
          </div>
        </div>
      </div>

      {/* Tüm rozetler */}
      {showAllBadges && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="font-bold text-gray-900">Tüm Rozetler</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BADGES.map((b) => {
              const has = b.earned(badgeInput);
              return (
                <div
                  key={b.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                    has ? "border-amber-200 bg-amber-50/60" : "border-gray-100 bg-gray-50/50"
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${has ? "bg-amber-100" : "bg-gray-100 opacity-40 grayscale"}`}>
                    {b.icon}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold ${has ? "text-amber-700" : "text-gray-500"}`}>
                      {b.title} {has && "✓"}
                    </p>
                    <p className="text-xs text-gray-400">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Son 5 test grafiği: WPM (teal, sol eksen) + Anlama % (turuncu, sağ eksen)
function ProgressChart({ data }: { data: Result[] }) {
  const w = 560, h = 190, padL = 40, padR = 40, padT = 16, padB = 30;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const maxWpm = Math.max(100, Math.ceil(Math.max(...data.map((d) => d.wpm)) * 1.15 / 50) * 50);
  const denom = Math.max(data.length - 1, 1);
  const x = (i: number) => (data.length === 1 ? padL + innerW / 2 : padL + (i * innerW) / denom);
  const yW = (v: number) => padT + (1 - v / maxWpm) * innerH;
  const yC = (v: number) => padT + (1 - v / 100) * innerH;

  const wpmPts = data.map((d, i) => `${x(i)},${yW(d.wpm)}`).join(" ");
  const compPts = data.map((d, i) => `${x(i)},${yC(d.comprehension)}`).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* yatay kılavuz çizgileri */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={padL} x2={w - padR} y1={padT + innerH * (1 - f)} y2={padT + innerH * (1 - f)} stroke="#f1f5f9" strokeWidth={1} />
        ))}
        {/* eksen etiketleri */}
        <text x={8} y={padT + 4} fontSize={10} fill="#94a3b8">{maxWpm}</text>
        <text x={8} y={padT + innerH + 4} fontSize={10} fill="#94a3b8">0</text>
        <text x={w - padR + 6} y={padT + 4} fontSize={10} fill="#fdba74">100</text>
        <text x={w - padR + 6} y={padT + innerH + 4} fontSize={10} fill="#fdba74">0</text>
        {/* çizgiler */}
        {data.length > 1 && <polyline points={wpmPts} fill="none" stroke="#0E8FA3" strokeWidth={2.5} strokeLinejoin="round" />}
        {data.length > 1 && <polyline points={compPts} fill="none" stroke="#E2600F" strokeWidth={2} strokeDasharray="5 4" strokeLinejoin="round" />}
        {/* noktalar + WPM etiketleri + tarih */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={yW(d.wpm)} r={4} fill="#0E8FA3" />
            <circle cx={x(i)} cy={yC(d.comprehension)} r={3.5} fill="#E2600F" />
            <text x={x(i)} y={yW(d.wpm) - 8} fontSize={10} fontWeight={700} fill="#0E8FA3" textAnchor="middle">{d.wpm}</text>
            <text x={x(i)} y={h - 8} fontSize={9} fill="#94a3b8" textAnchor="middle">
              {new Date(d.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" })}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex justify-center gap-5 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#0E8FA3]" /> WPM</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#E2600F]" /> Anlama %</span>
      </div>
    </div>
  );
}

// ==================== OKUMA HIZI TESTİ ====================
type Phase = "select" | "reading" | "questions" | "result";

// Okunan metinleri hatırla — aynı metni tekrar vermek ölçümü geçersiz kılar.
const SEEN_KEY = "rekorzeka_seen_passages";
function loadSeen(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    return [];
  }
}
function markSeen(id: string) {
  const seen = loadSeen();
  if (!seen.includes(id)) localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, id]));
}

// Seviyeden rastgele metin seç; önce hiç okunmamışlardan ver, hepsi bittiyse havuzu sıfırla.
function pickPassage(level: Passage["level"]): Passage {
  const pool = PASSAGES.filter((p) => p.level === level);
  const seen = loadSeen();
  const fresh = pool.filter((p) => !seen.includes(p.id));
  const from = fresh.length > 0 ? fresh : pool;
  if (fresh.length === 0) {
    // Bu seviyedeki tüm metinler okunmuş → seviyeyi listeden düşür
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen.filter((id) => !pool.some((p) => p.id === id))));
  }
  return from[Math.floor(Math.random() * from.length)];
}

function ReadingTest({ onSaved }: { onSaved: (r: Result) => void }) {
  const [phase, setPhase] = useState<Phase>("select");
  const [passage, setPassage] = useState<Passage | null>(null);
  const [startTs, setStartTs] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [tooFast, setTooFast] = useState(false);

  const words = passage ? wordCount(passage.text) : 0;
  const minutes = elapsed / 60000;
  const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
  const correct = passage
    ? answers.filter((a, i) => a === passage.questions[i].correct).length
    : 0;
  const comprehension = passage ? Math.round((correct / passage.questions.length) * 100) : 0;
  const effectiveWpm = Math.round(wpm * (comprehension / 100));

  function start(p: Passage) {
    setPassage(p);
    setAnswers(new Array(p.questions.length).fill(-1));
    setStartTs(Date.now());
    setTooFast(false);
    setPhase("reading");
  }
  function finishReading() {
    const ms = Date.now() - startTs;
    // Geçerlilik kontrolü: 900 WPM üstü = metin okunmadan geçilmiş demektir.
    const minMs = (words / MAX_CREDIBLE_WPM) * 60000;
    if (ms < minMs) {
      setTooFast(true);
      return;
    }
    setElapsed(ms);
    setPhase("questions");
  }
  function submit() {
    if (passage) {
      const r: Result = {
        date: new Date().toISOString(),
        wpm,
        comprehension,
        effectiveWpm,
        title: passage.title,
      };
      saveResult(r); // yerel yedek
      onSaved(r); // grafik/rozetler anında güncellensin
      markSeen(passage.id);
      void saveReadingSession({ ...r, passageId: passage.id }).catch(() => {}); // kalıcı kayıt
    }
    setPhase("result");
  }
  function reset() {
    setPhase("select");
    setPassage(null);
    setElapsed(0);
    setTooFast(false);
  }

  // Seviye seçimi — metin RASTGELE atanır (ezber/tanıdıklık ölçümü bozmasın)
  if (phase === "select") {
    const LEVELS: { level: Passage["level"]; desc: string; color: string; icon: string }[] = [
      { level: "Kolay", desc: "Günlük dille, akıcı metinler", color: "border-emerald-200 hover:border-emerald-400", icon: "🌱" },
      { level: "Orta", desc: "Bilgi yoğunluğu artan metinler", color: "border-amber-200 hover:border-amber-400", icon: "⚡" },
      { level: "İleri", desc: "Yoğun, terimli, uzun metinler", color: "border-rose-200 hover:border-rose-400", icon: "🔥" },
    ];
    return (
      <div>
        <div className="mb-4 rounded-xl bg-[#eef9f9] px-4 py-3 text-sm text-[#0E8FA3]">
          Seviyeni seç — sana <strong>rastgele bir metin</strong> atanır. Böylece hızın gerçek okuma hızını yansıtır, ezberi değil.
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {LEVELS.map((lv) => {
            const count = PASSAGES.filter((p) => p.level === lv.level).length;
            return (
              <button
                key={lv.level}
                onClick={() => start(pickPassage(lv.level))}
                className={`group rounded-2xl border bg-white p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${lv.color}`}
              >
                <div className="text-3xl">{lv.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-gray-900">{lv.level}</h3>
                <p className="mt-1 text-xs text-gray-400">{lv.desc}</p>
                <p className="mt-3 text-[11px] text-gray-400">{count} metin havuzu</p>
                <span className="mt-3 inline-block text-sm font-semibold text-[#0E8FA3]">Rastgele metinle başla →</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Okuma
  if (phase === "reading" && passage) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eef9f9] px-3 py-1 text-xs font-semibold text-[#0E8FA3]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#0E8FA3]" />
            Süre işliyor — okumaya odaklan
          </span>
          <span className="text-xs text-gray-400">{wordCount(passage.text)} kelime</span>
        </div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">{passage.title}</h2>
        <div className="prose-sm max-w-none space-y-4 text-[15px] leading-relaxed text-gray-700">
          {passage.text.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <div className="mt-6 border-t border-gray-100 pt-5">
          <p className="mb-3 text-sm text-gray-500">
            Metni bitirdiğinde butona bas — sonra anlama soruları gelecek.
          </p>
          {tooFast && (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              ⚠️ Çok hızlı geçtin — bu sürede {words} kelime okumak mümkün değil ({MAX_CREDIBLE_WPM}+ WPM). Sonuç
              kaydedilmez. Metni gerçekten okuyup tekrar dene.
            </div>
          )}
          <button
            onClick={finishReading}
            className="rounded-xl bg-[#0E8FA3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0c7d8f]"
          >
            Bitirdim, sorulara geç →
          </button>
        </div>
      </div>
    );
  }

  // Anlama soruları
  if (phase === "questions" && passage) {
    const allAnswered = answers.every((a) => a >= 0);
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-5 rounded-xl bg-[#eef9f9] px-4 py-3 text-sm text-[#0E8FA3]">
          Ham hızın: <strong>{wpm} WPM</strong> ({minutes.toFixed(1)} dk). Şimdi ne kadar anladığını ölçelim.
        </div>
        <div className="space-y-6">
          {passage.questions.map((q, qi) => (
            <div key={qi}>
              <p className="mb-2 font-semibold text-gray-800">
                {qi + 1}. {q.q}
              </p>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => {
                      const next = [...answers];
                      next[qi] = oi;
                      setAnswers(next);
                    }}
                    className={`rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                      answers[qi] === oi
                        ? "border-[#0E8FA3] bg-[#eef9f9] font-semibold text-[#0E8FA3]"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="mt-6 rounded-xl bg-[#0E8FA3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0c7d8f] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sonucu gör →
        </button>
      </div>
    );
  }

  // Sonuç
  if (phase === "result" && passage) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900">Sonucun</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Stat label="Okuma Hızı" value={`${wpm}`} unit="WPM" color="#0E8FA3" />
          <Stat label="Anlama" value={`%${comprehension}`} unit={`${correct}/${passage.questions.length} doğru`} color="#123A57" />
          <Stat label="Etkili Hız" value={`${effectiveWpm}`} unit="WPM (hız × anlama)" color="#E2600F" />
        </div>
        <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
          {feedback(wpm, comprehension)}
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={reset} className="rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c7d8f]">
            Yeni test
          </button>
          <p className="self-center text-xs text-gray-400">Sonucun &quot;Gelişimim&quot; sekmesine kaydedildi.</p>
        </div>
      </div>
    );
  }

  return null;
}

function Stat({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</div>
      <div className="mt-2 text-4xl font-bold" style={{ color }}>{value}</div>
      <div className="mt-1 text-xs text-gray-400">{unit}</div>
    </div>
  );
}

function feedback(wpm: number, comp: number): string {
  if (comp < 60) return "Anlama oranın düşük — hızı biraz azaltıp kavramaya odaklan. Hız, ancak anladığın sürece işe yarar.";
  if (wpm < 200) return "Ortalama bir okuma hızındasın. Takistoskop egzersiziyle iç seslendirmeyi azaltarak hızını yükseltebilirsin.";
  if (wpm < 350) return "İyi bir hızdasın ve anlama oranın da güçlü. Düzenli egzersizle 400+ WPM hedefleyebilirsin.";
  return "Mükemmel! Hem hızlı hem de doğru anlıyorsun. Bu seviyeyi korumak için düzenli pratik yap.";
}

// ==================== TAKİSTOSKOP ====================
// Gerçek saat tabanlı ilerleme — setTimeout zincirinin biriktirdiği hız kaymasını önler.
// index'i geçen gerçek süreye göre yeniden hesaplar; sekme arka plandayken bile hız sabit kalır.
function usePacedIndex(
  running: boolean,
  unitsPerMinute: number,
  total: number,
  onDone: () => void
) {
  const [index, setIndex] = useState(0);
  const rafRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  indexRef.current = index;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!running || unitsPerMinute <= 0) return;
    const start = performance.now();
    const base = indexRef.current;
    let active = true;
    const loop = (t: number) => {
      if (!active) return;
      const next = base + Math.floor(((t - start) / 60000) * unitsPerMinute);
      if (next >= total) {
        setIndex(total);
        onDoneRef.current();
        return;
      }
      if (next !== indexRef.current) setIndex(next);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, unitsPerMinute, total]);

  return [index, setIndex] as const;
}

function Takistoskop() {
  const [passage, setPassage] = useState<Passage>(PASSAGES[0]);
  const [chunkSize, setChunkSize] = useState(1);
  const [wpm, setWpm] = useState(300);
  const [running, setRunning] = useState(false);

  const chunks = useMemo(() => {
    const w = passage.text.trim().split(/\s+/).filter(Boolean);
    const out: string[] = [];
    for (let i = 0; i < w.length; i += chunkSize) {
      out.push(w.slice(i, i + chunkSize).join(" "));
    }
    return out;
  }, [passage, chunkSize]);

  // chunkSize kelimelik bloklar → dakikadaki blok sayısı = wpm / chunkSize
  const [index, setIndex] = usePacedIndex(running, wpm / chunkSize, chunks.length, () => {
    setRunning(false);
    bumpExercise("takistoskop"); // tur bitti → rozet sayacı
  });

  function startPause() {
    if (index >= chunks.length) setIndex(0);
    setRunning((r) => !r);
  }
  function restart() {
    setRunning(false);
    setIndex(0);
  }

  const done = index >= chunks.length;
  const progress = chunks.length ? Math.min(100, Math.round((index / chunks.length) * 100)) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
        <p>
          <strong className="text-gray-800">Takistoskop</strong> kelimeleri tek tek (ya da gruplar hâlinde) ekranda flaşlar.
          Gözünü sabit tutup kelimeleri iç sesin olmadan yakalamaya çalış — bu, okuma hızını sınırlayan iç seslendirmeyi kırar.
          Hızı kaldırabildiğin en üst seviyeye çek.
        </p>
      </div>

      {/* Ekran */}
      <div className="relative flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-900 to-[#123A57]">
        {/* Odak çizgisi */}
        <div className="absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 -translate-y-[calc(50%+2.5rem)] bg-[#E2600F]/50" />
        <span className="px-4 text-center text-3xl font-bold text-white sm:text-4xl">
          {done ? "Bitti 🎉" : running || index > 0 ? chunks[Math.min(index, chunks.length - 1)] : "Hazır mısın?"}
        </span>
        {/* İlerleme */}
        <div className="absolute bottom-0 left-0 h-1 bg-[#0E8FA3] transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Kontroller */}
      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            Hız: <span className="text-[#0E8FA3]">{wpm} WPM</span>
          </label>
          <input
            type="range" min={100} max={700} step={25} value={wpm}
            onChange={(e) => setWpm(Number(e.target.value))}
            className="w-full accent-[#0E8FA3]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Kelime grubu</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => { setChunkSize(n); restart(); }}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  chunkSize === n ? "bg-[#0E8FA3] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {n}&apos;li
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-gray-500">Metin</label>
          <select
            value={passage.id}
            onChange={(e) => { const p = PASSAGES.find((x) => x.id === e.target.value)!; setPassage(p); restart(); }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
          >
            {PASSAGES.map((p) => (
              <option key={p.id} value={p.id}>{p.title} ({wordCount(p.text)} kelime)</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <button
            onClick={startPause}
            className="flex-1 rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c7d8f]"
          >
            {running ? "⏸ Duraklat" : done ? "↻ Baştan" : index > 0 ? "▶ Devam" : "▶ Başlat"}
          </button>
          <button
            onClick={restart}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== GÖLGELEME / BLOK OKUMA (PACER) ====================
function PacerReader({
  title, desc, minWindow, maxWindow, defaultWindow, kind,
}: { title: string; desc: string; minWindow: number; maxWindow: number; defaultWindow: number; kind: ExerciseKind }) {
  const [passage, setPassage] = useState<Passage>(PASSAGES[0]);
  const [windowSize, setWindowSize] = useState(defaultWindow);
  const [wpm, setWpm] = useState(250);
  const [running, setRunning] = useState(false);

  const words = useMemo(() => passage.text.trim().split(/\s+/).filter(Boolean), [passage]);

  // Vurgu bloğu her kelimede bir kayar; öncü kenar wpm hızında ilerler (kesintisiz akış).
  const [index, setIndex] = usePacedIndex(running, wpm, words.length, () => {
    setRunning(false);
    bumpExercise(kind); // tur bitti → rozet sayacı
  });

  function startPause() {
    if (index >= words.length) setIndex(0);
    setRunning((r) => !r);
  }
  function restart() { setRunning(false); setIndex(0); }

  const done = index >= words.length;
  const windowOpts: number[] = [];
  for (let n = minWindow; n <= maxWindow; n++) windowOpts.push(n);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
        <strong className="text-gray-800">{title}.</strong> {desc}
      </div>

      {/* Metin + kayan vurgu */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-[17px] leading-[2.3] text-gray-300">
        {words.map((w, i) => {
          const active = !done && i >= index && i < index + windowSize;
          return (
            <span key={i} className={active ? "rounded bg-[#0E8FA3] px-1 py-0.5 font-medium text-white" : ""}>
              {w}{" "}
            </span>
          );
        })}
      </div>

      {/* Kontroller */}
      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">
            Hız: <span className="text-[#0E8FA3]">{wpm} WPM</span>
          </label>
          <input
            type="range" min={100} max={600} step={25} value={wpm}
            onChange={(e) => setWpm(Number(e.target.value))}
            className="w-full accent-[#0E8FA3]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Blok boyutu (kelime)</label>
          <div className="flex gap-2">
            {windowOpts.map((n) => (
              <button
                key={n}
                onClick={() => { setWindowSize(n); restart(); }}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  windowSize === n ? "bg-[#0E8FA3] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-gray-500">Metin</label>
          <select
            value={passage.id}
            onChange={(e) => { const p = PASSAGES.find((x) => x.id === e.target.value)!; setPassage(p); restart(); }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
          >
            {PASSAGES.map((p) => (
              <option key={p.id} value={p.id}>{p.title} ({wordCount(p.text)} kelime)</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <button onClick={startPause} className="flex-1 rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c7d8f]">
            {running ? "⏸ Duraklat" : done ? "↻ Baştan" : index > 0 ? "▶ Devam" : "▶ Başlat"}
          </button>
          <button onClick={restart} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== GÖZ AÇISI (SCHULTE TABLOSU) ====================
const SCHULTE_KEY = "rekorzeka_schulte_best";

function SchulteTable({ initialBest = null }: { initialBest?: number | null }) {
  const [grid, setGrid] = useState<number[]>([]);
  const [next, setNext] = useState(1);
  const [running, setRunning] = useState(false);
  const [startTs, setStartTs] = useState(0);
  const [now, setNow] = useState(0);
  const [best, setBest] = useState<number | null>(initialBest);
  const [wrong, setWrong] = useState<number | null>(null);

  useEffect(() => {
    // DB'den gelen en iyi süre ile localStorage'ı karşılaştır, küçüğü tut
    const b = localStorage.getItem(SCHULTE_KEY);
    const local = b ? Number(b) : null;
    setBest((cur) => {
      const vals = [cur, local].filter((v): v is number => v != null);
      return vals.length ? Math.min(...vals) : null;
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [running]);

  function start() {
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    setGrid(nums);
    setNext(1);
    setStartTs(Date.now());
    setNow(Date.now());
    setRunning(true);
  }

  function click(n: number) {
    if (!running) return;
    if (n === next) {
      if (n === 25) {
        const elapsed = (Date.now() - startTs) / 1000;
        setRunning(false);
        setNext(26);
        bumpExercise("schulte", Math.round(elapsed * 1000)); // tablo bitti → rozet + DB'ye süre (ms)
        if (best === null || elapsed < best) {
          setBest(elapsed);
          localStorage.setItem(SCHULTE_KEY, String(elapsed));
        }
      } else {
        setNext((v) => v + 1);
      }
    } else {
      setWrong(n);
      setTimeout(() => setWrong(null), 300);
    }
  }

  const elapsed = running ? (now - startTs) / 1000 : 0;
  const finished = next === 26;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
        <strong className="text-gray-800">Göz Açısı (Çevresel Görüş).</strong> Ortadaki turuncu noktaya sabit bak ve sayıları
        <strong> 1&apos;den 25&apos;e kadar sırayla</strong> gözünü fazla oynatmadan bul. Bu egzersiz bir bakışta gördüğün alanı
        (görüş açısını) genişletir — böylece okurken daha az duraklarsın.
      </div>

      {/* Üst bilgi */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="text-sm">
          <span className="text-gray-400">Sıradaki: </span>
          <span className="text-lg font-bold text-[#0E8FA3]">{finished ? "✓" : next}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Süre: </span>
          <span className="font-bold text-gray-800">{elapsed.toFixed(1)}s</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">En iyi: </span>
          <span className="font-bold text-[#E2600F]">{best != null ? `${best.toFixed(1)}s` : "—"}</span>
        </div>
        <button onClick={start} className="ml-auto rounded-xl bg-[#0E8FA3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0c7d8f]">
          {grid.length === 0 ? "▶ Başlat" : "↻ Yeni tablo"}
        </button>
      </div>

      {finished && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Tamamlandı! Süren: {((now - startTs) / 1000 || best || 0).toFixed(1)}s. Düzenli çalışırsan süren kısalır ve görüş açın genişler.
        </div>
      )}

      {/* Tablo */}
      {grid.length > 0 && (
        <div className="relative mx-auto w-fit rounded-2xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-5 gap-2">
            {grid.map((n) => {
              const passed = n < next;
              const isWrong = wrong === n;
              return (
                <button
                  key={n}
                  onClick={() => click(n)}
                  className={`flex h-14 w-14 items-center justify-center rounded-lg text-lg font-bold transition-colors sm:h-16 sm:w-16 ${
                    isWrong ? "bg-rose-500 text-white"
                    : passed ? "bg-[#eef9f9] text-[#0E8FA3]/40"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
          {/* Merkez sabitleme noktası */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E2600F] ring-4 ring-[#E2600F]/20" />
        </div>
      )}

      {grid.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-400">
          &quot;Başlat&quot;a bas — 5×5&apos;lik tablo çıkacak, sayıları sırayla bulmaya çalış.
        </div>
      )}
    </div>
  );
}

// ==================== GELİŞİMİM ====================
function Gelisim({ history }: { history: Result[] }) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <div className="text-4xl">📈</div>
        <p className="mt-3 font-semibold text-gray-700">Henüz test sonucun yok</p>
        <p className="mt-1 text-sm text-gray-400">Okuma Hızı Testi&apos;ni çözünce gelişimin burada grafikleşir.</p>
      </div>
    );
  }

  const best = Math.max(...history.map((h) => h.effectiveWpm));
  const last = history[history.length - 1];
  const first = history[0];
  const improvement = first.effectiveWpm > 0
    ? Math.round(((last.effectiveWpm - first.effectiveWpm) / first.effectiveWpm) * 100)
    : 0;
  const maxWpm = Math.max(...history.map((h) => h.wpm), 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="En İyi Etkili Hız" value={`${best}`} unit="WPM" color="#0E8FA3" />
        <Stat label="Son Test" value={`${last.effectiveWpm}`} unit={`%${last.comprehension} anlama`} color="#123A57" />
        <Stat label="İlk Testten Bu Yana" value={`${improvement >= 0 ? "+" : ""}%${improvement}`} unit="etkili hız değişimi" color="#E2600F" />
      </div>

      {/* Basit çubuk grafik */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="mb-4 text-sm font-semibold text-gray-700">Test geçmişi (ham WPM)</p>
        <div className="flex items-end gap-1.5 overflow-x-auto pb-2" style={{ minHeight: 140 }}>
          {history.slice(-20).map((h, i) => {
            const heightPct = Math.round((h.wpm / maxWpm) * 100);
            return (
              <div key={i} className="flex min-w-[24px] flex-1 flex-col items-center gap-1" title={`${h.wpm} WPM · %${h.comprehension} anlama`}>
                <span className="text-[10px] font-semibold text-gray-400">{h.wpm}</span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-[#0E8FA3] to-[#39b6c7]"
                  style={{ height: `${Math.max(4, heightPct)}px` }}
                />
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-gray-400">Son {Math.min(history.length, 20)} test gösteriliyor. Çubuğun üstüne gelince anlama oranını görürsün.</p>
      </div>
    </div>
  );
}
