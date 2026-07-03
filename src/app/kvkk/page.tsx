export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-sm border border-gray-100 p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0E8FA3] mb-2">Yasal Metin</p>
        <h1 className="text-2xl font-bold text-[#1e293b] mb-6">Kişisel Verilerin Korunması Aydınlatma Metni</h1>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-5 leading-relaxed">
          <p>
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında
            <strong className="text-gray-800"> Rekor Zeka Eğitim Teknolojileri</strong> ("Şirket") tarafından
            veri sorumlusu sıfatıyla hazırlanmıştır.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">1. Toplanan Kişisel Veriler</h2>
          <p>
            Platformumuzu kullanmanız sırasında ad-soyad, e-posta adresi, sınıf/eğitim durumu,
            sınav hedefleri ve tercih bilgileri gibi kişisel verileriniz işlenmektedir.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">2. Kişisel Verilerin İşlenme Amacı</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Koç eşleştirme hizmetinin sunulması</li>
            <li>Randevu ve paket yönetimi</li>
            <li>Müşteri destek hizmetlerinin yürütülmesi</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>İstatistiksel analiz ve hizmet geliştirme</li>
          </ul>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">3. Hukuki Dayanak</h2>
          <p>
            Kişisel verileriniz; sözleşmenin ifası, meşru menfaat ve açık rızanız kapsamında
            KVKK'nın 5. ve 6. maddeleri uyarınca işlenmektedir.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">4. Veri Saklama Süresi</h2>
          <p>
            Kişisel verileriniz, hizmet ilişkisinin sona ermesinden itibaren yasal saklama
            süreleri (genellikle 10 yıl) boyunca muhafaza edilmektedir.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">5. Haklarınız</h2>
          <p>KVKK'nın 11. maddesi kapsamında:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenen veriler hakkında bilgi talep etme</li>
            <li>Verilerin silinmesini veya yok edilmesini isteme</li>
            <li>İşleme itiraz etme</li>
          </ul>
          <p>
            haklarına sahipsiniz. Talepleriniz için{" "}
            <a href="mailto:destek@rekorzeka.com" className="text-[#0E8FA3] hover:underline">
              destek@rekorzeka.com
            </a>{" "}
            adresine yazabilirsiniz.
          </p>

          <div className="mt-8 rounded-xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-500">
            Son güncelleme: Temmuz 2026
          </div>
        </div>
      </div>
    </div>
  );
}
