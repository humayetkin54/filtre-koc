"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Koçun bu öğrenciye erişimi var mı? (aktif satın alma bağı)
async function getCoachForStudent(studentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: coach } = await admin
    .from("coaches")
    .select("id, name")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .maybeSingle();
  if (!coach) return null;

  const { count } = await admin
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .eq("coach_id", coach.id)
    .eq("user_id", studentId)
    .eq("status", "active");
  if ((count ?? 0) === 0) return null;

  return { coach, admin };
}

/* ── DERS PROGRAMI (koç düzenler) ── */
export async function addScheduleEntry(formData: FormData) {
  const studentId = formData.get("student_id") as string;
  const ctx = await getCoachForStudent(studentId);
  if (!ctx) return;

  await ctx.admin.from("study_schedule").insert({
    student_id: studentId,
    coach_id: ctx.coach.id,
    day_of_week: parseInt(formData.get("day_of_week") as string),
    time_slot: formData.get("time_slot") as string,
    subject: formData.get("subject") as string,
    topic: (formData.get("topic") as string) || null,
  });

  revalidatePath(`/koc-paneli/ogrencilerim/${studentId}`);
  revalidatePath("/ogrenci-paneli/program");
}

export async function deleteScheduleEntry(id: string, studentId: string) {
  const ctx = await getCoachForStudent(studentId);
  if (!ctx) return;

  await ctx.admin.from("study_schedule").delete().eq("id", id).eq("student_id", studentId);

  revalidatePath(`/koc-paneli/ogrencilerim/${studentId}`);
  revalidatePath("/ogrenci-paneli/program");
}

/* ── ÖDEVLER (koç verir) ── */
export async function addHomework(formData: FormData) {
  const studentId = formData.get("student_id") as string;
  const ctx = await getCoachForStudent(studentId);
  if (!ctx) return;

  const title = (formData.get("title") as string)?.trim();
  if (!title) return;

  await ctx.admin.from("homework").insert({
    student_id: studentId,
    coach_id: ctx.coach.id,
    title,
    description: (formData.get("description") as string) || null,
    due_date: (formData.get("due_date") as string) || null,
    status: "pending",
  });

  revalidatePath(`/koc-paneli/ogrencilerim/${studentId}`);
  revalidatePath("/ogrenci-paneli/odevler");
}

export async function deleteHomework(id: string, studentId: string) {
  const ctx = await getCoachForStudent(studentId);
  if (!ctx) return;

  await ctx.admin.from("homework").delete().eq("id", id).eq("student_id", studentId);

  revalidatePath(`/koc-paneli/ogrencilerim/${studentId}`);
  revalidatePath("/ogrenci-paneli/odevler");
}

/* ── KOÇ ÖZEL NOTU (öğrenci görmez) ── */
export async function saveCoachNote(formData: FormData) {
  const studentId = formData.get("student_id") as string;
  const ctx = await getCoachForStudent(studentId);
  if (!ctx) return;

  await ctx.admin.from("coach_notes").upsert({
    coach_id: ctx.coach.id,
    student_id: studentId,
    content: (formData.get("content") as string) || "",
    updated_at: new Date().toISOString(),
  }, { onConflict: "coach_id,student_id" });

  revalidatePath(`/koc-paneli/ogrencilerim/${studentId}`);
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: "confirmed" | "cancelled"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Koçun kendi randevusu mu kontrol et
  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!coach) return;

  await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId)
    .eq("coach_id", coach.id);

  revalidatePath("/koc-paneli");
}

export async function saveAvailability(
  coachId: string,
  schedule: Record<string, string[]>
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Güvenlik: koç kendi kaydı mı
  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("user_id", user.id)
    .eq("id", coachId)
    .single();

  if (!coach) return;

  const admin = createAdminClient();
  const { error } = await admin
    .from("coaches")
    .update({ availability_schedule: schedule })
    .eq("id", coachId);

  if (error) console.error("[saveAvailability] HATA:", error.message);
  else console.log("[saveAvailability] Kaydedildi:", coachId, Object.keys(schedule));

  revalidatePath("/koc-paneli");
  revalidatePath(`/koclar/${coachId}`);
}
