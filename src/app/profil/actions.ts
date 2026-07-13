"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Veli Takip Sistemi anahtarı — öğrenci, velisinin takibine izin verir.
// Durum user_metadata.veli_takip_enabled'da tutulur (yeni tablo gerekmez).
export async function setVeliTakip(enabled: boolean): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı." };

  // Aktif paket kontrolü (koçluk veya hızlı okuma)
  if (enabled) {
    const admin = createAdminClient();
    const { count } = await admin
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active");
    if ((count ?? 0) === 0) {
      return { error: "Veli takibini açmak için aktif bir paketiniz olmalı." };
    }
  }

  const { error } = await supabase.auth.updateUser({ data: { veli_takip_enabled: enabled } });
  if (error) return { error: error.message };

  revalidatePath("/profil");
  return { ok: true };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  const updates: Record<string, unknown> = {};

  if (name) updates.data = { full_name: name };
  if (email && email !== user.email) updates.email = email;
  if (password && password.length >= 6) updates.password = password;

  if (Object.keys(updates).length === 0) {
    redirect("/profil?error=Değişiklik yapılmadı.");
  }

  const { error } = await supabase.auth.updateUser(updates);

  if (error) {
    redirect(`/profil?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/profil?success=1");
}
