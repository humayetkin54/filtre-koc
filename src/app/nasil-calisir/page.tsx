const steps = [
  {
    num: "01",
    title: "Ücretsiz ön görüşme",
    desc: "Hedefini, mevcut netlerini ve çalışma alışkanlıklarını konuşuyoruz. 30 dakika, sıfır maliyet. Taahhüt yok.",
    detail: "Görüşmede sana uygun koç profilini ve tahmini net artış sürecini de paylaşıyoruz.",
  },
  {
    num: "02",
    title: "Akıllı eşleştirme",
    desc: "Hedeflediğin bölümü okuyan, aynı branştan mezun ve müsait olan koçları seninle eşleştiriyoruz.",
    detail: "Eşleştirme algoritması; hedef, konu zayıflıkları, bütçe ve çalışma saatlerini dikkate alır.",
  },
  {
    num: "03",
    title: "Kişisel plan",
    desc: "Koçun sana özel haftalık çalışma programı hazırlıyor. Hangi konuya kaç saat, hangi stratejiyle.",
    detail: "Plan her hafta deneme sonuçlarına göre güncellenir. Sabit değil, canlı bir yol haritası.",
  },
  {
    num: "04",
    title: "Sürekli takip",
    desc: "Günlük WhatsApp takibi, haftalık görüşmeler ve deneme analizleriyle net artışını izliyoruz.",
    detail: "Veli takip paneli sayesinde aile her hafta çalışma verisini ve gelişim raporunu görür.",
  },
]

const faqs = [
  {
    q: "Koçu beğenmezsem ne olur?",
    a: "14 gün içinde soru sormadan tam iade yapıyoruz. Sonrasında da dilediğin zaman ücretsiz koç değiştirebilirsin.",
  },
  {
    q: "Görüşmeler ne zaman yapılıyor?",
    a: "Koçunla birlikte haftalık program belirliyorsunuz. Sabah erken, akşam geç — tamamen size uygun saatlerde.",
  },
  {
    q: "Koçlar gerçekten doğrulanmış mı?",
    a: "Evet. Her koç diploma fotokopisi ve sınav sonuç belgesiyle doğrulanıyor. Profilde görebilirsin.",
  },
  {
    q: "Maksimum kaç öğrenciyle çalışıyor?",
    a: "Her koçun maksimum 8 öğrencisi olabilir. Bu sınır kalite güvencemizin temel kuralı.",
  },
  {
    q: "Ücret ne zaman alınıyor?",
    a: "Aylık abonelik modeli. İptal etmek istersen bir sonraki dönem faturalandırılmazsın.",
  },
]

export default function NasilCalisirPage() {
  return (
    <div className="min-h-full bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-[#1a1f5c] to-[#123A57] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Süreç
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Nasıl çalışır?
          </h1>
          <p className="mt-4 text-lg text-white/70">
            İlk görüşmeden ilk net artışına kadar 4 adım.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-6">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#123A57]/10">
                <span className="text-xl font-bold text-[#123A57]">{step.num}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
                <p className="mt-2 text-gray-600">{step.desc}</p>
                <p className="mt-1 text-sm text-gray-400">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-3xl font-bold tracking-tight text-gray-900">
            Sık sorulan sorular
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-4 py-20 text-center sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(135deg, #123A57 0%, #E2600F 100%)" }}
      >
        <h2 className="text-3xl font-bold text-white">Hâlâ sorun mu var?</h2>
        <p className="mt-3 text-white/70">30 dakikalık ücretsiz görüşmede her şeyi netleştirelim.</p>
        <a
          href="/koclar"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-[#123A57] transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          Ücretsiz görüşme planla →
        </a>
      </section>
    </div>
  )
}
