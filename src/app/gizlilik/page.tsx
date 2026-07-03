export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-sm border border-gray-100 p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0E8FA3] mb-2">Yasal Metin</p>
        <h1 className="text-2xl font-bold text-[#1e293b] mb-6">Gizlilik Sözleşmesi</h1>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-5 leading-relaxed">
          <p>
            Bu Gizlilik Sözleşmesi, <strong className="text-gray-800">Rekor Zeka</strong> platformunun
            kullanıcılarına sunduğu hizmetlerde kişisel verilerin nasıl korunduğunu açıklar.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">1. Veri Güvenliği</h2>
          <p>
            Kişisel verileriniz, endüstri standardı SSL/TLS şifrelemesi ve güvenli bulut
            altyapısı (Supabase) üzerinde saklanmaktadır. Yetkisiz erişimi önlemek için
            teknik ve idari tedbirler alınmaktadır.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">2. Çerezler</h2>
          <p>
            Platform, oturum yönetimi ve kullanıcı deneyimini iyileştirmek amacıyla
            zorunlu çerezler kullanmaktadır. Üçüncü taraf reklam çerezleri kullanılmamaktadır.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">3. Üçüncü Taraflarla Paylaşım</h2>
          <p>
            Kişisel verileriniz; yasal zorunluluklar dışında üçüncü taraflarla
            satılmaz, kiralanmaz veya paylaşılmaz. Hizmet sunumu için zorunlu
            olan alt yüklenicilerle (ödeme altyapısı vb.) sınırlı veri paylaşımı
            yapılabilir.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">4. Çocukların Gizliliği</h2>
          <p>
            Platform, 13 yaşın altındaki çocuklara yönelik değildir. 13 yaş altı
            kullanıcıların verileri fark edildiğinde derhal silinmektedir.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">5. Değişiklikler</h2>
          <p>
            Bu politika güncellendiğinde kayıtlı e-posta adresinize bildirim gönderilir.
            Platformu kullanmaya devam etmeniz, güncel politikayı kabul ettiğiniz anlamına gelir.
          </p>

          <h2 className="text-base font-bold text-[#1e293b] mt-6">6. İletişim</h2>
          <p>
            Gizlilik ile ilgili sorularınız için:{" "}
            <a href="mailto:destek@rekorzeka.com" className="text-[#0E8FA3] hover:underline">
              destek@rekorzeka.com
            </a>
          </p>

          <div className="mt-8 rounded-xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-500">
            Son güncelleme: Temmuz 2026
          </div>
        </div>
      </div>
    </div>
  );
}
