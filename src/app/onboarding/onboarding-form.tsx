"use client";

import { useState } from "react";
import { saveOnboarding } from "./actions";

const DERSLER = ["Matematik", "Türkçe", "Fizik", "Kimya", "Biyoloji", "Tarih", "Coğrafya", "Felsefe", "İngilizce", "Edebiyat"];

const steps = [
  { id: "target", title: "Hedef Üniversite / Bölüm", subtitle: "Hangi üniversiteyi ve bölümü kazanmak istiyorsun?" },
  { id: "nets", title: "Mevcut Netlerin", subtitle: "Yaklaşık TYT ve AYT netlerini paylaş." },
  { id: "months", title: "Sınava Ne Kadar Kaldı?", subtitle: "Hedef sınavına kaç ay kaldı?" },
  { id: "hours", title: "Haftalık Çalışma Süresi", subtitle: "Haftada kaç saat çalışabiliyorsun?" },
  { id: "weak", title: "En Zayıf Dersler", subtitle: "En çok zorlandığın dersleri seç." },
  { id: "coached", title: "Daha Önce Koçluk Aldın mı?", subtitle: "Daha önce özel koç veya danışmanlık desteği aldın mı?" },
  { id: "anxiety", title: "Sınav Kaygısı", subtitle: "Sınav kaygısı yaşıyor musun?" },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/20";

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    target: "",
    tyt_net: "",
    ayt_net: "",
    months: "",
    hours: "",
    weak_subjects: [] as string[],
    coached_before: "",
    anxiety_level: "",
  });
  const [loading, setLoading] = useState(false);

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  function toggleSubject(s: string) {
    setAnswers((a) => ({
      ...a,
      weak_subjects: a.weak_subjects.includes(s)
        ? a.weak_subjects.filter((x) => x !== s)
        : [...a.weak_subjects, s],
    }));
  }

  function canNext() {
    if (current.id === "target") return answers.target.trim().length > 0;
    if (current.id === "nets") return answers.tyt_net.trim().length > 0;
    if (current.id === "months") return answers.months.trim().length > 0;
    if (current.id === "hours") return answers.hours.trim().length > 0;
    if (current.id === "weak") return answers.weak_subjects.length > 0;
    if (current.id === "coached") return answers.coached_before.length > 0;
    if (current.id === "anxiety") return answers.anxiety_level.length > 0;
    return false;
  }

  async function handleSubmit() {
    setLoading(true);
    const fd = new FormData();
    Object.entries(answers).forEach(([k, v]) => {
      fd.append(k, Array.isArray(v) ? v.join(", ") : v);
    });
    await saveOnboarding(fd);
  }

  return (
    <div className="w-full max-w-lg">
      {/* Başlık */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#0E8FA3] shadow-sm mb-4">
          {step + 1} / {steps.length} · Profil Oluşturuluyor
        </div>
        <h1 className="text-2xl font-bold text-[#1e293b]">{current.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{current.subtitle}</p>
      </div>

      {/* İlerleme çubuğu */}
      <div className="mb-8 h-1.5 rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-[#0E8FA3] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Kart */}
      <div className="rounded-2xl bg-white p-8 shadow-sm">

        {current.id === "target" && (
          <input
            type="text"
            placeholder="Örn: Hacettepe Tıp, ODTÜ Bilgisayar Müh."
            className={inputClass}
            value={answers.target}
            onChange={(e) => setAnswers({ ...answers, target: e.target.value })}
            autoFocus
          />
        )}

        {current.id === "nets" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">TYT Net</label>
              <input
                type="number"
                min="0"
                max="120"
                placeholder="Örn: 85"
                className={inputClass}
                value={answers.tyt_net}
                onChange={(e) => setAnswers({ ...answers, tyt_net: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">AYT Net (varsa)</label>
              <input
                type="number"
                min="0"
                max="160"
                placeholder="Örn: 42"
                className={inputClass}
                value={answers.ayt_net}
                onChange={(e) => setAnswers({ ...answers, ayt_net: e.target.value })}
              />
            </div>
          </div>
        )}

        {current.id === "months" && (
          <div className="grid grid-cols-3 gap-3">
            {["1-3 ay", "3-6 ay", "6-9 ay", "9-12 ay", "12+ ay", "Bilmiyorum"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswers({ ...answers, months: opt })}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  answers.months === opt
                    ? "border-[#0E8FA3] bg-[#0E8FA3] text-white"
                    : "border-gray-200 text-gray-700 hover:border-[#0E8FA3]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {current.id === "hours" && (
          <div className="grid grid-cols-2 gap-3">
            {["1-5 saat", "5-10 saat", "10-20 saat", "20-30 saat", "30-40 saat", "40+ saat"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswers({ ...answers, hours: opt })}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  answers.hours === opt
                    ? "border-[#0E8FA3] bg-[#0E8FA3] text-white"
                    : "border-gray-200 text-gray-700 hover:border-[#0E8FA3]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {current.id === "weak" && (
          <div className="flex flex-wrap gap-2">
            {DERSLER.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleSubject(d)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                  answers.weak_subjects.includes(d)
                    ? "border-[#E2600F] bg-[#E2600F] text-white"
                    : "border-gray-200 text-gray-700 hover:border-[#E2600F]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {current.id === "coached" && (
          <div className="grid grid-cols-1 gap-3">
            {["Evet, daha önce aldım", "Hayır, ilk defa deniyorum", "Kısmen (online içerik vb.)"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswers({ ...answers, coached_before: opt })}
                className={`rounded-xl border-2 px-5 py-4 text-sm font-medium text-left transition-all ${
                  answers.coached_before === opt
                    ? "border-[#0E8FA3] bg-[#0E8FA3] text-white"
                    : "border-gray-200 text-gray-700 hover:border-[#0E8FA3]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {current.id === "anxiety" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 mb-4">Bu bilgi PDR uzmanımızın sana uygun destek planlaması yapması için kullanılır.</p>
            {[
              { val: "Yok", desc: "Sınavlarda rahatım, kaygı yaşamıyorum" },
              { val: "Az", desc: "Bazen hissediyorum ama yönetebiliyorum" },
              { val: "Orta", desc: "Performansımı etkiliyor" },
              { val: "Yoğun", desc: "Ciddi anlamda zorlanıyorum, destek lazım" },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setAnswers({ ...answers, anxiety_level: opt.val })}
                className={`w-full rounded-xl border-2 px-5 py-4 text-sm text-left transition-all ${
                  answers.anxiety_level === opt.val
                    ? "border-[#0E8FA3] bg-[#0E8FA3] text-white"
                    : "border-gray-200 hover:border-[#0E8FA3]"
                }`}
              >
                <span className="font-semibold">{opt.val}</span>
                <span className={`block text-xs mt-0.5 ${answers.anxiety_level === opt.val ? "text-white/80" : "text-gray-400"}`}>
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigasyon */}
      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300"
          >
            Geri
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="flex-1 rounded-xl bg-[#0E8FA3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0c7689] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Devam →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canNext() || loading}
            className="flex-1 btn-primary py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Kaydediliyor..." : "Profilimi Oluştur →"}
          </button>
        )}
      </div>
    </div>
  );
}
