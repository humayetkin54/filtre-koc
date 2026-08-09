export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-sm border border-gray-100 p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0E8FA3] mb-2">Yasal Metin</p>
        <h1 className="text-2xl font-bold text-[#1e293b] mb-1">Gizlilik Politikası</h1>
        <p className="text-xs text-gray-400 mb-8">Son güncelleme: Temmuz 2026</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

          {/* Giriş */}
          <section>
            <p>
              Bu Gizlilik Politikası, <strong className="text-gray-800">Rekor Zeka Eğitim Teknolojileri</strong>{" "}
              (&quot;Rekor Zeka&quot;, &quot;biz&quot;) tarafından işletilen{" "}
              <strong className="text-gray-800">rekorzeka.com</strong> platformunun kullanıcılarına
              (&quot;siz&quot;, &quot;kullanıcı&quot;) sunulan hizmetlerde kişisel verilerin nasıl
              toplandığını, kullanıldığını, korunduğunu ve paylaşıldığını açıklar.
            </p>
            <p className="mt-3">
              Bu politika, 6698 sayılı KVKK ve AB Genel Veri Koruma Tüzüğü (GDPR) ile uyumlu olarak
              hazırlanmıştır. Daha ayrıntılı KVKK haklarınız için{" "}
              <a href="/kvkk" className="text-[#0E8FA3] hover:underline">KVKK Aydınlatma Metni</a>ni inceleyebilirsiniz.
            </p>
          </section>

          {/* 1. Topladığımız Veriler */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">1. Topladığımız Veriler</h2>
            <p className="mb-4">Platform kullanımınız sırasında iki tür veri toplanmaktadır:</p>

            <div className="space-y-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="font-semibold text-gray-800 text-xs mb-2">A. Doğrudan Sağladığınız Veriler</p>
                <ul className="space-y-1.5 text-xs text-gray-500">
                  {[
                    "Ad, soyad ve e-posta adresi (kayıt sırasında)",
                    "Sınıf, sınav türü, hedef üniversite/bölüm ve net bilgileri (onboarding anketi)",
                    "Destek talep içerikleri ve mesajlaşma geçmişi",
                    "Randevu zamanlamaları ve koç tercihleri",
                    "Ödeme doğrulama kaydı (kart numarası sistemimizde saklanmaz)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#0E8FA3] font-bold flex-shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="font-semibold text-gray-800 text-xs mb-2">B. Otomatik Olarak Toplanan Veriler</p>
                <ul className="space-y-1.5 text-xs text-gray-500">
                  {[
                    "IP adresi ve tarayıcı/cihaz bilgisi",
                    "Sayfa görüntüleme, tıklama ve oturum süreleri",
                    "Hata logları ve platform performans verileri",
                    "Oturum çerezleri (bkz. Bölüm 4)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[#0E8FA3] font-bold flex-shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 2. Verilerin Kullanım Amaçları */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">2. Verilerin Kullanım Amaçları</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold">Amaç</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Dayanak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Hesap oluşturma ve kimlik doğrulama", "Sözleşme ifası"],
                    ["Algoritmik koç eşleştirme", "Sözleşme ifası"],
                    ["Randevu ve paket yönetimi", "Sözleşme ifası"],
                    ["Ödeme ve faturalama", "Yasal yükümlülük"],
                    ["Müşteri desteği ve şikayet yönetimi", "Meşru menfaat"],
                    ["Platform güvenliği ve sahtekarlık önleme", "Meşru menfaat"],
                    ["Kullanım istatistikleri ve A/B testi", "Açık rıza"],
                    ["Hizmet güncellemeleri ve kampanya e-postaları", "Açık rıza"],
                  ].map(([purpose, basis]) => (
                    <tr key={purpose} className="even:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-gray-600">{purpose}</td>
                      <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Açık rızaya dayanan işlemler için onayınızı istiyoruz ve rızanızı her zaman geri çekebilirsiniz.
            </p>
          </section>

          {/* 3. Veri Güvenliği */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">3. Veri Güvenliği</h2>
            <p className="mb-4">
              Verilerinizi korumak için aşağıdaki teknik ve organizasyonel tedbirleri uyguluyoruz:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "🔐", title: "Şifreleme", desc: "Tüm trafik TLS 1.2+ ile şifrelenir. Depolamada AES-256 kullanılır." },
                { icon: "🔑", title: "Şifre Güvenliği", desc: "Şifreler bcrypt ile hash'lenir; düz metin hiçbir zaman saklanmaz." },
                { icon: "💳", title: "Ödeme Güvenliği", desc: "Kart numarası sistemimizde saklanmaz; ödeme altyapısı PCI-DSS uyumludur." },
                { icon: "🛡️", title: "Erişim Kontrolü", desc: "Rol tabanlı yetkilendirme (RLS) ile sadece yetkili kişiler verilere erişebilir." },
                { icon: "📋", title: "Denetim Logları", desc: "Tüm hassas işlemler kayıt altına alınır ve düzenli olarak incelenir." },
                { icon: "🚨", title: "İhlal Bildirimi", desc: "Veri ihlali tespit edilmesi halinde 72 saat içinde KVKK Kurulu'na bildirim yapılır; etkilenen kullanıcılar da bilgilendirilir." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                  <p className="font-semibold text-gray-800 text-xs mb-1">{item.icon} {item.title}</p>
                  <p className="text-[11px] text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              <strong>Önemli:</strong> İnternet üzerinden hiçbir veri aktarımı %100 güvenli değildir.
              Platformumuzu kullanarak bu riski kabul etmiş olursunuz; ancak makul tüm önlemleri
              aldığımızı taahhüt ederiz.
            </div>
          </section>

          {/* 4. Çerezler */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">4. Çerez Politikası</h2>
            <p className="mb-4">
              Platformumuz aşağıdaki türde çerezler kullanmaktadır:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold">Çerez Türü</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Amaç</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Zorunlu mu?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Oturum çerezleri", "Giriş durumunuzu korur (Supabase auth token)", "Evet"],
                    ["Tercih çerezleri", "Popup kapatma gibi UI tercihlerini hatırlar (localStorage)", "Evet"],
                    ["Analitik çerezler", "Sayfa görüntüleme ve kullanım istatistikleri", "Hayır (rızayla)"],
                    ["Pazarlama çerezleri", "Meta Pixel — reklam performansı ölçümü ve yeniden hedefleme", "Hayır (rızayla)"],
                  ].map(([type, purpose, required]) => (
                    <tr key={type} className="even:bg-gray-50/50">
                      <td className="px-4 py-2.5 font-medium text-gray-700">{type}</td>
                      <td className="px-4 py-2.5 text-gray-500">{purpose}</td>
                      <td className={`px-4 py-2.5 font-semibold ${required === "Evet" ? "text-emerald-600" : "text-orange-500"}`}>{required}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Zorunlu olmayan çerezler <strong className="text-gray-600">yalnızca açık rızanızla</strong>{" "}
              çalışır. Siteye ilk girişinizde çıkan çerez bandında &ldquo;Sadece zorunlu&rdquo; derseniz
              Meta Pixel <strong className="text-gray-600">hiç yüklenmez</strong> ve reklam ölçümü için
              hakkınızda hiçbir veri toplanmaz. Kararınızı sayfanın altındaki{" "}
              <strong className="text-gray-600">Çerez tercihleri</strong> bağlantısından dilediğiniz zaman
              değiştirebilirsiniz. Zorunlu çerezleri tarayıcı ayarlarınızdan kapatabilirsiniz; ancak
              bu durumda bazı platform özellikleri çalışmayabilir.
            </p>
          </section>

          {/* 5. Üçüncü Taraflarla Paylaşım */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">5. Üçüncü Taraflarla Veri Paylaşımı</h2>
            <p className="mb-4">
              Verileriniz <strong className="text-gray-800">satılmaz veya kiralanmaz.</strong>{" "}
              Yalnızca aşağıdaki taraflarla ve belirtilen kapsamda paylaşılır:
            </p>

            <div className="space-y-3">
              {[
                {
                  title: "Platform Koçları",
                  scope: "Ad, sınav türü, randevu zamanı",
                  reason: "Koçluk hizmetinin yürütülmesi",
                  location: "🇹🇷 Yurt içi",
                },
                {
                  title: "Supabase Inc. (altyapı)",
                  scope: "Tüm hesap ve kullanım verileri",
                  reason: "Veritabanı, kimlik doğrulama ve depolama",
                  location: "🇪🇺 AB bölgesi — GDPR uyumlu",
                },
                {
                  title: "Vercel Inc. (hosting)",
                  scope: "IP adresi, istek logları, anonim ziyaret istatistikleri (çerezsiz)",
                  reason: "Platform barındırma, CDN ve toplu ziyaretçi ölçümü",
                  location: "🌍 ABD/AB — SCCs kapsamında",
                },
                {
                  title: "Meta Platforms (yalnızca çerez onayı verirseniz)",
                  scope: "Çerez kimliği, IP adresi, ziyaret edilen sayfa ve form gönderimi olayı",
                  reason: "Instagram/Facebook reklam performansının ölçümü ve yeniden hedefleme",
                  location: "🌍 ABD/AB — SCCs kapsamında",
                },
                {
                  title: "Yetkili Kamu Kurumları",
                  scope: "Talep edilen bilgiler",
                  reason: "Yasal zorunluluk veya mahkeme kararı",
                  location: "🇹🇷 Yurt içi",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-gray-800 text-xs">{item.title}</p>
                    <span className="text-[11px] whitespace-nowrap text-gray-400">{item.location}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 text-[11px] text-gray-500">
                    <span><strong className="text-gray-600">Kapsam:</strong> {item.scope}</span>
                    <span><strong className="text-gray-600">Amaç:</strong> {item.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Saklama Süreleri */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">6. Veri Saklama Süreleri</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold">Veri Türü</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Süre</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Dayanak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Hesap bilgileri", "Silinmeden itibaren 3 yıl", "Meşru menfaat"],
                    ["Ödeme / fatura kayıtları", "10 yıl", "VUK yasal zorunluluk"],
                    ["Destek talepleri", "Kapanıştan itibaren 3 yıl", "Meşru menfaat"],
                    ["Kullanım logları", "6 ay", "Güvenlik / hata tespiti"],
                    ["Pazarlama verileri", "Rıza geri alınana kadar", "Açık rıza"],
                    ["Randevu kayıtları", "2 yıl", "Sözleşme ifası"],
                  ].map(([type, period, basis]) => (
                    <tr key={type} className="even:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-gray-600">{type}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-700">{period}</td>
                      <td className="px-4 py-2.5 text-gray-400">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 7. Çocukların Gizliliği */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">7. Çocukların Gizliliği</h2>
            <p>
              Platformumuz LGS, YKS ve KPSS adaylarına yönelik olup 13 yaş ve üzerindeki
              kullanıcılara hitap etmektedir. 13 yaşın altındaki çocuklardan bilerek kişisel
              veri toplamıyoruz.
            </p>
            <p className="mt-2">
              13 yaşın altında bir kullanıcının kayıt olduğunu fark etmemiz veya bize bildirilmesi
              durumunda ilgili hesap ve veriler derhal silinir. 18 yaşın altındaki kullanıcıların
              platforma ebeveyn/vasi onayıyla kaydolması gerekmektedir.
            </p>
          </section>

          {/* 8. Haklarınız */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">8. Gizlilik Haklarınız</h2>
            <p className="mb-4">
              Aşağıdaki hakları kullanmak için{" "}
              <a href="mailto:bilgi@rekorzeka.com" className="text-[#0E8FA3] hover:underline">
                bilgi@rekorzeka.com
              </a>{" "}
              adresine yazabilir ya da{" "}
              <a href="/kvkk" className="text-[#0E8FA3] hover:underline">KVKK Aydınlatma Metni</a>mizdeki
              başvuru kanallarını kullanabilirsiniz:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ["Erişim", "Hakkınızda hangi verilerin tutulduğunu öğrenme"],
                ["Düzeltme", "Yanlış veya eksik verilerin güncellenmesi"],
                ["Silme", "\"Unutulma hakkı\" — verilerinizin silinmesini talep etme"],
                ["Kısıtlama", "Belirli işlemlerin durdurulmasını isteme"],
                ["Taşınabilirlik", "Verilerinizi makine okunabilir formatta alma"],
                ["İtiraz", "Meşru menfaate dayalı işlemelere itiraz etme"],
                ["Rıza geri alma", "Onay verdiğiniz işlemleri istediğiniz zaman durdurma"],
                ["Şikayet", "KVKK Kurulu'na başvurma hakkı"],
              ].map(([right, desc]) => (
                <div key={right} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="font-semibold text-gray-800 text-xs mb-0.5">{right}</p>
                  <p className="text-[11px] text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 9. Politika Değişiklikleri */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">9. Politika Değişiklikleri</h2>
            <p>
              Bu politikada yapılan önemli değişiklikler, yürürlük tarihinden en az{" "}
              <strong className="text-gray-800">30 gün önce</strong> kayıtlı e-posta adresinize
              bildirilir ve platform ana sayfasında duyurulur.
            </p>
            <p className="mt-2">
              Bildirimin ardından platformu kullanmaya devam etmeniz, güncellenmiş politikayı
              kabul ettiğiniz anlamına gelir. Kabul etmiyorsanız hesabınızı kapatmak ve
              verilerinizin silinmesini talep etmek için bizimle iletişime geçebilirsiniz.
            </p>
          </section>

          {/* 10. İletişim */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">10. İletişim</h2>
            <div className="rounded-xl border border-[#0E8FA3]/20 bg-[#eef9f9] px-5 py-4 space-y-1 text-xs text-gray-600">
              <p><strong className="text-gray-800">Rekor Zeka Eğitim Teknolojileri</strong></p>
              <p>E-posta: <a href="mailto:bilgi@rekorzeka.com" className="text-[#0E8FA3] hover:underline">bilgi@rekorzeka.com</a></p>
              <p>Web: <a href="https://rekorzeka.com" className="text-[#0E8FA3] hover:underline">rekorzeka.com</a></p>
              <p className="pt-1 text-gray-400">
                Gizlilik talepleriniz için e-postanızın konusuna <strong>&quot;Gizlilik Talebi&quot;</strong> yazmanız
                yanıt sürenizi kısaltır.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
