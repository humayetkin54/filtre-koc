export default function MesafeliSatisSozlesmesiPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-sm border border-gray-100 p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0E8FA3] mb-2">Yasal Metin</p>
        <h1 className="text-2xl font-bold text-[#1e293b] mb-1">Mesafeli Hizmet Satış Sözleşmesi</h1>
        <p className="text-xs text-gray-400 mb-8">
          Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
          Mesafeli Sözleşmeler Yönetmeliği (RG: 27.11.2014 / 29188) kapsamında
          hazırlanmıştır. Satın alma işlemi tamamlandığında bu sözleşmenin tüm
          hükümlerini okuduğunuz ve kabul ettiğiniz varsayılır.
        </p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

          {/* 1. Taraflar */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">1. Taraflar</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Satıcı */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                <div className="bg-[#123A57] px-4 py-2.5">
                  <p className="text-xs font-bold text-white">SATICI / HİZMET SAĞLAYICI</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    ["Unvan", "Rekor Zeka Eğitim Teknolojileri"],
                    ["Adres", "Türkiye"],
                    ["E-posta", "bilgi@rekorzeka.com"],
                    ["Web", "rekorzeka.com"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-3 px-4 py-2.5 text-xs">
                      <span className="w-16 flex-shrink-0 font-semibold text-gray-500">{label}</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alıcı */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                <div className="bg-[#0E8FA3] px-4 py-2.5">
                  <p className="text-xs font-bold text-white">ALICI / TÜKETİCİ</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    ["Ad Soyad", "Platforma kayıtlı kullanıcı adı"],
                    ["E-posta", "Hesaba kayıtlı e-posta adresi"],
                    ["Kayıt No", "Supabase kullanıcı kimliği (UUID)"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-3 px-4 py-2.5 text-xs">
                      <span className="w-16 flex-shrink-0 font-semibold text-gray-500">{label}</span>
                      <span className="text-gray-500 italic">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 text-[11px] text-gray-400 border-t border-gray-100">
                  Alıcı bilgileri satın alma anında sisteme kayıtlı verilerden otomatik olarak alınır.
                </div>
              </div>
            </div>
          </section>

          {/* 2. Sözleşmenin Konusu */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">2. Sözleşmenin Konusu ve Kapsamı</h2>
            <p>
              Bu sözleşme; Alıcı'nın <strong className="text-gray-800">rekorzeka.com</strong> platformu
              üzerinden elektronik ortamda satın aldığı <strong className="text-gray-800">dijital koçluk
              hizmet paketinin</strong> temel nitelikleri, bedeli, ödeme ve ifa koşulları ile tarafların
              hak ve yükümlülüklerini düzenlemektedir.
            </p>
            <p className="mt-3">
              Hizmet; seçilen paket türüne göre belirli sayıda birebir görüntülü/sesli görüşme seansı,
              kişiselleştirilmiş çalışma planı ve süreç boyunca rehberlik desteğinden oluşmaktadır.
              Seans sıklığı ve formatı seçilen pakete göre farklılık gösterir; detaylar paket satın
              alma sayfasında ve onay e-postasında belirtilir.
            </p>
          </section>

          {/* 3. Hizmetin Temel Nitelikleri */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">3. Hizmetin Temel Nitelikleri</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold">Özellik</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Açıklama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Hizmet türü", "Dijital / çevrim içi bireysel koçluk (YKS, LGS, KPSS/AGS, PDR)"],
                    ["Sunum kanalı", "Platform üzerinden video/sesli görüşme ya da mesajlaşma"],
                    ["Seans sıklığı", "Pakete göre haftada 1–4 seans (onay e-postasında belirtilir)"],
                    ["Seans süresi", "Pakete göre 30–60 dakika"],
                    ["Süre", "Aylık veya yıllık — satın alma anında seçilen plana göre"],
                    ["Dil", "Türkçe"],
                    ["Koç atama", "Eşleştirme algoritması + kullanıcı tercihi"],
                  ].map(([feature, desc]) => (
                    <tr key={feature} className="even:bg-gray-50/50">
                      <td className="px-4 py-2.5 font-medium text-gray-700">{feature}</td>
                      <td className="px-4 py-2.5 text-gray-500">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Bedel ve Ödeme */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">4. Hizmet Bedeli ve Ödeme</h2>
            <div className="rounded-xl border border-[#0E8FA3]/20 bg-[#eef9f9] px-5 py-4 text-xs text-gray-600 mb-4">
              <p className="font-semibold text-gray-800 mb-1">Fiyatlandırma</p>
              <p>
                Sözleşme bedeli, satın alma anında seçilen paket türüne ve plana (aylık/yıllık)
                göre belirlenir. Güncel fiyatlar her zaman{" "}
                <a href="/paketler" className="text-[#0E8FA3] hover:underline">rekorzeka.com/paketler</a>{" "}
                adresinde <strong>KDV dahil</strong> olarak gösterilmektedir. Tüketici, siparişi
                onaylamadan önce ödeyeceği toplam tutarı sipariş özeti ekranında görür.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              {[
                "Ödeme; kredi kartı veya banka kartı ile satın alma anında tek seferde tahsil edilir.",
                "Taksit seçenekleri ödeme sayfasında anlaşmalı bankalar için sunulur; taksit sayısı ve tutarları ödeme ekranında gösterilir.",
                "Kredi kartı bilgileri sistemimizde saklanmaz; ödeme işlemi PCI-DSS uyumlu altyapı üzerinden gerçekleştirilir.",
                "Fatura, ödeme tamamlandıktan sonra kayıtlı e-posta adresine iletilir.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#0E8FA3] font-bold flex-shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5. İfa */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">5. Hizmetin İfası ve Süresi</h2>
            <ul className="space-y-2 text-xs text-gray-600">
              {[
                "Ödemenin onaylanmasının ardından en geç 48 saat içinde koç ataması yapılır ve Alıcı e-posta ile bilgilendirilir.",
                "İlk seans randevusu, koç atandıktan sonra platform üzerinden alınır.",
                "Sözleşme süresi, koç atamasının tamamlandığı tarihten itibaren seçilen plan süresince (1 ay veya 12 ay) devam eder.",
                "Koçun herhangi bir sebeple hizmet verememesi durumunda Satıcı, Alıcı'ya ücretsiz koç değişikliği ya da seçime göre orantılı ücret iadesi sunar.",
                "Alıcı'nın randevuya gelmemesi veya zamanında iptal etmemesi halinde seans hakkı kullanılmış sayılır; iptal için seans başlangıcından en az 24 saat önce bildirim yapılması gerekir.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#0E8FA3] font-bold flex-shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 6. Cayma Hakkı */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">6. Cayma Hakkı</h2>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4 mb-4 text-xs text-emerald-800">
              <p className="font-semibold mb-1">✔ Cayma hakkı mevcuttur</p>
              <p>
                Alıcı, hizmet ifasına başlanmadan önce sözleşme tarihinden itibaren{" "}
                <strong>14 (on dört) takvim günü</strong> içinde herhangi bir gerekçe
                göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
              </p>
            </div>

            <p className="text-xs mb-3">
              Cayma hakkının kullanımı için Alıcı'nın aşağıdaki kanallardan birini kullanarak
              Satıcı'ya yazılı bildirimde bulunması yeterlidir:
            </p>
            <ul className="space-y-1 text-xs text-gray-600 mb-4 pl-4 list-disc">
              <li>E-posta: <a href="mailto:bilgi@rekorzeka.com" className="text-[#0E8FA3] hover:underline">bilgi@rekorzeka.com</a> — konu: &quot;Cayma Bildirimi&quot;</li>
              <li>Platform destek formu: <a href="/destek" className="text-[#0E8FA3] hover:underline">rekorzeka.com/destek</a></li>
            </ul>

            <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4 text-xs text-amber-800 space-y-3">
              <p className="font-semibold">⚠ Cayma hakkının sona erdiği hal — Yasal istisna</p>
              <p>
                Mesafeli Sözleşmeler Yönetmeliği madde 15/1-(ğ) uyarınca; tüketicinin{" "}
                <strong>onayıyla hizmet ifasına başlanmış</strong> olan dijital hizmet
                sözleşmelerinde cayma hakkı sona erer.
              </p>
              <p>
                Bu nedenle <strong>ilk koçluk seansının gerçekleştirilmesi</strong>, Alıcı'nın
                hizmet ifasına başlanmasını açıkça onayladığı an olarak kabul edilir ve cayma
                hakkı bu anı izleyen süre için kullanılamaz hale gelir.
              </p>
              <p>
                Satın alma işlemini tamamlayan Alıcı, sipariş onay ekranındaki{" "}
                <strong>&quot;İlk seansım gerçekleştiğinde cayma hakkımın sona ereceğini okudum,
                anladım ve onaylıyorum&quot;</strong> seçeneğini işaretleyerek bu hususta açıkça
                bilgilendirildiğini ve rıza gösterdiğini beyan eder.
              </p>
            </div>
          </section>

          {/* 7. İade */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">7. İade Koşulları ve Prosedürü</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-xs border border-gray-100 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold">Durum</th>
                    <th className="text-left px-4 py-2.5 font-semibold">İade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["İlk seans gerçekleşmeden 14 gün içinde cayma", "Tam iade"],
                    ["İlk seans gerçekleştikten sonra", "Cayma hakkı sona erer; iade yapılmaz"],
                    ["Satıcı kaynaklı iptal/aksaklık", "Kullanılmayan seanslar için orantılı iade"],
                    ["Koç değişikliği talebi", "Ücretsiz gerçekleştirilir, iade gerekmez"],
                    ["Teknik arıza (Satıcı kusuru)", "İlgili seans için telafi seansı veya iade"],
                  ].map(([situation, result]) => (
                    <tr key={situation} className="even:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-gray-600">{situation}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-700">{result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500">
              Onaylanan iade tutarı, <strong className="text-gray-700">5–10 iş günü</strong> içinde
              ödemenin yapıldığı kredi/banka kartına iade edilir. Bankanın hesaba yansıtma süresi
              Satıcı'nın kontrolünde değildir; kartınıza bağlı olarak ek 3–14 iş günü sürebilir.
            </p>
          </section>

          {/* 8. Ön Bilgilendirme ve Teyit */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">8. Ön Bilgilendirme ve Sözleşme Teyidi</h2>
            <ul className="space-y-2 text-xs text-gray-600">
              {[
                "Alıcı, satın alma işlemini tamamlamadan önce bu sözleşmeyi ve KVKK Aydınlatma Metni'ni okuma imkânı bulur; işlemi tamamlaması bu belgeleri kabul ettiği anlamına gelir (Yönetmelik m.8).",
                "Satıcı, sipariş onaylandıktan hemen sonra sözleşmenin bir örneğini Alıcı'nın kayıtlı e-posta adresine kalıcı veri saklayıcısı (e-posta) aracılığıyla iletir (Yönetmelik m.12).",
                "Alıcı dilediği zaman bu sözleşmeye rekorzeka.com/mesafeli-satis-sozlesmesi adresinden erişebilir.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#0E8FA3] font-bold flex-shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 9. Fesih ve Temerrüt */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">9. Fesih ve Temerrüt</h2>

            <div className="space-y-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-xs">
                <p className="font-semibold text-gray-800 mb-2">Alıcı'nın fesih hakkı</p>
                <p className="text-gray-500">
                  Alıcı, sözleşme süresinin dolmasını beklemeksizin sözleşmeyi feshedebilir.
                  Bu durumda kullanılmamış seanslar için orantılı iade yukarıdaki tabloya göre hesaplanır.
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-xs">
                <p className="font-semibold text-gray-800 mb-2">Satıcı'nın fesih hakkı</p>
                <p className="text-gray-500">
                  Alıcı'nın platform kurallarını ihlal etmesi, koça veya diğer kullanıcılara
                  zarar vermesi ya da ödeme yapılmaması halinde Satıcı sözleşmeyi derhal feshedebilir.
                  Fesih öncesinde Alıcı e-posta yoluyla bilgilendirilir ve itiraz için 5 iş günü
                  tanınır.
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-xs">
                <p className="font-semibold text-gray-800 mb-2">Temerrüt</p>
                <p className="text-gray-500">
                  Ödeme başarısız olursa Satıcı hizmet erişimini askıya alır ve Alıcı'ya
                  3 iş günü içinde bildirim yapar. 7 iş günü içinde ödeme sağlanmaz ise
                  sözleşme kendiliğinden sona erer ve kullanılmayan dönem için iade yapılmaz.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Sözleşme Süresi */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">10. Sözleşme Süresi ve Dili</h2>
            <ul className="space-y-2 text-xs text-gray-600">
              {[
                "Sözleşme, Alıcı'nın satın alma işlemini tamamladığı tarihte yürürlüğe girer.",
                "Süre, seçilen plana bağlı olarak 1 (bir) ay veya 12 (on iki) aydır.",
                "Sözleşme, süresi dolduğunda otomatik olarak yenilenmez; yenileme Alıcı'nın açık talebi ve yeni bir ödeme işlemiyle gerçekleşir.",
                "Bu sözleşmenin dili Türkçedir. Farklı dillerdeki çevirilerle çelişki halinde Türkçe metin esas alınır.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#0E8FA3] font-bold flex-shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 11. Uyuşmazlık Çözümü */}
          <section>
            <h2 className="text-base font-bold text-[#1e293b] mb-3">11. Uyuşmazlık Çözümü ve Yetkili Merci</h2>
            <p className="text-xs text-gray-600 mb-3">
              Bu sözleşmeden doğabilecek uyuşmazlıklarda aşağıdaki başvuru yolları mevcuttur:
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "Önce Satıcı ile iletişim",
                  desc: "Uyuşmazlık doğduğunda öncelikle bilgi@rekorzeka.com adresine başvurmanızı tavsiye ederiz. Talebiniz 5 iş günü içinde yanıtlanır.",
                },
                {
                  title: "Tüketici Hakem Heyeti",
                  desc: "6502 sayılı Kanun'un 68. maddesi uyarınca belirlenen parasal sınırlar dahilindeki tüketici uyuşmazlıkları için Tüketici Hakem Heyetlerine başvurabilirsiniz.",
                },
                {
                  title: "Tüketici Mahkemeleri",
                  desc: "Parasal sınırı aşan uyuşmazlıklar için Alıcı'nın veya Satıcı'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.",
                },
                {
                  title: "e-Devlet Başvurusu",
                  desc: "tüketici.gov.tr üzerinden de şikâyetinizi iletebilirsiniz.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#0E8FA3] flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-0.5">{item.title}</p>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Son not */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 text-xs text-gray-400">
            <p>Son güncelleme: Temmuz 2026 &nbsp;·&nbsp; Bu sözleşme Türk hukuku kapsamında hazırlanmıştır.</p>
            <p className="mt-1">
              Sorularınız için:{" "}
              <a href="mailto:bilgi@rekorzeka.com" className="text-[#0E8FA3] hover:underline">
                bilgi@rekorzeka.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
