import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OgrencilerimPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/koc-giris");

  const { data: coach } = await supabase
    .from("coaches")
    .select("id, name, avatar_color, avatar_text_color, avatar_initials")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .maybeSingle();

  if (!coach) redirect("/koc-giris");

  const admin = createAdminClient();
  const { data: purchases } = await admin
    .from("purchases")
    .select("user_id, student_name, student_email, plan, category, created_at")
    .eq("coach_id", coach.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Tekrar eden user_id'leri tekilleştir
  const seen = new Set<string>();
  const students = (purchases ?? []).filter((p) => {
    if (!p.user_id || seen.has(p.user_id)) return false;
    seen.add(p.user_id);
    return true;
  });

  // Öğrenci özetleri: okunmamış mesaj, son denemeler, bekleyen ödev
  const studentIds = students.map((s) => s.user_id);
  const [{ data: unreadMsgs }, { data: recentDenemes }, { data: pendingHws }] =
    studentIds.length > 0
      ? await Promise.all([
          admin.from("messages").select("student_id").eq("coach_id", coach.id).eq("sender_role", "student").is("read_at", null).in("student_id", studentIds),
          admin.from("deneme_results").select("student_id, net_total, exam_date").in("student_id", studentIds).order("exam_date", { ascending: false }),
          admin.from("homework").select("student_id").eq("status", "pending").in("student_id", studentIds),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }];

  const unreadBy: Record<string, number> = {};
  for (const m of unreadMsgs ?? []) unreadBy[m.student_id] = (unreadBy[m.student_id] ?? 0) + 1;

  const denemesBy: Record<string, number[]> = {};
  for (const d of recentDenemes ?? []) {
    (denemesBy[d.student_id] ??= []).push(d.net_total ?? 0);
  }

  const pendingBy: Record<string, number> = {};
  for (const h of pendingHws ?? []) pendingBy[h.student_id] = (pendingBy[h.student_id] ?? 0) + 1;

  return (
    <div className="min-h-full bg-gray-50">
      <div className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold"
            style={{ backgroundColor: coach.avatar_color, color: coach.avatar_text_color }}
          >
            {coach.avatar_initials}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#123A57]">Koç Paneli</p>
            <h1 className="text-2xl font-bold text-gray-900">Öğrencilerim</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-[#123A57] text-lg">{students.length}</span> aktif öğrenci
          </p>
        </div>

        {students.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <p className="text-4xl mb-3">👨‍🎓</p>
            <p className="text-sm text-gray-400">Henüz aktif öğrenciniz yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {students.map((s) => {
              const initials = (s.student_name ?? s.student_email ?? "?")
                .split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

              const unread = unreadBy[s.user_id] ?? 0;
              const nets = denemesBy[s.user_id] ?? []; // yeni → eski
              const lastNet = nets[0];
              const prevNet = nets[1];
              const trend = lastNet !== undefined && prevNet !== undefined
                ? lastNet > prevNet ? "up" : lastNet < prevNet ? "down" : "same"
                : null;
              const pendingCount = pendingBy[s.user_id] ?? 0;

              return (
                <Link
                  key={s.user_id}
                  href={`/koc-paneli/ogrencilerim/${s.user_id}`}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md hover:border-[#0E8FA3]/30"
                >
                  <div className="relative shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#123A57] text-sm font-bold text-white">
                      {initials}
                    </div>
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {s.student_name ?? "İsimsiz Öğrenci"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{s.student_email}</p>
                    <p className="mt-1 text-xs text-[#0E8FA3] font-medium">{s.category} · {s.plan}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {lastNet !== undefined && (
                        <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          trend === "up" ? "bg-emerald-50 text-emerald-700"
                          : trend === "down" ? "bg-red-50 text-red-600"
                          : "bg-gray-100 text-gray-600"
                        }`}>
                          📝 {lastNet.toFixed(1)} net
                          {trend === "up" && " ↑"}
                          {trend === "down" && " ↓"}
                          {trend === "same" && " →"}
                        </span>
                      )}
                      {pendingCount > 0 && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          ✅ {pendingCount} bekleyen ödev
                        </span>
                      )}
                      {unread > 0 && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                          💬 {unread} yeni mesaj
                        </span>
                      )}
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-300 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
