const values = [
  {
    title: "Kalite güvencesi",
    desc: "Her koç diploma ve sınav belgesiyle doğrulanır. Düşük puanlı koçlar platformdan çıkarılır.",
    icon: "🛡️",
  },
  {
    title: "Sınırlı öğrenci",
    desc: "Koç başına maksimum 8 öğrenci. Daha fazlası ilgisizliğe, biz bunu sistem olarak engelliyoruz.",
    icon: "👥",
  },
  {
    title: "Şeffaflık",
    desc: "Veli paneli, haftalık raporlar ve açık fiyatlandırma. Sürpriz yok, gizli ücret yok.",
    icon: "📊",
  },
  {
    title: "Deneyimden geliyor",
    desc: "Rekor Zeka kurucuları bizzat koçluk aldı, sistemin eksiklerini yaşayarak keşfetti.",
    icon: "🎓",
  },
]

const team = [
  {
    name: "Ayşe Kaya",
    role: "Kurucu & CEO",
    university: "Boğaziçi Üniversitesi — İşletme",
    initials: "AK",
    color: "#dde1ff",
    textColor: "#123A57",
  },
  {
    name: "Mehmet Demir",
    role: "Kurucu & CTO",
    university: "ODTÜ — Bilgisayar Mühendisliği",
    initials: "MD",
    color: "#f0e8ff",
    textColor: "#E2600F",
  },
  {
    name: "Zeynep Arslan",
    role: "Koç Kalite Direktörü",
    university: "Hacettepe — Psikoloji",
    initials: "ZA",
    color: "#d1fae5",
    textColor: "#065f46",
  },
]

export default function HakkimizdaPage() {
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
            Rekor Zeka, kalitesiz koçluk deneyimlerini yaşamış öğrenciler tarafından kuruldu.
            Çözüm: sistematik kalite güvencesi.
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
                Türkiye'de koçluk pazarı büyüyor ama kalite güvencesi yok. Öğrenciler
                binlerce lira ödeyip ilgisiz koçlarla karşılaşıyor. Biz bunu sistem
                düzeyinde çözüyoruz: doğrulanmış koçlar, sınırlı öğrenci sayısı ve
                aylık performans puanı.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#123A57]/10 to-[#E2600F]/10 p-10 text-center">
              <div className="text-5xl font-bold text-[#123A57]">4K+</div>
              <div className="mt-1 text-sm text-gray-500">Başarılı öğrenci</div>
              <div className="mt-6 text-5xl font-bold text-[#123A57]">320+</div>
              <div className="mt-1 text-sm text-gray-500">Doğrulanmış koç</div>
              <div className="mt-6 text-5xl font-bold text-[#123A57]">%94</div>
              <div className="mt-1 text-sm text-gray-500">Memnuniyet oranı</div>
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

      {/* Team */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#123A57]">
            Ekip
          </p>
          <h2 className="mb-10 text-3xl font-bold tracking-tight text-gray-900">
            Arkamızda kim var?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center"
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
                  style={{
                    backgroundColor: member.color,
                    color: member.textColor,
                  }}
                >
                  {member.initials}
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-[#123A57]">
                  {member.role}
                </p>
                <p className="mt-1 text-xs text-gray-400">{member.university}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
