import Link from 'next/link'

const stats = [
  { num: '4K+', lbl: 'Öğrenci kazandı' },
  { num: '320+', lbl: 'Uzman koç' },
  { num: '14', lbl: 'Gün iade garantisi' },
  { num: 'Max 8', lbl: 'Öğrenci / koç' },
]

const steps = [
  { icon: '🎯', num: '01', title: 'Ücretsiz ön görüşme', desc: 'Hedefini, mevcut netlerini ve çalışma alışkanlıklarını konuşuyoruz. 30 dakika, sıfır maliyet.' },
  { icon: '🔎', num: '02', title: 'Akıllı eşleştirme', desc: 'Hedeflediğin bölümü okuyan, aynı branştan mezun ve müsait olan koçları seninle eşleştiriyoruz.' },
  { icon: '📋', num: '03', title: 'Kişisel plan', desc: 'Koçun sana özel haftalık çalışma programı hazırlıyor. Hangi konuya kaç saat, hangi stratejiyle.' },
  { icon: '📈', num: '04', title: 'Sürekli takip', desc: 'Günlük WhatsApp takibi, haftalık görüşmeler ve deneme analizleriyle net artışını izliyoruz.' },
]

const kocTipleri = [
  { tag: 'YKS', title: 'Üniversite Koçluğu', desc: 'TYT ve AYT\'de net artışı hedefleyen, hedef bölümü okuyan koçlarla çalış.', features: ['Hedef üniversite mezunu koç', 'TYT + AYT strateji planı', 'Haftalık deneme analizi', '7/24 WhatsApp desteği'] },
  { tag: 'LGS', title: 'Fen Lisesi Koçluğu', desc: 'LGS\'de ilk 100\'e girmek ve fen lisesi kazanmak için stratejik hazırlık.', features: ['Fen lisesi mezunu koçlar', 'Yeni nesil soru taktikleri', 'Veli bilgilendirme raporu', 'Düzenli performans takibi'] },
  { tag: 'KPSS', title: 'Memur Sınavı Koçluğu', desc: 'KPSS\'de üst sıralara girmek için deneyimli, sınavı kazanmış koçlar.', features: ['KPSS kazanmış koçlar', 'GY/GK + Alan sınavı planı', 'Özgün soru analizleri', 'Esnek program desteği'] },
  { tag: 'PDR', title: 'Psikolojik Danışmanlık', desc: 'Sınav kaygısı, motivasyon ve stres yönetimi için uzman PDR desteği.', features: ['Psikoloji mezunu danışmanlar', 'Sınav kaygısı terapisi', 'Kariyer & tercih rehberliği', 'Aile görüşmeleri'] },
]

const garantiler = [
  { icon: '🛡️', title: '14 gün iade garantisi', desc: 'İlk 14 gün içinde memnun kalmazsan, soru sormadan tam iade.' },
  { icon: '👥', title: 'Max 8 öğrenci / koç', desc: 'Her koça en fazla 8 öğrenci — tam ilgi garantisi.' },
  { icon: '🔄', title: 'Koç değiştirme hakkı', desc: 'Uyum sağlayamazsan dilediğinde ücretsiz koç değiştirebilirsin.' },
  { icon: '⭐', title: 'Aylık performans puanı', desc: 'Düşük puan alan koç platformdan çıkarılır.' },
  { icon: '📊', title: 'Veli takip paneli', desc: 'Aileler haftalık çalışma verisini ve gelişim raporunu görür.' },
  { icon: '🎓', title: 'Doğrulanmış koçlar', desc: 'Tüm koçlar diploma ve sınav sonuçlarıyla doğrulanıyor.' },
]

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-[5%] py-32"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 60% 40%, #dde1ff 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, #f0e8ff 0%, transparent 60%), #f7f6f2' }}>
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Türkiye'nin kalite güvenceli koçluk platformu
          </div>
          <h1 className="font-bold text-5xl md:text-7xl tracking-tight text-gray-900 max-w-3xl mb-6 leading-tight">
            Hedefine giden yolu{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">bilen koçla</span>{' '}
            çalış
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
            Hedeflediğin üniversiteyi kazanmış, aynı yolu yürümüş koçlarla eşleşiyorsun. Max 8 öğrenci per koç. 14 gün iade garantisi.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/koclar" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:-translate-y-0.5">
              Ücretsiz ön görüşme al →
            </Link>
            <a href="#nasil-calisir" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all">
              Nasıl çalışır?
            </a>
          </div>
          <div className="flex gap-12 mt-16 flex-wrap">
            {stats.map(s => (
              <div key={s.lbl}>
                <div className="font-bold text-4xl tracking-tight text-gray-900">{s.num}</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="py-24 px-[5%] bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-3">Süreç</p>
          <h2 className="font-bold text-4xl tracking-tight text-gray-900 mb-4">4 adımda koçuna kavuş</h2>
          <p className="text-gray-500 max-w-lg mb-12">Seni en iyi anlayan koçu bulmak için sistematik bir eşleştirme sürecinden geçiyorsun.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.num} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
                <span className="absolute top-4 right-5 text-5xl font-bold text-gray-100 leading-none">{s.num}</span>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-4">{s.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KOÇ TİPLERİ */}
      <section className="py-24 px-[5%] bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-3">Hizmetler</p>
          <h2 className="font-bold text-4xl tracking-tight text-gray-900 mb-4">Hangi yoldasın?</h2>
          <p className="text-gray-500 max-w-lg mb-12">Sınavına ve hedefine özel koçluk modeli seçiyorsun.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kocTipleri.map(k => (
              <div key={k.tag} className="group bg-white rounded-2xl p-6 border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600">
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 group-hover:bg-white/20 group-hover:text-white transition-colors">{k.tag}</span>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-white transition-colors">{k.title}</h3>
                <p className="text-sm text-gray-500 mb-4 group-hover:text-white/80 transition-colors">{k.desc}</p>
                <ul className="space-y-2">
                  {k.features.map(f => (
                    <li key={f} className="text-xs text-gray-500 flex items-center gap-2 group-hover:text-white/80 transition-colors">
                      <span className="text-green-500 font-bold group-hover:text-white">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KALİTE GÜVENCE */}
      <section className="py-24 px-[5%]" style={{ background: 'linear-gradient(135deg, #0e0e14 0%, #1a1040 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-purple-400 mb-3">Neden FiltrEkoç?</p>
          <h2 className="font-bold text-4xl tracking-tight text-white mb-4">Rakiplerden farkımız:<br />kalite güvencesi</h2>
          <p className="text-gray-400 max-w-lg mb-12">Diğer platformlardaki şikayetlerin en büyük nedeni koç ilgisizliği. Biz bunu sistem düzeyinde çözüyoruz.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {garantiler.map(g => (
              <div key={g.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-4">{g.icon}</div>
                <h4 className="font-semibold text-white mb-2">{g.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-[5%] text-center" style={{ background: 'linear-gradient(135deg, #3a4cff 0%, #7c3aff 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-bold text-4xl md:text-5xl tracking-tight text-white mb-4">Hedefin ne? Konuşalım.</h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            30 dakikalık ücretsiz görüşmede seviyeni, hedefini ve en uygun koçu birlikte belirliyoruz. Taahhüt yok.
          </p>
          <Link href="/koclar" className="bg-white text-blue-600 font-bold px-10 py-4 rounded-xl text-lg transition-all hover:-translate-y-1 hover:shadow-2xl inline-block">
            Ücretsiz görüşme planla →
          </Link>
        </div>
      </section>
    </main>
  )
}