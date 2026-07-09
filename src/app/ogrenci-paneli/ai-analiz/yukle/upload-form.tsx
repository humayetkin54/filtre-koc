"use client";

import { useState, useTransition } from "react";
import { analyzeExamScan } from "../actions";

const EXAM_TYPES = [
  { key: "TYT", label: "TYT" },
  { key: "SAY", label: "AYT Sayısal (SAY)" },
  { key: "EA", label: "AYT Eşit Ağırlık (EA)" },
  { key: "SOZ", label: "AYT Sözel (SÖZ)" },
  { key: "DIL", label: "YDT Dil (DİL)" },
];

export function UploadForm() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
    setError(null);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await analyzeExamScan(formData);
      if (result?.error) setError(result.error);
      // Başarılıysa action redirect eder
    });
  }

  return (
    <form action={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sınav Türü</label>
          <select name="exam_name" required className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]">
            {EXAM_TYPES.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sınav Tarihi</label>
          <input type="date" name="exam_date" required className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Kitapçık Fotoğrafları <span className="font-normal text-gray-400">(en fazla 15 adet)</span>
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition hover:border-[#0E8FA3] hover:bg-[#eef9f9]">
          <span className="text-3xl">📷</span>
          <span className="text-sm font-semibold text-gray-600">Fotoğraf seç veya çek</span>
          <span className="text-xs text-gray-400">JPG / PNG — her biri en fazla 8MB</span>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            required
            onChange={handleFiles}
            className="hidden"
          />
        </label>
      </div>

      {previews.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">{previews.length} fotoğraf seçildi:</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`Sayfa ${i + 1}`} className="aspect-[3/4] w-full rounded-lg border border-gray-200 object-cover" />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-[#0E8FA3] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0c7689] disabled:opacity-60"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            Yapay zekâ analiz ediyor... (30-60 sn sürebilir)
          </span>
        ) : (
          "🤖 Soruları Çek ve Analiz Et"
        )}
      </button>
    </form>
  );
}
