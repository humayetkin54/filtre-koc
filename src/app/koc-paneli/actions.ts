"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
