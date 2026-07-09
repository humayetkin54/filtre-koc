"use client";

import { useState, useTransition } from "react";
import { analyzeExamScan } from "../actions";

const MAX_PHOTOS = 41;

const EXAM_TYPES = [
  { key: "TYT", label: "TYT" },
  { key: "SAY", label: "AYT Sayısal (SAY)" },
  { key: "EA", label: "AYT Eşit Ağırlık (EA)" },
  { key: "SOZ", label: "AYT Sözel (SÖZ)" },
  { key: "DIL", label: "YDT Dil (DİL)" },
];

// Fotoğrafı tarayıcıda küçült — 41 sayfa yüklenebilsin diye
async function compressImage(file: File, maxDim = 1400, quality = 0.72): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob((b) => res(b), "image/jpeg", quality)
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // sıkıştırma başarısızsa orijinali kullan
  }
}

export function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "compress" | "analyze">("idle");
  const [isPending, startTransition] = useTransition();

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length > MAX_PHOTOS) {
      setError(`En fazla ${MAX_PHOTOS} fotoğraf yükleyebilirsin (${selected.length} seçtin).`);
      return;
    }
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
    setError(null);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      if (files.length === 0) {
        setError("En az 1 fotoğraf seç.");
        return;
      }

      // 1) Fotoğrafları sıkıştır
      setPhase("compress");
      const compressed: File[] = [];
      for (const f of files) {
        compressed.push(await compressImage(f));
      }

      const totalMB = compressed.reduce((a, f) => a + f.size, 0) / (1024 * 1024);
      if (totalMB > 18) {
        setPhase("idle");
        setError(`Fotoğrafların toplam boyutu çok büyük (${totalMB.toFixed(0)}MB). Daha az sayfayla deneyin veya iki ayrı analiz yapın.`);
        return;
      }

      // 2) Sıkıştırılmış dosyalarla gönder
      setPhase("analyze");
      const fd = new FormData();
      fd.set("exam_name", formData.get("exam_name") as string);
      fd.set("exam_date", formData.get("exam_date") as string);
      for (const f of compressed) fd.append("photos", f);

      const result = await analyzeExamScan(fd);
      setPhase("idle");
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
          Kitapçık Fotoğrafları <span className="font-normal text-gray-400">(en fazla {MAX_PHOTOS} sayfa)</span>
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition hover:border-[#0E8FA3] hover:bg-[#eef9f9]">
          <span className="text-3xl">📷</span>
          <span className="text-sm font-semibold text-gray-600">Fotoğraf seç veya çek</span>
          <span className="text-xs text-gray-400">JPG / PNG — fotoğraflar otomatik sıkıştırılır</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </label>
      </div>

      {previews.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">{previews.length} sayfa seçildi:</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
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
            {phase === "compress" ? "Fotoğraflar hazırlanıyor..." : "Yapay zekâ analiz ediyor... (1-2 dk sürebilir)"}
          </span>
        ) : (
          "🤖 Soruları Çek ve Analiz Et"
        )}
      </button>
    </form>
  );
}
