import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { StudentTabs } from "./student-tabs";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/koc-giris");

  const admin = createAdminClient();
  const { data: coach } = await admin
    .from("coaches")
    .select("id, name, avatar_color, avatar_text_color, avatar_initials")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .maybeSingle();
  if (!coach) redirect("/koc-giris");

  // Bu öğrenci gerçekten bu koçun mu?
  const { data: purchase } = await admin
    .from("purchases")
    .select("user_id, student_name, student_email, plan, category, created_at")
    .eq("coach_id", coach.id)
    .eq("user_id", studentId)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!purchase) notFound();

  // Tüm verileri paralel çek
  const [
    { data: goal },
    { data: denemeler },
    { data: schedule },
    { data: homework },
    { data: messages },
    { data: appointments },
    { data: coachNotes },
  ] = await Promise.all([
    admin.from("goals").select("*").eq("student_id", studentId).maybeSingle(),
    admin.from("deneme_results").select("*").eq("student_id", studentId).order("exam_date", { ascending: false }),
    admin.from("study_schedule").select("*").eq("student_id", studentId),
    admin.from("homework").select("*").eq("student_id", studentId).order("created_at", { ascending: false }),
    admin.from("messages").select("*").eq("student_id", studentId).eq("coach_id", coach.id).order("created_at", { ascending: true }),
    admin.from("appointments").select("id, date, time, status, note").eq("user_id", studentId).eq("coach_id", coach.id).order("date", { ascending: false }),
    admin.from("coach_notes").select("id, content, created_at").eq("coach_id", coach.id).eq("student_id", studentId).order("created_at", { ascending: false }),
  ]);

  const initials = (purchase.student_name ?? purchase.student_email ?? "?")
    .split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  const startDate = new Date(purchase.created_at).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-full bg-gray-50">
      {/* Başlık */}
      <div className="border-b border-gray-100 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link href="/koc-paneli/ogrencilerim" className="text-xs font-semibold text-[#0E8FA3] hover:underline">
            ← Öğrencilerim
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#123A57] text-xl font-bold text-white">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{purchase.student_name ?? "İsimsiz Öğrenci"}</h1>
              <p className="text-sm text-gray-500">{purchase.student_email}</p>
            </div>
          </div>

          {/* Özet rozetler */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#eef9f9] px-3 py-1.5 text-xs font-bold text-[#0E8FA3]">
              📦 {purchase.category} · {purchase.plan}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
              Başlangıç: {startDate}
            </span>
            {goal?.target_university && (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                🎯 {goal.target_university}{goal.target_department ? ` · ${goal.target_department}` : ""}
              </span>
            )}
            {goal?.target_exam && (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                {goal.target_exam}{goal.target_score ? ` · Hedef: ${goal.target_score} net` : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <StudentTabs
          studentId={studentId}
          denemeler={denemeler ?? []}
          schedule={schedule ?? []}
          homework={homework ?? []}
          messages={messages ?? []}
          appointments={appointments ?? []}
          coachNotes={coachNotes ?? []}
          unreadMessages={(messages ?? []).filter(m => m.sender_role === "student" && !m.read_at).length}
        />
      </div>
    </div>
  );
}
