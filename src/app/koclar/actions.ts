"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function bookAppointment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

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
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
