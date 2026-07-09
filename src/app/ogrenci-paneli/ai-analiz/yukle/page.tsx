import { UploadForm } from "./upload-form";

// Gemini analizi uzun sürebilir — Vercel fonksiyon süresini artır
export const maxDuration = 60;

export default function YuklePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">📸 Deneme Sınavı Sorularını Çek</h1>
        <p className="text-sm text-gray-500">
          Kitapçığında doğru yaptığın soruların yanına <span className="font-bold text-emerald-600">+</span>,
          yanlış yaptıklarının yanına <span className="font-bold text-red-500">−</span> işareti koy,
          sayfaların fotoğrafını çekip yükle. Yapay zekâ ders ve konu bazlı analiz çıkarsın.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 space-y-1">
        <p className="font-bold">📌 İyi sonuç için ipuçları:</p>
        <p>• Fotoğrafları iyi ışıkta, sayfaya dik açıyla çek</p>
        <p>• + ve − işaretleri soru numarasının yanında net görünsün</p>
        <p>• Bir seferde en fazla 15 fotoğraf yükleyebilirsin</p>
      </div>

      <UploadForm />
    </div>
  );
}
