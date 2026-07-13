import { createClient } from "@/lib/supabase/server";
import DestekForm from "./destek-form";

export default async function DestekPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#123A57] to-[#0E8FA3] px-4 py-14 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-8 h-8">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
            <circle cx="12" cy="12" r="4" />
            <path strokeLinecap="round" d="M4.93 4.93l3.54 3.54M15.54 15.54l3.53 3.53M19.07 4.93l-3.53 3.54M8.46 15.54l-3.53 3.53" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Destek Merkezi</h1>
        <p className="text-white/70 text-sm max-w-md mx-auto">
          Teknik sorunlar, satın alma ve paket işlemleri için bizimle iletişime geçin.
          Uzman ekibimiz en kısa sürede yanıt verir.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Sol — Hızlı bilgi */}
        <div className="space-y-4">
          <h2 className="font-bold text-[#1e293b] text-sm uppercase tracking-widest">Sık Başvurulan Konular</h2>

          {[
            { icon: "💳", title: "Satın alma ve ödeme", desc: "Paket ücretleri, ödeme yöntemleri, fatura" },
            { icon: "🔄", title: "Paket iptali / iade", desc: "7 gün içinde koşulsuz iade" },
            { icon: "👨‍🏫", title: "Koç değişikliği", desc: "Ücretsiz koç değiştirme hakkı" },
            { icon: "🔐", title: "Hesap ve şifre", desc: "Giriş sorunları, e-posta değişikliği" },
            { icon: "📅", title: "Randevu sorunları", desc: "Randevu iptali veya yeniden planlama" },
            { icon: "🐞", title: "Hata bildirimi", desc: "Teknik sorunları bildirin" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}

          <div className="rounded-xl bg-[#eef9f9] border border-[#0E8FA3]/20 p-4 text-xs text-gray-600 leading-relaxed">
            <p className="font-semibold text-[#0E8FA3] mb-1">⏱ Yanıt süresi</p>
            <p>Hafta içi <strong>2–4 saat</strong>, hafta sonu <strong>24 saat</strong> içinde yanıt alırsınız.</p>
          </div>
        </div>

        {/* Sağ — Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8">
            <h2 className="font-bold text-lg text-[#1e293b] mb-1">Destek Talebi Oluştur</h2>
            <p className="text-sm text-gray-500 mb-6">Talebiniz en kısa sürede incelenecek.</p>
            <DestekForm userEmail={user?.email ?? ""} userName={user?.user_metadata?.full_name ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
