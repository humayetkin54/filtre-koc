"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function submitIntroRequest(formData: FormData) {
  const name = formData.get("name") as string;
  const grade = formData.get("grade") as string;
  const area = formData.get("area") as string;
  const phone = formData.get("phone") as string;

  if (!name || !grade || !area || !phone) {
    return { error: "Lütfen tüm alanları doldurun." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("intro_requests").insert({
    name,
    grade,
    area,
    phone,
  });

  if (error) {
    return { error: "Bir hata oluştu, lütfen tekrar deneyin." };
  }

  return { success: true };
}
