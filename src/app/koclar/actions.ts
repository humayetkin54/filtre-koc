"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function startCoaching(coachId: string, coachName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const admin = createAdminClient();

  // Koçsuz aktif satın alma var mı?
  const { data: purchase } = await admin
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .is("coach_id", null)
    .maybeSingle();

  if (purchase) {
    // Koçsuz satın almaya koç ata
    await admin.from("purchases").update({ coach_id: coachId, coach_name: coachName }).eq("id", purchase.id);
  } else {
    // Zaten koçu olan satın alma varsa, o koçu güncelle
    const { data: existing } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (existing) {
      await admin.from("purchases").update({ coach_id: coachId, coach_name: coachName }).eq("id", existing.id);
    }
  }

  revalidatePath("/randevularim");
  redirect("/randevularim");
}
export async function bookAppointment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

  const { count } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_intro", true);

  if (count && count >= 3) {
    return { error: "Ücretsiz ön görüşme hakkınızı doldurdunuz." };
  }

  const coachId = formData.get("coach_id") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const note = formData.get("note") as string;
  const studentName = user.user_metadata?.full_name ?? null;

  const { error } = await supabase.from("appointments").insert({
    user_id: user.id,
    coach_id: coachId,
    date,
    time,
    note: note || null,
    student_name: studentName,
    student_email: user.email ?? null,
    is_intro: true,
    seen_by_coach: false,
  });

  if (error) {
    return { error: error.message };
  }

  await notifyCoach(coachId, studentName ?? user.email ?? "Bir öğrenci", date, time);

  return { success: true };
}

async function notifyCoach(coachId: string, studentName: string, date: string, time: string) {
  const admin = createAdminClient();
  const { data: coach } = await admin
    .from("coaches")
    .select("user_id, name")
    .eq("id", coachId)
    .single();

  if (!coach?.user_id) return;

  const { data: coachUser } = await admin.auth.admin.getUserById(coach.user_id);
  const coachEmail = coachUser?.user?.email;
  if (!coachEmail) return;

  const dateStr = new Date(date).toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const { sendEmail } = await import("@/lib/email");
  await sendEmail({
    to: [{ email: coachEmail, name: coach.name }],
    subject: "Yeni randevu talebiniz var",
    html: `<p>Merhaba ${coach.name},</p><p><strong>${studentName}</strong> sizden <strong>${dateStr} ${time}</strong> için randevu talep etti.</p><p>Talebi onaylamak veya iptal etmek için <a href="https://www.rekorzeka.com/koc-paneli">koç panelinize</a> gidin.</p>`,
  });
}
