const contactItems = [
  {
    label: "E-posta",
    value: "destek@rekorzeka.com",
    icon: "✉️",
  },
  {
    label: "WhatsApp",
    value: "+90 555 123 45 67",
    icon: "💬",
  },
  {
    label: "Destek saatleri",
    value: "Hafta içi 09:00 – 21:00",
    icon: "🕐",
  },
]

export default function IletisimPage() {
  return (
    <div className="min-h-full bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-[#1a1f5c] to-[#3a4cff] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-300">
            İletişim
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Bize ulaşın
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Sorularınız için 24 saat içinde dönüş yapıyoruz.
          </p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mesaj gönderin</h2>
              <p className="mt-2 text-sm text-gray-500">
                Formu doldurun, ekibimiz en kısa sürede size dönüş yapsın.
              </p>
              <form className="mt-8 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Adınız
                  </label>
                  <input
                    type="text"
                    placeholder="Ada Yılmaz"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    E-posta
                  </label>
                  <input
                    type="email"
                    placeholder="ada@ornek.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Konu
                  </label>
                  <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20">
                    <option value="">Seçin...</option>
                    <option>Koç eşleştirme</option>
                    <option>Fiyatlandırma</option>
                    <option>Teknik sorun</option>
                    <option>Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Mesajınız
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Mesajınızı yazın..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full py-3"
                >
                  Gönder
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Doğrudan iletişim</h2>
              <p className="mt-2 text-sm text-gray-500">
                Hızlı cevap için WhatsApp veya e-posta tercih edin.
              </p>
              <div className="mt-8 space-y-4">
                {contactItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3a4cff]/10 text-xl">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">{item.label}</p>
                      <p className="mt-0.5 font-semibold text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#3a4cff]/10 to-[#7c3aff]/10 p-6">
                <p className="font-semibold text-gray-900">
                  Ücretsiz ön görüşme tercih eder misiniz?
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  30 dakikalık birebir görüşmede sorularınızı yanıtlayalım.
                </p>
                <a
                  href="/koclar"
                  className="btn-primary mt-4 px-5 py-2.5 text-sm"
                >
                  Görüşme planla →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
