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

/* ── AI PROGRAM ÖNERİSİNİ UYGULA ── */
export async function applyAiProgram(scanId: string, studentId: string) {
  const ctx = await getCoachForStudent(studentId);
  if (!ctx) return;

  const { data: scan } = await ctx.admin
    .from("exam_scans")
    .select("program_suggestion")
    .eq("id", scanId)
    .eq("student_id", studentId)
    .maybeSingle();

  const entries = (scan?.program_suggestion ?? []) as {
    gun: number; saat: string; ders: string; konu: string;
  }[];
  if (entries.length === 0) return;

  // Önce mevcut programı temizle, AI önerisini uygula
  await ctx.admin.from("study_schedule").delete().eq("student_id", studentId);
  await ctx.admin.from("study_schedule").insert(
    entries.map((e) => ({
      student_id: studentId,
      coach_id: ctx.coach.id,
      day_of_week: e.gun,
      time_slot: e.saat,
      subject: e.ders,
      topic: e.konu || null,
    }))
  );

  revalidatePath(`/koc-paneli/ogrencilerim/${studentId}`);
  revalidatePath("/ogrenci-paneli/program");
}

/* ── KOÇ ÖZEL NOTLARI (öğrenci görmez) ── */
export async function saveCoachNote(formData: FormData) {
  const studentId = formData.get("student_id") as string;
  const ctx = await getCoachForStudent(studentId);
  if (!ctx) return;

  const content = ((formData.get("content") as string) || "").trim();
  if (!content) return;

  await ctx.admin.from("coach_notes").insert({
    coach_id: ctx.coach.id,
    student_id: studentId,
    content,
  });

  revalidatePath(`/koc-paneli/ogrencilerim/${studentId}`);
}

/* ── MESAJLARI OKUNDU İŞARETLE (koç, öğrenci mesajlarını okudu) ── */
export async function markStudentMessagesRead(studentId: string) {
  const ctx = await getCoachForStudent(studentId);
  if (!ctx) return;

  await ctx.admin
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("coach_id", ctx.coach.id)
    .eq("student_id", studentId)
    .eq("sender_role", "student")
    .is("read_at", null);

  revalidatePath("/koc-paneli/ogrencilerim");
  revalidatePath(`/koc-paneli/ogrencilerim/${studentId}`);
}

export async function deleteCoachNote(id: string, studentId: string) {
  const ctx = await getCoachForStudent(studentId);
  if (!ctx) return;

  await ctx.admin.from("coach_notes").delete().eq("id", id).eq("coach_id", ctx.coach.id);

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
