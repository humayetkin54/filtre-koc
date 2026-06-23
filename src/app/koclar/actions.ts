"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function bookAppointment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

  const { count } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_intro", true);

  if (count && count > 0) {
    return { error: "Ömür boyu sadece 1 ücretsiz ön görüşme hakkınız var ve bunu daha önce kullandınız." };
  }

  const coachId = formData.get("coach_id") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const note = formData.get("note") as string;

  const { error } = await supabase.from("appointments").insert({
    user_id: user.id,
    coach_id: coachId,
    date,
    time,
    note: note || null,
    student_name: user.user_metadata?.full_name ?? null,
    student_email: user.email ?? null,
    is_intro: true,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
