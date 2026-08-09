export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-sm border border-gray-100 p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0E8FA3] mb-2">Yasal Metin</p>
        <h1 className="text-2xl font-bold text-[#1e293b] mb-1">
          Kişisel Verilerin Korunması Kanunu (KVKK) Kapsamında Aydınlatma Metni
        </h1>
        <p className="text-xs text-gray-400 mb-8">Son güncelleme: Temmuz 2026</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

          {/* 1. Veri Sorumlusu */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">1. Veri Sorumlusunun Kimliği ve İletişim Bilgileri</h2>
            <p className="mb-3">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca kişisel verileriniz;
              aşağıda bilgileri yer alan veri sorumlusu tarafından işlenmektedir.
            </p>
            <div className="rounded-xl bg-gray-50 border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              {[
                ["Unvan", "Rekor Zeka Eğitim Teknolojileri"],
                ["Adres", "Türkiye"],
                ["E-posta", "bilgi@rekorzeka.com"],
                ["Web Sitesi", "rekorzeka.com"],
              ].map(([label, value]) => (
                <div key={label} className="flex px-4 py-3 gap-4">
                  <span className="w-28 flex-shrink-0 font-semibold text-gray-700">{label}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. İşlenen Kişisel Veriler ve Toplama Yöntemleri */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">2. İşlenen Kişisel Veriler ve Toplama Yöntemleri</h2>
            <p className="mb-3">
              Kişisel verileriniz; platform kayıt formları, anket/onboarding adımları, ödeme sayfaları,
              destek talep formları, çerezler ve benzeri otomatik yollarla toplanmaktadır.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold">Veri Kategorisi</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Örnekler</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Toplama Yöntemi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Kimlik", "Ad, soyad", "Kayıt formu"],
                    ["İletişim", "E-posta adresi", "Kayıt / destek formu"],
                    ["Eğitim / Hedef", "Sınıf, sınav türü, hedef üniversite/bölüm, net bilgileri", "Onboarding anketi"],
                    ["Finansal", "Ödeme onay kaydı (kart numarası saklanmaz)", "Ödeme altyapısı"],
                    ["Kullanım", "Oturum, sayfa görüntüleme, tıklama verileri", "Çerez / sunucu logu"],
                    ["İletişim İçeriği", "Destek talepleri, mesaj içerikleri", "Destek formu"],
                  ].map(([cat, ex, method]) => (
                    <tr key={cat} className="even:bg-gray-50/50">
                      <td className="px-4 py-2.5 font-medium text-gray-700">{cat}</td>
                      <td className="px-4 py-2.5 text-gray-500">{ex}</td>
                      <td className="px-4 py-2.5 text-gray-500">{method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. İşleme Amaçları ve Hukuki Dayanaklar */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">3. Kişisel Verilerin İşlenme Amaçları ve Hukuki Dayanakları</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold">Amaç</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Hukuki Dayanak (KVKK m.5)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Üyelik ve kimlik doğrulama işlemleri", "Sözleşmenin kurulması ve ifası (m.5/2-c)"],
                    ["Koç eşleştirme hizmetinin sunulması", "Sözleşmenin ifası (m.5/2-c)"],
                    ["Randevu ve paket yönetimi", "Sözleşmenin ifası (m.5/2-c)"],
                    ["Ödeme ve fatura işlemleri", "Yasal yükümlülüğün yerine getirilmesi (m.5/2-ç)"],
                    ["Müşteri destek hizmetleri", "Meşru menfaat (m.5/2-f)"],
                    ["Platform güvenliği ve hata tespiti", "Meşru menfaat (m.5/2-f)"],
                    ["İstatistiksel analiz ve hizmet geliştirme", "Açık rıza (m.5/1)"],
                    ["Pazarlama ve bilgilendirme e-postaları", "Açık rıza (m.5/1)"],
                  ].map(([purpose, basis]) => (
                    <tr key={purpose} className="even:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-gray-600">{purpose}</td>
                      <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Aktarım */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">4. Kişisel Verilerin Aktarılması</h2>
            <p className="mb-4">
              Kişisel verileriniz KVKK'nın 8. ve 9. maddeleri çerçevesinde aşağıdaki taraflarla
              ve belirtilen amaçlarla sınırlı biçimde paylaşılmaktadır:
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "Koçlar (platform kullanıcıları)",
                  desc: "Eşleştirme ve randevu süreçlerinin yürütülmesi amacıyla ad, sınav türü ve iletişim bilgileri paylaşılır.",
                  flag: "🇹🇷 Yurt içi",
                },
                {
                  title: "Supabase (veritabanı ve kimlik doğrulama altyapısı)",
                  desc: "Kullanıcı verileri Supabase'in EU bölgesindeki sunucularında saklanmaktadır. Supabase, GDPR uyumlu bir veri işleyicidir.",
                  flag: "🇪🇺 AB (yeterlilik kararı mevcut)",
                },
                {
                  title: "Vercel (barındırma/hosting)",
                  desc: "Platform, Vercel altyapısında çalışmaktadır. Vercel, GDPR uyumlu olup veri işleme sözleşmesi imzalanmıştır.",
                  flag: "🌍 ABD/AB (SCCs ile güvence altında)",
                },
                {
                  title: "Yetkili kamu kuruluşları",
                  desc: "Yasal zorunluluk veya resmi talep halinde ilgili mevzuat kapsamında paylaşılır.",
                  flag: "🇹🇷 Yurt içi",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-gray-800 text-xs">{item.title}</p>
                    <span className="text-[11px] whitespace-nowrap text-gray-400">{item.flag}</span>
                  </div>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Saklama Süresi */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">5. Saklama Süreleri</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold">Veri Türü</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Saklama Süresi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Üyelik ve hesap bilgileri", "Hesap silinmesinden itibaren 3 yıl"],
                    ["Ödeme ve fatura kayıtları", "10 yıl (VUK gereği)"],
                    ["Destek talepleri", "Kapanış tarihinden itibaren 3 yıl"],
                    ["Kullanım logları (çerez vb.)", "6 ay"],
                    ["Pazarlama onayı ile toplanan veriler", "Rıza geri alınana kadar"],
                  ].map(([type, period]) => (
                    <tr key={type} className="even:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-gray-600">{type}</td>
                      <td className="px-4 py-2.5 text-gray-500">{period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 6. Veri Güvenliği */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">6. Veri Güvenliği Tedbirleri</h2>
            <p className="mb-3">
              Kişisel verilerinizin güvenliğini sağlamak amacıyla aşağıdaki teknik ve idari
              tedbirler alınmaktadır:
            </p>
            <ul className="space-y-2">
              {[
                "Tüm veri iletimi TLS 1.2+ şifreleme ile korunmaktadır.",
                "Şifreler tek yönlü hash algoritmaları (bcrypt) ile saklanmaktadır; düz metin şifre tutulmamaktadır.",
                "Ödeme işlemlerinde kart numarası sistemimizde saklanmamaktadır.",
                "Veritabanı erişimi rol tabanlı yetkilendirme (RLS) ile kısıtlanmıştır.",
                "Veri ihlali durumunda KVKK'nın öngördüğü 72 saat içinde Kurul'a bildirim yapılacaktır.",
                "Çalışanlar ve hizmet sağlayıcılar gizlilik yükümlülüğü kapsamında hareket etmektedir.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs text-gray-600">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-[#eef9f9] border border-[#0E8FA3]/20 flex items-center justify-center text-[#0E8FA3] font-bold text-[10px]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 7. Haklar */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">7. İlgili Kişi Olarak Haklarınız (KVKK m.11)</h2>
            <p className="mb-3">Kişisel verilerinize ilişkin aşağıdaki haklara sahipsiniz:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ["Bilgi edinme", "Kişisel verilerinizin işlenip işlenmediğini öğrenme"],
                ["Bilgi talep etme", "İşlenen veriler, amaçları ve aktarılan taraflar hakkında bilgi alma"],
                ["Amaca uygunluk denetimi", "Verilerin amacına uygun kullanılıp kullanılmadığını öğrenme"],
                ["Düzeltme", "Eksik veya yanlış verilerin düzeltilmesini isteme"],
                ["Silme / yok etme", "Koşulların oluşması halinde verilerin silinmesini isteme"],
                ["Üçüncü kişilere bildirim", "Düzeltme ve silme işlemlerinin aktarılan taraflara bildirilmesini talep etme"],
                ["İtiraz", "İşlemenin hukuka aykırı olduğunu öne sürerek karşı çıkma"],
                ["Otomatik sisteme itiraz", "Otomatik analiz sonucuyla aleyhinize çıkan kararalara itiraz etme"],
                ["Zararın giderilmesi", "İşleme nedeniyle uğradığınız zararın tazminini talep etme"],
              ].map(([right, desc]) => (
                <div key={right} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">
                  <p className="font-semibold text-gray-800 text-xs mb-0.5">{right}</p>
                  <p className="text-[11px] text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Başvuru Yolları */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">8. Başvuru Usulü</h2>
            <p className="mb-4">
              Haklarınızı kullanmak için aşağıdaki kanallardan herhangi biriyle başvurabilirsiniz.
              Başvurularınız en geç <strong className="text-gray-800">30 gün</strong> içinde
              ücretsiz olarak sonuçlandırılır (işlemin ayrıca bir maliyet gerektirmesi halinde
              Kurul tarafından belirlenen tarife uygulanır).
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: "✉️",
                  title: "E-posta",
                  desc: "bilgi@rekorzeka.com adresine \"KVKK Başvurusu\" konusuyla yazabilirsiniz. Kimliğinizi doğrulayan bir belge eklemeniz gerekmektedir.",
                },
                {
                  icon: "📬",
                  title: "Yazılı Posta",
                  desc: "Islak imzalı dilekçenizi şirket adresimize posta veya kargo yoluyla iletebilirsiniz.",
                },
                {
                  icon: "🔏",
                  title: "Kayıtlı Elektronik Posta (KEP)",
                  desc: "KEP adresiniz varsa resmi KEP kanalımız üzerinden başvurabilirsiniz.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                  <span className="text-base mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-xs mb-0.5">{item.title}</p>
                    <p className="text-[11px] text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              Başvurunuzun tarafımızca yanıtlanmasından memnun kalmamanız durumunda
              <strong> Kişisel Verileri Koruma Kurulu</strong>&apos;na
              (<a href="https://www.kvkk.gov.tr" target="_blank" rel="noopener noreferrer" className="underline">kvkk.gov.tr</a>)
              şikâyette bulunma hakkınız saklıdır.
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
