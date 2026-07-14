import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { hizliOkumaAccess } from "@/lib/hizli-okuma-access";

export const metadata = { title: "Hızlı Okuma Paketleri | Rekor Zeka" };

const FEATURES = [
  {
    icon: "⏱️",
    title: "Premium Hız Testleri",
    desc: "WPM, anlama oranı ve etkili hız ölçümü; gelişimini ölçen detaylı analiz ve grafikler.",
  },
  {
    icon: "⚡",
    title: "Takistoskop",
    desc: "Görsel algı hızını artıran anlık kelime gösterme egzersizi — iç seslendirmeyi kırar.",
  },
  {
    icon: "🔲",
    title: "Blok Okuma",
    desc: "Metni tek tek değil, kelime grupları (bloklar) halinde okuma alışkanlığı kazandırır.",
  },
  {
    icon: "🎯",
    title: "Gölgeleme & Ritmik Göz",
    desc: "Odaklanmayı artıran ve göz kaslarını güçlendiren kayan vurgu çalışmaları.",
  },
  {
    icon: "🔢",
    title: "Göz Açısı (Schulte)",
    desc: "Tek bakışta daha fazla kelime görmek için çevresel görüşü genişletme tabloları.",
  },
  {
    icon: "🏅",
    title: "18 Başarı Rozeti",
    desc: "Oyunlaştırılmış ilerleme sistemi — her kilometre taşında yeni rozet, sürekli motivasyon.",
  },
];

// Hızlı Okuma'ya özel bağımsız satış sayfası.
// Koçluk üyeliği ŞART DEĞİL — yalnızca hızlı okuma da satın alınabilir.
export default async function HizliOkumaSatisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Üye değilse önce kayıt; üyeyse doğrudan ödeme akışı
  const buyHref = user
    ? `/satin-al?category=${encodeURIComponent("Hızlı Okuma")}&plan=${encodeURIComponent("30 Gün")}&price=2499&period=${encodeURIComponent("/30 gün")}`
    : "/kayit";

  // Zaten erişimi var mı? (paket dahili veya ayrı satın alım)
  let hasAccess = false;
  if (user) {
    const admin = createAdminClient();
    const { data: purchases } = await admin
      .from("purchases")
      .select("plan, category, created_at")
      .eq("user_id", user.id)
      .eq("status", "active");
    hasAccess = hizliOkumaAccess(purchases ?? []).allowed;
  }

  return (
    <main
      className="min-h-screen px-4 py-16 sm:px-6"
      style={{ background: "linear-gradient(160deg, #eef3f5 0%, #e3eef0 50%, #d8ebe9 100%)" }}
    >
      <div className="mx-auto max-w-xl">
        {/* Başlık */}
        <h1 className="text-center text-4xl font-bold tracking-tight text-[#123A57] sm:text-5xl">
          Hızlı Okuma Paketleri
        </h1>
        <div className="mt-5 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#d5f2f5] px-4 py-2 text-sm font-semibold text-[#0E8FA3]">
            💳 Tüm Paketlerde 12 Aya Varan Taksit İmkanı
          </span>
        </div>

        {/* Paket kartı */}
        <div className="relative mt-10 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 shadow">
            Sınav Odaklı
          </span>

          <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">Rekor Hız</h2>

          {/* Fiyat */}
          <div className="mt-5 text-center">
            <div className="text-base text-gray-400 line-through">4.499 ₺</div>
            <div className="mt-0.5">
              <span className="text-5xl font-bold tracking-tight text-[#123A57]">2.499</span>
              <span className="text-2xl font-bold text-[#123A57]"> ₺</span>
            </div>
            <div className="mt-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                %44 indirim
              </span>
            </div>
            <p className="mt-3 text-sm font-bold text-[#123A57]">🚀 30 Gün Tam Erişim</p>
          </div>

          <div className="my-7 border-t border-dashed border-gray-200" />

          {/* Özellikler */}
          <div className="space-y-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#eef9f9] text-lg">
                  {f.icon}
                </span>
                <div>
                  <p className="font-bold text-gray-900">{f.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Satın al / panelde aç */}
          {hasAccess ? (
            <Link
              href="/ogrenci-paneli/hizli-okuma"
              className="mt-8 block rounded-xl bg-[#0E8FA3] py-4 text-center text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#0c7d8f] hover:shadow-lg"
            >
              ✅ Erişimin Var — Panelde Aç
            </Link>
          ) : (
            <Link
              href={buyHref}
              className="mt-8 block rounded-xl bg-[#123A57] py-4 text-center text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#0d2c42] hover:shadow-lg"
            >
              Hemen Satın Al
            </Link>
          )}
          {!user && (
            <p className="mt-3 text-center text-xs text-gray-400">
              Satın almak için önce <strong className="text-[#0E8FA3]">ücretsiz üye</strong> olman gerekiyor —
              butona tıklayınca kayıt sayfasına yönlendirileceksin.
            </p>
          )}
          <p className="mt-3 text-center text-xs text-gray-400">
            Koçluk paketi almadan, yalnızca Hızlı Okuma eğitimini satın alabilirsin.
            7 gün koşulsuz iade garantisi geçerlidir.
          </p>
        </div>
      </div>
    </main>
  );
}
