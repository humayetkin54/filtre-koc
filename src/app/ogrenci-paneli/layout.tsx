import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/ogrenci-paneli", label: "Genel Bakış", icon: "📊", exact: true },
  { href: "/ogrenci-paneli/ai-asistan", label: "RekorZeka AI Asistan", icon: "🤖" },
  { href: "/ogrenci-paneli/ai-analiz", label: "Deneme AI Analiz", icon: "📊" },
  { href: "/ogrenci-paneli/deneme", label: "Deneme Sonuçları", icon: "📝" },
  { href: "/ogrenci-paneli/program", label: "Ders Programı", icon: "📅" },
  { href: "/ogrenci-paneli/odevler", label: "Ödevlerim", icon: "✅" },
  { href: "/ogrenci-paneli/hedefler", label: "Hedeflerim", icon: "🎯" },
  { href: "/ogrenci-paneli/mesajlar", label: "Mesajlaşma", icon: "💬" },
];

export default async function OgrenciPaneliLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const admin = createAdminClient();
  const { count } = await admin.from("purchases").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "active");
  if ((count ?? 0) === 0) redirect("/paketler");

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="rounded-2xl border border-gray-200 bg-white p-3 space-y-1">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Öğrenci Paneli</p>
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-[#eef9f9] hover:text-[#0E8FA3]"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <Link
                  href="/randevularim"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
                >
                  <span>🗓</span>
                  Randevularım
                </Link>
              </div>
            </div>
          </aside>

          {/* İçerik */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
