import { createClient, createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { WelcomeModal } from "./welcome-modal";

export default async function OgrenciPaneliPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const [
    { data: purchases },
    { data: denemes },
    { data: homework },
    { data: goals },
    { count: unreadCount },
  ] = await Promise.all([
    admin.from("purchases").select("coach_name, coach_id, category, plan, created_at").eq("user_id", user!.id).eq("status", "active"),
    admin.from("deneme_results").select("net_total, exam_name, exam_date").eq("student_id", user!.id).order("exam_date", { ascending: false }).limit(5),
    admin.from("homework").select("id, status").eq("student_id", user!.id),
    admin.from("goals").select("target_university, target_department, target_exam, target_score").eq("student_id", user!.id).maybeSingle(),
    admin.from("messages").select("id", { count: "exact", head: true }).eq("student_id", user!.id).eq("sender_role", "coach").is("read_at", null),
  ]);

  const purchase = purchases?.[0];
  const lastDeneme = denemes?.[0];
  const pendingHw = (homework ?? []).filter(h => h.status === "pending").length;
  const totalHw = (homework ?? []).length;

  const cards = [
    { icon: "📝", label: "Son Deneme", value: lastDeneme ? `${lastDeneme.net_total?.toFixed(1)} net` : "Henüz girilmedi", sub: lastDeneme?.exam_name, href: "/ogrenci-paneli/deneme", color: "bg-blue-50 text-blue-700" },
    { icon: "✅", label: "Ödevler", value: `${pendingHw} bekliyor`, sub: `${totalHw} toplam ödev`, href: "/ogrenci-paneli/odevler", color: "bg-amber-50 text-amber-700" },
    { icon: "🎯", label: "Hedefim", value: goals?.target_university ?? "Belirlenmedi", sub: goals?.target_department, href: "/ogrenci-paneli/hedefler", color: "bg-emerald-50 text-emerald-700" },
    { icon: "💬", label: "Mesajlar", value: (unreadCount ?? 0) > 0 ? `${unreadCount} yeni mesaj` : "Yeni mesaj yok", sub: "Koçundan", href: "/ogrenci-paneli/mesajlar", color: (unreadCount ?? 0) > 0 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600" },
  ];

  return (
    <div className="space-y-6">
      <WelcomeModal />
      {/* Hoşgeldin */}
      <div className="rounded-2xl bg-gradient-to-br from-[#123A57] to-[#0E8FA3] p-6 text-white">
        <p className="text-sm font-medium text-white/70">Hoş geldin</p>
        <h1 className="mt-0.5 text-2xl font-bold">{user?.user_metadata?.full_name ?? user?.email}</h1>
        {purchase && (
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold">
              {purchase.category} · {purchase.plan}
            </div>
            {purchase.coach_name && (
              <div className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold">
                Koç: {purchase.coach_name}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map(c => (
          <Link key={c.href} href={c.href} className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md hover:border-[#0E8FA3]/30">
            <div className={`inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-lg mb-3 ${c.color}`}>{c.icon}</div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{c.label}</p>
            <p className="mt-1 text-lg font-bold text-gray-900 leading-tight">{c.value}</p>
            {c.sub && <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>}
          </Link>
        ))}
      </div>

      {/* Hızlı bağlantılar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Hızlı Erişim</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: "/ogrenci-paneli/deneme", label: "Deneme Ekle", icon: "➕" },
            { href: "/ogrenci-paneli/program", label: "Ders Programı", icon: "📅" },
            { href: "/randevularim", label: "Randevu Al", icon: "🗓" },
          ].map(l => (
            <Link key={l.href} href={l.href} className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-4 text-center text-xs font-semibold text-gray-600 hover:border-[#0E8FA3] hover:text-[#0E8FA3] transition-colors">
              <span className="text-2xl">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
