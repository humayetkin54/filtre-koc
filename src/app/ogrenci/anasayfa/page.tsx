import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Panelim | Rekor Zeka" };

// Giriş sonrası öğrenci anasayfası (panel dışında, jetkampus tarzı hub).
export default async function OgrenciAnasayfaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const admin = createAdminClient();
  const { count } = await admin
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");
  if ((count ?? 0) === 0) redirect("/paketler");

  const firstName = (user.user_metadata?.full_name as string | undefined)?.split(" ").slice(0, 2).join(" ") ?? user.email;

  const bigCards = [
    {
      title: "Koçluk Sistemi",
      desc: "Birebir öğrenci takibi, ödevlendirme ve rehberlik hizmeti.",
      icon: "🎓",
      btn: "Koçluk Paneli",
      href: "/ogrenci-paneli",
      grad: "from-violet-500 to-purple-600",
      btnText: "text-purple-600",
    },
    {
      title: "Deneme Merkezi",
      desc: "Deneme sonuçların, AI kitapçık analizi ve net takibin bir arada.",
      icon: "📝",
      btn: "Denemelerim",
      href: "/ogrenci-paneli/deneme",
      grad: "from-[#0E8FA3] to-[#0b6d84]",
      btnText: "text-[#0E8FA3]",
    },
    {
      title: "Hızlı Okuma",
      desc: "WPM testi, takistoskop ve göz egzersizleriyle okuma hızını katla.",
      icon: "👁️",
      btn: "Hızlı Okumaya Başla",
      href: "/ogrenci-paneli/hizli-okuma",
      grad: "from-emerald-500 to-green-600",
      btnText: "text-emerald-600",
    },
  ];

  const quickLinks = [
    { href: "/ogrenci-paneli/ai-asistan", label: "RekorZeka AI Asistan", icon: "🤖" },
    { href: "/ogrenci-paneli/ai-analiz", label: "Deneme AI Analiz", icon: "📊" },
    { href: "/ogrenci-paneli/program", label: "Ders Programı", icon: "📅" },
    { href: "/ogrenci-paneli/odevler", label: "Ödevlerim", icon: "✅" },
    { href: "/ogrenci-paneli/hedefler", label: "Hedeflerim", icon: "🎯" },
    { href: "/ogrenci-paneli/mesajlar", label: "Mesajlaşma", icon: "💬" },
  ];

  return (
    <main className="min-h-full bg-gradient-to-br from-rose-50/40 via-slate-50 to-teal-50/40 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Başlık şeridi */}
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#123A57] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
            Panelim
          </span>
          <Link href="/destek" className="text-xs font-semibold text-gray-400 transition-colors hover:text-[#0E8FA3]">
            ? Yardım
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-[#123A57] sm:text-4xl">
            Hoş geldin, {firstName} 👋
          </h1>
          <Link
            href="/randevularim"
            className="rounded-xl bg-[#123A57] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d2c42]"
          >
            🗓 Randevu Al
          </Link>
        </div>

        {/* 3 büyük kart */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {bigCards.map((c) => (
            <div key={c.href} className={`flex flex-col rounded-2xl bg-gradient-to-br ${c.grad} p-6 text-white shadow-md`}>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{c.icon}</span>
                <h2 className="text-lg font-bold">{c.title}</h2>
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/90">{c.desc}</p>
              <Link
                href={c.href}
                className={`mt-6 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-bold ${c.btnText} shadow-sm transition hover:shadow-md`}
              >
                {c.btn}
              </Link>
            </div>
          ))}
        </div>

        {/* Hızlı erişim */}
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Hızlı Erişim</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quickLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-center text-xs font-semibold text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0E8FA3] hover:text-[#0E8FA3] hover:shadow-md"
              >
                <span className="text-2xl">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
