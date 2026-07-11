"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

const NOTIFY_EMAIL = "humayetkin@gmail.com";

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

  await notifyAdmin(name, grade, area, phone);

  return { success: true };
}

async function notifyAdmin(name: string, grade: string, area: string, phone: string) {
  await sendEmail({
    to: [{ email: NOTIFY_EMAIL }],
    subject: "Yeni ücretsiz ön görüşme talebi",
    html: `<p>Yeni bir ön görüşme talebi geldi:</p><ul><li><strong>Ad Soyad:</strong> ${name}</li><li><strong>Sınıf:</strong> ${grade}</li><li><strong>Alan:</strong> ${area}</li><li><strong>Telefon:</strong> ${phone}</li></ul><p>Tüm talepleri görmek için <a href="https://www.rekorzeka.com/admin">admin paneline</a> gidin.</p>`,
  });
}
