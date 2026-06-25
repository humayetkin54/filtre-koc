import { OnGorusmeForm } from "./form";

export default function OnGorusmePage() {
  return (
    <div className="bg-gray-50 px-[5%] py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        {/* SOL — bilgi kartı */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-8">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
              Ücretsiz Ön Görüşme
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              Hedefine ulaşan{" "}
              <span className="text-blue-600 italic">binlerce öğrencinin</span>{" "}
              ilk adımı
            </h1>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Formu birkaç dakikada doldur; danışmanımız seni aynı gün arayıp yol haritanı birlikte çizsin.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["🤝 Ücretsiz görüşme", "⚡ Aynı gün dönüş", "🎯 Kişiye özel plan"].map((b) => (
                <span key={b} className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700">
                  {b}
                </span>
              ))}
            </div>

            <p className="mt-6 text-xs text-gray-400">Rekor Zeka · 2027 YKS</p>
          </div>

          <div className="space-y-3 px-2">
            {[
              "Hedefin ve çalışma tarzın için net bir yol haritası",
              "Uzman danışmanımızla bire bir, samimi bir görüşme",
              "Tamamen ücretsiz — formu gönder, aynı gün seni arayalım",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  ✓
                </span>
                <p className="text-sm text-gray-600">{t}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-blue-600 px-6 py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl">
              📞
            </div>
            <p className="text-sm text-white">
              Talebin alınınca danışmanımız belirttiğin numaradan seni arayacak
            </p>
          </div>
        </div>

        {/* SAĞ — form */}
        <div>
          <OnGorusmeForm />
        </div>
      </div>
    </div>
  );
}
