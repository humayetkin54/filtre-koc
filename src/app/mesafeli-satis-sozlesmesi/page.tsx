export default function MesafeliSatisSozlesmesiPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-sm border border-gray-100 p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0E8FA3] mb-2">Yasal Metin</p>
        <h1 className="text-2xl font-bold text-[#1e293b] mb-6">Mesafeli Satış Sözleşmesi</h1>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-5 leading-relaxed">
          <p>
            Bu Mesafeli Satış Sözleşmesi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
            Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmıştır.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">1. Taraflar</h2>
          <p>
            <strong className="text-gray-800">Satıcı:</strong> Rekor Zeka Eğitim Teknolojileri<br />
            <strong className="text-gray-800">Alıcı:</strong> Platforma kayıtlı kullanıcı
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">2. Konu ve Kapsam</h2>
          <p>
            Bu sözleşme, Rekor Zeka platformu üzerinden satın alınan dijital koçluk paketlerini kapsar.
            Hizmetler; birebir görüşme seansları, çalışma planı ve rehberlik desteğinden oluşmaktadır.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">3. Ödeme</h2>
          <p>
            Ödeme, satın alma anında kredi/banka kartı ile tahsil edilir. Taksit seçenekleri
            ödeme sayfasında sunulmaktadır. Fatura, kayıtlı e-posta adresinize iletilir.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">4. Cayma Hakkı</h2>
          <p>
            Tüketici, hizmet ifasına başlanmadan önce 14 (on dört) gün içinde herhangi bir
            gerekçe göstermeksizin sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanımı
            için{" "}
            <a href="mailto:destek@rekorzeka.com" className="text-[#0E8FA3] hover:underline">
              destek@rekorzeka.com
            </a>{" "}
            adresine yazılı bildirim yapılması yeterlidir.
          </p>
          <p>
            İlk koçluk seansının gerçekleştirilmesiyle birlikte hizmet ifasına başlanmış
            sayılır ve cayma hakkı sona erer.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">5. İade Koşulları</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Seansa başlanmamışsa: 14 gün içinde tam iade</li>
            <li>Koç değişikliği talebi: ücretsiz gerçekleştirilir</li>
            <li>İade süreci 5-10 iş günü içinde tamamlanır</li>
          </ul>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">6. Uyuşmazlık Çözümü</h2>
          <p>
            Bu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti mahkemeleri ve
            Tüketici Hakem Heyetleri yetkilidir.
          </p>

          <div className="mt-8 rounded-xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-500">
            Son güncelleme: Temmuz 2026
          </div>
        </div>
      </div>
    </div>
  );
}
