const plans = [
  {
    name: "Başlangıç",
    price: 1490,
    desc: "Hedefe yeni başlayanlar için temel koçluk desteği.",
    highlight: false,
    features: [
      "Haftada 1 görüşme (45 dk)",
      "Günlük WhatsApp takibi",
      "Haftalık çalışma planı",
      "Deneme analizi (aylık 1)",
      "Max 8 öğrenci garantisi",
    ],
    notIncluded: ["Veli takip paneli", "Öncelikli eşleştirme"],
  },
  {
    name: "Standart",
    price: 2490,
    desc: "En çok tercih edilen paket. Ciddi net artışı isteyenler için.",
    highlight: true,
    features: [
      "Haftada 2 görüşme (45 dk)",
      "Günlük WhatsApp takibi",
      "Haftalık çalışma planı",
      "Deneme analizi (aylık 2)",
      "Max 8 öğrenci garantisi",
      "Veli takip paneli",
    ],
    notIncluded: ["Öncelikli eşleştirme"],
  },
  {
    name: "Premium",
    price: 3990,
    desc: "Maksimum odak, maksimum destek. İlk sırayı hedefleyenler için.",
    highlight: false,
    features: [
      "Haftada 3 görüşme (60 dk)",
      "Günlük WhatsApp takibi",
      "Haftalık çalışma planı",
      "Sınırsız deneme analizi",
      "Max 8 öğrenci garantisi",
      "Veli takip paneli",
      "Öncelikli eşleştirme",
    ],
    notIncluded: [],
  },
]

const guarantees = [
  "14 gün iade garantisi",
  "Koç değiştirme hakkı",
  "Doğrulanmış koçlar",
  "Aylık performans puanı",
]

export default function PaketlerPage() {
  return (
    <div className="min-h-full bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-[#1a1f5c] to-[#3a4cff] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Fiyatlandırma
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Paketler
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Tüm paketlerde 14 gün iade garantisi ve doğrulanmış koçlar.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.highlight
                    ? "border-[#3a4cff] bg-[#3a4cff] text-white shadow-2xl shadow-[#3a4cff]/20"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-amber-900">
                    En Popüler
                  </span>
                )}
                <div>
                  <h2
                    className={`text-lg font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                  >
                    {plan.name}
                  </h2>
                  <p
                    className={`mt-1 text-sm ${plan.highlight ? "text-white/70" : "text-gray-500"}`}
                  >
                    {plan.desc}
                  </p>
                  <div className="mt-6">
                    <span
                      className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                    >
                      {plan.price.toLocaleString("tr-TR")} ₺
                    </span>
                    <span
                      className={`text-sm ${plan.highlight ? "text-white/60" : "text-gray-400"}`}
                    >
                      /ay
                    </span>
                  </div>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span
                        className={`mt-0.5 font-bold ${plan.highlight ? "text-white" : "text-emerald-500"}`}
                      >
                        ✓
                      </span>
                      <span
                        className={plan.highlight ? "text-white/90" : "text-gray-700"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span
                        className={`mt-0.5 ${plan.highlight ? "text-white/30" : "text-gray-300"}`}
                      >
                        ✗
                      </span>
                      <span
                        className={plan.highlight ? "text-white/40" : "text-gray-300"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/koclar"
                  className={`mt-8 block rounded-xl px-6 py-3 text-center text-sm font-bold transition-all hover:-translate-y-0.5 ${
                    plan.highlight
                      ? "bg-white text-[#3a4cff] hover:shadow-lg"
                      : "bg-[#3a4cff] text-white hover:bg-[#2f3fd4]"
                  }`}
                >
                  Koç seç →
                </a>
              </div>
            ))}
          </div>

          {/* Guarantees */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            {guarantees.map((g) => (
              <div
                key={g}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600"
              >
                <span className="text-emerald-500">✓</span> {g}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
