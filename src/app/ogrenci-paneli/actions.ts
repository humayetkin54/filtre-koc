"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EXAM_CONFIGS, calculateScore } from "./deneme/exam-config";

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

  const exam_name = formData.get("exam_name") as string;
  const config = EXAM_CONFIGS[exam_name];
  if (!config) return;

  // net_* alanlarını topla
  const nets: Record<string, number> = {};
  for (const f of config.fields) {
    nets[f.key] = parseFloat(formData.get(`net_${f.key}`) as string) || 0;
  }
  const net_total = Object.values(nets).reduce((a, b) => a + b, 0);

  const obpRaw = formData.get("obp") as string;
  const obp = obpRaw ? parseFloat(obpRaw) : null;

  // 2025 katsayılarıyla puan: base + Σ(net × katsayı)
  const rawScore = calculateScore(exam_name, nets);
  // Okul puanı dahil yerleştirme puanı: puan + diploma_notu × 0.6 (OBP×0.12)
  const tyt_score = rawScore !== null && obp !== null
    ? Math.round((rawScore + obp * 0.6) * 100) / 100
    : rawScore;

  const { data: purchase } = await admin.from("purchases").select("coach_id").eq("user_id", user.id).eq("status", "active").maybeSingle();

  const insertData: Record<string, unknown> = {
    student_id: user.id,
    coach_id: purchase?.coach_id ?? null,
    exam_date: formData.get("exam_date") as string,
    exam_name,
    turkish_net: nets.turkce ?? 0,
    math_net: nets.tmat ?? 0,
    science_net: nets.fen ?? 0,
    social_net: nets.sosyal ?? 0,
    net_total,
    notes: (formData.get("notes") as string) || null,
    nets,
  };
  if (obp !== null) insertData.obp = obp;
  if (tyt_score !== null) insertData.tyt_score = tyt_score;

  await admin.from("deneme_results").insert(insertData);

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
