"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAppointment(data: {
  coachId: string;
  date: string;
  time: string;
  note: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Giriş yapmalısınız." };

  // Satın alma kontrolü
  const admin = createAdminClient();
  const { count } = await admin
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("coach_id", data.coachId)
    .eq("status", "active");

  if ((count ?? 0) === 0) return { error: "Bu koç için aktif paketiniz yok." };

  // Aynı güne öğrencinin zaten randevusu var mı
  const { count: studentConflict } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("coach_id", data.coachId)
    .eq("user_id", user.id)
    .eq("date", data.date)
    .neq("status", "cancelled");

  if ((studentConflict ?? 0) > 0) return { error: "Bu güne zaten bir randevunuz var. Lütfen farklı bir gün seçin." };

  // Aynı saat başka öğrenciye verilmiş mi
  const { count: slotConflict } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("coach_id", data.coachId)
    .eq("date", data.date)
    .eq("time", data.time)
    .neq("status", "cancelled");

  if ((slotConflict ?? 0) > 0) return { error: "Bu saat dolu. Lütfen başka bir saat seçin." };

  const { error } = await supabase.from("appointments").insert({
    coach_id: data.coachId,
    user_id: user.id,
    student_name: user.user_metadata?.full_name ?? null,
    student_email: user.email ?? null,
    date: data.date,
    time: data.time,
    note: data.note || null,
    status: "pending",
    seen_by_coach: false,
  });

  if (error) return { error: error.message };

  // Koça e-posta bildirimi (hata olsa akışı bozmaz)
  try {
    const { data: coach } = await admin
      .from("coaches")
      .select("name, email, user_id")
      .eq("id", data.coachId)
      .maybeSingle();

    if (coach) {
      let coachEmail = (coach.email as string | null) ?? null;
      if (!coachEmail && coach.user_id) {
        const { data: cu } = await admin.auth.admin.getUserById(coach.user_id);
        coachEmail = cu?.user?.email ?? null;
      }

      if (coachEmail) {
        const dateStr = new Date(data.date).toLocaleDateString("tr-TR", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        });
        const studentName = user.user_metadata?.full_name ?? user.email ?? "Öğrenciniz";
        const { sendEmail } = await import("@/lib/email");
        await sendEmail({
          to: [{ email: coachEmail, name: coach.name }],
          subject: "Yeni randevu talebiniz var",
          html: `<p>Merhaba ${coach.name},</p><p><strong>${studentName}</strong> sizden <strong>${dateStr} ${data.time}</strong> için randevu talep etti.</p><p>Onaylamak veya reddetmek için <a href="https://www.rekorzeka.com/koc-paneli">koç panelinize</a> gidin.</p>`,
        });
      }
    }
  } catch (e) {
    console.error("[randevu bildirim] hata:", e instanceof Error ? e.message : e);
  }

  revalidatePath("/randevularim");
  return { success: true };
}
