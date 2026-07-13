import Link from 'next/link'
import { IntroPopup } from './intro-popup'

const stats = [
  { num: '%100', lbl: 'PDR / Psikoloji Koordinasyonu' },
  { num: '7/24', lbl: 'Yapay Zeka Destekli Asistan' },
  { num: '3x', lbl: 'Okuma Hızı Artış Hedefi' },
  { num: '7', lbl: 'Gün Koşulsuz İade Garantisi' },
]

const heroChips = [
  '🤖 AI Soru Çözümü',
  '📸 Deneme Kitapçığı AI Analizi',
  '👁️ Hızlı Okuma Merkezi',
  '👨‍👩‍👧 Veli Takip Sistemi',
]

const yolHaritasi = [
  {
    num: '01', icon: '🔬', color: '#0E8FA3',
    title: 'Bilişsel ve Mizaç Analizi',
    tag: 'Teşhis',
    desc: 'Sürece ezbere programlarla değil, öğrencinin öğrenme stilini, mizaç özelliklerini ve mevcut akademik temelini analiz eden profesyonel envanterlerle başlarız.',
  },
  {
    num: '02', icon: '♟️', color: '#123A57',
    title: 'Stratejik Akademik Planlama',
    tag: 'Kurgu',
    desc: 'Tıpkı tahtada birkaç hamle sonrasını kurgulayan büyük usta titizliğiyle, öğrenciye özel uzun vadeli bir çalışma haritası çıkarılır. Rastgele çalışmaya son verilir.',
  },
  {
    num: '03', icon: '📊', color: '#0E8FA3',
    title: 'Veri Odaklı Performans Takibi',
    tag: 'Analiz',
    desc: 'Öğrencinin çözdüğü her soru ve katıldığı her deneme sayısal bir kesinlikle veri setlerine dönüştürülür. Eksik kazanımlar algoritmik hassasiyetle tespit edilir.',
  },
  {
    num: '04', icon: '🛡️', color: '#123A57',
    title: 'Güvenli ve Motive Edici İletişim',
    tag: 'PDR Desteği',
    desc: 'Öğrencinin sadece netleri değil, psikolojik süreçleri de takip edilir. Sınav stresinden uzak, güvenli bir iletişim kanalı ile motivasyon daima yüksek tutulur.',
  },
  {
    num: '05', icon: '🏆', color: '#E2600F',
    title: 'Sürekli Optimizasyon',
    tag: 'Hedefe Ulaşma',
    desc: 'Verilerden elde edilen geri bildirimlerle program sürekli güncellenir. Öğrencinin potansiyeli maksimuma çıkarılarak gerçek sınav anına kusursuz bir hazırlık sağlanır.',
  },
]

const kocTipleri = [
  { tag: 'YKS', title: 'YKS Koçluğu', desc: 'TYT ve AYT\'de net artışı hedefleyen, hedef bölümü okuyan koçlarla çalış.', features: ['Hedef üniversite mezunu koç', 'TYT + AYT strateji planı', 'Haftalık deneme analizi', '7/24 WhatsApp desteği'] },
  { tag: 'LGS', title: 'LGS Koçluğu', desc: 'Fen ve Anadolu Lisesi\'ni kazanmak için stratejik hazırlık.', features: ['Yeni nesil soru taktikleri', 'Veli bilgilendirme raporu', 'Düzenli performans takibi'] },
  { tag: 'KPSS/AGS', title: 'KPSS/AGS Koçluğu', desc: 'KPSS\'de üst sıralara girmek için deneyimli, sınavı kazanmış koçlar.', features: ['GY/GK + Alan sınavı planı', 'Özgün soru analizleri', 'Esnek program desteği'] },
  { tag: 'PDR', title: 'Psikolojik Danışmanlık', desc: 'Sınav kaygısı, motivasyon ve stres yönetimi için uzman PDR desteği.', features: ['PDR mezunu danışmanlar', 'Sınav kaygısı terapisi', 'Kariyer & tercih rehberliği', 'Aile görüşmeleri'] },
]

const garantiler = [
  { icon: '🛡️', title: '7 gün koşulsuz iade', desc: 'İlk 7 gün içinde memnun kalmazsan, soru sormadan tam iade. Uzun paketlerde iptalde kullanılmayan aylar iade edilir.' },
  { icon: '👥', title: 'Max 8 öğrenci / koç', desc: 'Her koça en fazla 8 öğrenci — tam ilgi garantisi.' },
  { icon: '🔄', title: 'Koç değiştirme hakkı', desc: 'Uyum sağlayamazsan dilediğinde ücretsiz koç değiştirebilirsin.' },
  { icon: '⭐', title: 'Aylık performans puanı', desc: 'Düşük puan alan koç platformdan çıkarılır.' },
  { icon: '📊', title: 'Veli takip paneli', desc: 'Aileler haftalık çalışma verisini ve gelişim raporunu görür.' },
  { icon: '🎓', title: 'Doğrulanmış koçlar', desc: 'Tüm koçlar diploma ve sınav sonuçlarıyla doğrulanıyor.' },
]

export default function HomePage() {
  return (
    <main>
      <IntroPopup />
      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-[5%] py-32"
        style={{ background: 'linear-gradient(135deg, #eef3f5 0%, #e3eef0 35%, #cfe9e6 70%, #b8e0db 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#1e293b] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#0E8FA3] rounded-full animate-pulse" />
            YENİ NESİL · PDR DESTEKLİ · SEÇKİN AKADEMİK KOÇLUK PLATFORMU
          </div>
          <h1 className="font-bold text-5xl md:text-7xl tracking-tight text-[#1e293b] max-w-3xl mb-6 leading-tight">
            Derece yapan koçlar ve yapay zeka ile{' '}
            <span className="text-[#E2600F]">netlerini katla</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mb-8 leading-relaxed">
            Sıradan tavsiyeleri ve ezbere programları unutun. Diploma güvenceli PDR koordinatörleri liderliğinde, yapay zeka destekli analiz araçlarıyla çalışın. Sadece çalışmayı değil, kazanma psikolojisini öğrenin.
          </p>
          <div className="flex gap-2 flex-wrap mb-10">
            {heroChips.map(c => (
              <span key={c} className="rounded-full border border-white/60 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#123A57] backdrop-blur-sm">
                {c}
              </span>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <Link href="/on-gorusme" className="btn-primary px-8 py-4 text-base">
              Ücretsiz Uzman Görüşmesi Al →
            </Link>
            <Link href="/koclar?tip=YKS" className="border-2 border-[#0E8FA3] text-[#0E8FA3] hover:bg-[#0E8FA3] hover:text-white font-semibold px-6 py-3.5 rounded-xl text-base transition-all">
              YKS Koçunu Seç
            </Link>
            <Link href="/koclar?tip=LGS" className="border-2 border-[#0E8FA3] text-[#0E8FA3] hover:bg-[#0E8FA3] hover:text-white font-semibold px-6 py-3.5 rounded-xl text-base transition-all">
              LGS Koçunu Seç
            </Link>
            <Link href={`/koclar?tip=${encodeURIComponent('KPSS/AGS')}`} className="border-2 border-[#0E8FA3] text-[#0E8FA3] hover:bg-[#0E8FA3] hover:text-white font-semibold px-6 py-3.5 rounded-xl text-base transition-all">
              KPSS/AGS Koçu
            </Link>
          </div>
          <a href="#ozellikler" className="mt-5 inline-block text-sm font-semibold text-[#0E8FA3] hover:underline">
            ↓ Platform özelliklerini keşfet
          </a>
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

      {/* PLATFORM ÖZELLİKLERİ */}
      <section id="ozellikler" className="py-24 px-[5%] bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#0E8FA3] mb-3">Platform Özellikleri</p>
          <h2 className="font-bold text-4xl tracking-tight text-gray-900 mb-4">Sadece koçluk değil,<br className="sm:hidden" /> yeni nesil teknoloji</h2>
          <p className="text-gray-500 max-w-xl mb-12">Koçunun birebir ilgisine, yapay zeka destekli araçlar eşlik eder. Hepsi tek panelde, tüm paketlere dahil.</p>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
            {/* Deneme AI Analiz — büyük kart */}
            <div className="lg:col-span-3 rounded-2xl p-7 text-white" style={{ background: 'linear-gradient(135deg, #123A57 0%, #0E8FA3 100%)' }}>
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-widest uppercase mb-4">📸 Deneme AI Analiz</span>
              <h3 className="font-bold text-2xl mb-2">Kitapçığını fotoğrafla,<br />yapay zeka analiz etsin</h3>
              <p className="text-sm text-white/80 leading-relaxed mb-6">Deneme kitapçığının fotoğraflarını yükle; yapay zeka doğru-yanlışlarından zayıf konularını tespit etsin, koçun tek tıkla haftalık programına dönüştürsün.</p>
              <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
                <span className="rounded-lg bg-white/15 px-3 py-2">📸 Fotoğrafla</span>
                <span className="text-white/50">→</span>
                <span className="rounded-lg bg-white/15 px-3 py-2">🤖 Zayıf konu tespiti</span>
                <span className="text-white/50">→</span>
                <span className="rounded-lg bg-white/15 px-3 py-2">📅 Haftalık program</span>
              </div>
            </div>

            {/* AI Asistan — büyük kart */}
            <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-gray-50 p-7">
              <span className="inline-block rounded-full bg-[#eef9f9] px-3 py-1 text-[11px] font-bold tracking-widest uppercase text-[#0E8FA3] mb-4">🤖 RekorZeka AI Asistan</span>
              <h3 className="font-bold text-2xl text-gray-900 mb-2">7/24 yanında bir<br />yapay zeka koçu</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Takıldığın sorunun fotoğrafını gönder, adım adım çözümünü al. Çalışma planı, konu anlatımı ve motivasyon — gece yarısı bile.</p>
              <div className="space-y-2">
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[#0E8FA3] px-4 py-2.5 text-xs text-white">Bu soruyu çözemedim, yardım eder misin? 📷</div>
                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-white border border-gray-200 px-4 py-2.5 text-xs text-gray-600">Tabii! Adım adım çözelim: önce verilenleri yazalım… 🤖</div>
              </div>
            </div>

            {/* Hızlı Okuma */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-2xl mb-3">👁️</div>
              <h3 className="font-bold text-gray-900 mb-1.5">Hızlı Okuma Merkezi</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">WPM hız testi, takistoskop ve göz egzersizleriyle okuma hızını katla. Paragraf sorularında kazandığın her dakika, fazladan çözülen soru demek.</p>
              <div className="flex items-end gap-2">
                <span className="font-bold text-3xl text-[#0E8FA3]">320</span>
                <span className="text-xs text-gray-400 mb-1">WPM</span>
                <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">18 başarı rozeti 🏅</span>
              </div>
            </div>

            {/* Net Takibi */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-1.5">Net Takibi & Grafikler</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">Her deneme sonucun TYT/AYT ayrımıyla grafiğe dönüşür; gelişimini sen de koçun da anlık görür.</p>
              <svg viewBox="0 0 200 60" className="w-full">
                <polyline points="10,45 60,38 110,30 160,18 190,12" fill="none" stroke="#0E8FA3" strokeWidth="3" strokeLinecap="round" />
                <polyline points="10,52 60,48 110,42 160,35 190,28" fill="none" stroke="#E2600F" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 4" />
                <circle cx="190" cy="12" r="4" fill="#0E8FA3" />
                <circle cx="190" cy="28" r="4" fill="#E2600F" />
              </svg>
            </div>

            {/* Veli Takip */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-2xl mb-3">👨‍👩‍👧</div>
              <h3 className="font-bold text-gray-900 mb-1.5">Veli Takip Sistemi</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">Öğrencinin izniyle veliler; koç, ödev durumu ve deneme gelişimini kendi panelinden şeffafça takip eder.</p>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-xs font-semibold text-gray-600">Veli takibi</span>
                <span className="inline-flex h-5 w-9 items-center rounded-full bg-[#0E8FA3]"><span className="ml-auto mr-0.5 h-4 w-4 rounded-full bg-white" /></span>
              </div>
            </div>
          </div>

          {/* Alt şerit: diğer araçlar */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: '🎥', title: 'Online Görüşme', desc: 'Randevu onaylanır, görüşme linki otomatik oluşur — tek tıkla bağlan.' },
              { icon: '💬', title: 'Koçla Mesajlaşma', desc: 'Sorunu panelden yaz, koçun bildirimle görsün; kesintisiz iletişim.' },
              { icon: '📅', title: 'Program & Ödev Takibi', desc: 'Haftalık ders programın ve ödevlerin tek ekranda, tik tik ilerle.' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOL HARİTASI */}
      <section id="nasil-calisir" className="py-24 px-[5%] bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#0E8FA3] mb-3">Bilimsel Metodumuz</p>
          <h2 className="font-bold text-4xl tracking-tight text-gray-900 mb-4">Başarıya Giden Yol Haritası</h2>
          <p className="text-gray-500 max-w-xl mb-16">Öğrencinin potansiyelini sistematik bir süreçle maksimuma çıkarıyoruz. Her adım, bir öncekinin üzerine inşa edilir.</p>

          {/* Desktop: yatay zaman çizelgesi */}
          <div className="hidden lg:block relative">
            {/* Bağlantı çizgisi */}
            <div className="absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#0E8FA3] via-[#123A57] to-[#E2600F]" />
            <div className="grid grid-cols-5 gap-4">
              {yolHaritasi.map((s, i) => (
                <div key={s.num} className="flex flex-col items-center text-center">
                  {/* Numara dairesi */}
                  <div
                    className="relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold mb-6 shadow-lg"
                    style={{ background: s.color }}
                  >
                    <span className="text-2xl leading-none">{s.icon}</span>
                    <span className="text-[10px] font-bold mt-0.5 opacity-80">{s.num}</span>
                  </div>
                  {/* Etiket */}
                  <span className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: s.color }}>{s.tag}</span>
                  {/* Başlık */}
                  <h3 className="font-bold text-gray-900 text-sm mb-3 leading-snug">{s.title}</h3>
                  {/* Açıklama */}
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: dikey zaman çizelgesi */}
          <div className="lg:hidden relative pl-10">
            {/* Dikey çizgi */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#0E8FA3] via-[#123A57] to-[#E2600F]" />
            <div className="flex flex-col gap-8">
              {yolHaritasi.map((s) => (
                <div key={s.num} className="relative flex gap-4">
                  {/* Daire */}
                  <div
                    className="absolute -left-[2.35rem] z-10 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0"
                    style={{ background: s.color }}
                  >
                    <span className="text-lg">{s.icon}</span>
                  </div>
                  {/* İçerik */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full text-white" style={{ background: s.color }}>{s.tag}</span>
                      <span className="text-xs text-gray-400 font-bold">{s.num}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
              <div key={k.tag} className="group bg-white rounded-2xl p-6 border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-transparent koc-card">
                <span className="koc-tag inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 transition-colors">{k.tag}</span>
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
          <p className="text-xs font-semibold tracking-widest uppercase text-purple-400 mb-3">Seçkin Bir Gelecek Tasarımı</p>
          <h2 className="font-bold text-4xl tracking-tight text-white mb-4">Sıradan bir çalışma değil,<br />seçkin bir gelecek tasarımı</h2>
          <p className="text-gray-400 max-w-2xl mb-12">Rekor Zeka&apos;da her öğrenci, kendine özgü bir yol haritasıyla ilerler. Akademik başarıyı psikolojik denge ve veriye dayalı takiple harmanlıyoruz — çünkü gerçek dönüşüm, sistemli bir yaklaşımla mümkündür.</p>

          {/* Değer kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { icon: '👔', title: 'Terzi Usulü Mentorluk', desc: 'Her öğrenci tektir, programı da öyle olmalıdır.' },
              { icon: '🧠', title: 'Akademik & Psikolojik Denge', desc: 'Sadece netleri değil, kaygıyı da yönetiyoruz.' },
              { icon: '👑', title: 'Ayrıcalıklı Kulüp', desc: 'Burası sadece bir kurs değil, başarıya odaklanmış bir topluluk.' },
              { icon: '📊', title: 'Veriye Dayalı Takip', desc: 'Anlık analizler, gerçek zamanlı gelişim grafikleri.' },
            ].map(v => (
              <div key={v.title} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="text-3xl mb-4">{v.icon}</div>
                <h4 className="font-semibold text-white mb-2">{v.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Kalite güvencesi kartları */}
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
      <section className="py-24 px-[5%] text-center" style={{ background: 'linear-gradient(135deg, #123A57 0%, #E2600F 100%)' }}>
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