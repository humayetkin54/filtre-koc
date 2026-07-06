"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getStudentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");
  return { supabase, user };
}

/* ── DENEME SONUÇLARI ── */
export async function addDenemeResult(formData: FormData) {
  const { user } = await getStudentUser();
  const admin = createAdminClient();

  const turkish_net = parseFloat(formData.get("turkish_net") as string) || 0;
  const math_net = parseFloat(formData.get("math_net") as string) || 0;
  const science_net = parseFloat(formData.get("science_net") as string) || 0;
  const social_net = parseFloat(formData.get("social_net") as string) || 0;

  const { data: purchase } = await admin.from("purchases").select("coach_id").eq("user_id", user.id).eq("status", "active").maybeSingle();

  await admin.from("deneme_results").insert({
    student_id: user.id,
    coach_id: purchase?.coach_id ?? null,
    exam_date: formData.get("exam_date") as string,
    exam_name: formData.get("exam_name") as string,
    turkish_net, math_net, science_net, social_net,
    net_total: turkish_net + math_net + science_net + social_net,
    notes: (formData.get("notes") as string) || null,
  });

  revalidatePath("/ogrenci-paneli/deneme");
}

export async function deleteDenemeResult(id: string) {
  const { user } = await getStudentUser();
  const admin = createAdminClient();
  await admin.from("deneme_results").delete().eq("id", id).eq("student_id", user.id);
  revalidatePath("/ogrenci-paneli/deneme");
}

/* ── HEDEFLER ── */
export async function saveGoal(formData: FormData) {
  const { user } = await getStudentUser();
  const admin = createAdminClient();

  await admin.from("goals").upsert({
    student_id: user.id,
    target_university: formData.get("target_university") as string,
    target_department: formData.get("target_department") as string,
    target_exam: formData.get("target_exam") as string,
    target_score: parseFloat(formData.get("target_score") as string) || null,
    target_year: parseInt(formData.get("target_year") as string) || null,
    notes: (formData.get("notes") as string) || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "student_id" });

  revalidatePath("/ogrenci-paneli/hedefler");
}

/* ── ÖDEVLER ── */
export async function toggleHomework(id: string, currentStatus: string) {
  const { user } = await getStudentUser();
  const admin = createAdminClient();
  const newStatus = currentStatus === "completed" ? "pending" : "completed";
  await admin.from("homework").update({ status: newStatus }).eq("id", id).eq("student_id", user.id);
  revalidatePath("/ogrenci-paneli/odevler");
}

/* ── MESAJLAR ── */
export async function sendMessage(formData: FormData) {
  const { user } = await getStudentUser();
  const admin = createAdminClient();

  const content = (formData.get("content") as string)?.trim();
  if (!content) return;

  const { data: purchase } = await admin.from("purchases").select("coach_id").eq("user_id", user.id).eq("status", "active").maybeSingle();
  if (!purchase?.coach_id) return;

  await admin.from("messages").insert({
    student_id: user.id,
    coach_id: purchase.coach_id,
    sender_role: "student",
    content,
  });

  revalidatePath("/ogrenci-paneli/mesajlar");
}

export async function sendMessageAsCoach(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const admin = createAdminClient();
  const { data: coach } = await admin.from("coaches").select("id").eq("user_id", user.id).eq("status", "approved").maybeSingle();
  if (!coach) return;

  const studentId = formData.get("student_id") as string;
  const content = (formData.get("content") as string)?.trim();
  if (!content || !studentId) return;

  await admin.from("messages").insert({
    student_id: studentId,
    coach_id: coach.id,
    sender_role: "coach",
    content,
  });

  revalidatePath(`/koc-paneli/ogrencilerim/${studentId}`);
}
