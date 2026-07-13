"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { PASSAGES, wordCount, type Passage } from "./passages";

// ---- localStorage ilerleme ----
const LS_KEY = "rekorzeka_wpm_history";
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

type Tab = "test" | "takistoskop" | "gelisim";

export function HizliOkumaClient() {
  const [tab, setTab] = useState<Tab>("test");

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
          { id: "test", label: "Okuma Hızı Testi", icon: "⏱️" },
          { id: "takistoskop", label: "Takistoskop Egzersizi", icon: "👁️" },
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

      {tab === "test" && <ReadingTest />}
      {tab === "takistoskop" && <Takistoskop />}
      {tab === "gelisim" && <Gelisim />}
    </div>
  );
}

// ==================== OKUMA HIZI TESTİ ====================
type Phase = "select" | "reading" | "questions" | "result";

function ReadingTest() {
  const [phase, setPhase] = useState<Phase>("select");
  const [passage, setPassage] = useState<Passage | null>(null);
  const [startTs, setStartTs] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

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
    setPhase("reading");
  }
  function finishReading() {
    setElapsed(Date.now() - startTs);
    setPhase("questions");
  }
  function submit() {
    if (passage) {
      saveResult({
        date: new Date().toISOString(),
        wpm,
        comprehension,
        effectiveWpm,
        title: passage.title,
      });
    }
    setPhase("result");
  }
  function reset() {
    setPhase("select");
    setPassage(null);
    setElapsed(0);
  }

  // Metin seçimi
  if (phase === "select") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {PASSAGES.map((p) => {
          const w = wordCount(p.text);
          const levelColor =
            p.level === "Kolay" ? "text-emerald-600 bg-emerald-50"
            : p.level === "Orta" ? "text-amber-600 bg-amber-50"
            : "text-rose-600 bg-rose-50";
          return (
            <button
              key={p.id}
              onClick={() => start(p)}
              className="group rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-[#0E8FA3] hover:shadow-lg"
            >
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${levelColor}`}>
                {p.level}
              </span>
              <h3 className="mt-3 font-bold text-gray-900 group-hover:text-[#0E8FA3]">{p.title}</h3>
              <p className="mt-1 text-xs text-gray-400">{w} kelime · {p.questions.length} anlama sorusu</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[#0E8FA3]">Teste başla →</span>
            </button>
          );
        })}
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
function Takistoskop() {
  const [passage, setPassage] = useState<Passage>(PASSAGES[0]);
  const [chunkSize, setChunkSize] = useState(1);
  const [wpm, setWpm] = useState(300);
  const [running, setRunning] = useState(false);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chunks = useMemo(() => {
    const w = passage.text.trim().split(/\s+/).filter(Boolean);
    const out: string[] = [];
    for (let i = 0; i < w.length; i += chunkSize) {
      out.push(w.slice(i, i + chunkSize).join(" "));
    }
    return out;
  }, [passage, chunkSize]);

  useEffect(() => {
    if (!running) return;
    if (index >= chunks.length) {
      setRunning(false);
      return;
    }
    const msPerChunk = (60000 / wpm) * chunkSize;
    timerRef.current = setTimeout(() => setIndex((i) => i + 1), msPerChunk);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [running, index, chunks.length, wpm, chunkSize]);

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

// ==================== GELİŞİMİM ====================
function Gelisim() {
  const [history, setHistory] = useState<Result[]>([]);
  useEffect(() => setHistory(loadHistory()), []);

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
