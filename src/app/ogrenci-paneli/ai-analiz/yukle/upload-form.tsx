"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startExamScan, analyzeScanBatch, finalizeExamScan } from "../actions";

const MAX_PHOTOS = 50;
const MAX_BATCH_BYTES = 2.5 * 1024 * 1024; // Vercel istek limiti 4.5MB — güvenli pay ile 2.5MB
const MAX_BATCH_COUNT = 6; // grup başına ~6 sayfa: daha az istek, RPM baskısı düşük, süre marjı rahat

// Sunucu çağrısı çökerse veya geçici hata dönerse aynı işlemi 3 kez dene
async function callWithRetry<T extends { error?: string }>(
  fn: () => Promise<T>,
  onRetry: (attempt: number) => void,
  attempts = 3
): Promise<T | { error: string }> {
  let lastErr = "Sunucuya ulaşılamadı (zaman aşımı olabilir). İnternetini kontrol edip tekrar dene.";
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fn();
      if (!res?.error) return res;
      lastErr = res.error;
    } catch {
      // istek tamamen düştü (zaman aşımı / ağ) — tekrar dene
    }
    if (i < attempts - 1) {
      onRetry(i + 2);
      await new Promise((r) => setTimeout(r, 3500));
    }
  }
  return { error: lastErr };
}

const EXAM_TYPES = [
  { key: "TYT", label: "TYT" },
  { key: "SAY", label: "AYT Sayısal (SAY)" },
  { key: "EA", label: "AYT Eşit Ağırlık (EA)" },
  { key: "SOZ", label: "AYT Sözel (SÖZ)" },
  { key: "DIL", label: "YDT Dil (DİL)" },
];

// Fotoğrafı tarayıcıda küçült — 50 sayfa yüklenebilsin diye
async function compressOnce(file: File, maxDim: number, quality: number): Promise<File | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob((b) => res(b), "image/jpeg", quality)
    );
    if (!blob) return null;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return null;
  }
}

async function compressImage(file: File): Promise<File> {
  // İlk deneme: 1400px, %70 kalite
  let out = await compressOnce(file, 1400, 0.7);
  // Hâlâ büyükse: 1100px, %55 kalite
  if (out && out.size > 500 * 1024) {
    const smaller = await compressOnce(file, 1100, 0.55);
    if (smaller) out = smaller;
  }
  return out ?? file;
}

// Fotoğrafları hem adet hem toplam boyut sınırına göre grupla
function buildBatches(files: File[]): File[][] {
  const batches: File[][] = [];
  let current: File[] = [];
  let currentSize = 0;
  for (const f of files) {
    if (current.length > 0 && (currentSize + f.size > MAX_BATCH_BYTES || current.length >= MAX_BATCH_COUNT)) {
      batches.push(current);
      current = [];
      currentSize = 0;
    }
    current.push(f);
    currentSize += f.size;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

export function UploadForm() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
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

      const examName = formData.get("exam_name") as string;
      const examDate = formData.get("exam_date") as string;

      // 1) Fotoğrafları sıkıştır
      setProgress("Fotoğraflar hazırlanıyor...");
      const compressed: File[] = [];
      for (const f of files) {
        compressed.push(await compressImage(f));
      }

      // 2) Tarama kaydı başlat
      const start = await callWithRetry(
        () => startExamScan(examName, examDate, compressed.length),
        (n) => setProgress(`Bağlantı sorunu — tekrar deneniyor (${n}/3)...`)
      );
      if ("error" in start || !("id" in start) || !start.id) {
        setProgress(null);
        setError(("error" in start && start.error) || "Kayıt oluşturulamadı.");
        return;
      }

      // 3) Gruplar halinde gönder (Vercel istek limiti nedeniyle — boyuta göre dinamik)
      const tooBig = compressed.find((f) => f.size > MAX_BATCH_BYTES);
      if (tooBig) {
        setProgress(null);
        setError(`"${tooBig.name}" sıkıştırmaya rağmen çok büyük. O sayfayı tekrar, daha uzaktan çekip dene.`);
        return;
      }

      const batches = buildBatches(compressed);
      let donePages = 0;
      for (const chunk of batches) {
        donePages += chunk.length;
        const label = `Sayfalar analiz ediliyor... (${donePages}/${compressed.length})`;
        setProgress(label);

        const fd = new FormData();
        for (const f of chunk) fd.append("photos", f);

        const res = await callWithRetry(
          () => analyzeScanBatch(start.id, fd),
          (n) => setProgress(`${label} — tekrar deneniyor (${n}/3)...`)
        );
        if (res && "error" in res && res.error) {
          setProgress(null);
          setError(res.error);
          return;
        }
      }

      // 4) Analiz özeti + program önerisi üret
      setProgress("Analiz özeti ve program önerisi hazırlanıyor...");
      const fin = await callWithRetry(
        () => finalizeExamScan(start.id),
        (n) => setProgress(`Analiz özeti — tekrar deneniyor (${n}/3)...`)
      );
      setProgress(null);
      if (fin && "error" in fin && fin.error) {
        setError(fin.error);
        return;
      }

      router.push(`/ogrenci-paneli/ai-analiz?scan=${start.id}`);
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
            {progress ?? "İşleniyor..."}
          </span>
        ) : (
          "🤖 Soruları Çek ve Analiz Et"
        )}
      </button>
    </form>
  );
}
