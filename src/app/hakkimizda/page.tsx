import { createAdminClient } from "@/lib/supabase/server"

export const metadata = { title: "Hakkımızda" }

const values = [
  {
    title: "Belgeyle doğrulama",
    desc: "Her koç, ÖSYM kontrol kodlu sonuç belgesi ve diplomasıyla doğrulanır. Doğrulanamayan iddia vitrine çıkmaz.",
    icon: "🛡️",
  },
  {
    title: "Sınırlı öğrenci",
    desc: "Koç başına sınırlı öğrenci. Daha fazlası ilgisizliğe yol açar; biz bunu sistem olarak engelliyoruz.",
    icon: "👥",
  },
  {
    title: "Şeffaflık",
    desc: "Veli takip paneli, haftalık veli raporları ve açık fiyatlandırma. Sürpriz yok, gizli ücret yok.",
    icon: "📊",
  },
  {
    title: "Deneyimden geliyor",
    desc: "Rekor Zeka kurucuları bizzat koçluk aldı, sistemin eksiklerini yaşayarak keşfetti — bu platform o eksiklere cevaptır.",
    icon: "🎓",
  },
]

const verificationSteps = [
  {
    step: "01",
    title: "Başvuru + Belge",
    desc: "Koç adayı; üniversitesi, bölümü ve sınav derecesiyle başvurur, ÖSYM sonuç belgesini yükler.",
    icon: "📄",
  },
  {
    step: "02",
    title: "Resmî Doğrulama",
    desc: "Belge, ÖSYM'nin resmî Sonuç Belgesi Kontrol sistemi üzerinden kontrol koduyla teyit edilir. Ekran görüntüsü kabul edilmez.",
    icon: "✅",
  },
  {
    step: "03",
    title: "Sürekli Değerlendirme",
    desc: "Yayına alınan koç, öğrencilerinin gerçek puan ve yorumlarıyla değerlendirilir. Standardın altında kalan koçla yolumuz ayrılır.",
    icon: "⭐",
  },
]

export default async function HakkimizdaPage() {
  // Onaylı ve yayındaki koç sayısı — canlı veri, şişirme yok
  const admin = createAdminClient()
  const { count } = await admin
    .from("coaches")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved")
    .eq("is_active", true)
  const coachCount = count ?? 0

  return (
    <div className="min-h-full bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-br from-slate-900 via-[#1a1f5c] to-[#123A57] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Biz kimiz
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Hakkımızda
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/70">
            Rekor Zeka, kalitesiz koçluk deneyimlerini bizzat yaşamış öğrenciler tarafından kuruldu.
            Çözümümüz: belgeyle doğrulanan koçlar ve yapay zeka destekli sistematik takip.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#123A57]">
                Misyon
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Her öğrencinin hak ettiği kalitede koçluğa erişimi var
              </h2>
              <p className="mt-4 leading-relaxed text-gray-500">
                Türkiye&apos;de koçluk pazarı büyüyor ama kalite güvencesi yok. Öğrenciler
                binlerce lira ödeyip derecesi bile doğrulanmamış koçlarla karşılaşabiliyor.
                Biz bunu sistem düzeyinde çözüyoruz: ÖSYM belgesiyle doğrulanan koçlar,
                sınırlı öğrenci sayısı ve gerçek öğrenci değerlendirmeleri.
              </p>
              <p className="mt-3 leading-relaxed text-gray-500">
                <strong className="text-gray-700">Yeni bir platformuz ve bununla gurur duyuyoruz:</strong>{" "}
                şişirilmiş rakamlar yerine doğrulanabilir gerçekler sunuyoruz. 2026-2027 dönemi
                öğrencilerimizi sınırlı kontenjanla alıyoruz.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#123A57]/10 to-[#E2600F]/10 p-10 text-center">
              <div className="text-5xl font-bold text-[#123A57]">{coachCount}</div>
              <div className="mt-1 text-sm text-gray-500">Onaylı koç — ve büyüyor</div>
              <div className="mt-6 text-5xl font-bold text-[#123A57]">%100</div>
              <div className="mt-1 text-sm text-gray-500">ÖSYM belge kontrolü politikası</div>
              <div className="mt-6 text-5xl font-bold text-[#123A57]">7/24</div>
              <div className="mt-1 text-sm text-gray-500">Yapay zeka asistanı</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#123A57]">
            Değerlerimiz
          </p>
          <h2 className="mb-10 text-3xl font-bold tracking-tight text-gray-900">
            Rakiplerden farkımız nedir?
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-3 text-3xl">{v.icon}</div>
                <h3 className="font-semibold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doğrulama süreci */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#123A57]">
            Kalite Güvencesi
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900">
            Bir koç vitrine nasıl çıkar?
          </h2>
          <p className="mb-10 max-w-2xl text-gray-500">
            &quot;Doğrulanmış koç&quot; bizim için bir slogan değil, üç adımlı bir süreç.
            Profilinde &quot;Doğrulanmış Belge&quot; rozeti gördüğün her koç bu süreçten geçti.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {verificationSteps.map((s) => (
              <div
                key={s.step}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{s.icon}</span>
                  <span className="text-sm font-bold text-gray-300">{s.step}</span>
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#123A57] to-[#0E8FA3] px-6 py-8 text-center">
            <h3 className="text-lg font-bold text-white">Bize bir soru sorman yeterli</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
              30 dakikalık ücretsiz ön görüşmede hedefini dinliyor, sana en uygun koçu öneriyoruz.
              Taahhüt yok.
            </p>
            <a
              href="/on-gorusme"
              className="mt-5 inline-block rounded-xl bg-white px-8 py-3 text-sm font-bold text-[#123A57] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Ücretsiz Ön Görüşme Planla →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
