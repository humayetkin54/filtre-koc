"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient();

  const onboarding = {
    target: formData.get("target") as string,
    tyt_net: formData.get("tyt_net") as string,
    ayt_net: formData.get("ayt_net") as string,
    months_to_exam: formData.get("months") as string,
    weekly_hours: formData.get("hours") as string,
    weak_subjects: formData.get("weak_subjects") as string,
    coached_before: formData.get("coached_before") as string,
    anxiety_level: formData.get("anxiety_level") as string,
    onboarding_completed: true,
  };

  const { error } = await supabase.auth.updateUser({ data: onboarding });

  if (error) {
    redirect("/onboarding?error=1");
  }

  redirect("/koclar");
}
