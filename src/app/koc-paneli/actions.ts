"use server";

import { createClient } from "@/lib/supabase/server";
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
