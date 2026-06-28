const categories = [
  {
    tag: "YKS",
    title: "YKS Koçluğu",
    plans: [
      {
        name: "1 Aylık",
        price: 5200,
        period: "/ay",
        highlight: false,
        features: [
          "Haftada 1 online görüşme",
          "Koçunla mesajlaşabilme",
          "Sana özel haftalık program",
          "Psikolojik Danışman veya Derece Koçu ile çalışma",
          "Koç değişikliği hakkı",
          "Seviyeye uygun kaynak önerileri",
        ],
      },
      {
        name: "Sınava Kadar",
        price: 48000,
        period: "/yıl · 6 taksit",
        highlight: true,
        features: [
          "6 taksitle ödeme imkanı",
          "Haftada 1 online görüşme",
          "Koçunla mesajlaşabilme",
          "Sana özel haftalık program",
          "Psikolojik Danışman veya Derece Koçu ile çalışma",
          "Seviyeye uygun kaynak önerileri",
          "Sınav sonrası tercih danışmanlığı",
          "Deneme kulübü üyeliği",
          "Psikolog/PDR tarafından ayda 1 grup rehberliği",
        ],
      },
    ],
  },
  {
    tag: "LGS",
    title: "LGS Koçluğu",
    plans: [
      {
        name: "1 Aylık",
        price: 5200,
        period: "/ay",
        highlight: false,
        features: [
          "Psikolojik Danışman ile süreç takibi",
          "Sana özel günlük/haftalık program",
          "Her hafta online görüşme",
          "İki haftada bir veli görüşmesi",
          "Günlük rapor alma",
        ],
      },
      {
        name: "Sınava Kadar",
        price: 48000,
        period: "/yıl · 6 taksit",
        highlight: true,
        features: [
          "6 taksitle ödeme imkanı",
          "Psikolojik Danışman ile süreç takibi",
          "Sana özel günlük/haftalık program",
          "Her hafta online görüşme",
          "İki haftada bir veli görüşmesi",
          "Günlük rapor alma",
        ],
      },
    ],
  },
  {
    tag: "MEB AGS",
    title: "MEB AGS Koçluğu",
    plans: [
      {
        name: "Aylık",
        price: 5200,
        period: "/ay",
        highlight: false,
        features: [
          "Psikolojik Danışman tarafından süreç takibi",
          "Haftada 1 online görüşme",
          "Koçunla mesajlaşabilme",
          "Sana özel haftalık program",
          "Seviyeye uygun kaynak önerileri",
        ],
      },
      {
        name: "Sınava Kadar",
        price: 48000,
        period: "/yıl",
        highlight: true,
        features: [
          "Psikolojik Danışman tarafından süreç takibi",
          "Haftada 1 online görüşme",
          "Koçunla mesajlaşabilme",
          "Sana özel haftalık program",
          "Seviyeye uygun kaynak önerileri",
          "Koç değişikliği hakkı",
        ],
      },
    ],
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

      {/* Categories */}
      {categories.map((cat) => (
        <section key={cat.tag} className="border-b border-gray-100 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-700">
                {cat.tag}
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                {cat.title}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {cat.plans.map((plan) => (
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
                      Avantajlı
                    </span>
                  )}
                  <div>
                    <h3
                      className={`text-lg font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                    >
                      {plan.name}
                    </h3>
                    <div className="mt-4">
                      <span
                        className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                      >
                        {plan.price.toLocaleString("tr-TR")} ₺
                      </span>
                      <span
                        className={`text-sm ${plan.highlight ? "text-white/60" : "text-gray-400"}`}
                      >
                        {" "}{plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
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
          </div>
        </section>
      ))}

      {/* Guarantees */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-4">
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
